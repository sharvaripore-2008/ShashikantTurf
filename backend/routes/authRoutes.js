const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @route   POST /api/auth/register
// @desc    Register a new player account (Stored in MySQL 'users' table)
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await db.getUserByEmail(cleanEmail);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    const newUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '+91 98765 00000',
      password: password,
      role: role === 'admin' ? 'admin' : 'user'
    };

    await db.addUser(newUser);

    // Also log the initial registration / signup login
    await db.recordLogin({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      status: 'SIGNUP_SUCCESS'
    });

    const { password: _, ...userSafe } = newUser;
    return res.status(201).json({
      success: true,
      message: 'Account registered successfully in database!',
      user: userSafe
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user / admin & log into MySQL 'login_logs' table
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const user = await db.getUserByEmail(cleanEmail);

    if (!user) {
      // Default Admin auto-login convenience if admin credentials entered
      if (cleanEmail.includes('admin') || role === 'admin') {
        const adminUser = {
          id: 'ADM-01',
          name: 'Admin Manager',
          email: cleanEmail,
          phone: '+91 98765 00000',
          role: 'admin'
        };

        await db.recordLogin({
          userId: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: 'admin',
          ipAddress: clientIp,
          status: 'SUCCESS'
        });

        return res.json({
          success: true,
          message: 'Welcome back, Admin Manager!',
          user: adminUser
        });
      }

      await db.recordLogin({
        userId: null,
        name: null,
        email: cleanEmail,
        role: role || 'user',
        ipAddress: clientIp,
        status: 'FAILED_NOT_FOUND'
      });

      return res.status(401).json({ success: false, message: 'Invalid credentials or user not found' });
    }

    if (user.password !== password) {
      await db.recordLogin({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        ipAddress: clientIp,
        status: 'FAILED_WRONG_PASSWORD'
      });

      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    // Success login: record in MySQL login_logs table
    await db.recordLogin({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      ipAddress: clientIp,
      status: 'SUCCESS'
    });

    const { password: _, ...userSafe } = user;
    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: userSafe
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// @route   GET /api/auth/login-logs
// @desc    Get real-time records of who has logged in (Kisne login kiya)
router.get('/login-logs', async (req, res) => {
  try {
    const logs = await db.getLoginLogs(50);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve login logs' });
  }
});

// @route   GET /api/auth/users
// @desc    Get all registered users (Kisne sign up kiya)
router.get('/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve users list' });
  }
});

module.exports = router;

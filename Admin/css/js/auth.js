let activeRole = 'user';

function selectRole(role) {
  activeRole = role;
  document.querySelectorAll('.role-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) return showToast('Please enter both email and password', 'warning');

  const userData = {
    id: activeRole === 'admin' ? 'ADM-01' : 'USR-' + Math.floor(1000 + Math.random() * 9000),
    name: activeRole === 'admin' ? 'Admin Manager' : email.split('@')[0],
    email: email,
    phone: "+91 98765 00000",
    role: activeRole
  };

  DB.setCurrentUser(userData);
  showToast(`Welcome back, ${userData.name}!`, 'success');
  setTimeout(() => {
    window.location.href = activeRole === 'admin' ? 'admin/dashboard.html' : 'index.html';
  }, 900);
}

function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const confirmPassword = document.getElementById('regConfirmPassword').value.trim();

  if (password !== confirmPassword) return showToast('Passwords do not match!', 'error');

  const newUser = {
    id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
    name: name,
    email: email,
    phone: phone,
    role: activeRole
  };

  DB.setCurrentUser(newUser);
  showToast('Account created successfully!', 'success');
  setTimeout(() => {
    window.location.href = activeRole === 'admin' ? 'admin/dashboard.html' : 'index.html';
  }, 900);
}

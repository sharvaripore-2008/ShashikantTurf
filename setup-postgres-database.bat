@echo off
title Shashikant Turf - PostgreSQL Database Setup
cd /d "%~dp0backend"
echo ==================================================
echo   Setting up Shashikant Turf PostgreSQL Database...
echo ==================================================
node setup-pg-db.js
pause


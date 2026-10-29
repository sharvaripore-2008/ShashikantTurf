@echo off
title Shashikant Turf - MySQL Database Setup
cd /d "%~dp0backend"
echo ==================================================
echo   Setting up Shashikant Turf MySQL Database...
echo ==================================================
node setup-db.js
pause


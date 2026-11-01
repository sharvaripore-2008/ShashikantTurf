@echo off
title Deploy Shashikant Turf to Firebase Hosting
color 0A
cls
echo ================================================================
echo    🔥 SHASHIKANT TURF - FIREBASE HOSTING DEPLOYMENT 🔥
echo ================================================================
echo.
echo Project: shashikant-turf-37359
echo.
echo Step 1: Sign in with your Firebase Google Account...
echo (A browser window will open automatically, click Allow)
echo.
call npx --yes firebase-tools login

echo.
echo Step 2: Deploying website to live Firebase Hosting...
call npx --yes firebase-tools deploy --only hosting

echo.
echo ================================================================
echo    🎉 DEPLOYMENT COMPLETE! 
echo    Your website is now LIVE at:
echo    https://shashikant-turf-37359.web.app
echo ================================================================
echo.
pause

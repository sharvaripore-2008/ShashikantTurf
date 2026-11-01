@echo off
title Deploy Shashikant Turf to Firebase Hosting
color 0A
cls
echo ================================================================
echo    🔥 SHASHIKANT TURF - FIREBASE HOSTING DEPLOYMENT 🔥
echo ================================================================
echo.
echo Checking Firebase CLI installation...
call npx --yes firebase-tools --version
if %errorlevel% neq 0 (
    echo.
    echo ❌ Firebase Tools could not be run.
    echo Please make sure you have internet access and Node.js installed.
    pause
    exit /b
)

echo.
echo Step 1: Login to Firebase (Google Account)...
echo A browser window will open. Sign in with your Google Account:
echo (e.g. sharvariporegithub@gmail.com)
echo.
call npx firebase-tools login

echo.
echo Step 2: Deploying Website to Firebase Hosting...
call npx firebase-tools deploy --only hosting

echo.
echo ================================================================
echo    🎉 DEPLOYMENT COMPLETE! YOUR WEBSITE IS NOW LIVE ON FIREBASE!
echo ================================================================
echo.
pause


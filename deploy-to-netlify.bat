@echo off
title Deploy Shashikant Turf to Netlify
color 0B
cls
echo ================================================================
echo       🌐 SHASHIKANT TURF - NETLIFY DEPLOYMENT 🌐
echo ================================================================
echo.
echo Launching Netlify CLI deployment...
echo (If you haven't logged in yet, a browser window will open to authorize)
echo.
call npx --yes netlify-cli deploy --prod --dir=.

echo.
echo ================================================================
echo    🎉 DEPLOYMENT COMPLETE! 
echo    Your website is now LIVE on Netlify!
echo ================================================================
echo.
pause


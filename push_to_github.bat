@echo off
title Push CareerConnect AI to GitHub
cd /d "%~dp0"
echo ========================================================
echo Pushing CareerConnect AI to GitHub (syamayyappa/Career-connect)
echo ========================================================
echo.
git add .
git commit -m "Update project features, architecture documentation and defense manual"
git push -u origin main
echo.
echo ========================================================
echo Finished! Check https://github.com/syamayyappa/Career-connect
echo ========================================================
pause

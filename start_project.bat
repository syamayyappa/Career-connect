@echo off
title CareerConnect AI - Server Launcher
cd /d "%~dp0"

echo ========================================================
echo Starting CareerConnect AI (Backend + Frontend)
echo ========================================================
echo.

echo Starting Backend Server (Port 5000)...
start "CareerConnect AI - Backend (Port 5000)" cmd /k "cd /d "%~dp0backend" && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server (Port 5173)...
start "CareerConnect AI - Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo Both servers are launching!
echo Backend API:  http://localhost:5000
echo Frontend App: http://localhost:5173
echo ========================================================
echo.
pause

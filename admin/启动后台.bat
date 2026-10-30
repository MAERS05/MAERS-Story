@echo off
title MAERS Admin
cd /d "%~dp0.."

start /b powershell -NoProfile -Command ^
  "while(!(Test-NetConnection localhost -Port 3001 -InformationLevel Quiet -WarningAction SilentlyContinue)){Start-Sleep -Milliseconds 200}; Start-Process 'http://localhost:3001/index-admin.html'"

npm run admin

echo.
echo Server stopped. Press any key to close.
pause >nul

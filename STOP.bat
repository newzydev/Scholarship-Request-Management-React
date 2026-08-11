@echo off
setlocal
title Scholarship Request Management - Stop System
cd /d "%~dp0"

echo ============================================
echo   Scholarship Request Management System
echo ============================================
echo.

docker version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker was not found, or Docker Desktop is not running.
    echo.
    pause
    exit /b 1
)

echo Stopping the system ...
echo.

docker compose down
if errorlevel 1 (
    echo.
    echo [ERROR] Something went wrong while stopping the system. See the messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   The system has been stopped.
echo   (Database data is kept. Run RUN.bat to start again.)
echo.
echo   Tip: to also erase the sample database data,
echo   run this manually:  docker compose down -v
echo ============================================
echo.

pause

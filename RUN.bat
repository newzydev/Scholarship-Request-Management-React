@echo off
setlocal
title Scholarship Request Management - Run System
cd /d "%~dp0"

echo ============================================
echo   Scholarship Request Management System
echo ============================================
echo.

docker version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker was not found, or Docker Desktop is not running.
    echo Please start Docker Desktop, wait until it is ready, then run this file again.
    echo.
    pause
    exit /b 1
)

echo Building and starting the system with Docker Compose ...
echo (the first run may take a few minutes to download and build)
echo.

docker compose up --build -d
if errorlevel 1 (
    echo.
    echo [ERROR] Something went wrong while starting the system. See the messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo Waiting for the system to become ready ...
timeout /t 5 /nobreak >nul

echo.
echo ============================================
echo   The system is ready
echo ============================================
echo   Student request form : http://localhost:8080/
echo   Staff login page     : http://localhost:8080/login
echo.
echo   Staff test account   : staff01 / Staff@1234
echo.
echo   To stop the system later, double-click STOP.bat
echo ============================================
echo.

start http://localhost:8080/

pause

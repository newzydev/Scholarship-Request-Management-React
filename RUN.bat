@echo off
setlocal enabledelayedexpansion
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

set BUILDX_NO_DEFAULT_ATTESTATIONS=1
set COMPOSE_BAKE=false

echo Building and starting the system with Docker Compose ...
echo (the first run may take a few minutes to download and build)
echo.

docker compose --progress plain --ansi never up --build -d
if errorlevel 1 (
    echo.
    echo [ERROR] Something went wrong while starting the system. See the messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo Waiting for the system to become ready

set READY=0
for /l %%i in (1,1,90) do (
    if "!READY!"=="0" (
        curl -s -o nul http://localhost:8080/ >nul 2>&1
        if not errorlevel 1 (
            set READY=1
        ) else (
            <nul set /p "_dot=."
            timeout /t 1 /nobreak >nul
        )
    )
)
echo.
echo.

if "!READY!"=="1" (
    echo ============================================
    echo   The system is ready
    echo ============================================
) else (
    echo ============================================
    echo   Still starting up - opening the browser anyway
    echo   If the page does not load yet, just refresh it in a few seconds
    echo ============================================
)
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

@echo off
REM Eduardo Faustos System Setup Script for Windows
REM This script sets up the entire Eduardo Faustos System locally without Docker

echo ================================
echo Eduardo Faustos System Local Setup
echo ================================

setlocal enabledelayedexpansion

echo.
echo Checking prerequisites...

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js 18+
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

REM Check npm
where npm >nul 2>nul
if errorlevel 1 (
    echo npm is not installed. Please install npm
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm found: %NPM_VERSION%

REM Check .NET SDK
where dotnet >nul 2>nul
if errorlevel 1 (
    echo .NET SDK is not installed. Please install .NET 8 SDK
    exit /b 1
)
for /f "tokens=*" %%i in ('dotnet --version') do set DOTNET_VERSION=%%i
echo [OK] .NET SDK found: %DOTNET_VERSION%

REM Check PHP
where php >nul 2>nul
if errorlevel 1 (
    echo PHP is not installed. Please install PHP 8.2+
    exit /b 1
)
for /f "tokens=*" %%i in ('php --version') do set PHP_VERSION=%%i
echo [OK] PHP found: %PHP_VERSION:~0,20%

REM Check Composer
where composer >nul 2>nul
if errorlevel 1 (
    echo Composer is not installed. Please install Composer
    exit /b 1
)
echo [OK] Composer found

REM Setup Frontend
echo.
echo Setting up Frontend...
cd frontend
call npm install
if errorlevel 1 (
    echo Frontend setup failed
    exit /b 1
)
echo [OK] Frontend dependencies installed
cd ..

REM Setup Backend Auth
echo.
echo Setting up Auth Service (.NET)...
cd backend-auth\CRMAuth
call dotnet restore
if errorlevel 1 (
    echo Auth Service setup failed
    exit /b 1
)
echo [OK] Auth Service dependencies restored
cd ..\..

REM Setup Backend Orders
echo.
echo Setting up Orders Service (PHP)...
cd backend-orders
if not exist .env (
    copy .env.example .env
)
call composer install
if errorlevel 1 (
    echo Orders Service setup failed
    exit /b 1
)
echo [OK] Orders Service dependencies installed
cd ..

echo.
echo ================================
echo Setup completed successfully!
echo ================================

echo.
echo Next steps:
echo 1. Update database connection strings in .env files
echo 2. Run .NET migrations: cd backend-auth\CRMAuth ^& dotnet ef database update
echo 3. Run PHP migrations: cd backend-orders ^& php artisan migrate
echo.
echo To start services:
echo Terminal 1 - Frontend:  cd frontend ^& npm start
echo Terminal 2 - Auth:      cd backend-auth\CRMAuth ^& dotnet run
echo Terminal 3 - Orders:    cd backend-orders ^& php artisan serve --port=8001

pause

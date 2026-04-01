@echo off
REM ============================================================================
REM Script para instalar y ejecutar la aplicación CRM con Docker
REM Windows PowerShell es requerido
REM ============================================================================

setlocal enabledelayedexpansion

REM Colores para mensajes
cls
echo.
echo ============================================================================
echo         Eduardo Faustos System - Docker Setup Script for Windows
echo ============================================================================
echo.

REM Verificar si Docker está instalado
echo [1/5] Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Docker no está instalado o no está en el PATH
    echo.
    echo Por favor descargar Docker Desktop desde:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ Docker está instalado
docker --version

REM Verificar si Docker Compose está instalado
echo.
echo [2/5] Verificando Docker Compose...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Docker Compose no está instalado
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ Docker Compose está instalado
docker-compose --version

REM Verificar si Docker está ejecutándose
echo.
echo [3/5] Verificando que Docker está en ejecución...
docker ps >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Docker no está ejecutándose
    echo.
    echo Por favor:
    echo   1. Abre Docker Desktop
    echo   2. Espera a que esté completamente cargado
    echo   3. Ejecuta este script nuevamente
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ Docker está en ejecución

REM Levantar los servicios
echo.
echo [4/5] Iniciando los servicios (esto puede tomar 2-3 minutos)...
echo.
docker-compose up -d

if errorlevel 1 (
    echo.
    echo ERROR: No se pudieron iniciar los servicios
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ Servicios iniciados

REM Esperar a que todo se estabilice
echo.
echo [5/5] Esperando a que los servicios se estabilicen...
echo.
timeout /t 5 /nobreak

REM Mostrar estado
echo.
echo ============================================================================
echo                            ESTADO DE SERVICIOS
echo ============================================================================
echo.
docker-compose ps

REM Mostrar información de acceso
echo.
echo ============================================================================
echo                         APLICACION LISTA PARA USAR
echo ============================================================================
echo.
echo ACCESO A LA APLICACION:
echo   Frontend (Angular):     http://localhost:3000
echo   Auth API:               http://localhost:5005/api
echo   Orders API:             http://localhost:8001/api
echo.
echo CREDENCIALES DE PRUEBA:
echo   Email:                  admin@example.com
echo   Contraseña:             password123
echo.
echo BASE DE DATOS (SQL Server):
echo   Server:                 localhost,1433
echo   Usuario:                sa
echo   Contraseña:             YourPassword123!
echo.
echo COMANDOS UTILES:
echo   Ver logs:               docker-compose logs -f
echo   Detener:                docker-compose stop
echo   Reiniciar:              docker-compose start
echo   Ver estado:             docker-compose ps
echo.
echo ============================================================================
echo.

REM Preguntar si desea abrir el navegador
set /p OPEN="¿Deseas abrir el navegador en http://localhost:3000? (S/N): "
if /i "%OPEN%"=="S" (
    start http://localhost:3000
)

echo.
echo ============================================================================
echo                          Presiona una tecla para continuar...
echo ============================================================================
pause

REM Mostrar logs
docker-compose logs -f

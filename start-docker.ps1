# ============================================================================
# Script PowerShell para instalar y ejecutar la aplicación CRM con Docker
# Uso: .\start-docker.ps1
# ============================================================================

# Requerir PowerShell 5.0 o superior
#Requires -Version 5.0

# Funciones de ayuda
function Write-Header {
    param([string]$Message)
    Write-Host "`n============================================================================" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "============================================================================`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ ERROR: $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

# Elemento de menú
function Show-Menu {
    Write-Header "Eduardo Faustos System - Docker Setup"
    
    Write-Host "Selecciona una opción:" -ForegroundColor White
    Write-Host "1) Verified que todo esté instalado y levantar aplicación" -ForegroundColor White
    Write-Host "2) Ver estado de los servicios" -ForegroundColor White
    Write-Host "3) Ver logs de los servicios" -ForegroundColor White
    Write-Host "4) Detener servicios" -ForegroundColor White
    Write-Host "5) Reiniciar servicios" -ForegroundColor White
    Write-Host "6) Eliminar contenedores y volúmenes (LIMPIEZA TOTAL)" -ForegroundColor White
    Write-Host "7) Salir" -ForegroundColor White
    Write-Host "`n"
}

# Verificar Docker
function Test-Docker {
    Write-Header "[1/4] Verificando Docker"
    
    try {
        $dockerVersion = docker --version
        Write-Success "Docker está instalado"
        Write-Info $dockerVersion
    }
    catch {
        Write-Error "Docker no está instalado o no está en el PATH"
        Write-Info "Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop"
        return $false
    }
    
    try {
        $composeVersion = docker-compose --version
        Write-Success "Docker Compose está instalado"
        Write-Info $composeVersion
    }
    catch {
        Write-Error "Docker Compose no está instalado"
        return $false
    }
    
    try {
        docker ps | Out-Null
        Write-Success "Docker está ejecutándose"
    }
    catch {
        Write-Error "Docker no está ejecutándose"
        Write-Info "Por favor abre Docker Desktop y espera a que cargue completamente"
        return $false
    }
    
    return $true
}

# Levantar servicios
function Start-Services {
    Write-Header "[2/4] Iniciando servicios"
    
    Write-Warning "Esto puede tomar 2-3 minutos la primera vez..."
    Write-Info "Se descargarán: SQL Server, .NET Runtime, Node.js, PHP"
    Write-Host ""
    
    try {
        docker-compose up -d
        Write-Success "Servicios iniciados"
    }
    catch {
        Write-Error "No se pudieron iniciar los servicios"
        Write-Info "Revisa los logs: docker-compose logs"
        return $false
    }
    
    return $true
}

# Esperar a estabilización
function Wait-Services {
    Write-Header "[3/4] Esperando estabilización de servicios"
    
    Write-Info "Esperando 10 segundos..."
    1..10 | ForEach-Object {
        Write-Host "." -NoNewline -ForegroundColor Cyan
        Start-Sleep -Seconds 1
    }
    Write-Host "" -ForegroundColor Cyan
}

# Mostrar estado
function Show-Status {
    Write-Header "[4/4] Estado de servicios"
    
    Write-Host ""
    docker-compose ps
    
    Write-Header "APLICACION LISTA PARA USAR"
    
    Write-Host "ACCESO:" -ForegroundColor Yellow
    Write-Host "  Frontend (Angular):     http://localhost:3000" -ForegroundColor Green
    Write-Host "  Auth API:               http://localhost:5005/api" -ForegroundColor Green
    Write-Host "  Orders API:             http://localhost:8001/api" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "CREDENCIALES DE PRUEBA:" -ForegroundColor Yellow
    Write-Host "  Email:                  admin@example.com" -ForegroundColor Green
    Write-Host "  Contraseña:             password123" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "BASE DE DATOS (SQL Server):" -ForegroundColor Yellow
    Write-Host "  Server:                 localhost,1433" -ForegroundColor Green
    Write-Host "  Usuario:                sa" -ForegroundColor Green
    Write-Host "  Contraseña:             YourPassword123!" -ForegroundColor Green
    Write-Host ""
}

# Mostrar logs
function Show-Logs {
    Write-Header "Mostrando logs (Ctrl+C para detener)"
    Write-Info "Estos son los logs en tiempo real de todos los servicios"
    Write-Host ""
    
    docker-compose logs -f
}

# Ver estado
function Show-Services-Status {
    Write-Header "Estado actual de servicios"
    Write-Host ""
    docker-compose ps
    Write-Host ""
}

# Detener servicios
function Stop-Services {
    Write-Header "Deteniendo servicios..."
    docker-compose stop
    Write-Success "Servicios detenidos"
    Write-Info "Los datos de la base de datos se han mantenido"
}

# Reiniciar servicios
function Restart-Services {
    Write-Header "Reiniciando servicios..."
    docker-compose restart
    Write-Success "Servicios reiniciados"
    Write-Info "Esperando a que se estabilicen..."
    Start-Sleep -Seconds 5
}

# Limpiar todo
function Remove-Services {
    Write-Header "LIMPIEZA TOTAL"
    Write-Error "Esto eliminará TODOS los contenedores y datos de la base de datos"
    Write-Host ""
    
    $confirm = Read-Host "¿Estás seguro? Presiona 'si' para confirmar"
    
    if ($confirm -eq "si") {
        Write-Host "Eliminando contenedores y volúmenes..." -ForegroundColor Red
        docker-compose down -v
        Write-Success "Limpieza completada"
    }
    else {
        Write-Info "Operación cancelada"
    }
}

# Script principal
function Main {
    $firstRun = $true
    
    while ($true) {
        if ($firstRun) {
            Write-Header "Eduardo Faustos System - Docker Installer & Manager"
            
            # Verificar Docker
            if (-not (Test-Docker)) {
                Write-Error "No se puede continuar. Docker no está configurado correctamente."
                Read-Host "Presiona Enter para salir"
                exit
            }
            
            # Preguntar si levantar
            Write-Host ""
            $start = Read-Host "¿Deseas levantar los servicios ahora? (S/N)"
            
            if ($start -eq "S" -or $start -eq "s") {
                # Levantar servicios
                if (Start-Services) {
                    Wait-Services
                    Show-Status
                    $firstRun = $false
                    
                    # Preguntar si ver logs
                    Write-Host ""
                    $logs = Read-Host "¿Deseas ver los logs en tiempo real? (S/N)"
                    if ($logs -eq "S" -or $logs -eq "s") {
                        Show-Logs
                    }
                }
                else {
                    Read-Host "Error al iniciar servicios. Presiona Enter para salir"
                    exit
                }
            }
            else {
                exit
            }
        }
        
        # Menú principal
        Show-Menu
        $choice = Read-Host "Selecciona una opción (1-7)"
        
        switch ($choice) {
            "1" {
                if (Test-Docker) {
                    if (Start-Services) {
                        Wait-Services
                        Show-Status
                    }
                }
            }
            "2" {
                Show-Services-Status
            }
            "3" {
                Show-Logs
            }
            "4" {
                Stop-Services
            }
            "5" {
                Restart-Services
                Show-Services-Status
            }
            "6" {
                Remove-Services
            }
            "7" {
                Write-Host "Saliendo..." -ForegroundColor Yellow
                exit
            }
            default {
                Write-Error "Opción no válida"
            }
        }
        
        if ($choice -ne "3") {
            Read-Host "Presiona Enter para continuar"
        }
    }
}

# Ejecutar
Main

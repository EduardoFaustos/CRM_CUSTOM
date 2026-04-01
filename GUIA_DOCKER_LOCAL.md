# 🐳 Guía Completa - Instalar y Ver la Aplicación con Docker

**Actualizado:** 31 de Marzo de 2026

---

## 📋 Requisitos

### Para Windows (Recomendado)
- Windows 10/11 64-bit
- Docker Desktop instalado
- 4-6 GB de RAM disponibles
- 10 GB de espacio en disco
- Puertos libres: 3000, 5005, 8001, 1433

---

## 🔧 Paso 1: Instalar Docker Desktop (Si no lo tienes)

### A. Descargar Docker Desktop

1. Ve a https://www.docker.com/products/docker-desktop
2. Descarga **Docker Desktop for Windows**
3. Espera a que descargue (⏱️ ~600 MB)

### B. Instalar Docker Desktop

1. Ejecuta el instalador descargado: `Docker Desktop Installer.exe`
2. En las opciones de instalación:
   - ✅ Marcar: "Install required Windows components for WSL 2"
   - ✅ Marcar: "Add Docker Compose"
   - Dejar otras opciones por defecto
3. Haz clic en "Install"
4. Se pedirá reiniciar → **Reinicia tu computadora**

### C. Verificar instalación

Después de reiniciar, abre **PowerShell** y verifica:

```powershell
# Ver versión de Docker
docker --version

# Ver versión de Docker Compose
docker-compose --version

# Prueba completa (debe devolver "Hello from Docker!")
docker run hello-world
```

**Si todo funciona → ✅ Docker está instalado correctamente**

---

## 🚀 Paso 2: Levantar la Aplicación

### A. Abrir Terminal en la carpeta del proyecto

**Opción 1 - Con PowerShell:**
```powershell
# Navega a la carpeta del proyecto
cd c:\interno\tyt\crm-system

# Verifica que estés en la carpeta correcta
ls  # Deberías ver docker-compose.yml

# Verifica que Docker está ejecutándose
docker ps
```

**Opción 2 - Con Windows Explorer:**
1. Abre `c:\interno\tyt\crm-system`
2. En el menú: **File → Open PowerShell here as administrator**

### B. Levantar los servicios

```powershell
# Iniciar todos los servicios (la primera vez descargará imágenes)
docker-compose up -d

# Esperar 2-3 minutos a que todo se inicialice...
```

**¿Qué está pasando?**
- 🔵 **SQL Server** está iniciando la base de datos
- 🟢 **Backend Auth** (.NET) compilando y arrancando
- 🟠 **Backend Orders** (PHP) instalando dependencias
- 🔴 **Angular Frontend** compilando los componentes

### C. Verificar que todo está funcionando

```powershell
# Ver estado de los contenedores
docker-compose ps

# Deberías ver algo como:
# NAME                COMMAND              STATUS          PORTS
# sqlserver           mssql-server        Up 2 minutes     0.0.0.0:1433->1433/tcp
# auth-service        dotnet run          Up 1 minute      0.0.0.0:5005->5005/tcp
# orders-service      apache2 -D FOREGROUND Up 1 minute     0.0.0.0:8001->8001/tcp
# frontend            npm start           Up 1 minute      0.0.0.0:3000->3000/tcp
```

**Todos con "Up" = ✅ Todo funcionando**

---

## 👀 Paso 3: Ver la Aplicación

### A. Abrir en el navegador

Abre tu navegador favorito y ve a:

```
http://localhost:3000
```

Deberías ver la **aplicación CRM cargada** ✅

### B. Acceder a los diferentes servicios

| Servicio | URL | Propósito |
|----------|-----|-----------|
| **Frontend** | http://localhost:3000 | Aplicación web principal |
| **Auth API** | http://localhost:5005/api | API de autenticación |
| **Orders API** | http://localhost:8001/api | API de pedidos |
| **SQL Server** | localhost:1433 | Base de datos |

### C. Datos de prueba para Login

```
Usuario: admin@example.com
Contraseña: password123
```

---

## ⚙️ Paso 4: Verificar la Base de Datos (Opcional)

### Ver las bases de datos creadas

```powershell
# Conectar a SQL Server desde Docker
docker exec -it crm-system_sqlserver_1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourPassword123!

# Dentro de SQL:
SELECT name FROM sys.databases;
GO

# Deberías ver:
# CRMAuthDb    (Base de datos de autenticación)
# CRMOrdersDb  (Base de datos de pedidos)
```

**Salir de SQL:** `EXIT`

### Usar SQL Server Management Studio (SSMS)

Si tienes **SQL Server Management Studio** instalado:

1. Abre SSMS
2. **Server name:** `localhost,1433` o simplemente `localhost`
3. **Authentication:** SQL Server Authentication
4. **Login:** `sa`
5. **Password:** `YourPassword123!`
6. Click **Connect**

---

## 📊 Paso 5: Ver Logs de los Servicios

### Ver todos los logs en tiempo real

```powershell
# Mostrar logs de todos los servicios
docker-compose logs -f

# Presiona Ctrl+C para detener
```

### Ver logs de un servicio específico

```powershell
# Logs del frontend
docker-compose logs -f frontend

# Logs del backend de autenticación
docker-compose logs -f auth-service

# Logs del backend de pedidos
docker-compose logs -f orders-service

# Logs de la base de datos
docker-compose logs -f sqlserver
```

---

## 🛑 Paso 6: Detener la Aplicación

### Detener sin borrar datos

```powershell
# Detener todos los contenedores (sin borrar datos)
docker-compose stop

# Ver que están detenidos
docker-compose ps
```

### Reiniciar después de detener

```powershell
# Volver a iniciar
docker-compose start

# Volver a levantar con logs
docker-compose up
```

### Detener y borrar todo (limpieza total)

```powershell
# ⚠️ ESTO BORRARÁ TODOS LOS DATOS DE LA BD
# Detenemos y removemos contenedores
docker-compose down

# También borrar los volúmenes (BD)
docker-compose down -v
```

---

## 🔧 Comandos Útiles de Docker

### Verificar que Docker está ejecutándose

```powershell
# Ver versiones
docker --version
docker-compose --version

# Ver contenedores en ejecución
docker ps

# Ver todos los contenedores (incluso detenidos)
docker ps -a

# Ver redes de Docker
docker network ls
```

### Limpiar Docker (Liberar espacio)

```powershell
# Ver uso de espacio
docker system df

# Limpiar contenedores detenidos
docker container prune

# Limpiar imágenes no usadas
docker image prune

# Limpiar todo (⚠️ extremo cuidado)
docker system prune -a
```

### Acceder a un contenedor

```powershell
# Acceder al terminal del frontend
docker exec -it crm-system_frontend_1 bash

# Acceder al terminal del backend orders
docker exec -it crm-system_orders-service_1 bash

# Acceder a SQL Server
docker exec -it crm-system_sqlserver_1 bash
```

---

## 🧪 Paso 7: Pruebas Rápidas

### Test de las APIs

**1. Test del login (Auth API)**
```powershell
# Abrir PowerShell y pegar esto:

$body = @{
    email = "admin@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5005/api/auth/login" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

**2. Test de la API de Orders**
```powershell
# Ver todos los pedidos
Invoke-RestMethod -Uri "http://localhost:8001/api/orders" `
    -Method GET
```

### Test desde navegador

1. Abre Chrome/Firefox Developer Tools (F12)
2. Ve a la pestaña **Console**
3. Verifica que no hay errores

---

## 🐛 Solucionar Problemas

### El frontend no carga

```powershell
# Verificar logs del frontend
docker-compose logs frontend

# Si hay errores de npm:
docker-compose stop frontend
docker-compose up --build frontend
```

### El backend dice "Connection refused"

```powershell
# Verificar que SQL Server está corriendo
docker-compose ps sqlserver

# Ver logs de SQL Server
docker-compose logs sqlserver

# Esperar 30 segundos más y reintentar
```

### Puerto 3000 ya está en uso

```powershell
# Ver qué proceso usa el puerto 3000
netstat -ano | findstr :3000

# Matar el proceso (reemplaza PID por el número que viste)
taskkill /PID <PID> /F

# O cambiar el puerto en docker-compose.yml:
# Cambiar "3000:3000" a "4200:3000"
```

### Base de datos vacía (sin datos)

```powershell
# Verificar que las migraciones se ejecutaron
docker-compose logs orders-service

# Ejecutar migraciones manualmente
docker exec crm-system_orders-service_1 php artisan migrate

# Para el backend .NET
docker exec crm-system_auth-service_1 dotnet ef database update
```

---

## 📈 Verificación Completa

Ejecuta esta lista para verificar que todo funciona:

- [ ] Docker Desktop está abierto
- [ ] `docker ps` muestra 4 contenedores en ejecución
- [ ] Frontend carga en http://localhost:3000
- [ ] Se puede acceder a http://localhost:5005/api (Auth API)
- [ ] Se puede acceder a http://localhost:8001/api (Orders API)
- [ ] Puedes loguear con admin@example.com / password123
- [ ] No hay errores en la consola del navegador (F12)

---

## 📊 Información de Puertos y URLs

| Componente | Puerto | URL | Usuario | Contraseña |
|-----------|--------|-----|---------|-----------|
| Frontend (Angular) | 3000 | http://localhost:3000 | admin@example.com | password123 |
| Auth API | 5005 | http://localhost:5005/api | - | - |
| Orders API (Apache) | 8001 | http://localhost:8001/api | - | - |
| SQL Server | 1433 | localhost,1433 | sa | YourPassword123! |

---

## 🗑️ Paso Final: Limpiar al Terminar

```powershell
# Cuando termines de trabajar:

# Opción 1: Detener (guarda datos)
docker-compose stop

# Opción 2: Detener y eliminar (limpia todo)
docker-compose down

# Opción 3: Limpiar todo incluyendo datos
docker-compose down -v
```

---

## 📞 Ayuda Rápida

**¿Dónde encuentro...?**

| Necesito | Ubcación |
|----------|----------|
| Código frontend | `frontend/src/app/` |
| Código backend .NET | `backend-auth/` |
| Código backend PHP | `backend-orders/` |
| Scripts de BD | `database/migrations/` |
| Logs | Ver con `docker-compose logs` |
| Archivos de configuración | `docker-compose.yml` |
| Dockerfiles | `Dockerfile.* ` en raíz del proyecto |

---

## ✅ ¡Listo!

Ya tienes la aplicación corriendo en tu máquina local. Ahora puedes:

✅ Ver cómo se ve la interfaz  
✅ Probar las validaciones ecuatorianas (cédula/RUC)  
✅ Revisar el código fuente  
✅ Hacer cambios y ver reflejados en tiempo real  
✅ Debuguear con las herramientas del navegador  

**¿Preguntas? Revisa el archivo TROUBLESHOOTING.md o GETTING_STARTED.md**

---

**Versión:** 1.0  
**Última actualización:** 31-03-2026  
**estado:** ✅ Listo para usar

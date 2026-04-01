# Guía de Solución de Problemas

Problemas comunes y soluciones para el Sistema CRM.

## Problemas del Frontend

### 1. El API del Backend no es Accesible

**Síntoma:** Errores CORS en la consola del navegador

**Soluciones:**
```bash
# Verificar si los servicios del backend están ejecutándose
docker ps  # si usa Docker
ps aux | grep dotnet  # servicio .NET
ps aux | grep php      # servicio PHP

# Verificar disponibilidad de puerto
netstat -ano | findstr "5000"  # Windows
lsof -i :5000  # Mac/Linux

# Verificar variables de entorno
cat frontend/src/environments/environment.ts

# Reiniciar frontend
cd frontend
npm start
```

### 2. Problemas de Token de Autenticación

**Síntoma:** El estado de sesión iniciada no persiste

**Soluciones:**
```bash
# Limpiar datos del navegador
# 1. Abrir DevTools (F12)
# 2. Tab Application → Local Storage
# 3. Eliminar entradas para localhost:4200/3000

# Verificar token en LocalStorage
localStorage.getItem('token')  # consola del navegador

# Verificar formato del token
# Debe comenzar con "eyJ" y contener 3 partes separadas por puntos
```

### 3. Fallos de Compilación

**Síntoma:** `npm run build` falla

**Soluciones:**
```bash
# Limpiar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar compilación TypeScript
npm run build -- --verbose

# Verificar errores de sintaxis
npm run lint

# Actualizar Angular CLI
npm install -g @angular/cli@latest
```

### 4. Los Gráficos no se Muestran

**Síntoma:** Dashboard muestra áreas de gráficos vacías

**Soluciones:**
```bash
# Verificar ng2-charts está instalado
npm list ng2-charts

# Verificar consola del navegador para errores
# Abrir DevTools → Consola

# Reinstalar si es necesario
npm install ng2-charts chart.js
```

---

## Problemas del Servicio de Autenticación Backend (.NET)

### 1. Problemas de Conexión a Base de Datos

**Síntoma:** Error "Cannot open database"

**Soluciones:**
```bash
# Verificar SQL Server está ejecutándose
# Windows: Abrir SQL Server Configuration Manager
# Docker: docker ps | grep mssql

# Verificar cadena de conexión
cat backend-auth/CRMAuth/appsettings.json

# Probar conexión
sqlcmd -S localhost -U sa -P YourPassword123! -Q "SELECT 1"

# Si la cadena de conexión es incorrecta:
# Editar appsettings.json y reiniciar servicio
dotnet run
```

### 2. Problemas de Migración EF Core

**Síntoma:** Advertencia "Pending migrations"

**Soluciones:**
```bash
cd backend-auth/CRMAuth

# Verificar estado de migraciones
dotnet ef migrations list

# Aplicar migraciones pendientes
dotnet ef database update

# Si falla, recrear base de datos
dotnet ef database drop --force
dotnet ef database create
dotnet ef database update
```

### 3. Problemas de Token JWT

**Síntoma:** Errores "Invalid token"

**Soluciones:**
```bash
# Verificar longitud del secreto JWT (mínimo 32 caracteres)
echo $env:Jwt__Secret | Measure-Object -Character  # PowerShell

# Verificar payload del token
# Decodificar en jwt.io

# Verificar expiración del token
# Token en JWT.io muestra la sección "exp"

# Regenerar secreto si es necesario
# Editar appsettings.json
# Redesplegarel servicio
```

### 4. Errores CORS

**Síntoma:** Errores "Access-Control-Allow-Origin"

**Soluciones:**
```bash
# Verificar CORS configurado en Program.cs
# Debe tener:
# builder.Services.AddCors(options =>
# {
#     options.AddPolicy("AllowAll", ...
# });

# Verificar si URL del frontend está permitida
# Actualizar política CORS con URL correcta del frontend
```

---

## Problemas del Servicio de Pedidos Backend (PHP)

### 1. Problemas de Conexión a Base de Datos

**Síntoma:** Errores "SQLSTATE[HY000]" o "Connection refused"

**Soluciones:**
```bash
# Verificar SQL Server es accesible
# Desde el contenedor PHP
php -r "sqlsrv_connect('localhost', array('UID' => 'sa', 'PWD' => 'password'));"

# Verificar archivo .env existe y tiene valores correctos
ls -la backend-orders/.env

# Verificar si controlador SQL Server PHP está instalado
php -m | grep sqlsrv
# Si no: docker-compose rebuild

# Probar conexión directamente
php artisan tinker
DB::connection()->getPdo();
```

### 2. Problemas de Modelo Eloquent

**Síntoma:** Errores "Column not found"

**Soluciones:**
```bash
# Ejecutar migraciones
cd backend-orders
php artisan migrate

# Si falla migración, verificar archivos
ls database/migrations/

# Verificar esquema de base de datos
php artisan tinker
DB::table('customers')->getConnection()->getSchemaBuilder()->getColumnListing('customers');

# Reiniciar base de datos si es necesario (¡cuidado!)
php artisan migrate:refresh --seed
```

### 3. Problemas de Respuesta de API

**Síntoma:** Errores 500 o "Method not allowed"

**Soluciones:**
```bash
# Verificar rutas
php artisan route:list

# Verificar métodos del controlador existen
cat app/Http/Controllers/CustomerController.php

# Verificar sintaxis PHP
php -l app/Http/Controllers/CustomerController.php

# Ver logs de error
tail -f storage/logs/laravel.log
```

### 4. Problemas CORS

**Síntoma:** Solicitudes cross-origin bloqueadas

**Soluciones:**
```bash
# Añadir encabezados CORS a respuestas
# En routes/api.php o middleware

// Añadir a routes/api.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

# O instalar paquete CORS de Laravel
composer require fruitcake/laravel-cors
php artisan vendor:publish --tag="cors"
```

---

## Problemas de Base de Datos

### 1. No se puede Conectar a SQL Server

**Síntoma:** Errores de timeout de conexión

**Soluciones:**
```bash
# Verificar servicio SQL Server está ejecutándose
# Windows: net start MSSQLSERVER
# Docker Linux: docker ps | grep sqlserver

# Verificar puerto está abierto
netstat -an | findstr 1433

# Verificar credenciales
# Predeterminado: User=sa, Password=YourPassword123!

# Probar conexión telnet
telnet localhost 1433
```

### 2. Base de Datos no Existe

**Síntoma:** Errores "Database not found"

**Soluciones:**
```bash
# Conectar a SQL Server
sqlcmd -S localhost -U sa -P YourPassword123!

# Verificar bases de datos existentes
SELECT name FROM sys.databases;
GO

# Crear bases de datos si faltan
CREATE DATABASE CRMAuthDb;
GO
CREATE DATABASE CRMOrdersDb;
GO

# Ejecutar migraciones
# .NET: dotnet ef database update
# PHP: php artisan migrate
```

### 3. Espacio en Disco Insuficiente

**Síntoma:** Errores "Cannot write to database"

**Soluciones:**
```bash
# Verificar tamaño archivo log SQL Server
# Windows: C:\Program Files\Microsoft SQL Server\MSSQL*\MSSQL\LOG\

# Reducir archivo log
DBCC SHRINKFILE (CRMAuthDb_log, 100);
GO

# Eliminar volúmenes Docker antiquos (Linux)
docker volume prune

# Eliminar datos del contenedor Docker
docker system prune -a
```

---

## Problemas de Docker

### 1. Los Servicios No Inician

**Síntoma:** Errores `docker-compose up`

**Soluciones:**
```bash
# Verificar demonio Docker está ejecutándose
docker ps

# Ver logs detallados
docker-compose logs -f

# Reconstruir imágenes
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verificar conflictos de puerto
netstat -an | findstr "3000"  # Windows
lsof -i :3000  # Mac/Linux
```

### 2. Contenedor se Reinicia Continuamente

**Síntoma:** El contenedor sale inmediatamente

**Soluciones:**
```bash
# Ver logs del contenedor
docker logs container-name

# Ejecutar contenedor interactivamente
docker run -it image-name /bin/bash

# Problemas comunes:
# - Puerto ya en uso
# - Variables de entorno faltantes
# - Fallo de healthcheck
```

### 3. No se puede Acceder al Servicio del Contenedor

**Síntoma:** Connection refused a localhost:puerto

**Soluciones:**
```bash
# Verificar mapeo de puertos
docker ps

# Verificar servicio está escuchando
docker exec -it crm-auth bash
netstat -an | grep LISTEN

# Probar IP del contenedor
docker inspect container-name | grep IPAddress

# Verificar red Docker
docker network ls
docker network inspect bridge
```

---

## Problemas de Rendimiento

### 1. Respuestas Lentas de API

**Síntoma:** API tarda 5+ segundos en responder

**Soluciones:**
```bash
# Verificar rendimiento de base de datos
# SQL Server: Ver planes de ejecución de consultas
# PHP: Habilitar query logging en .env
LOG_QUERIES=true

# Verificar para consultas N+1
# Tab Redes del Frontend → ver solicitudes múltiples

# Optimizar índices de base de datos
# Comúnes en: customers.email, orders.status, orders.customer_id

# Verificar uso de memoria del servidor
docker stats
```

### 2. Tiempo de Carga del Frontend Lento

**Síntoma:** La página tarda mucho tiempo en cargar

**Soluciones:**
```bash
# Compilar bundle de producción
cd frontend
npm run build

# Verificar tamaño del bundle
npm run build | grep "bundle.js"

# Analizar bundles
npm install webpack-bundle-analyzer
npm run build -- --analyze

# Habilitar compresión
# Añadir a config de Nginx o http-server
gzip on;
```

---

## Problemas de Seguridad

### 1. HTTPS Falta

**Síntoma:** El navegador muestra "No es seguro"

**Soluciones:**
```bash
# Para desarrollo: usar localhost (HTTP está bien)
# Para producción: 
# 1. Obtener certificado SSL (Let's Encrypt es gratis)
# 2. Actualizar docker-compose con puertos HTTPS
# 3. Configurar Nginx/IIS para SSL

# Setup HTTPS Docker Compose:
environment:
  - ASPNETCORE_URLS=https://+:5001;http://+:5000
  - ASPNETCORE_Kestrel__Certificates__Default__Path=/https/cert.pfx
```

### 2. Datos Sensibles Expuestos

**Síntoma:** Claves API/contraseñas visibles en solicitudes de red

**Soluciones:**
```bash
# Nunca hacer commit de secretos
echo "*.key" >> .gitignore
echo ".env" >> .gitignore

# Usar variables de entorno
# Nunca codificar en el código

# Verificar historial git
git grep "password" $(git rev-list --all)

# Usar gestores de contraseñas para credenciales
```

---

## Lista de Verificación de Solución de Problemas

Cuando depure, trabaje a través de este proceso sistemático:

```bash
# 1. Verificar servicios están ejecutándose
docker ps  # Docker
ps aux | grep -E "dotnet|php|node"  # Manual

# 2. Verificar logs
docker-compose logs -f service-name
tail -f storage/logs/laravel.log  # PHP
dotnet run  # .NET (salida de consola)

# 3. Probar conectividad
# Frontend → Backend
curl http://localhost:5000/api/auth/verify
curl http://localhost:8001/api/customers

# 4. Verificar base de datos
# Conectar y consultar
sqlcmd -S localhost -U sa -P YourPassword123! -Q "SELECT * FROM Users"

# 5. Verificar navegador
# Abrir DevTools (F12)
# Pestaña Network: verificar respuestas API
# Pestaña Console: verificar errores de JavaScript

# 6. Limpiar cachés
# Navegador: Ctrl+Shift+Delete → Limpiar todo
# Docker: docker system prune
# Frontend: rm -rf node_modules && npm install
```

## Obtener Ayuda

Si los problemas persisten:

1. Verificar archivos README.md relevantes
2. Revisar API_DOCUMENTATION.md para uso de API
3. Verificar logs con salida detallada
4. Buscar problemas existentes en el historial git
5. Probar en aislamiento (ej: base de datos por separado)
6. Crear ejemplo reproducible mínimo

# Guía de Referencia Rápida

Búsqueda rápida para comandos y operaciones comunes.

## 🚀 Inicio Rápido (5 minutos)

```bash
# Clonar y navegar
cd crm-system

# Método 1: Docker (Recomendado)
docker-compose up -d

# Método 2: Manual
# Terminal 1: Frontend
cd frontend && npm install && npm start

# Terminal 2: Backend Autenticación
cd backend-auth/CRMAuth && dotnet run

# Terminal 3: Backend Pedidos
cd backend-orders && php artisan serve

# Acceder a la aplicación
# Frontend: http://localhost:3000 (o :4200 si npm start)
# Auth Swagger: http://localhost:5005/swagger
```

---

## 📋 Comandos Esenciales

### Frontend (Angular)

```bash
cd frontend

# Instalar dependencias
npm install

# Servidor de desarrollo
npm start
# O
ng serve

# Compilar producción
npm run build

# Ejecutar pruebas
npm test

# Ejecutar linter
npm run lint

# Limpiar caché
rm -rf node_modules package-lock.json
npm install

# Servir archivos compilados
npx http-server dist/frontend
```

### Backend Autenticación (.NET 8)

```bash
cd backend-auth/CRMAuth

# Restaurar dependencias
dotnet restore

# Ejecutar servidor de desarrollo
dotnet run

# Ejecutar en modo producción
dotnet run --configuration Release

# Compilar proyecto
dotnet build

# Ejecutar pruebas
dotnet test

# Migraciones de base de datos
dotnet ef migrations add NombreMigracion
dotnet ef database update
dotnet ef database drop

# Crear compilación de producción
dotnet publish -c Release -o ./publish
```

### Backend Pedidos (PHP/Laravel)

```bash
cd backend-orders

# Instalar dependencias
composer install

# Servidor de desarrollo
php artisan serve

# Ejecutar migraciones
php artisan migrate

# Resetear migraciones (cuidado)
php artisan migrate:refresh --seed

# Ejecutar pruebas
php artisan test

# Tinker (REPL de PHP)
php artisan tinker

# Limpiar caché
php artisan cache:clear
php artisan config:clear
```

### Docker

```bash
# Iniciar todos los servicios (recomendado)
docker-compose up -d

# Detener todos los servicios
docker-compose down

# Ver logs
docker-compose logs -f

# Logs de servicio específico
docker-compose logs -f crm-frontend

# Compilar imágenes
docker-compose build

# Eliminar imágenes y volúmenes (¡cuidado!)
docker-compose down -v

# Recompilar sin caché
docker-compose build --no-cache

# Entrar en contenedor de servicio
docker exec -it crm-auth bash
docker exec -it crm-orders /bin/bash
```

---

## 🔐 Credenciales de Acceso

### Usuarios de Prueba Predeterminados

| Email | Contraseña | Rol |
|-------|-----------|-----|
| user@example.com | Password123! | Usuario |
| admin@example.com | Admin123! | Administrador |

**Para registrar nuevo usuario:**
1. Clic en "Registrar" en página de inicio de sesión
2. Completa: Email, Nombre, Contraseña
3. Sistema crea la cuenta
4. Inicia sesión automáticamente

---

## 🔗 Puntos Finales de API

### Servicio Autenticación (Puerto 5005)

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/verify        [Requiere JWT]
GET    /swagger                 [UI Swagger]
```

### Servicio Pedidos (Puerto 8001)

```
GET    /api/customers
POST   /api/customers
GET    /api/customers/{id}
PUT    /api/customers/{id}
DELETE /api/customers/{id}

GET    /api/orders              [Filtro: status, customer_id, date]
POST   /api/orders
GET    /api/orders/{id}
PUT    /api/orders/{id}
PATCH  /api/orders/{id}/status
DELETE /api/orders/{id}

GET    /api/dashboard/stats
GET    /api/dashboard/order-activity
GET    /api/dashboard/revenue-chart
```

### Frontend (Puerto 3000 o 4200)

```
http://localhost:3000
├── /auth/login
├── /auth/register
├── /dashboard
├── /customers
│   ├── /customers/list
│   ├── /customers/create
│   └── /customers/edit/:id
└── /orders
    ├── /orders/list
    ├── /orders/create
    └── /orders/edit/:id
```

---

## 🧪 Pruebas

### Frontend (Angular)

```bash
cd frontend

# Ejecutar todas las pruebas
npm test

# Ejecutar archivo específico
npm test -- --include='**/auth.service.spec.ts'

# Ejecutar con cobertura
ng test --code-coverage

# Modo headless (CI)
ng test --watch=false --browsers=ChromeHeadless

# Pruebas E2E (si están configuradas)
ng e2e
```

### Backend Autenticación (.NET)

```bash
cd backend-auth

# Ejecutar todas las pruebas
dotnet test

# Ejecutar prueba específica
dotnet test --filter "AuthServiceTests"

# Ejecutar con salida detallada
dotnet test -v n

# Generar informe de cobertura
dotnet test /p:CollectCoverage=true /p:CoverageFormat=opencover
```

### Backend Pedidos (PHP)

```bash
cd backend-orders

# Ejecutar todas las pruebas
php artisan test

# Ejecutar prueba específica
php artisan test tests/Feature/CustomerControllerTest.php

# Ejecutar método de prueba específico
php artisan test tests/Feature/CustomerControllerTest.php --filter=test_can_create_customer
```

---

## 📊 Gestión de Base de Datos

### SQL Server (Docker)

```bash
# Conectar a SQL Server
sqlcmd -S localhost -U sa -P YourPassword123!

# Comandos comunes en sqlcmd
# Listar bases de datos
SELECT name FROM sys.databases;
GO

# Usar base de datos específica
USE CRMAuthDb;
GO

# Listar tablas
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;
GO

# Ejecutar consulta
SELECT * FROM Users;
GO

# Salir
EXIT
GO
```

### Copias de Seguridad de Base de Datos

```bash
# Hacer copia de seguridad (desde contenedor)
docker exec crm-db \
  /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P YourPassword123! \
  -Q "BACKUP DATABASE CRMAuthDb TO DISK = '/var/opt/mssql/backup/CRMAuthDb.bak'"

# Restaurar base de datos
USE master;
RESTORE DATABASE CRMAuthDb 
FROM DISK = '/var/opt/mssql/backup/CRMAuthDb.bak';
GO
```

---

## 🔑 Variables de Entorno

### Frontend (`frontend/.env`)

```bash
VITE_API_AUTH_URL=http://localhost:5005
VITE_API_ORDERS_URL=http://localhost:8001
```

### Backend Autenticación (`backend-auth/appsettings.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=CRMAuthDb;User Id=sa;Password=YourPassword123!"
  },
  "Jwt": {
    "Secret": "TuClaveSecretaDe32CaracteresOMedia!",
    "Issuer": "CRMAuthService",
    "Audience": "CRMClient",
    "ExpirationMinutes": 1440
  }
}
```

### Backend Pedidos (`backend-orders/.env`)

```bash
DB_CONNECTION=sqlsrv
DB_HOST=localhost
DB_PORT=1433
DB_DATABASE=CRMOrdersDb
DB_USERNAME=sa
DB_PASSWORD=YourPassword123!
```

---

## 🐛 Modo Debug

### Frontend

```typescript
// En cualquier componente o servicio
import { enableDebugTools } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

enableDebugTools(componentRef);

// Luego en consola del navegador
ng.probe($0).componentInstance  // Obtener instancia del componente
ng.probe($0).injector.get(YourService)  // Obtener servicio
```

### Backend Autenticación

```csharp
// Program.cs - Habilitar logging detallado
builder.Services
  .AddLogging(config => config
    .AddConsole()
    .SetMinimumLevel(LogLevel.Debug));

// Luego en código
private readonly ILogger<AuthService> _logger;
_logger.LogDebug("Mensaje debug: {variable}", variable);
```

### Backend Pedidos

```bash
# Habilitar query logging
# En .env
APP_DEBUG=true

# En tinker
php artisan tinker
DB::enableQueryLog();
Customer::all();
dd(DB::getQueryLog());
```

---

## 📦 URLs de Despliegue

| Entorno | Frontend | Auth API | Orders API |
|---------|----------|----------|-----------|
| Local | http://localhost:3000 | http://localhost:5005 | http://localhost:8001 |
| Docker | http://localhost:3000 | http://crm-auth:5005 | http://crm-orders:8001 |
| Preparación | https://staging.crm.local | https://auth.staging.crm.local | https://api.staging.crm.local |
| Producción | https://crm.company.com | https://auth.crm.company.com | https://api.crm.company.com |

---

## 📝 Ubicaciones de Archivos

```
crm-system/
├── frontend/                    # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/           # Módulo autenticación
│   │   │   ├── customers/      # Módulo clientes
│   │   │   ├── orders/         # Módulo pedidos
│   │   │   ├── dashboard/      # Módulo dashboard
│   │   │   ├── shared/         # Componentes compartidos
│   │   │   └── services/       # Servicios HTTP
│   │   ├── environments/       # Configuración de entornos
│   │   └── styles.scss         # Estilos globales
│   └── package.json
│
├── backend-auth/                # Servicio Autenticación .NET
│   └── CRMAuth/
│       ├── Controllers/
│       ├── Models/
│       ├── Services/
│       ├── Data/               # DbContext
│       └── Program.cs
│
├── backend-orders/              # Servicio Pedidos PHP/Laravel
│   ├── app/
│   │   ├── Models/
│   │   └── Http/Controllers/
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   └── .env
│
├── docker-compose.yml           # Orquestación Docker
├── Dockerfile.frontend          # Imagen Frontend
├── Dockerfile.auth              # Imagen Autenticación
├── Dockerfile.orders            # Imagen Pedidos
│
├── postman-collection.json      # Pruebas de API
├── ARCHITECTURE.md              # Documentación arquitectura
├── API_DOCUMENTATION.md         # Referencia de API
├── DEPLOYMENT.md                # Guía despliegue
├── TESTING.md                   # Guía pruebas
└── TROUBLESHOOTING.md           # Este archivo
```

---

## 🎯 Tareas Comunes

### Agregar Nuevo Registro de Cliente

```bash
curl -X POST http://localhost:8001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "address": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip_code": "62701"
  }'
```

### Crear Pedido

```bash
curl -X POST http://localhost:8001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "order_number": "ORD-001",
    "status": "pending",
    "items": [
      {
        "product_name": "Widget",
        "quantity": 5,
        "unit_price": 29.99
      }
    ]
  }'
```

### Actualizar Estado de Pedido

```bash
curl -X PATCH http://localhost:8001/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Registrar Nuevo Usuario

```bash
curl -X POST http://localhost:5005/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "New User",
    "password": "Password123!"
  }'
```

### Iniciar Sesión y Obtener Token

```bash
curl -X POST http://localhost:5005/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'

# La respuesta incluirá el token:
# {
#   "success": true,
#   "message": "Login successful",
#   "data": {
#     "token": "eyJhbGciOiJIUzI1NiIs..."
#   }
# }
```

### Usar Token en Solicitudes

```bash
# Establecer variable en shell
TOKEN="eyJhbGciOiJIUzI1NiIs..."

# Usar en llamadas de API
curl -X GET http://localhost:5005/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

---

## ⚡ Optimización de Rendimiento

### Frontend

```bash
# Verificar tamaños de bundle
cd frontend
npm run build -- --analyzer

# Minificar y comprimir
npm run build -- --prod

# Habilitar compresión gzip
npm install compression
```

### Backend

```bash
# Índices de base de datos
CREATE INDEX idx_customer_email ON Customers(email);
CREATE INDEX idx_order_status ON Orders(status);
CREATE INDEX idx_order_customer ON Orders(customer_id);

# Limpiar caché de consultas
php artisan cache:clear
```

---

## 🔒 Lista de Verificación de Seguridad

- [ ] Cambiar contraseña predeterminada de base de datos
- [ ] Actualizar secreto JWT (32+ caracteres mínimo)
- [ ] Habilitar HTTPS en producción
- [ ] Configurar CORS para dominios específicos (no wildcard)
- [ ] Habilitar limitación de velocidad
- [ ] Agregar validación de entrada
- [ ] Revisar copias de seguridad de base de datos
- [ ] Configurar monitoreo y alertas
- [ ] Mantener dependencias al día
- [ ] Revisar logs de errores regularmente

---

## 📞 Recursos de Soporte

- **Documentación API**: Ver [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Arquitectura**: Ver [ARCHITECTURE.md](ARCHITECTURE.md)
- **Guía Pruebas**: Ver [TESTING.md](TESTING.md)
- **Despliegue**: Ver [DEPLOYMENT.md](DEPLOYMENT.md)
- **Solución de Problemas**: Ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Inicio Rápido**: Ver [GETTING_STARTED.md](GETTING_STARTED.md)

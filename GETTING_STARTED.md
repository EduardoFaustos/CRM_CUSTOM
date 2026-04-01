# Guía de Inicio Rápido - Sistema CRM

Complete la configuración del Sistema CRM en 10 minutos.

---

## 📋 Lista de Verificación de Requisitos Previos

Antes de comenzar, verifica que tengas instalado lo siguiente:

### Opción A: Docker Compose (Recomendado - Más Fácil)
- [ ] Docker instalado y ejecutándose
- [ ] Docker Compose instalado (incluido con Docker Desktop)
- [ ] 4 GB de RAM disponibles
- [ ] 5 GB de espacio en disco disponible
- [ ] Puertos 3000, 5005, 8001, 1433 disponibles

### Opción B: Configuración Manual (Más Control)
- [ ] Node.js 18+ instalado
- [ ] npm actualizado (`npm --version`)
- [ ] .NET 8 SDK instalado
- [ ] PHP 8.2+ instalado
- [ ] Composer instalado
- [ ] SQL Server 2022 o superior (instalado y ejecutándose)
- [ ] Todos los puertos arriba disponibles

⏱️ **Tiempo estimado para verificar:** 2 minutos

---

## 🚀 Opción 1: Configuración con Docker (Recomendado)

### Paso 1: Clonar el Repositorio

```bash
# Si aún no has clonado
git clone <repository-url>
cd crm-system
```

### Paso 2: Iniciar los Servicios

```bash
# Iniciar todos los servicios
docker-compose up -d

# Esperar 1-2 minutos a que todo se inicialice...
```

### Paso 3: Verificar que Todo Funciona

```bash
# Ver estado de los contenedores
docker-compose ps

# Deberías ver 4 contenedores corriendo:
# - crm-frontend (Puerto 3000)
# - crm-auth (Puerto 5005)
# - crm-orders (Puerto 8001 - Apache/PHP)
# - crm-db (SQL Server, Puerto 1433)
```

### Paso 4: Acceder a la Aplicación

Abre tu navegador y visita:
- **Frontend:** http://localhost:3000
- **Swagger (API Auth):** http://localhost:5005/swagger
- **Orders API:** http://localhost:8001/api

### Paso 5: Primer Inicio de Sesión

Usa estas credenciales de usuario de prueba:

```
Email:    user@example.com
Contraseña: Password123!
```

¡Listo! ✅ Tu sistema está ejecutándose localmente.

⏱️ **Tiempo total:** ~3 minutos

---

## 🔧 Opción 2: Configuración Manual (Sin Docker)

### Paso 1: Configurar Base de Datos SQL Server

```bash
# En terminal o SQL Server Management Studio
sqlcmd -S localhost -U sa -P YourPassword123!
```

Copiar y ejecutar en sqlcmd:
```sql
CREATE DATABASE CRMAuthDb;
GO
CREATE DATABASE CRMOrdersDb;
GO
EXIT
```

### Paso 2: Configurar Frontend (Terminal 1)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Esperar a que se abra en http://localhost:4200 (pode variar)
```

### Paso 3: Configurar Backend Autenticación (Terminal 2)

```bash
cd backend-auth/CRMAuth

# Restaurar dependencias
dotnet restore

# Actualizar base de datos (ejecuta migraciones)
dotnet ef database update

# Iniciar servidor
dotnet run

# Debería iniciar en http://localhost:5005
```

### Paso 4: Configurar Backend Pedidos (Terminal 3)

```bash
cd backend-orders

# Instalar dependencias
composer install

# Crear archivo .env
cp .env.example .env

# Ejecutar migraciones
php artisan migrate

# Iniciar servidor
php artisan serve

# Debería iniciar en http://localhost:8000 por defecto
# O especificar puerto:
php artisan serve --port=5001
```

### Paso 5: Acceder a la Aplicación

- **Frontend:** http://localhost:4200
- **Auth Swagger:** http://localhost:5005/swagger
- **Orders API:** http://localhost:8000 (o :5001 si especificaste)

### Paso 6: Primer Inicio de Sesión

Usa credenciales de prueba:
```
Email:    user@example.com
Contraseña: Password123!
```

⏱️ **Tiempo total:** ~5 minutos

---

## ✅ Verificación de Configuración Exitosa

Sigue estas pruebas rápidas para confirmar que todo funciona correctamente:

### 1. Verificar Frontend
```bash
# Abrir navegador
http://localhost:4200

# Debes ver:
✅ Página de inicio de sesión
✅ Campos de email y contraseña
✅ Botón de Registrar
✅ Diseño responsive
```

### 2. Verificar Servicio de Autenticación
```bash
# Opción 1: Navegador
http://localhost:5005/swagger

# Deberías ver:
✅ Interfaz Swagger
✅ Endpoints listados (/register, /login, /verify)
✅ Botón "Try it out" funcional

# Opción 2: cURL
curl http://localhost:5005/api/auth/verify
# Retorna 401 (unauthorized) = correcto
```

### 3. Verificar Servicio de Pedidos
```bash
# cURL
curl http://localhost:5001/api/customers \
  -H "Authorization: Bearer dummy"

# O en navegador
http://localhost:5001/api/customers
# Retorna 401 (unauthorized) = correcto
```

### 4. Primo Login Test
```bash
# En navegador
1. Navega a http://localhost:4200
2. Completa Email: user@example.com
3. Completa Contraseña: Password123!
4. Haz clic "Iniciar Sesión"
5. Debes ver el dashboard

✅ Si ves el dashboard → Configuración exitosa!
```

---

## 🎯 Primer Tutorial (5 minutos después del inicio)

Una vez que hayas iniciado sesión, prueba esto:

### 1. Crear un Cliente
```
1. Haz clic en "Clientes" en el menú
2. Haz clic en "+ Crear Cliente"
3. Completa:
   - Nombre: "Test Company"
   - Email: "test@company.com"
   - Teléfono: "+1-555-0100"
   - Dirección: "123 Main St"
4. Haz clic "Guardar"
5. Cliente aparece en la lista
```

### 2. Crear un Pedido
```
1. Haz clic en "Pedidos" en el menú
2. Haz clic en "+ Crear Pedido"
3. Selecciona Cliente: "Test Company"
4. Agrega artículos (ejemplo):
   - SKU: PROD-001
   - Cantidad: 5
   - Precio: $29.99
5. Haz clic "Crear"
6. Pedido aparece en lista con estado "Pendiente"
```

### 3. Ver Dashboard
```
1. Haz clic en "Dashboard" en el menú
2. Ves estadísticas en tiempo real:
   - Total de Clientes
   - Total de Pedidos
   - Ingresos
   - Gráficos de actividad
```

¡Felicidades! ✅ El sistema está completamente funcional.

---

## 🐛 Troubleshooting Rápido

Si algo no funciona:

### Puerto ya en uso
```bash
# Windows
netstat -ano | findstr "4200"
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :4200
kill -9 <PID>
```

### Docker no inicia
```bash
# Verificar Docker está ejecutándose
docker --version
docker ps

# Si falla:
docker-compose down
docker-compose up -d
```

### Que no puedo iniciar sesión
```bash
# Verificar backend responde
curl http://localhost:5005/api/auth/verify

# Si no responde:
docker-compose logs -f crm-auth

# Limpiar localStorage del navegador
# DevTools → Application → Local Storage → Limpiar
```

### Base de datos no conecta
```bash
# Verificar SQL Server
docker ps | grep mssql
docker logs crm-db

# Esperar más tiempo y reintentar (SQL Server tarda)
sleep 30
docker-compose ps
```

**¿Problema no resuelto?** → Ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📚 Próximos Pasos

Ahora que tienes el sistema funcionando:

1. **Entender la arquitectura:** Lee [ARCHITECTURE.md](ARCHITECTURE.md) (15 min)
2. **Aprender las APIs:** Lee [API_DOCUMENTATION.md](API_DOCUMENTATION.md) (10 min)
3. **Hacer cambios:** Edita código en `frontend/`, `backend-auth/`, `backend-orders/`
4. **Ejecutar pruebas:** Sigue [TESTING.md](TESTING.md) (15 min)
5. **Desplegar:** Lee [DEPLOYMENT.md](DEPLOYMENT.md) (20 min)

---

## 🔗 Recursos útiles

- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Comandos comunes
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Endpoints
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Soluciones de problemas
- [postman-collection.json](postman-collection.json) - Pruebas de API (importar a Postman)

---

## ⏱️ Resumen de Tiempos

| Tarea | Time |
|-------|------|
| Verificar requisitos | 2 min |
| Docker setup | 3 min |
| Primer login | 1 min |
| Tutorial básico | 5 min |
| **Total** | **11 min** |

¡Configuración completada! Estás listo para desarrollar. 🚀

---

**¿Preguntas?** Consulta [INDEX.md](INDEX.md) para encontrar la documentación correcta.

**¿Problemas?** Ve a [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

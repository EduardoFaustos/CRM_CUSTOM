# 🚀 VER LA APLICACIÓN EN DOCKER - guía rápida

**Último update:** 31 de Marzo de 2026

---

## ⏱️ 5 minutos para tener la app funcionando

### Paso 1️⃣: Descargar Docker (si no lo tienes)

👉 https://www.docker.com/products/docker-desktop

Descarga → Instala → Reinicia

---

### Paso 2️⃣: Abrir Terminal

**Opción A - Windows Explorer (más fácil):**
1. Abre la carpeta: `c:\interno\tyt\crm-system`
2. Click derecho en la carpeta vacía → **Open PowerShell here as administrator**

**Opción B - PowerShell manual:**
```powershell
cd c:\interno\tyt\crm-system
```

---

### Paso 3️⃣: Ejecutar UNO de estos comandos

#### OPCIÓN 1 - Script automático (RECOMENDADO)

```powershell
# Windows:
.\start-docker.ps1

# Si pide permiso, ejecuta primero esto:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### OPCIÓN 2 - Manual con Docker Compose

```powershell
docker-compose up -d
```

**Espera 2-3 minutos...**

---

### Paso 4️⃣: Ver si todo está corriendo

```powershell
docker-compose ps
```

Deberías ver esto:
```
NAME            STATUS
sqlserver       Up 2 minutes
auth-service    Up 1 minute
orders-service  Up 1 minute
frontend        Up 1 minute
```

✅ Todos con "Up" = **¡Está funcionando!**

---

### Paso 5️⃣: Abrir la aplicación

Abre en tu navegador:

```
http://localhost:3000
```

---

## 🔐 Datos de Login

```
Email:      admin@example.com
Contraseña: password123
```

---

## 🌐 URLs de acceso

| Qué | Dónde |
|-----|-------|
| **App Web** | http://localhost:3000 |
| **API Auth** | http://localhost:5000/api |
| **API Orders** | http://localhost:8001/api |
| **Base de Datos** | localhost:1433 |

---

## ⛔ Detener la aplicación

```powershell
# Detener (guarda datos)
docker-compose stop

# O completamente:
docker-compose down

# O borrar todo:
docker-compose down -v
```

---

## 🐛 Problemas comunes

### No funciona nada
```powershell
# Verificar estado
docker-compose ps

# Ver errores
docker-compose logs
```

### Puerto ya está en uso
```powershell
# Ver qué usa el puerto
netstat -ano | findstr :3000

# Matar el proceso
taskkill /PID <numero> /F
```

### Docker no inicia
```powershell
# Abre Docker Desktop y espera a que cargue
# Luego intenta de nuevo
```

---

## 📚 Para más detalles

- Guía completa: [`GUIA_DOCKER_LOCAL.md`](GUIA_DOCKER_LOCAL.md)
- Problemas: [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)
- Setup: [`GETTING_STARTED.md`](GETTING_STARTED.md)

---

## ✨ Eso es todo!

Ya tienes la aplicación CRM corriendo con:
- ✅ Frontend Angular
- ✅ Backend .NET
- ✅ Backend PHP
- ✅ Base de datos SQL Server
- ✅ Todas las validaciones ecuatorianas

**Abre http://localhost:3000 y empieza a probar 🎉**


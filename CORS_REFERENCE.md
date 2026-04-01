# 🔐 Guía de CORS - Sistema CRM

## Configuración Actual de CORS

### 📍 Ubicación
```
backend-orders/app/Http/Middleware/CorsMiddleware.php
```

### ⚙️ Configuración

| Parámetro | Valor |
|-----------|-------|
| **Origen Permitido** | `http://localhost:3000` |
| **Métodos HTTP** | GET, POST, PUT, DELETE, PATCH, OPTIONS |
| **Headers Permitidos** | Content-Type, Authorization, X-Requested-With |
| **Credenciales** | Habilitadas |
| **Max Age** | 86400 segundos (24 horas) |

---

## 🔍 Verificación de CORS

### 1. Verificar que los Headers se Envían Correctamente

**En el navegador (DevTools → Network):**
```
Request Headers:
  Access-Control-Allow-Origin: http://localhost:3000
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
  Access-Control-Allow-Credentials: true
```

### 2. Probar con cURL

```bash
# Solicitud preflight (OPTIONS)
curl -X OPTIONS http://localhost:8001/api/customers \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Solicitud real (GET)
curl -X GET http://localhost:8001/api/customers \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -v
```

---

## ⚠️ Problemas Comunes y Soluciones

### Problema: "Access-Control-Allow-Origin contains multiple values"

**Causa:** Los headers CORS están siendo establecidos en múltiples lugares (Apache + Middleware)

**Solución:** 
1. Verificar que `apache.conf` NO tiene headers CORS
2. Verificar que `nginx.conf` NO tiene headers CORS
3. Regenerar autoload: `docker compose exec -T orders-service composer dump-autoload`
4. Reiniciar Apache: `docker compose exec -T orders-service apachectl restart`

### Problema: CORS error pero sin headers en la respuesta

**Causa:** El middleware no se está ejecutando

**Solución:**
1. Verificar que el middleware está registrado en `bootstrap/app.php`
2. Verificar que la solicitud llega al endpoint (verificar logs)
3. Revisar que no hay otra configuración de CORS conflictiva

### Problema: El frontend no puede acceder a la API

**Checklist:**
- [ ] ¿El frontend está en `http://localhost:3000`?
- [ ] ¿La API está en `http://localhost:8001`?
- [ ] ¿El navegador muestra error CORS en la consola?
- [ ] ¿Los headers de respuesta incluyen `Access-Control-Allow-Origin`?
- [ ] ¿El contenedor Apache está corriendo?

---

## 🔧 Personalizar CORS

### Para Permitir Otro Origen

**Editar:** `backend-orders/app/Http/Middleware/CorsMiddleware.php`

**Línea 20 y 33:**
```php
// Cambiar de:
->header('Access-Control-Allow-Origin', 'http://localhost:3000')

// A:
->header('Access-Control-Allow-Origin', 'http://tu-dominio.com')
```

### Para Permitir Múltiples Orígenes

```php
$allowedOrigins = [
    'http://localhost:3000',
    'http://tu-dominio.com',
    'https://tu-dominio.com'
];

$origin = $request->header('Origin');
if (in_array($origin, $allowedOrigins)) {
    $originToUse = $origin;
} else {
    $originToUse = $allowedOrigins[0]; // Default
}

$response->headers->set('Access-Control-Allow-Origin', $originToUse);
```

### Para Permitir Cualquier Origen (⚠️ Solo Desarrollo)

```php
->header('Access-Control-Allow-Origin', '*')
->header('Access-Control-Allow-Credentials', 'false') // Importante: no puede ser true con *
```

---

## 📋 Checklist de Implementación

### Al Cambiar CORS

- [ ] Actualizar middleware en `CorsMiddleware.php`
- [ ] Verificar que Apache NO tiene headers CORS en `apache.conf`
- [ ] Verificar que Nginx NO tiene headers CORS en `nginx.conf`
- [ ] Regenerar autoload: `composer dump-autoload`
- [ ] Reiniciar web server: `apachectl restart` o equivalente
- [ ] Limpiar cache del navegador (Ctrl+Shift+Delete)
- [ ] Probar con cURL primero
- [ ] Probar desde el navegador después

---

## 🚀 Deployment a Producción

### Configuración Recomendada

```php
// En variables de entorno
$origin = env('CORS_ALLOWED_ORIGIN', 'http://localhost:3000');

->header('Access-Control-Allow-Origin', $origin)
```

### En `.env`
```env
# Desarrollo
CORS_ALLOWED_ORIGIN=http://localhost:3000

# Producción
CORS_ALLOWED_ORIGIN=https://crm.tudominio.com
```

---

## 📚 Referencias

- [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Laravel - CORS](https://laravel.com/docs/11.x/configuration#cors)
- [Apache - CORS Headers](https://httpd.apache.org/docs/current/mod/mod_headers.html)

---

**Última actualización:** 1 de Abril de 2026

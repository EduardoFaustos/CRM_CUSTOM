# Documentación de API del Sistema CRM

Referencia completa de todos los endpoints REST de la API del Sistema CRM.

---

## 🔐 Autenticación

### Tokens JWT

Todos los endpoints (excepto autenticación) requieren autenticación mediante JWT Token.

**Header requerido:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de token decodificado:**
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "rol": "Administrator",
  "iat": 1705320600,
  "exp": 1705324200
}
```

---

## 🔑 Endpoints de Autenticación (Base: `http://localhost:5000`)

### Registro de Usuario

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newuser@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "role": "User"
  }
}
```

**Errores posibles:**
- `400 Bad Request`: Email inválido o contraseña débil
- `409 Conflict`: El email ya existe

---

### Iniciar Sesión

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "role": "Administrator",
    "lastLogin": "2026-01-15T10:30:00Z"
  }
}
```

**Errores posibles:**
- `401 Unauthorized`: Email o contraseña incorrectos
- `400 Bad Request`: Campos requeridos faltantes

---

### Verificar Token

```http
GET /api/auth/verify
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "role": "Administrator",
    "isValid": true,
    "expiresAt": "2026-01-15T11:30:00Z"
  }
}
```

**Errores posibles:**
- `401 Unauthorized`: Token inválido o expirado

---

### Actualizar Token

```http
POST /api/auth/refresh-token
Authorization: Bearer <expired_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

---

### Cerrar Sesión

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

---

### Verificar Salud

```http
GET /api/auth/health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-15T10:30:00Z",
  "database": "connected"
}
```

---

## 👥 Endpoints de Clientes (Base: `http://localhost:5001`)

### Obtener Todos los Clientes

```http
GET /api/customers
Authorization: Bearer <token>
```

**Query Parameters (Opcionales):**
- `page=1`: Número de página (por defecto: 1)
- `pageSize=10`: Elementos por página (por defecto: 10)
- `sortBy=name`: Campo para ordenar
- `sortOrder=asc`: Dirección de ordenamiento (asc/desc)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "customerId": "660e8400-e29b-41d4-a716-446655440000",
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      "phoneNumber": "+1-555-0100",
      "address": "123 Business St",
      "city": "New York",
      "country": "USA",
      "isActive": true,
      "createdAt": "2026-01-10T08:00:00Z",
      "updatedAt": "2026-01-15T10:30:00Z",
      "orderCount": 5,
      "totalOrderAmount": 5250.50
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 45,
    "pageSize": 10
  }
}
```

---

### Crear Cliente

```http
POST /api/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Client Inc",
  "email": "info@newclient.com",
  "phoneNumber": "+1-555-0200",
  "address": "456 Commerce Ave",
  "city": "Los Angeles",
  "country": "USA"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Cliente creado exitosamente",
  "data": {
    "customerId": "770e8400-e29b-41d4-a716-446655440000",
    "name": "New Client Inc",
    "email": "info@newclient.com",
    "phoneNumber": "+1-555-0200",
    "address": "456 Commerce Ave",
    "city": "Los Angeles",
    "country": "USA",
    "isActive": true,
    "createdAt": "2026-01-15T10:35:00Z"
  }
}
```

**Errores posibles:**
- `400 Bad Request`: Email duplicado o validación fallida
- `401 Unauthorized`: Token inválido
- `403 Forbidden`: Permisos insuficientes

---

### Obtener Cliente por ID

```http
GET /api/customers/{customerId}
Authorization: Bearer <token>
```

**URL Example:**
```
GET /api/customers/660e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "customerId": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phoneNumber": "+1-555-0100",
    "address": "123 Business St",
    "city": "New York",
    "country": "USA",
    "isActive": true,
    "createdAt": "2026-01-10T08:00:00Z",
    "updatedAt": "2026-01-15T10:30:00Z",
    "orders": [
      {
        "orderId": "880e8400-e29b-41d4-a716-446655440000",
        "orderNumber": "ORD-2026-00001",
        "totalAmount": 1050.00,
        "status": "Completed",
        "createdAt": "2026-01-12T14:00:00Z"
      }
    ]
  }
}
```

**Errores posibles:**
- `404 Not Found`: Cliente no existe
- `401 Unauthorized`: Token inválido

---

### Actualizar Cliente

```http
PUT /api/customers/{customerId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Acme Corporation Updated",
  "phoneNumber": "+1-555-0101",
  "address": "789 New Business St",
  "city": "New York",
  "country": "USA"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Cliente actualizado exitosamente",
  "data": {
    "customerId": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation Updated",
    "email": "contact@acme.com",
    "phoneNumber": "+1-555-0101",
    "address": "789 New Business St",
    "city": "New York",
    "country": "USA",
    "isActive": true,
    "updatedAt": "2026-01-15T10:40:00Z"
  }
}
```

---

### Eliminar Cliente

```http
DELETE /api/customers/{customerId}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Cliente eliminado exitosamente"
}
```

**Errores posibles:**
- `404 Not Found`: Cliente no existe
- `409 Conflict`: Cliente tiene pedidos activos
- `401 Unauthorized`: Token inválido

---

## 📦 Endpoints de Pedidos (Base: `http://localhost:5001`)

### Obtener Todos los Pedidos

```http
GET /api/orders
Authorization: Bearer <token>
```

**Query Parameters (Opcionales):**
- `status=Pending`: Filtrar por estado
- `customerId=<id>`: Filtrar por cliente
- `page=1`: Número de página
- `pageSize=20`: Elementos por página

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "orderId": "880e8400-e29b-41d4-a716-446655440000",
      "orderNumber": "ORD-2026-00001",
      "customerId": "660e8400-e29b-41d4-a716-446655440000",
      "customerName": "Acme Corporation",
      "orderDate": "2026-01-12T14:00:00Z",
      "status": "Pending",
      "totalAmount": 1050.00,
      "taxAmount": 84.00,
      "shippingAmount": 15.00,
      "itemCount": 3,
      "createdAt": "2026-01-12T14:00:00Z",
      "updatedAt": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCount": 25,
    "pageSize": 20
  }
}
```

---

### Crear Pedido

```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "660e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "sku": "PROD-001",
      "description": "Widget Pro",
      "quantity": 5,
      "unitPrice": 29.99
    },
    {
      "sku": "PROD-002",
      "description": "Gadget Basic",
      "quantity": 2,
      "unitPrice": "84.99"
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "country": "USA"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Pedido creado exitosamente",
  "data": {
    "orderId": "990e8400-e29b-41d4-a716-446655440000",
    "orderNumber": "ORD-2026-00123",
    "customerId": "660e8400-e29b-41d4-a716-446655440000",
    "orderDate": "2026-01-15T10:45:00Z",
    "status": "Pending",
    "items": [
      {
        "orderItemId": "aa0e8400-e29b-41d4-a716-446655440000",
        "sku": "PROD-001",
        "description": "Widget Pro",
        "quantity": 5,
        "unitPrice": 29.99,
        "lineTotal": 149.95
      },
      {
        "orderItemId": "bb0e8400-e29b-41d4-a716-446655440000",
        "sku": "PROD-002",
        "description": "Gadget Basic",
        "quantity": 2,
        "unitPrice": 84.99,
        "lineTotal": 169.98
      }
    ],
    "subtotal": 319.93,
    "taxAmount": 25.59,
    "shippingAmount": 15.00,
    "totalAmount": 360.52,
    "createdAt": "2026-01-15T10:45:00Z"
  }
}
```

**Errores posibles:**
- `400 Bad Request`: Datos inválidos o cliente no existe
- `409 Conflict`: Inventario insuficiente
- `401 Unauthorized`: Token inválido

---

### Obtener Pedido por ID

```http
GET /api/orders/{orderId}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orderId": "880e8400-e29b-41d4-a716-446655440000",
    "orderNumber": "ORD-2026-00001",
    "customerId": "660e8400-e29b-41d4-a716-446655440000",
    "customerName": "Acme Corporation",
    "orderDate": "2026-01-12T14:00:00Z",
    "status": "In Transit",
    "shippingDate": "2026-01-14T08:30:00Z",
    "deliveryDate": null,
    "items": [
      {
        "orderItemId": "aa0e8400-e29b-41d4-a716-446655440000",
        "sku": "PROD-001",
        "description": "Widget Pro",
        "quantity": 5,
        "unitPrice": 29.99,
        "lineTotal": 149.95
      }
    ],
    "subtotal": 950.00,
    "taxAmount": 76.00,
    "shippingAmount": 24.00,
    "totalAmount": 1050.00,
    "createdAt": "2026-01-12T14:00:00Z",
    "updatedAt": "2026-01-15T10:30:00Z"
  }
}
```

---

### Actualizar Estado de Pedido

```http
PUT /api/orders/{orderId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Shipped",
  "trackingNumber": "1Z999AA10123456784"
}
```

**Estados válidos:** Pending, Processing, Shipped, In Transit, Delivered, Cancelled

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Estado del pedido actualizado",
  "data": {
    "orderId": "880e8400-e29b-41d4-a716-446655440000",
    "status": "Shipped",
    "shippingDate": "2026-01-15T11:00:00Z",
    "trackingNumber": "1Z999AA10123456784",
    "updatedAt": "2026-01-15T11:00:00Z"
  }
}
```

---

### Eliminar Pedido

```http
DELETE /api/orders/{orderId}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Pedido eliminado exitosamente"
}
```

**Errores posibles:**
- `404 Not Found`: Pedido no existe
- `409 Conflict`: No se puede eliminar pedido completado o enviado
- `401 Unauthorized`: Token inválido

---

## 📊 Endpoints de Reportes (Base: `http://localhost:5001`)

### Resumen de Estadísticas

```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalCustomers": 45,
    "totalOrders": 128,
    "totalRevenue": 45230.50,
    "averageOrderValue": 353.35,
    "pendingOrders": 12,
    "completedOrders": 110,
    "cancelledOrders": 6,
    "activeCustomers": 38,
    "newCustomersThisMonth": 5,
    "averageDaysToDeliver": 3.2
  }
}
```

---

### Actividad Reciente de Pedidos

```http
GET /api/dashboard/order-activity
Authorization: Bearer <token>
```

**Query Parameters:**
- `days=30`: Últimos N días
- `limit=10`: Máximo de registros

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-01-15T00:00:00Z",
      "pending": 3,
      "processing": 2,
      "shipped": 5,
      "delivered": 8,
      "cancelled": 0,
      "total": 18,
      "revenue": 6450.00
    },
    {
      "date": "2026-01-14T00:00:00Z",
      "pending": 2,
      "processing": 4,
      "shipped": 6,
      "delivered": 10,
      "cancelled": 1,
      "total": 23,
      "revenue": 8120.50
    }
  ]
}
```

---

### Reporte de Clientes Principales

```http
GET /api/reports/top-customers
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit=10`: Número de clientes a listar
- `period=month`: Período (week, month, quarter, year)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "customerId": "660e8400-e29b-41d4-a716-446655440000",
      "name": "Acme Corporation",
      "orderCount": 15,
      "totalSpent": 5250.50,
      "lastOrderDate": "2026-01-15T10:30:00Z",
      "averageOrderValue": 350.03
    }
  ]
}
```

---

## 🛒 Endpoints de Inventario (Base: `http://localhost:5001`)

### Obtener Estado del Inventario

```http
GET /api/inventory
Authorization: Bearer <token>
```

**Query Parameters:**
- `sku=PROD-001`: Filtrar por SKU
- `status=low`: Estado (low, normal, high)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "inventoryId": "cc0e8400-e29b-41d4-a716-446655440000",
      "sku": "PROD-001",
      "productName": "Widget Pro",
      "quantity": 15,
      "reorderLevel": 20,
      "status": "low",
      "locationCode": "A1-001",
      "lastRestocked": "2026-01-10T08:00:00Z"
    }
  ]
}
```

---

## ⚠️ Códigos de Error

### Errores 4xx (Cliente)

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| 400 | Bad Request | Solicitud inválida o datos malformados |
| 401 | Unauthorized | Token faltante o inválido |
| 403 | Forbidden | Permisos insuficientes |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto de datos (ej. email duplicado) |
| 422 | Unprocessable Entity | Validación de datos fallida |

### Errores 5xx (Servidor)

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| 500 | Internal Server Error | Error interno del servidor |
| 503 | Service Unavailable | Servicio no disponible |

### Formato de Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo 'email' es requerido",
    "details": [
      {
        "field": "email",
        "message": "Email es requerido"
      }
    ]
  }
}
```

---

## 🔄 Rate Limiting

- Límite: **100 solicitudes por hora** por dirección IP
- Header de respuesta: `X-RateLimit-Remaining`
- Límite será excedido retorna `429 Too Many Requests`

---

## 📝 Headers Requeridos

Todos los endpoints requieren:

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

---

## 🧪 Ejemplos de Prueba

### Con cURL

```bash
# Iniciar sesión
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"PassWord123!"}'

# Obtener clientes (con token)
curl -X GET http://localhost:5001/api/customers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Crear cliente
curl -X POST http://localhost:5001/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Test Co","email":"test@example.com"}'
```

### Con Postman

1. Importar: [postman-collection.json] (incluido en repo)
2. Establecer variable: `{{ token }}` en Pre-request Script
3. Usar `{{ base_url }}` para cambiar entre localhost y producción

---

## 📚 Recursos Adicionales

- Ver [ARCHITECTURE.md](ARCHITECTURE.md) para detalles de arquitectura
- Ver [TESTING.md](TESTING.md) para pruebas de API
- Ver [DEPLOYMENT.md](DEPLOYMENT.md) para despliegue en diferentes entornos

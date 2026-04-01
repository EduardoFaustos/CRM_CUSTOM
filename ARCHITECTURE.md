# Arquitectura del Sistema CRM

Visión general de la arquitectura, componentes, y flujos de datos del Sistema CRM.

---

## 🏛️ Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                       Cliente Web (Navegador)                   │
│                     Angular 17 + TypeScript                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
              HTTPS/REST          HTTPS/REST
                    │                 │
      ┌─────────────▼──────────┐   ┌──▼──────────────────────┐
      │ Frontend (Puerto 4200) │   │ API Gateway/Load Bal.   │
      │ - Dashboard            │   │ (Nginx/Azure LB)        │
      │ - Gestión de Clientes  │   │ - Routing               │
      │ - Gestión de Pedidos   │   │ - Rate Limiting         │
      │ - Autenticación/Login  │   │ - CORS                  │
      └─────────────┬──────────┘   └──┬──────────────────────┘
                    │                  │
              ┌─────┴──────────┬───────┴─────────┐
              │                │                 │
          Port 5000        Port 5001             │
              │                │                 │
    ┌─────────▼────────┐  ┌────▼──────────┐    │
    │  Servicio Auth   │  │ Servicio      │    │
    │ .NET 8 / C#      │  │ Órdenes/      │    │
    │ - Autenticación  │  │ Clientes      │    │
    │ - Autorización   │  │ PHP 8.2/      │    │
    │ - JWT            │  │ Laravel 11    │    │
    │ - Usuarios       │  │ - Gestión     │    │
    │                  │  │   clientes    │    │
    └─────────┬────────┘  │ - Pedidos     │    │
              │           │ - Artículos   │    │
              │           │ - Reportes    │    │
              └───────┬───┴───────────────┘    │
                      │                        │
              ┌───────┴─────────────────┐      │
              │   SQL Server 2019+      │◄─────┘
              │   (Microsoft Azure)     │
              │ ┌────────────────────┐  │
              │ │ CRMAuthDb          │  │
              │ │ - Users            │  │
              │ │ - Auth Tokens      │  │
              │ │ - Sessions         │  │
              │ └────────────────────┘  │
              │ ┌────────────────────┐  │
              │ │ CRMOrdersDb        │  │
              │ │ - Customers        │  │
              │ │ - Orders           │  │
              │ │ - Order Items      │  │
              │ │ - Inventory        │  │
              │ └────────────────────┘  │
              └────────────────────────┘
```

---

## 🔄 Flujo de Autenticación

```
Usuario
   │
   ├─► POST /auth/register ──────────┐
   │                                  ▼
   │   ┌────────────────────────────────────────┐
   │   │ 1. Validar datos                       │
   │   │ 2. Hash de contraseña (BCrypt)         │
   │   │ 3. Crear usuario en BD                 │
   │   │ 4. Retornar token JWT                  │
   │   └────────────────────┬───────────────────┘
   │                        │
   │   ┌───────────────────┴────────────────────┐
   │   ▼                                         ▼
   ├─ Guardar token (localStorage)    POST /auth/login
   │                              │
   │                              ▼
   │    ┌────────────────────────────────────────┐
   │    │ 1. Buscar usuario por email            │
   │    │ 2. Validar contraseña con BCrypt       │
   │    │ 3. Crear JWT (sub = userId)            │
   │    │ 4. JWT contiene rol de usuario         │
   │    └────────────────────┬───────────────────┘
   │                         │
   │     ┌───────────────────┴──────────────────┐
   │     ▼                                      ▼
   └─ Retornar:                  Iniciar sesión
       - token
       - user
       - expiry
```

### Estructura del JWT Token

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-id-123",
    "email": "user@example.com",
    "rol": "Administrator",
    "iat": 1234567890,
    "exp": 1234571490
  },
  "signature": "HMACSHA256(...)"
}
```

---

## 🗂️ Estructura de Base de Datos

### CRMAuthDb (Servicio de Autenticación)

```sql
[Users]
├── UserId (PK, UNIQUEIDENTIFIER)
├── Email (NVARCHAR(255), UNIQUE)
├── PasswordHash (NVARCHAR(MAX))
├── Role (NVARCHAR(50))
├── IsActive (BIT)
├── CreatedAt (DATETIME2)
├── UpdatedAt (DATETIME2)
└── LastLoginAt (DATETIME2)

[AuthTokens]
├── TokenId (PK, UNIQUEIDENTIFIER)
├── UserId (FK → Users)
├── Token (NVARCHAR(MAX))
├── ExpiresAt (DATETIME2)
├── RevokedAt (DATETIME2)
├── CreatedAt (DATETIME2)
└── IpAddress (NVARCHAR(45))
```

### CRMOrdersDb (Servicio de Órdenes)

```sql
[Customers]
├── CustomerId (PK, UNIQUEIDENTIFIER)
├── UserId (FK → Users from CRMAuthDb)
├── Name (NVARCHAR(255))
├── Email (NVARCHAR(255))
├── PhoneNumber (NVARCHAR(20))
├── Address (NVARCHAR(500))
├── City (NVARCHAR(100))
├── Country (NVARCHAR(100))
├── IsActive (BIT)
├── CreatedAt (DATETIME2)
└── UpdatedAt (DATETIME2)

[Orders]
├── OrderId (PK, UNIQUEIDENTIFIER)
├── CustomerId (FK → Customers)
├── OrderNumber (NVARCHAR(50), UNIQUE)
├── OrderDate (DATETIME2)
├── ShippingDate (DATETIME2, NULLABLE)
├── DeliveryDate (DATETIME2, NULLABLE)
├── Status (NVARCHAR(50))
├── TotalAmount (DECIMAL(10,2))
├── TaxAmount (DECIMAL(10,2))
├── ShippingAmount (DECIMAL(10,2))
├── CreatedAt (DATETIME2)
└── UpdatedAt (DATETIME2)

[OrderItems]
├── OrderItemId (PK, UNIQUEIDENTIFIER)
├── OrderId (FK → Orders)
├── SKU (NVARCHAR(50))
├── Description (NVARCHAR(500))
├── Quantity (INT)
├── UnitPrice (DECIMAL(10,2))
├── LineTotal (DECIMAL(10,2))
└── CreatedAt (DATETIME2)

[Inventory]
├── InventoryId (PK, UNIQUEIDENTIFIER)
├── SKU (NVARCHAR(50), UNIQUE)
├── ProductName (NVARCHAR(255))
├── Quantity (INT)
├── ReorderLevel (INT)
├── LastRestocked (DATETIME2)
└── LocationCode (NVARCHAR(10))
```

---

## 🔌 Interfaces de Servicios

### Frontend (Angular)

**Servicios principales:**

```typescript
// auth.service.ts
- register(email, password): Observable<AuthResponse>
- login(email, password): Observable<AuthResponse>
- logout(): void
- isAuthenticated(): boolean
- getUserRole(): string
- refreshToken(): Observable<AuthResponse>

// customer.service.ts
- getCustomers(): Observable<Customer[]>
- getCustomer(id): Observable<Customer>
- createCustomer(data): Observable<Customer>
- updateCustomer(id, data): Observable<Customer>
- deleteCustomer(id): Observable<void>

// order.service.ts
- getOrders(): Observable<Order[]>
- getOrder(id): Observable<Order>
- createOrder(data): Observable<Order>
- updateOrderStatus(id, status): Observable<Order>
- getOrderStats(): Observable<OrderStats>
```

### Servicio de Autenticación (.NET)

**Endpoints:**

```http
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/auth/logout
GET    /api/auth/verify
GET    /api/auth/health
```

**Modelos:**

```csharp
public class RegisterRequest {
    public string Email { get; set; }
    public string Password { get; set; }
}

public class AuthResponse {
    public string Token { get; set; }
    public UserDto User { get; set; }
    public DateTime ExpiresAt { get; set; }
}

public class UserDto {
    public Guid UserId { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
}
```

### Servicio de Órdenes (PHP/Laravel)

**Endpoints:**

```http
GET    /api/customers
POST   /api/customers
GET    /api/customers/{id}
PUT    /api/customers/{id}
DELETE /api/customers/{id}

GET    /api/orders
POST   /api/orders
GET    /api/orders/{id}
PUT    /api/orders/{id}
DELETE /api/orders/{id}

GET    /api/orders/stats/summary
GET    /api/orders/activity/recent
```

**Modelos:**

```php
class Customer extends Model {
    protected $table = 'Customers';
    protected $primaryKey = 'CustomerId';
    
    protected $fillable = [
        'UserId', 'Name', 'Email', 'PhoneNumber',
        'Address', 'City', 'Country'
    ];
    
    public function orders() {
        return $this->hasMany(Order::class, 'CustomerId');
    }
}
```

---

## 🔐 Seguridad

### Autenticación

- **JWT Bearer Tokens** para stateless authentication
- **BCrypt** para hash de contraseñas (factor de trabajo: 12)
- **Token Expiry**: 1 hora
- **Refresh Token**: 7 días
- **HTTPS** obligatorio en producción

### Autorización

- **Role-Based Access Control (RBAC)**:
  - `Administrator`: Acceso completo
  - `Manager`: Gestión de clientes y pedidos
  - `User`: Solo lectura e inserción limitada

- **Token Validation**:
  ```csharp
  // Middleware de autorización en .NET
  [Authorize(Roles = "Administrator,Manager")]
  [HttpGet("api/orders")]
  public IActionResult GetOrders() { ... }
  ```

### Protección de Datos

- **SQL Server Encryption**: TDE (Transparent Data Encryption)
- **CORS**: Configurado solo para dominio permitido
- **Rate Limiting**: 100 requaestas/hora por IP
- **Request Validation**: Validación de entrada en todos los endpoints

---

## 📊 Flujo de Datos Principal

### 1. Crear un Nuevo Cliente

```
Angular Component
    │
    ├─► customerService.createCustomer(data)
    │
    ├─► POST /api/customers (con JWT token)
    │
    ├─► Backend PHP Laravel
    │   ├─► Validar token JWT
    │   ├─► Validar datos de entrada
    │   ├─► INSERT en tabla Customers
    │   └─► Retornar cliente creado
    │
    └─► Angular muestra cliente en tabla
```

### 2. Crear un Nuevo Pedido

```
Usuario completa formulario de pedido
    │
    ├─► orderService.createOrder({
    │       customerId, items, totalAmount, ...
    │   })
    │
    ├─► POST /api/orders
    │
    ├─► Backend PHP Laravel
    │   ├─► Validar token JWT
    │   ├─► Crear registro en Orders
    │   ├─► Crear registros en OrderItems
    │   ├─► Actualizar Inventory
    │   ├─► Calcular impuestos y envío
    │   ├─► SET Status = 'Pending'
    │   └─► Retornar orden creada con detalles
    │
    ├─► Angular Redux actualiza estado
    │
    └─► Dashboard se refreshea automáticamente
```

---

## 🎯 Patrones de Diseño

### Model-View-ViewModel (MVVM) - Angular

```
View (Template HTML)
    │
    ├─► ViewModel (Component .ts)
    │   ├─► Service Layer
    │   └─► State Management (RxJS/Reactive)
    │
    └─► Model (Interfaces TypeScript)
```

### Repository Pattern - PHP/Laravel

```
Controller
    │
    ├─► Repository Interface
    │   ├─► Customer Repository
    │   ├─► Order Repository
    │   └─► Inventory Repository
    │
    ├─► Eloquent Model
    │
    └─► Database
```

### Dependency Injection - .NET

```
Controller
    │
    ├─► Constructor DI
    │   ├─► IAuthService
    │   ├─► IPasswordHasher
    │   └─► ITokenGenerater
    │
    └─► Implementation Classes
```

---

## 📦 Despliegue de Componentes

### Desarrollo Local

```
Docker Compose
├── Frontend Container (Node.js)
├── Auth Service Container (.NET)
├── Orders Service Container (PHP)
└── SQL Server Container
```

### Producción (Kubernetes)

```
Kubernetes Cluster (3 Nodos)
├── Frontend Pods (3 replicas)
├── Auth Service Pods (3 replicas)
├── Orders Service Pods (3 replicas)
├── Services (ClusterIP)
├── Ingress (HTTPS)
└── SQL Server (Managed Azure SQL)
```

---

## 🔄 Integración de Servicios

### Comunicación Frontend ↔ Backend

```typescript
// JSON Request
{
  "method": "POST",
  "headers": {
    "Authorization": "Bearer eyJhbGc...",
    "Content-Type": "application/json"
  },
  "body": {
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "items": [
      {
        "sku": "PROD-001",
        "quantity": 5,
        "unitPrice": 29.99
      }
    ]
  }
}

// JSON Response
{
  "status": 201,
  "data": {
    "orderId": "223e4567-e89b-12d3-a456-426614174000",
    "orderNumber": "ORD-2026-00123",
    "status": "Pending",
    "totalAmount": 149.95,
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

### Comunicación Backend ↔ Database

```csharp
// .NET Entity Framework
var user = await _context.Users
    .AsNoTracking()
    .FirstOrDefaultAsync(u => u.Email == email);

// Laravel Eloquent
$customer = Customer::with('orders')
    ->where('email', $email)
    ->first();
```

---

## 🚀 Escalabilidad

### Horizontal Scaling

- **Kubernetes HPA** (Horizontal Pod Autoscaler)
  - Base: 3 pods por servicio
  - Máximo: 10 pods
  - Trigger: CPU > 80% o Memoria > 85%

### Caching

- **Redis** para sesiones (opcional)
- **Browser Cache** para assets estáticos
- **HTTP Cache Headers** en endpoints de solo lectura

### Optimización de Base de Datos

- **Índices**: Creados en columnas frecuentemente consultadas
- **Queries Optimizadas**: Usar JOINs eficientemente
- **Connection Pooling**: 100 conexiones máximo
- **Particionamiento**: Tablas grandes particionadas por fecha

---

## 📚 Recursos Adicionales

- Ver [API_DOCUMENTATION.md](API_DOCUMENTATION.md) para detalles de endpoints
- Ver [DEPLOYMENT.md](DEPLOYMENT.md) para instrucciones de despliegue
- Ver [TESTING.md](TESTING.md) para estrategia de pruebas

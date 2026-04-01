# Guía de Pruebas del Sistema CRM

Guía completa para ejecutar pruebas unitarias e integración en todos los servicios.

---

## 🧪 Pruebas de Frontend (Angular)

### Requisitos Previos
```bash
cd frontend
npm install
```

### Ejecutar Pruebas

**Ejecutar todas las pruebas**
```bash
npm test
```

**Ejecutar pruebas en modo headless (CI)**
```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

**Ejecutar archivo de prueba específico**
```bash
npm test -- --include='**/auth.service.spec.ts'
```

**Generar informe de cobertura**
```bash
npm test -- --watch=false --code-coverage
```

Los informes de cobertura estarán en `frontend/coverage/`

### Estructura de Pruebas
- Ubicación: `src/app/**/*.spec.ts`
- Framework: Jasmine/Karma
- Archivos de prueba clave:
  - `core/services/auth.service.spec.ts` - Pruebas del servicio de autenticación
  - `modules/auth/components/login.component.spec.ts` - Pruebas del componente login
  - `modules/orders/components/orders-list.component.spec.ts` - Pruebas de lista de pedidos

---

## 🧪 Pruebas del Servicio de Autenticación Backend (.NET)

### Requisitos Previos
```bash
cd backend-auth/CRMAuth
dotnet restore
```

### Ejecutar Pruebas

**Ejecutar todas las pruebas**
```bash
dotnet test
```

**Ejecutar pruebas con salida detallada**
```bash
dotnet test -v d
```

**Ejecutar prueba específica**
```bash
dotnet test --filter "AuthServiceTests"
```

**Ejecutar pruebas y generar cobertura**
```bash
dotnet test /p:CollectCoverage=true /p:CoverageFormat=opencover
```

### Estructura de Pruebas
- Ubicación: `CRMAuth.Tests/`
- Framework: xUnit
- Archivos de prueba clave:
  - `AuthServiceTests.cs` - Pruebas unitarias del servicio de autenticación
  - Incluye: Pruebas de registro, hash de contraseñas, generación JWT

### Ejemplo de Prueba
```csharp
[Fact]
public async Task RegisterAsync_WithValidRequest_ShouldCreateUser()
{
    // Arrange
    var request = new RegisterRequest { ... };
    
    // Act
    var result = await _authService.RegisterAsync(request);
    
    // Assert
    Assert.NotNull(result);
}
```

---

## 🧪 Pruebas del Servicio de Pedidos Backend (PHP)

### Requisitos Previos
```bash
cd backend-orders
composer install
```

### Ejecutar Pruebas

**Ejecutar todas las pruebas**
```bash
php artisan test
```

**Ejecutar pruebas con salida detallada**
```bash
php artisan test --verbose
```

**Ejecutar archivo de prueba específico**
```bash
php artisan test tests/Feature/CustomerControllerTest.php
```

**Ejecutar con cobertura**
```bash
php artisan test --coverage
```

### Estructura de Pruebas
- Ubicación: `tests/Feature/` (Integración), `tests/Unit/` (Unitarias)
- Framework: PHPUnit (Pest)
- Archivos de prueba clave:
  - `Feature/CustomerControllerTest.php` - Pruebas de API de clientes
  - `Feature/OrderControllerTest.php` - Pruebas de API de pedidos

### Ejemplo de Prueba
```php
public function test_create_customer()
{
    $data = ['name' => 'John Doe', ...];
    $response = $this->post('/api/customers', $data);
    $response->assertStatus(201);
}
```

---

## 🔗 Pruebas de Integración

### Pruebas de Flujo End-to-End

Prueba el viaje completo del usuario:

1. **Registro → Autenticación**
   - POST `/auth/register` con nuevo usuario
   - Verificar que se devuelve token JWT
   - Verificar que el usuario fue creado en base de datos

2. **Gestión de Clientes**
   - POST `/customers` para crear cliente
   - GET `/customers` para listar
   - PUT `/customers/{id}` para actualizar
   - DELETE `/customers/{id}` para eliminar

3. **Creación de Pedidos**
   - POST `/orders` con cliente y artículos
   - Verificar que el total del pedido se calcula correctamente
   - Verificar que los artículos del pedido se crean

4. **Dashboard**
   - GET `/dashboard/stats` devuelve datos agregados
   - GET `/dashboard/order-activity` devuelve datos de gráficos

### Herramientas de Prueba

**Pruebas de API (Postman/Insomnia)**
1. Importar: `postman-collection.json`
2. Establecer variables de entorno:
   - `base_url=http://localhost:5000`
   - `token=<jwt_token>`
   - `customer_id=<id>`

**Pruebas de Carga**
```bash
# Usar Apache Bench
ab -n 100 -c 10 http://localhost:5000/api/auth/verify

# Usar wrk
wrk -t12 -c400 -d30s http://localhost:5000/api/auth/verify
```

---

## 🔄 Integración Continua

### Ejemplo de GitHub Actions

```yaml
name: Pruebas

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mssql:
        image: mcr.microsoft.com/mssql/server:2022-latest
        env:
          SA_PASSWORD: TestPass123!
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Configurar Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Pruebas Frontend
        run: |
          cd frontend
          npm install
          npm test -- --watch=false
      
      - name: Configurar .NET
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: '8.0'
      
      - name: Pruebas Servicio Auth
        run: |
          cd backend-auth/CRMAuth
          dotnet test
```

---

## 📊 Requisitos de Cobertura

- **Frontend**: Mínimo 70% cobertura de declaraciones
- **Backend Autenticación**: Mínimo 75% cobertura de métodos
- **Backend Pedidos**: Mínimo 70% cobertura de código

---

## 🔍 Depuración de Pruebas

### Frontend
```bash
# Ejecutar pruebas en modo watch
npm test

# Depurar en DevTools de Chrome
npm test -- --browsers=Chrome --watch=true
```

### .NET
```bash
# Depurar en Visual Studio
Abrir CRMSystem.sln → Test Explorer → Click derecho → Depurar

# O por línea de comandos
dotnet test --logger:"console;verbosity=detailed"
```

### PHP
```bash
# Agregar puntos de ruptura en código
// Luego ejecutar
php artisan test --filter=specific_test --env=testing
```

---

## 📈 Generación de Informes de Pruebas

Generar informes:

```bash
# Cobertura de Frontend
npm test -- --code-coverage --watch=false

# Cobertura de .NET
dotnet test /p:CollectCoverage=true /p:CoverageFormat=cobertura

# Cobertura de PHP
php artisan test --coverage --coverage-html=coverage
```

Los informes están disponibles en:
- Frontend: `frontend/coverage/index.html`
- .NET: `backend-auth/CRMAuth/CoverageReport/index.html`
- PHP: `backend-orders/coverage/index.html`

---

## ✅ Checklist de Pruebas Antes del Despliegue

- [ ] Todas las pruebas unitarias pasan (Frontend, Backend, PHP)
- [ ] Cobertura de código cumple los mínimos requeridos
- [ ] No hay pruebas marcadas como pendientes
- [ ] Las pruebas de integración E2E pasan
- [ ] Los tiempos de respuesta de API están dentro de los límites
- [ ] Las pruebas de carga pasaron satisfactoriamente
- [ ] Los informes de cobertura se revisaron
- [ ] CI/CD pipeline ejecutó exitosamente

---

## 🚀 Próximos Pasos

Para más información sobre pruebas:
- Ver [ARCHITECTURE.md](ARCHITECTURE.md) para entender la estructura del sistema
- Ver [API_DOCUMENTATION.md](API_DOCUMENTATION.md) para detalles de endpoints
- Ver [postman-collection.json](postman-collection.json) para ejemplos de API

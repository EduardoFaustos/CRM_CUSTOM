# 🧪 QUÉ PROBAR EN LA APLICACIÓN - Validaciones Ecuatorianas

**Después de abrir http://localhost:3000**

---

http://localhost:5005/swagger/index.html y:

Ve a POST /api/auth/register
Haz clic en "Try it out"
En el body, pon:
{
  "email": "admin@example.com",
  "name": "Admin User",
  "password": "password123"
}
Click Execute

## 🔐 Paso 1: Login

1. Email: `admin@example.com`
2. Contraseña: `password123`
3. Click **Entrar**

Deberías ver el **Dashboard del CRM**

---

## 📋 Paso 2: Crear un Cliente (NUEVO)

### Ir a Clientes

1. Menu izquierdo → **Clientes**
2. Click en botón **+ Nuevo Cliente**

---

## 🧪 Paso 3: Probar la Validación de Cédula

### Formulario que verás:

```
┌─────────────────────────────────────┐
│ Documento de Identidad              │
├─────────────────────────────────────┤
│ [              ]  ← Input de 10 dígitos
│ Tipo de Documento ▼                 │
│ ├─ Cédula de Identidad             │
│ ├─ RUC                             │
│ └─ Pasaporte                       │
└─────────────────────────────────────┘
```

### Prueba 1: Cédula VÁLIDA ✅

1. Selecciona: **Tipo de Documento** = "Cédula de Identidad"
2. Ingresa: `1710034065` en el campo Documento
3. **Resultado esperado:** ✓ Documento válido (texto verde)

### Prueba 2: Cédula INVÁLIDA ❌

1. Tipo: "Cédula de Identidad"
2. Ingresa: `1710034064` (cambias último dígito)
3. **Resultado:** ✗ Error rojo: "Dígito verificador no coincide"

### Prueba 3: Cédula con Provincia Inválida ❌

1. Tipo: "Cédula de Identidad"
2. Ingresa: `9910034065` (provincia 99)
3. **Resultado:** ✗ Error: "Provincia inválida"

---

## 🏢 Paso 4: Probar RUCs

### Prueba 1: RUC Jurídico VÁLIDO ✅

1. Tipo: **RUC**
2. Ingresa: `1790085783001`
3. **Resultado:** ✓ Documento válido

### Prueba 2: RUC Natural VÁLIDO ✅

1. Tipo: **RUC**
2. Ingresa: `1713175071001`
3. **Resultado:** ✓ Documento válido

### Prueba 3: RUC Público VÁLIDO ✅

1. Tipo: **RUC**
2. Ingresa: `1260004800001`
3. **Resultado:** ✓ Documento válido

### Prueba 4: RUC INVÁLIDO ❌

1. Tipo: **RUC**
2. Ingresa: `1790085784001` (cambia verificador)
3. **Resultado:** ✗ Error: "RUC Jurídico inválido"

---

## 🛂 Paso 5: Probar Pasaporte

### Prueba 1: Pasaporte VÁLIDO ✅

1. Tipo: **Pasaporte**
2. Ingresa: `N1234567` (6-15 caracteres alfanuméricos)
3. **Resultado:** ✓ Documento válido

### Prueba 2: Pasaporte MUY CORTO ❌

1. Tipo: **Pasaporte**
2. Ingresa: `N123` (menos de 6 caracteres)
3. **Resultado:** ✗ Error: "Entre 6 y 15 caracteres"

---

## 📝 Paso 6: Completar Formulario

Una vez que la cédula valida correctamente:

| Campo | Valor de prueba |
|-------|-----------------|
| **Cédula** | 1710034065 |
| **Tipo** | Cédula de Identidad |
| **Nombre** | Juan Pérez García |
| **Email** | juan@example.com |
| **Teléfono** | +593-99-1234567 |
| **Dirección** | Calle Principal 123 |
| **Ciudad** | Quito |
| **Provincia** | Pichincha |
| **Código Postal** | 170150 |

---

## ✅ Paso 7: Guardar Cliente

1. Click botón **Guardar**
2. **Resultado esperado:**
   - ✓ Mensaje: "Cliente creado exitosamente"
   - ✓ Redirecciona a lista de clientes
   - ✓ El cliente aparece en la lista

---

## 🔄 Paso 8: Editar Cliente

1. Click en el cliente que creaste
2. **Nota:** El campo Cédula está **deshabilitado** (no se puede cambiar)
   - Esto es correcto, la cédula es el ID único
3. Puedes cambiar otros campos
4. Click **Guardar**

---

## 🧠 Información Visual - Lo que verás

### Campo VÁLIDO (verde)
```
┌────────────────────────────────┐
│ Documento de Identidad         │
│ [1710034065                  ] │
│ ✓ Documento válido (verde)     │
│ Cédula: 10 dígitos             │
└────────────────────────────────┘
```

### Campo INVÁLIDO (rojo)
```
┌────────────────────────────────┐
│ Documento de Identidad         │
│ [1710034064                  ] │
│ ✗ Dígito verificador no        │
│   coincide (rojo)              │
│ Cédula: 10 dígitos             │
└────────────────────────────────┘
```

### Cambio dinámico según tipo
```
Al cambiar "Tipo de Documento":

- Cédula:     "10 dígitos (ej: 0123456789)"
- RUC:        "13 dígitos (ej: 1790085783001)"
- Pasaporte:  "6-15 caracteres alfanuméricos"
```

---

## 📊 Documentos de Prueba Válidos

### Cédulas ecuatorianas
```
Válidas:
  1710034065  ← Estándar (provincia 17)
  0923456781  ← Provincia 09
  2410000001  ← Provincia 24 (máxima)

Inválidas (para pruebas de rechazo):
  1710034064  ← Verificador incorrecto
  9910034065  ← Provincia inválida (99)
  171003406   ← Solo 9 dígitos
```

### RUCs ecuatorianos
```
RUC Natural (3er dígito 0-5):
  1713175071001  ✓

RUC Jurídico (3er dígito 9):
  1790085783001  ✓

RUC Público (3er dígito 6):
  1260004800001  ✓

Inválidos para pruebas:
  1790085784001  ← Verificador incorrecto
  1714175071001  ← 3er dígito 4 (inválido)
```

### Pasaportes
```
Válidos:
  N1234567     ✓
  E9876543     ✓
  A1B2C3D4     ✓
  ABCD123456   ✓

Inválidos:
  N123         ← Muy corto (< 6)
  N12345678901234567  ← Muy largo (> 15)
  N-123456     ← Contiene guión
```

---

## 🔍 Dónde Ver los Cambios

### En el Navegador (F12 - Developer Tools)

1. Abre la aplicación
2. Presiona **F12** (Developer Tools)
3. Va a la pestaña **Console**
4. Verifica:
   - ✅ No hay errores rojos
   - ✅ Los validadores están funcionando

### En la Network (Pestaña Network)

1. F12 → **Network**
2. Rellena un formulario y haz click **Guardar**
3. Ve el request al servidor:
   - URL: `http://localhost:8001/api/customers`
   - Método: **POST**
   - Status: **201** (creado) o **422** (validación fallida)

---

## 🛠️ APIs para Pruebas Manual (PowerShell)

### Crear un cliente con cédula válida

```powershell
$body = @{
    cedula = "1710034065"
    tipo_documento = "Cedula"
    name = "Test User"
    email = "test@example.com"
    phone = "+59399123456"
    address = "Test Address"
    city = "Quito"
    state = "Pichincha"
    zip_code = "170150"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8001/api/customers" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

**Resultado esperado:**
```json
{
  "cedula": "1710034065",
  "tipo_documento": "Cedula",
  "name": "Test User",
  "email": "test@example.com",
  ...
}
```

### Intentar crear con cédula inválida

```powershell
$body = @{
    cedula = "1710034064"  ← Esta es INVÁLIDA
    tipo_documento = "Cedula"
    ...
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8001/api/customers" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

**Resultado esperado (error 422):**
```json
{
  "message": "Validación fallida",
  "errors": {
    "cedula": ["Cédula inválida: Dígito verificador no coincide."]
  }
}
```

---

## ✔️ Checklist de Validación

- [ ] Login funciona (`admin@example.com` / `password123`)
- [ ] Ir a Clientes
- [ ] Crear nuevo cliente
- [ ] Cédula válida (`1710034065`) muestra ✓ verde
- [ ] Cédula inválida (`1710034064`) muestra ✗ rojo
- [ ] RUC válido (`1790085783001`) se acepta
- [ ] Pasaporte válido (`N1234567`) se acepta
- [ ] Documento se guarda en la base de datos
- [ ] Editar cliente funciona
- [ ] Cédula está deshabilitada en edición
- [ ] No hay errores en la consola (F12)

---

## 🎓 Aprendizaje

Dentro de la aplicación verás:

1. **Validación en tiempo real** - Mientras escribes en el campo
2. **Mensajes de error útiles** - Dicen exactamente qué está mal
3. **Validación dinámiga** - Cambia según el tipo de documento
4. **Validación dual** - Frontend (rápido) + Backend (seguro)
5. **Algoritmo SRI** - Verificador según estándar ecuatoriano

---

## 📞 Si algo no funciona

1. Verifica que todos los servicios estén corriendo:
   ```powershell
   docker-compose ps
   ```

2. Ver logs:
   ```powershell
   docker-compose logs -f
   ```

3. Leer documentación:
   - [`GUIA_DOCKER_LOCAL.md`](GUIA_DOCKER_LOCAL.md)
   - [`VALIDACION_CEDULA_RUC_IMPLEMENTATION.md`](VALIDACION_CEDULA_RUC_IMPLEMENTATION.md)

---

**¡Listo! Ahora tienes todo lo necesario para probar la aplicación y las validaciones ecuatorianas 🎉**


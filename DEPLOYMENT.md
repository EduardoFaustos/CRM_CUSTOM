# Guía de Despliegue del Sistema CRM

Instrucciones detalladas para desplegar el sistema CRM en diferentes entornos.

---

## 🏗️ Requisitos Previos

### Software Requerido
- **Docker Desktop** 4.0+ (incluye Docker Engine y Docker Compose)
- **Git** 2.30+
- **Node.js** 18+ (si desplegado manualmente)
- **.NET SDK** 8.0+ (para backend de autenticación)
- **PHP** 8.2+ con Composer (para backend de órdenes)
- **SQL Server** 2019+ o Azure SQL Database

### Credenciales y Permisos
- Acceso a repositorio Git
- Credenciales de servidor SQL Server
- Claves API para servicios en la nube (si aplica)
- Certificados SSL/TLS válidos

---

## 📦 Despliegue Local con Docker

### Paso 1: Clonar Repositorio
```bash
git clone <repository-url>
cd crm-system
```

### Paso 2: Configurar Variables de Entorno

Crear archivo `.env.local`:
```env
# Base de Datos
SA_PASSWORD=YourSecurePassword123!
MSSQL_SA_PASSWORD=YourSecurePassword123!

# Frontend
FRONTEND_PORT=4200

# Backend Autenticación
AUTH_SERVICE_PORT=5000
AUTH_DB_CONNECTION=Server=mssql;Database=CRMAuthDb;User Id=sa;Password=YourSecurePassword123!;

# Backend Órdenes
ORDERS_SERVICE_PORT=5001
ORDERS_DB_CONNECTION=Driver={ODBC Driver 17 for SQL Server};Server=mssql;Database=CRMOrdersDb;User Id=sa;Password=YourSecurePassword123!;

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure

# CORS
ALLOWED_ORIGINS=http://localhost:4200
```

### Paso 3: Iniciar Contenedores

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver estado de servicios
docker-compose ps

# Ver logs de un servicio
docker-compose logs -f frontend
docker-compose logs -f auth-service
docker-compose logs -f orders-service
docker-compose logs -f mssql
```

### Paso 4: Verificar Despliegue

```bash
# Frontend
curl http://localhost:4200

# Backend Auth
curl http://localhost:5000/api/auth/health

# Backend Órdenes
curl http://localhost:5001/api/orders/health

# Base de Datos
sqlcmd -S localhost -U sa -P YourSecurePassword123!
> SELECT 1;
> GO
```

---

## 🌐 Despliegue en Staging

### Configuración de Servidor Staging

**Especificaciones Mínimas:**
- CPU: 4 vCores
- RAM: 8 GB
- Almacenamiento: 50 GB SSD
- Sistema Operativo: Ubuntu 20.04 LTS o Windows Server 2022

### Paso 1: Preparar Servidor

```bash
# Actualizar paquetes (Ubuntu)
sudo apt update
sudo apt upgrade -y

# Instalar Docker
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER

# Instalar Git
sudo apt install git -y

# Instalar otras herramientas
sudo apt install curl wget jq -y
```

### Paso 2: Desplegar Aplicación

```bash
# Clonar repositorio
cd /opt
sudo git clone <repository-url> crm-staging
sudo chown -R $USER:$USER crm-staging
cd crm-staging

# Configurar variables de staging
cp .env.sample .env.staging
nano .env.staging  # Editar valores

# Crear volúmenes persistentes
docker volume create crm_data_staging
docker volume create crm_logs_staging

# Iniciar servicios
docker-compose --file docker-compose.staging.yml up -d
```

### Paso 3: Configurar Reverse Proxy (Nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name staging-crm.example.com;
    
    ssl_certificate /etc/letsencrypt/live/staging-crm.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging-crm.example.com/privkey.pem;
    
    # Frontend
    location / {
        proxy_pass http://localhost:4200;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Backend Auth
    location /api/auth/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Authorization $http_authorization;
    }
    
    # Backend Órdenes
    location /api/orders/ {
        proxy_pass http://localhost:5001/api/;
        proxy_set_header Authorization $http_authorization;
    }
}
```

### Paso 4: Certificados SSL

```bash
# Usar Let's Encrypt con Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado
sudo certbot --nginx -d staging-crm.example.com

# Auto-renovación
sudo systemctl enable certbot.timer
```

---

## 🚀 Despliegue en Producción

### Arquitectura de Alta Disponibilidad

```
┌─────────────────────────────────────────┐
│      Load Balancer (Azure LB)           │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───────────┐         ┌───────────┐
│ K8s Nodo 1│         │ K8s Nodo 2│
├───────────┤         ├───────────┤
│ Frontend  │         │ Frontend  │
│ Auth API  │         │ Auth API  │
│ Órdenes   │         │ Órdenes   │
└───────────┘         └───────────┘
    │                     │
    └─────────┬───────────┘
              │
    ┌─────────────────────┐
    │  SQL Server (RTO)   │
    │  High Availability  │
    └─────────────────────┘
```

### Paso 1: Configurar Kubernetes

**Usando Azure Kubernetes Service (AKS):**

```bash
# Crear cluster AKS
az aks create \
    --resource-group myResourceGroup \
    --name crm-prod \
    --node-count 3 \
    --vm-set-type VirtualMachineScaleSets \
    --zones 1 2 3 \
    --enable-managed-identity

# Obtener credenciales
az aks get-credentials --resource-group myResourceGroup --name crm-prod

# Verificar cluster
kubectl get nodes
```

### Paso 2: Desplegar Aplicación en Kubernetes

```bash
# Crear namespace
kubectl create namespace crm-prod

# Crear secretos
kubectl create secret generic crm-secrets \
    --from-literal=db-password=YourSecurePassword123! \
    --from-literal=jwt-secret=your-jwt-secret \
    -n crm-prod

# Desplegar servicios
kubectl apply -f k8s/frontend-deployment.yml -n crm-prod
kubectl apply -f k8s/auth-service-deployment.yml -n crm-prod
kubectl apply -f k8s/orders-service-deployment.yml -n crm-prod
kubectl apply -f k8s/services.yml -n crm-prod
kubectl apply -f k8s/ingress.yml -n crm-prod

# Verificar despliegue
kubectl get pods -n crm-prod
kubectl get svc -n crm-prod
```

**Ejemplo manifest (k8s/frontend-deployment.yml):**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: crm-frontend
  namespace: crm-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: crm-frontend
  template:
    metadata:
      labels:
        app: crm-frontend
    spec:
      containers:
      - name: frontend
        image: myregistry.azurecr.io/crm-frontend:1.0.0
        ports:
        - containerPort: 4200
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 4200
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 4200
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Paso 3: Configurar Base de Datos en Producción

**Usar Azure SQL Database:**

```bash
# Crear servidor SQL
az sql server create \
    --name crm-sql-prod \
    --resource-group myResourceGroup \
    --admin-user sqladmin \
    --admin-password YourSecurePassword123!

# Crear bases de datos
az sql db create \
    --server crm-sql-prod \
    --name CRMAuthDb \
    --resource-group myResourceGroup \
    --service-objective S2

az sql db create \
    --server crm-sql-prod \
    --name CRMOrdersDb \
    --resource-group myResourceGroup \
    --service-objective S2

# Configurar firewall para Kubernetes
az sql server firewall-rule create \
    --server crm-sql-prod \
    --name AllowAKS \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 255.255.255.255
```

### Paso 4: Configurar Monitoreo y Alertas

**Usar Azure Monitor:**

```bash
# Crear Application Insights
az monitor app-insights component create \
    --app crm-prod \
    --resource-group myResourceGroup \
    --location eastus

# Crear alertas
az monitor metrics alert create \
    --name crm-high-cpu \
    --description "Alerta si CPU > 80%" \
    --resource-group myResourceGroup \
    --scopes /subscriptions/.../resourceGroups/myResourceGroup/providers/Microsoft.Kubernetes/managedClusters/crm-prod \
    --condition "avg Percentage CPU > 80"

# Ver métricas
kubectl top nodes
kubectl top pods -n crm-prod
```

### Paso 5: Configurar Copias de Seguridad

```bash
# Configurar copias de seguridad automáticas (SQL Azure)
az sql db update \
    --server crm-sql-prod \
    --name CRMAuthDb \
    --backup-storage-redundancy GeoRedundant

# Configurar retención
az sql db update \
    --server crm-sql-prod \
    --name CRMAuthDb \
    --retention-days 35

# Restaurar desde copia de seguridad (si es necesario)
az sql db restore \
    --server crm-sql-prod \
    --name CRMAuthDb-restored \
    --from-backup-resource-id /subscriptions/.../CRMAuthDb \
    --time "2026-01-15T12:30:00Z"
```

---

## 🔄 Integración Continua/Despliegue Continuo (CI/CD)

### GitHub Actions Pipeline

```yaml
name: Despliegue CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: myregistry.azurecr.io

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Construir imagen Frontend
        run: docker build -t $REGISTRY/crm-frontend:${{ github.sha }} ./frontend
      
      - name: Construir imagen Auth Service
        run: docker build -t $REGISTRY/crm-auth:${{ github.sha }} ./backend-auth
      
      - name: Construir imagen Orders Service
        run: docker build -t $REGISTRY/crm-orders:${{ github.sha }} ./backend-orders
      
      - name: Autenticar con Azure
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Enviar imágenes a Azure Container Registry
        run: |
          az acr login -n myregistry
          docker push $REGISTRY/crm-frontend:${{ github.sha }}
          docker push $REGISTRY/crm-auth:${{ github.sha }}
          docker push $REGISTRY/crm-orders:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      
      - name: Autenticar con Azure
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Actualizar Kubernetes
        run: |
          az aks get-credentials --resource-group myResourceGroup --name crm-prod
          kubectl set image deployment/crm-frontend crm-frontend=$REGISTRY/crm-frontend:${{ github.sha }} -n crm-prod
          kubectl rollout status deployment/crm-frontend -n crm-prod
```

---

## 🛠️ Mantenimiento en Producción

### Monitoreo Regular

```bash
# Verificar estado de pods
kubectl get pods -n crm-prod
kubectl describe pod <pod-name> -n crm-prod

# Ver logs
kubectl logs -f <pod-name> -n crm-prod
kubectl logs -f -l app=crm-frontend -n crm-prod

# Métricas de recursos
kubectl top nodes
kubectl top pods -n crm-prod
```

### Actualizar Aplicación

```bash
# Actualizar imagen
kubectl set image deployment/crm-frontend \
    crm-frontend=myregistry.azurecr.io/crm-frontend:2.0.0 \
    -n crm-prod

# Verificar rollout
kubectl rollout status deployment/crm-frontend -n crm-prod

# Retroceder si es necesario
kubectl rollout undo deployment/crm-frontend -n crm-prod
```

### Escalar Aplicación

```bash
# Aumentar réplicas
kubectl scale deployment crm-frontend --replicas=5 -n crm-prod

# Configurar autoescalado
kubectl autoscale deployment crm-frontend --min=3 --max=10 -n crm-prod
```

---

## 🚨 Recuperación ante Desastres

### RTO (Recovery Time Objective): 1 hora
### RPO (Recovery Point Objective): 15 minutos

### Procedimiento de Recuperación

1. **Verificar estado de SQL Server**
   ```bash
   # Conectar a servidor secundario si principal está inactivo
   sqlcmd -S crm-sql-backup.database.windows.net -U sqladmin
   ```

2. **Restaurar desde copia de seguridad**
   ```bash
   az sql db restore \
       --server crm-sql-prod \
       --name CRMAuthDb-recovered \
       --from-backup-resource-id <backup-id>
   ```

3. **Redireccionar conexiones de aplicación**
   ```bash
   kubectl set env deployment/crm-auth \
       CONNECTION_STRING="Server=crm-sql-backup.database.windows.net;..." \
       -n crm-prod
   ```

4. **Verificar servicios**
   ```bash
   curl https://crm.example.com/api/auth/health
   curl https://crm.example.com/api/orders/health
   ```

---

## 📋 Checklist de Despliegue

**Antes del Despliegue:**
- [ ] Todas las pruebas pasan
- [ ] Revisión de código completada
- [ ] Variables de entorno configuradas
- [ ] Certificados SSL válidos
- [ ] Copias de seguridad actualizadas

**Durante el Despliegue:**
- [ ] Monitoreo activado
- [ ] Equipo en guardia
- [ ] Rollout plan disponible
- [ ] Comunicación al cliente

**Después del Despliegue:**
- [ ] Pruebas de humo completadas
- [ ] Monitoreo de métricas
- [ ] Reportar al equipo
- [ ] Documentar cambios

---

## 📚 Recursos Adicionales

- [Documentación de Kubernetes](https://kubernetes.io/docs/)
- [Azure AKS Documentation](https://learn.microsoft.com/en-us/azure/aks/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- Ver [ARCHITECTURE.md](ARCHITECTURE.md) para detalles del sistema

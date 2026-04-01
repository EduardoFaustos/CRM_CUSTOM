<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRM Orders API - Documentación</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            padding: 40px;
            text-align: center;
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        
        .endpoints {
            text-align: left;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .endpoints h2 {
            color: #333;
            font-size: 18px;
            margin-bottom: 15px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        
        .endpoint {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-left: 4px solid #667eea;
            border-radius: 4px;
        }
        
        .endpoint-method {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-weight: bold;
            font-size: 12px;
            margin-right: 10px;
        }
        
        .get { background: #61affe; color: white; }
        .post { background: #49cc90; color: white; }
        .put { background: #fca130; color: white; }
        .patch { background: #50e3c2; color: white; }
        .delete { background: #f93e3e; color: white; }
        
        .endpoint-url {
            color: #333;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 30px;
            flex-wrap: wrap;
        }
        
        .btn {
            flex: 1;
            min-width: 150px;
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }
        
        .btn-secondary {
            background: #f0f0f0;
            color: #333;
            border: 2px solid #667eea;
        }
        
        .btn-secondary:hover {
            background: #f8f9fa;
        }
        
        .status {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
        }
        
        .info {
            background: #d1ecf1;
            color: #0c5460;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #17a2b8;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 CRM Orders API</h1>
        <p class="subtitle">API REST para gestión de clientes y órdenes</p>
        
        <div class="status">
            ✅ API disponible y funcional
        </div>
        
        <div class="endpoints">
            <h2>📋 Endpoints Principales</h2>
            
            <div class="endpoint">
                <span class="endpoint-method get">GET</span>
                <span class="endpoint-url">/api/customers</span>
            </div>
            
            <div class="endpoint">
                <span class="endpoint-method post">POST</span>
                <span class="endpoint-url">/api/customers</span>
            </div>
            
            <div class="endpoint">
                <span class="endpoint-method get">GET</span>
                <span class="endpoint-url">/api/customers/{cedula}</span>
            </div>
            
            <div class="endpoint">
                <span class="endpoint-method put">PUT</span>
                <span class="endpoint-url">/api/customers/{cedula}</span>
            </div>
            
            <div class="endpoint">
                <span class="endpoint-method delete">DELETE</span>
                <span class="endpoint-url">/api/customers/{cedula}</span>
            </div>
            
            <div class="endpoint">
                <span class="endpoint-method get">GET</span>
                <span class="endpoint-url">/api/orders</span>
            </div>
            
            <div class="endpoint">
                <span class="endpoint-method post">POST</span>
                <span class="endpoint-url">/api/orders</span>
            </div>
            
            <div class="endpoint">
                <span class="endpoint-method get">GET</span>
                <span class="endpoint-url">/api/dashboard/stats</span>
            </div>
        </div>
        
        <div class="info">
            <strong>ℹ️ Base URL:</strong> http://localhost:8001/api
        </div>
        
        <div class="button-group">
            <a href="http://localhost:3000" class="btn btn-primary">
                🖥️ Ir al Frontend
            </a>
            <a href="http://localhost:5005/swagger" class="btn btn-secondary">
                📚 Ver Auth API
            </a>
        </div>
    </div>
</body>
</html>

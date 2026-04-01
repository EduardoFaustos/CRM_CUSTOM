# CRM Orders Service (PHP 8 / Laravel)

Customer and Orders Management Service for the Eduardo Faustos System built with PHP 8 and Laravel 11.

## Requirements

- PHP 8.2+
- SQL Server
- Composer

## Setup

### 1. Install Dependencies

\`\`\`bash
composer install
\`\`\`

### 2. Environment Configuration

\`\`\`bash
cp .env.example .env
\`\`\`

Update the database connection in \`.env\`:

\`\`\`env
DB_CONNECTION=sqlsrv
DB_HOST=your_server
DB_DATABASE=CRMOrdersDb
DB_USERNAME=sa
DB_PASSWORD=your_password
\`\`\`

### 3. Run Migrations

\`\`\`bash
php artisan migrate
\`\`\`

### 4. Start the Service

\`\`\`bash
php artisan serve --port=8001
\`\`\`

The service will be available at \`http://localhost:8001\`
API documentation available at \`http://localhost:8001/api/docs\`

## API Endpoints

### Customers
- **GET** \`/api/customers\` - List all customers
- **POST** \`/api/customers\` - Create customer
- **GET** \`/api/customers/{id}\` - Get customer
- **PUT** \`/api/customers/{id}\` - Update customer
- **DELETE** \`/api/customers/{id}\` - Delete customer

### Orders
- **GET** \`/api/orders\` - List orders (with filters)
- **POST** \`/api/orders\` - Create order
- **GET** \`/api/orders/{id}\` - Get order
- **PUT** \`/api/orders/{id}\` - Update order
- **PATCH** \`/api/orders/{id}/status\` - Update order status
- **DELETE** \`/api/orders/{id}\` - Delete order

### Dashboard
- **GET** \`/api/dashboard/stats\` - Get statistics
- **GET** \`/api/dashboard/order-activity\` - Get activity chart
- **GET** \`/api/dashboard/revenue\` - Get revenue chart

## Testing

\`\`\`bash
php artisan test
\`\`\`

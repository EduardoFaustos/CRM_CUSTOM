# CRM Authentication Service (.NET 8)

Authentication microservice for the Eduardo Faustos System built with ASP.NET Core 8.

## Requirements

- .NET 8 SDK
- SQL Server

## Setup

### 1. Update Connection String

Edit `appsettings.json` with your SQL Server connection string:

\`\`\`json
"DefaultConnection": "Server=YOUR_SERVER;Database=CRMAuthDb;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=true;"
\`\`\`

### 2. Apply Migrations

\`\`\`bash
dotnet ef database update
\`\`\`

### 3. Run the Service

\`\`\`bash
dotnet run
\`\`\`

The service will be available at \`https://localhost:5001\`
Swagger documentation at \`https://localhost:5001/swagger\`

## API Endpoints

- **POST** \`/api/auth/register\` - Register a new user
- **POST** \`/api/auth/login\` - Login user
- **GET** \`/api/auth/verify\` - Verify token (requires authentication)

## Testing

\`\`\`bash
dotnet test
\`\`\`

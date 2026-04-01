# Eduardo Faustos System Frontend

Angular 17 Frontend for the CRM Customer and Orders Management System.

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm start
\`\`\`

The application will be available at \`http://localhost:4200\`

### Build

\`\`\`bash
npm run build
\`\`\`

### Testing

\`\`\`bash
npm test
\`\`\`

## Project Structure

- **src/app/core**: Core services, guards, and interceptors
- **src/app/modules**: Feature modules (auth, customers, orders, dashboard)
- **src/app/shared**: Shared components (navigation, footer, alerts, loading)
- **src/environments**: Environment configuration

## Features

- User authentication with JWT tokens
- Customer management (CRUD)
- Order management with status tracking
- Dashboard with statistics and charts
- Responsive design with Tailwind CSS

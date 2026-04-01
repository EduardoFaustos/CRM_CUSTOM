#!/bin/bash

# Eduardo Faustos System Setup Script
# This script sets up the entire Eduardo Faustos System locally without Docker

echo "================================"
echo "Eduardo Faustos System Local Setup"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "\n${YELLOW}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"

# Check .NET SDK
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}.NET SDK is not installed. Please install .NET 8 SDK${NC}"
    exit 1
fi
echo -e "${GREEN}✓ .NET SDK found: $(dotnet --version)${NC}"

# Check PHP
if ! command -v php &> /dev/null; then
    echo -e "${RED}PHP is not installed. Please install PHP 8.2+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PHP found: $(php --version | head -n 1)${NC}"

# Check Composer
if ! command -v composer &> /dev/null; then
    echo -e "${RED}Composer is not installed. Please install Composer${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Composer found${NC}"

# Setup Frontend
echo -e "\n${YELLOW}Setting up Frontend...${NC}"
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}Frontend setup failed${NC}"
    exit 1
fi
cd ..

# Setup Backend Auth
echo -e "\n${YELLOW}Setting up Auth Service (.NET)...${NC}"
cd backend-auth/CRMAuth
dotnet restore
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Auth Service dependencies restored${NC}"
else
    echo -e "${RED}Auth Service setup failed${NC}"
    exit 1
fi
cd ../..

# Setup Backend Orders
echo -e "\n${YELLOW}Setting up Orders Service (PHP)...${NC}"
cd backend-orders
cp .env.example .env
composer install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Orders Service dependencies installed${NC}"
else
    echo -e "${RED}Orders Service setup failed${NC}"
    exit 1
fi
cd ..

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${GREEN}================================${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Update database connection strings in .env files"
echo "2. Run .NET migrations: cd backend-auth/CRMAuth && dotnet ef database update"
echo "3. Run PHP migrations: cd backend-orders && php artisan migrate"
echo ""
echo "${YELLOW}To start services:${NC}"
echo "Terminal 1 - Frontend:  cd frontend && npm start"
echo "Terminal 2 - Auth:      cd backend-auth/CRMAuth && dotnet run"
echo "Terminal 3 - Orders:    cd backend-orders && php artisan serve --port=8001"

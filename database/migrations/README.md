# Database Migration Scripts

This folder contains SQL migration scripts for setting up the CRM databases.

## Create Auth Database

\`\`\`sql
CREATE DATABASE CRMAuthDb;
GO

USE CRMAuthDb;
GO

CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY NOT NULL,
    Email NVARCHAR(256) NOT NULL UNIQUE,
    Name NVARCHAR(256) NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    LastLogin DATETIME2 NULL,
    IsActive BIT NOT NULL DEFAULT 1
);
GO
\`\`\`

## Create Orders Database

\`\`\`sql
CREATE DATABASE CRMOrdersDb;
GO

USE CRMOrdersDb;
GO

CREATE TABLE Customers (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    phone NVARCHAR(20) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    city NVARCHAR(100) NOT NULL,
    state NVARCHAR(50) NOT NULL,
    zip_code NVARCHAR(20) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE TABLE Orders (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    customer_id BIGINT NOT NULL FOREIGN KEY REFERENCES Customers(id),
    order_number NVARCHAR(50) NOT NULL UNIQUE,
    status NVARCHAR(20) NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    completed_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE TABLE OrderItems (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    order_id BIGINT NOT NULL FOREIGN KEY REFERENCES Orders(id),
    product_name NVARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

CREATE INDEX idx_customer_id ON Orders(customer_id);
CREATE INDEX idx_order_status ON Orders(status);
CREATE INDEX idx_order_date ON Orders(created_at);
GO
\`\`\`

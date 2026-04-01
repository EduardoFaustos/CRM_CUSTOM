-- Create CRMAuthDb if not exists
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CRMAuthDb')
BEGIN
    CREATE DATABASE CRMAuthDb;
END
GO

-- Create CRMOrdersDb if not exists
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CRMOrdersDb')
BEGIN
    CREATE DATABASE CRMOrdersDb;
END
GO

-- Use CRMOrdersDb
USE CRMOrdersDb;
GO

-- Create sessions table for Laravel
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'sessions')
BEGIN
    CREATE TABLE [sessions] (
        [id] varchar(255) PRIMARY KEY,
        [user_id] bigint NULL,
        [ip_address] varchar(45) NULL,
        [user_agent] nvarchar(max) NULL,
        [payload] nvarchar(max) NOT NULL,
        [last_activity] int NOT NULL
    );
    CREATE INDEX idx_sessions_user_id ON [sessions]([user_id]);
    CREATE INDEX idx_sessions_last_activity ON [sessions]([last_activity]);
END
GO

-- Create migrations table for Laravel
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'migrations')
BEGIN
    CREATE TABLE [migrations] (
        [id] int PRIMARY KEY IDENTITY(1,1),
        [migration] varchar(255) NOT NULL,
        [batch] int NOT NULL
    );
END
GO

-- Create customers table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'customers')
BEGIN
    CREATE TABLE [customers] (
        [cedula] varchar(20) PRIMARY KEY,
        [tipo_documento] varchar(50) NOT NULL DEFAULT 'Cedula',
        [name] varchar(255) NOT NULL,
        [email] varchar(255) UNIQUE NULL,
        [phone] varchar(20) NULL,
        [address] nvarchar(max) NULL,
        [city] varchar(100) NULL,
        [state] varchar(100) NULL,
        [zip_code] varchar(20) NULL,
        [created_at] datetime DEFAULT GETDATE(),
        [updated_at] datetime DEFAULT GETDATE()
    );
END
GO

-- Create orders table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'orders')
BEGIN
    CREATE TABLE [orders] (
        [id] int PRIMARY KEY IDENTITY(1,1),
        [cedula] varchar(20) NOT NULL,
        [order_date] datetime DEFAULT GETDATE(),
        [total_amount] decimal(10,2) NOT NULL,
        [status] varchar(50) DEFAULT 'pending',
        [created_at] datetime DEFAULT GETDATE(),
        [updated_at] datetime DEFAULT GETDATE(),
        FOREIGN KEY ([cedula]) REFERENCES [customers]([cedula])
    );
    CREATE INDEX idx_orders_cedula ON [orders]([cedula]);
    CREATE INDEX idx_orders_status ON [orders]([status]);
END
GO

-- Create order_items table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'order_items')
BEGIN
    CREATE TABLE [order_items] (
        [id] int PRIMARY KEY IDENTITY(1,1),
        [order_id] int NOT NULL,
        [product_name] varchar(255) NOT NULL,
        [quantity] int NOT NULL DEFAULT 1,
        [unit_price] decimal(10,2) NOT NULL,
        [total] decimal(10,2) NOT NULL,
        [created_at] datetime DEFAULT GETDATE(),
        [updated_at] datetime DEFAULT GETDATE(),
        FOREIGN KEY ([order_id]) REFERENCES [orders]([id]) ON DELETE CASCADE
    );
    CREATE INDEX idx_order_items_order_id ON [order_items]([order_id]);
END
GO

-- Use CRMAuthDb
USE CRMAuthDb;
GO

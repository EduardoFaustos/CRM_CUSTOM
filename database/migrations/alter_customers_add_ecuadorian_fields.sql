-- Migración: Agregar campos de estándar ecuatoriano a tabla Customers
-- Descripción: Agregar campo cédula como identificador único y tipo_documento
-- Fecha: 2026-03-31

-- Paso 1: Agregar columnas si no existen
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='Customers' AND COLUMN_NAME='cedula')
BEGIN
    ALTER TABLE [Customers] ADD [cedula] [varchar](25) NULL;
END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='Customers' AND COLUMN_NAME='tipo_documento')
BEGIN
    ALTER TABLE [Customers] ADD [tipo_documento] [varchar](20) NULL DEFAULT 'Cedula';
END

-- Paso 2: Hacer cedula NOT NULL y UNIQUE después de llenar datos existentes
-- (Asegurar que todos los registros existentes tengan cedula única si es necesario)

-- Paso 3: Establecer cedula como PRIMARY KEY (Esto reemplaza el ID anterior)
-- NOTA: Esto requiere que no haya referencias FK o que se actualicen primero

/*
-- Opción A: Si necesitas mantener historial de datos existentes
UPDATE [Customers] SET [cedula] = CAST(ROW_NUMBER() OVER (ORDER BY id) AS varchar(25)) WHERE [cedula] IS NULL;

-- Opción B: Agregar restricción UNIQUE a cedula
ALTER TABLE [Customers] ADD CONSTRAINT UQ_Cedula UNIQUE ([cedula]);

-- Opción C (Completo - Cambiar PK a cedula):
-- Solo si no hay referencias FK activas:
-- 1. Crear tabla temporal con nueva estructura
-- 2. Copiar datos
-- 3. Eliminar tabla original
-- 4. Renombrar tabla temporal
*/

-- Para producción, ejecuta estos pasos manualmente después de validar datos existentes:
-- 1. Backup de base de datos
-- 2. Actualizar clientes existentes con cédulas válidas
-- 3. Hacer las columnas NOT NULL
-- 4. Agregar restricción UNIQUE a cedula

PRINT 'Migración ejecutada: Campos ecuatorianos agregados a Customers';
PRINT 'Próximos pasos manuales:';
PRINT '1. Llenar cedula para clientes existentes';
PRINT '2. Ejecutar: ALTER TABLE Customers ALTER COLUMN cedula VARCHAR(25) NOT NULL;';
PRINT '3. Ejecutar: ALTER TABLE Customers ADD CONSTRAINT UQ_Cedula_Unique UNIQUE (cedula);';

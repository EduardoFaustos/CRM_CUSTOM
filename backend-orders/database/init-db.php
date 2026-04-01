#!/usr/bin/env php
<?php
// Database initialization script
$retryCount = 0;
$maxRetries = 30;
$delayMs = 1000;

while ($retryCount < $maxRetries) {
    try {
        // Connect to master database (no database specified)
        $pdo = new PDO(
            'sqlsrv:Server=sqlserver,1433;TrustServerCertificate=yes;Encrypt=no',
            'sa',
            'YourPassword123!',
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]
        );

        echo "[" . date('H:i:s') . "] Connected to SQL Server\n";

        // Create CRMOrdersDb
        try {
            $pdo->exec("IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CRMOrdersDb') CREATE DATABASE CRMOrdersDb");
            echo "[" . date('H:i:s') . "] ✓ CRMOrdersDb ready\n";
        } catch (Exception $e) {
            echo "[" . date('H:i:s') . "] Warning creating CRMOrdersDb: " . $e->getMessage() . "\n";
        }

        // Create CRMAuthDb
        try {
            $pdo->exec("IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CRMAuthDb') CREATE DATABASE CRMAuthDb");
            echo "[" . date('H:i:s') . "] ✓ CRMAuthDb ready\n";
        } catch (Exception $e) {
            echo "[" . date('H:i:s') . "] Warning creating CRMAuthDb: " . $e->getMessage() . "\n";
        }

        $pdo = null;
        echo "[" . date('H:i:s') . "] Database initialization complete!\n";
        exit(0);

    } catch (Exception $e) {
        $retryCount++;
        if ($retryCount >= $maxRetries) {
            echo "[" . date('H:i:s') . "] ✗ Failed to initialize databases after " . $maxRetries . " attempts\n";
            echo "Error: " . $e->getMessage() . "\n";
            exit(1);
        }
        echo "[" . date('H:i:s') . "] Waiting for SQL Server... (attempt " . $retryCount . "/" . $maxRetries . ")\n";
        usleep($delayMs * 1000);
    }
}

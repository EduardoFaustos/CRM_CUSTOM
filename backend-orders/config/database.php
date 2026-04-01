<?php

return [
    'default' => env('DB_CONNECTION', 'sqlsrv'),
    'connections' => [
        'sqlsrv' => [
            'driver' => 'sqlsrv',
            'host' => env('DB_HOST', 'sqlserver'),
            'port' => env('DB_PORT', 1433),
            'database' => env('DB_DATABASE', 'CRMOrdersDb'),
            'username' => env('DB_USERNAME', 'sa'),
            'password' => env('DB_PASSWORD', 'YourPassword123!'),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'encrypt' => 'no',
            'trust_server_certificate' => true,
        ],
    ],
    'migrations' => 'migrations',
];

<?php

return [
    'default' => 'default',
    'documentations' => [
        'default' => [
            'api' => [
                'title' => 'CRM Orders API',
                'description' => 'API Documentation for CRM Orders Management Service',
                'version' => '1.0.0',
                'host' => 'localhost:8001',
                'basePath' => '/api',
                'schemes' => ['http'],
            ],
            'routes' => [
                'api' => 'api/v1/*',
                'docs' => 'api/documentation',
                'oauth2_callback' => 'api/oauth2-callback',
            ],
            'paths' => [
                'use_absolute_path' => env('L5_SWAGGER_USE_ABSOLUTE_PATH', true),
                'docs_json' => 'api-docs/api-docs.json',
                'docs_yaml' => 'api-docs/api-docs.yaml',
                'annotations' => [
                    base_path('app/Http/Controllers'),
                ],
            ],
        ],
    ],
    'paths' => [
        'docs' => storage_path('api-docs/'),
        'views' => base_path('resources/views/vendor/l5-swagger'),
        'cache' => storage_path('l5-swagger-cache'),
    ],
    'ui' => [
        'display' => [
            'dark_mode' => false,
            'filter' => true,
            'show_extensions' => false,
            'show_models' => true,
        ],
        'operations' => [
            'copySampleModelSchema' => true,
            'displayOperationId' => false,
        ],
        'models' => [
            'display' => true,
            'expand_depth' => 1,
            'example_model_expansion' => 'list',
            'default_expand_depth' => 1,
            'deep_linking' => true,
            'show_extensions' => false,
            'show_vendor_extensions' => false,
        ],
    ],
    'constants' => [
        'L5_SWAGGER_USE_ABSOLUTE_PATH' => env('L5_SWAGGER_USE_ABSOLUTE_PATH', true),
    ],
];

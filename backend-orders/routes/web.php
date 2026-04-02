<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/api/documentation');
});

Route::get('/api', function () {
    return redirect('/api/documentation');
});

// Ruta de documentación Swagger
Route::get('/api/documentation', function () {
    return view('api-docs');
})->name('api.docs');

// Servir el archivo JSON de OpenAPI
Route::get('/api/swagger-docs.json', function () {
    return response()->file(storage_path('api-docs/api-docs.json'));
});

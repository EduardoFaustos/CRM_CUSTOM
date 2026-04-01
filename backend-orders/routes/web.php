<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/api/documentation');
});

Route::get('/api', function () {
    return redirect('/api/documentation');
});

// Ruta temporal de documentación
Route::get('/api/documentation', function () {
    return view('api-docs');
})->name('api.docs');


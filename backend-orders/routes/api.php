&lt;?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DashboardController;

Route::prefix('api')->group(function () {
    // Customers
    Route::apiResource('customers', CustomerController::class);

    // Orders
    Route::apiResource('orders', OrderController::class);
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus']);

    // Dashboard
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('dashboard/order-activity', [DashboardController::class, 'orderActivity']);
    Route::get('dashboard/revenue', [DashboardController::class, 'revenueChart']);
});

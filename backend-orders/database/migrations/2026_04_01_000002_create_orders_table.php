<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('cedula', 20);
            $table->dateTime('order_date')->default(now());
            $table->decimal('total_amount', 10, 2);
            $table->string('status', 50)->default('pending');
            $table->timestamps();
            
            $table->foreign('cedula')->references('cedula')->on('customers');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

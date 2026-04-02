<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'cedula',
        'order_number',
        'status',
        'total_amount',
        'completed_at'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    protected $appends = ['items'];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'cedula', 'cedula');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getItemsAttribute()
    {
        return $this->orderItems;
    }
}

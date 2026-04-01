<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $primaryKey = 'cedula';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'cedula',
        'tipo_documento',
        'name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'zip_code'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}

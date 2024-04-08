<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incoming extends Model
{
    use HasFactory;

    protected $fillable = [
        'input_date',
        'delivery_id',
        'product_code'
    ];

    public function product() {
        return $this->hasMany(Product::class, 'code', 'product_code');
    }

    public function delivery() {
        return $this->hasMany(Delivery::class, 'id', 'delivery_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;

    protected $table = 'master_delivery';

    protected $fillable = [
        'delivery_invoice',
        'delivery_name',
        'customer_name',
        'customer_address',
        'delivery_cost',
        'number_plates',
        'date_delivery',
        'time_delivery',
        'batch_number',
        'products'
    ];

    public function product() {
        return $this->hasMany(Product::class, 'code', 'product_code');
    }

    public function vehicle() {
        return $this->belongsTo(Vehicle::class);
    }
}

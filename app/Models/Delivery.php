<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'product_code',
        'quantity',
        'target_delivery',
        'actual_delivery',
        'percentage'
    ];

    public function product() {
        return $this->hasMany(Product::class, 'code', 'product_code');
    }

    public function vehicle() {
        return $this->belongsTo(Vehicle::class);
    }
}

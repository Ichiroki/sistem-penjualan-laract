<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;

    protected $primaryKey = 'number_plates';

    public $incrementing = 'false';

    protected $keyType = 'string';

    protected $fillable = [
        'number_plates',
        'vehicle_type',
        'product_code',
        'target_delivery'
    ];

    public function product() {
        return $this->hasMany(Product::class, 'code', 'product_code');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Delivery extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';

    public $incrementing = 'false';

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'number_plates',
        'vehicle_type',
        'product_code',
        'target_delivery'
    ];

    public function product() {
        return $this->hasMany(Product::class, 'code', 'product_code');
    }
}

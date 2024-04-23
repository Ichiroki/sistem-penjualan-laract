<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    protected $fillable = [
        'number_plates',
        'vehicle_type',
        'target'
    ];

    public function delivery() {
        return $this->hasMany(Delivery::class, 'id', 'target');
    }

    use HasFactory;
}

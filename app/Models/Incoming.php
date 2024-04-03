<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incoming extends Model
{
    use HasFactory;

    protected $fillable = [
        'input_date',
        'number_plates',
        'product_code'
    ];

    public function delivery() {
        return $this->hasMany(Delivery::class);
    }
}

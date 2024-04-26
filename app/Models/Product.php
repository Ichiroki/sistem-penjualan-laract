<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $primaryKey = 'code';

    public $incrementing = 'false';

    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'name',
        'quantity',
        'delivery'
    ];

    public function delivery() {
        return $this->belongsTo(Delivery::class);
    }
}

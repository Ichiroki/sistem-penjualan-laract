<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Retur extends Model
{
    protected $table = 'master_retur';

    protected $fillable = [
        'retur_invoice',
        'retur_name',
        'customer_name',
        'customer_address',
        'number_plate',
        'date_retur',
        'time_retur',
        'batch_number'
    ];

    use HasFactory;
}

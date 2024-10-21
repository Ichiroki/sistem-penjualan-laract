<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incoming extends Model
{
    use HasFactory;

    protected $table = 'master_incoming';

    protected $fillable = [
        'incoming_invoice',
        'supplier_name',
        'received_to',
        'number_plate',
        'product',
        'date_incoming',
        'time_incoming',
        'subtotal'
    ];
}

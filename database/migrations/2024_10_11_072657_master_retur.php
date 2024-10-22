<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('master_retur', function (Blueprint $table) {
            $table->id();
            $table->string('retur_invoice')->unique();
            $table->string('retur_name');
            $table->string('customer_name');
            $table->string('customer_address');
            $table->string('number_plate');
            $table->date('date_retur');
            $table->time('time_retur');
            $table->string('batch_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_retur');
    }
};

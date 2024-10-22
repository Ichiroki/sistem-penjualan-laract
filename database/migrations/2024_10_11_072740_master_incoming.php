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
        Schema::create('master_incoming', function (Blueprint $table) {
            $table->id();
            $table->string('incoming_invoice')->unique();
            $table->string('supplier_name');
            $table->date('date_incoming');
            $table->time('time_incoming');
            $table->string('received_to');
            $table->string('number_plate');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_incoming');
    }
};

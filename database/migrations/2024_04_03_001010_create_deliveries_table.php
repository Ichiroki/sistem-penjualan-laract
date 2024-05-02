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
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->nullable('vehicles', 'vehicle_delivery_id');
            $table->string('product_code');
            $table->integer('quantity');
            $table->integer('target_delivery');
            $table->integer('actual_delivery');
            $table->decimal('percentage');
            $table->timestamps();

            $table->foreign('product_code')->references('code')->on('products')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};

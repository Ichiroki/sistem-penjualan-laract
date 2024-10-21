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
        Schema::create('detail_delivery', function (Blueprint $table) {
            $table->id();
            $table->integer('quantity');
            $table->string('product_code');
            $table->string('product_name');
            $table->string('delivery_invoice');
            $table->timestamps();

            $table->foreign('delivery_invoice')->references('delivery_invoice')->on('master_delivery');
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

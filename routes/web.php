<?php

use App\Http\Controllers\{DeliveriesController, IncomingController, ProductController, ProfileController, RetursController, VehicleController, ViewController};
use Illuminate\Support\Facades\Route;

Route::get('/', [ViewController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('products/{code}', [ProductController::class, 'showByCode']);
Route::get('deliveries/{invoice}', [DeliveriesController::class, 'show']);
Route::get('incoming/{invoice}', [IncomingController::class, 'show']);
Route::get('returs/{invoice}', [RetursController::class, 'show']);

Route::prefix('/')->middleware(['auth', 'verified'])->group(function() {
    Route::get('product', [ViewController::class, 'product'])->name('product');
    Route::get('delivery', [ViewController::class, 'delivery'])->name('delivery');
    Route::get('retur', [ViewController::class, 'retur'])->name('retur');
    Route::get('incoming', [ViewController::class, 'incoming'])->name('incoming');
    Route::get('vehicle', [ViewController::class, 'vehicle'])->name('vehicle');

    Route::apiResource('products', ProductController::class);
    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('deliveries', DeliveriesController::class);
    Route::apiResource('returs', RetursController::class);
    Route::apiResource('incomings', IncomingController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

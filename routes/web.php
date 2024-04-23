<?php

use App\Http\Controllers\DeliveriesController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\IncomingController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ViewController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ViewController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('products/{code}', [ProductController::class, 'showByCode']);
Route::get('deliveries/{number_plates}', [DeliveriesController::class, 'showByNumberPlates']);
Route::get('deliveries/{product_code}', [DeliveriesController::class, 'showByProductCode']);

Route::prefix('/')->middleware(['auth', 'verified'])->group(function() {
    Route::get('product', [ViewController::class, 'product'])->name('product');
    Route::get('delivery', [ViewController::class, 'delivery'])->name('delivery');
    Route::get('incoming', [ViewController::class, 'incoming'])->name('incoming');
    Route::get('expense', [ViewController::class, 'expense'])->name('expense');
    Route::get('vehicle', [ViewController::class, 'vehicle'])->name('vehicle');

    Route::apiResource('products', ProductController::class);
    Route::apiResource('deliveries', DeliveriesController::class);
    Route::apiResource('incomings', IncomingController::class);
    Route::apiResource('expenses', ExpenseController::class);

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

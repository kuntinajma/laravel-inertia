<?php

use App\Http\Controllers\ChirpController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('chirps', ChirpController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth']);

Route::resource('users', UserController::class)
    ->only(['index', 'store', 'edit', 'update', 'destroy'])
    ->middleware(['auth', 'is-admin']);


Route::group([
    'middleware' => ['auth', 'is-admin'],
    'prefix' => 'admin',
    'as' => 'admin.'
],function() {
    Route::put('/reports/update-user-status/{userId}', [\App\Http\Controllers\Admin\ReportController::class, 'updateUserStatus'])->name('reports.update-user-status');

    Route::resource('chirps', \App\Http\Controllers\Admin\ChirpController::class);
    Route::resource('reports', \App\Http\Controllers\Admin\ReportController::class);
});

require __DIR__.'/auth.php';

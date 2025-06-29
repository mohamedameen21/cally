<?php

use App\Helpers\ApiResponse;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\TestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        $user = Auth::user();

        return ApiResponse::success(['user' => [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
        ]], 'User Details');
    });

    // Availability routes
    Route::get('/availabilities', [App\Http\Controllers\AvailabilityController::class, 'index']);
    Route::post('/availabilities', [App\Http\Controllers\AvailabilityController::class, 'store']);
    
    // Booking routes (authenticated)
    Route::apiResource('bookings', App\Http\Controllers\BookingController::class);
});

// Public routes
Route::get('/availabilities/month', [App\Http\Controllers\AvailabilityController::class, 'getByUsernameAndMonth']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Test route
Route::get('/test', function() {
    return response()->json(['message' => 'API routes are working!']);
});

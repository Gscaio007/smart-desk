<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\TicketCommentController;
use App\Http\Controllers\Api\MetadataController;
use App\Http\Controllers\Api\DashboardController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('/tickets', TicketController::class)->only(['index', 'store', 'show']);
Route::post('/tickets/{ticket}/comments', [TicketCommentController::class, 'store']);
Route::patch('/tickets/{ticket}/assign', [TicketController::class, 'assign']);
Route::patch('/tickets/{ticket}/status', [TicketController::class, 'updateStatus']);
Route::get('/ticket-categories', [MetadataController::class, 'ticketCategories']);
Route::get('/priorities', [MetadataController::class, 'priorities']);
Route::get('/dashboard', DashboardController::class);
    });


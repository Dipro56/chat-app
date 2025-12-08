<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;




Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route::get('/get-userlist', [UserController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/profile', [AuthController::class, 'updateProfile']);
    Route::get('/get-userlist', [UserController::class, 'index']);

    // Route::post('/messages/send', [MessageController::class, 'send']);
    // Route::get('/messages/conversations', [MessageController::class, 'getConversations']);
    // Route::get('/messages/conversation/{userId}', [MessageController::class, 'getConversation']);
    // Route::delete('/messages/{id}', [MessageController::class, 'delete']);
    // Route::get('/messages/unread-count', [MessageController::class, 'getUnreadCount']);

    // Send a message or create conversation
    Route::post('/messages/send', [MessageController::class, 'sendMessage']);

    // Get all messages between current user and selected user
    Route::get('/messages/conversation/{userId}', [MessageController::class, 'getConversation']);
});

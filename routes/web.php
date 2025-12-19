<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;



Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);


Route::get('/login', function () {
    return Inertia::render('login');
})->name('login');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/register', function () {
    return Inertia::render('register');
})->name('register');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


// Route::get('/chat-interface', function () {
//     return Inertia::render('chat-interface');
// })->name('chat-interface');



Route::middleware(['auth'])->group(function () {
    Route::get('/chat-interface', function () {
        return Inertia::render('chat-interface');
    })->name('chat-interface');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/get-userlist', [UserController::class, 'index']);
});

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});


Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/profile', [AuthController::class, 'updateProfile']);
    Route::get('/get-userlist', [UserController::class, 'index']);

    Route::post('/messages/typing', [MessageController::class, 'typing']);
    Route::post('/messages/send', [MessageController::class, 'sendMessage']);
    Route::get('/messages/conversation/{userId}', [MessageController::class, 'getConversation']);
});

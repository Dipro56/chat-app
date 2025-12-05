<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/login', function () {
    return Inertia::render('login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('register');
})->name('register');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::get('/chat-interface', function () {
    return Inertia::render('chat-interface');
})->name('chat-interface');

// Route::middleware(['auth'])->group(function () {
//     Route::get('/chat-interface', function () {
//         return Inertia::render('chat-interface');
//     })->name('chat-interface');
// });

// Route::middleware(['api.token.auth'])->group(function () {
//     Route::get('/chat-interface', function () {
//         return Inertia::render('chat-interface');
//     })->name('chat-interface');
// });

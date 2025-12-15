<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| 1️⃣ Private chat channel (per user inbox)
|--------------------------------------------------------------------------
| Each user listens to their own channel for incoming messages
*/

Broadcast::channel('chat.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

/*
|--------------------------------------------------------------------------
| 2️⃣ Presence channel (online / offline)
|--------------------------------------------------------------------------
| ALL authenticated users join this
*/
Broadcast::channel('presence-online', function ($user) {
    return [
        'id' => $user->id,
        'name' => $user->name,
    ];
});

/*
|--------------------------------------------------------------------------
| 3️⃣ Sidebar update channel
|--------------------------------------------------------------------------
| Used ONLY to notify user to reorder contact list
*/
Broadcast::channel('contacts.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

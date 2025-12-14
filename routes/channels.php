<?php

use Illuminate\Support\Facades\Broadcast;

// Private chat channel
Broadcast::channel('chat.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
    // return true;
});

// Presence channel
Broadcast::channel('presence', function ($user) {
    return ['id' => $user->id, 'name' => $user->name];
});

//new

Broadcast::channel('chat.{senderId}.{receiverId}', function ($user, $senderId, $receiverId) {
    // User must be either the sender or receiver to join
    return (int) $user->id === (int) $senderId || (int) $user->id === (int) $receiverId;
});

// OR using a more dynamic approach
Broadcast::channel('private-chat.{chatId}', function ($user, $chatId) {
    // Check if user belongs to this chat
    return $user->chats()->where('chat_id', $chatId)->exists();
});

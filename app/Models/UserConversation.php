<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserConversation extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'conversation_id',
        'last_message_id',
        'unread_count',
        'updated_at'
    ];
}

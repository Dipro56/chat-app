<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageDeletion extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'message_id',
        'user_id',
        'deleted_at'
    ];
}

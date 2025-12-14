<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class UserTyping implements ShouldBroadcast
{
    public $receiver_id;
    public $user_id;

    public function __construct($receiver_id, $user_id)
    {
        $this->receiver_id = $receiver_id;
        $this->user_id = $user_id;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('chat.' . $this->receiver_id);
    }

    public function broadcastAs()
    {
        return 'UserTyping';
    }
}

<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserOnline implements ShouldBroadcast
{
    public $user;

    public function __construct($user)
    {
        $this->user = [
            'id' => $user->id,
            'name' => $user->name,
        ];
    }

    public function broadcastOn()
    {
        return new PresenceChannel('presence-online');
    }

    public function broadcastAs()
    {
        return 'user.online';
    }
}

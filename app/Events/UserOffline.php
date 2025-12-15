<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserOffline implements ShouldBroadcast
{
    public $userId;

    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    public function broadcastOn()
    {
        return new PresenceChannel('presence-online');
    }

    public function broadcastAs()
    {
        return 'user.offline';
    }
}

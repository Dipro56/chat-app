<?php

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageRead implements ShouldBroadcast
{
    public $message_id;
    public $reader_id;

    public function __construct($message_id, $reader_id)
    {
        $this->message_id = $message_id;
        $this->reader_id = $reader_id;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('chat.' . $this->message_id);
    }

    public function broadcastAs()
    {
        return 'MessageRead';
    }
}

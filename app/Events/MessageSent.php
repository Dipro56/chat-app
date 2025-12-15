<?php

// namespace App\Events;

// use App\Models\Message;
// use Illuminate\Broadcasting\PrivateChannel;
// use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
// use Illuminate\Queue\SerializesModels;

// class MessageSent implements ShouldBroadcast
// {
//     use SerializesModels;

//     public $message;

//     public function __construct(Message $message)
//     {
//         $this->message = $message;
//     }

//     public function broadcastOn()
//     {
//         // Send to both sender and receiver
//         return [
//             new PrivateChannel('chat.' . $this->message->sender_id),
//             new PrivateChannel('chat.' . $this->message->receiver_id),
//         ];
//     }

//     public function broadcastAs()
//     {
//         return 'MessageSent';
//     }
// }


namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return [
            // Chat inbox
            new PrivateChannel('chat.' . $this->message->sender_id),
            new PrivateChannel('chat.' . $this->message->receiver_id),

            // Sidebar reorder
            new PrivateChannel('contacts.' . $this->message->sender_id),
            new PrivateChannel('contacts.' . $this->message->receiver_id),
        ];
    }

    public function broadcastAs()
    {
        return 'message.sent';
    }
}

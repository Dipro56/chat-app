<?php

namespace App\Actions;

use App\Models\Message;
use App\Models\UserConversation;
use App\Models\ConversationParticipant;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class SendMessageAction
{
    public static function execute(string $conversationId, int $senderId, string $body): Message
    {
        return DB::transaction(function () use ($conversationId, $senderId, $body) {

            $message = Message::create([
                'id' => (string) Str::ulid(),
                'conversation_id' => $conversationId,
                'sender_id' => $senderId,
                'body' => $body,
                'created_at' => now(),
            ]);

            $participants = ConversationParticipant::where('conversation_id', $conversationId)
                ->pluck('user_id');

            foreach ($participants as $userId) {
                UserConversation::updateOrCreate(
                    ['user_id' => $userId, 'conversation_id' => $conversationId],
                    [
                        'last_message_id' => $message->id,
                        'updated_at' => now()
                    ]
                );

                if ($userId !== $senderId) {
                    UserConversation::where('user_id', $userId)
                        ->where('conversation_id', $conversationId)
                        ->increment('unread_count');
                }
            }

            return $message;
        });
    }
}

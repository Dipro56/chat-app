<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Actions\SendMessageAction;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Message;
use App\Events\UserTyping;




class MessageController extends Controller
{
    // Send a message (auto-create conversation if first time)
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|integer',
            'body' => 'required|string'
        ]);

        $senderId = Auth::id();
        $receiverId = $request->receiver_id;

        // Check if a conversation exists between these two users
        $conversation = Conversation::whereHas('participants', function ($q) use ($senderId, $receiverId) {
            $q->whereIn('user_id', [$senderId, $receiverId]);
        }, '=', 2)->first();

        // If no conversation, create one
        if (!$conversation) {
            $conversation = Conversation::create();
            ConversationParticipant::insert([
                ['conversation_id' => $conversation->id, 'user_id' => $senderId, 'created_at' => now(), 'updated_at' => now()],
                ['conversation_id' => $conversation->id, 'user_id' => $receiverId, 'created_at' => now(), 'updated_at' => now()]
            ]);
        }

        // Send the message
        $message = SendMessageAction::execute($conversation->id, $senderId, $request->body);

        return response()->json(['status' => 'success', 'data' => $message]);
    }

    // Fetch messages between current user and selected user
    public function getConversation(string $userId)
    {
        $authId = Auth::id();

        // Get the conversation between these two users
        $conversation = Conversation::whereHas('participants', function ($q) use ($authId, $userId) {
            $q->whereIn('user_id', [$authId, $userId]);
        }, '=', 2)->first();

        if (!$conversation) {
            return response()->json(['status' => 'success', 'data' => []]);
        }

        $messages = Message::where('conversation_id', $conversation->id)
            ->orderBy('id', 'asc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $messages]);
    }

    public function typing(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|integer',
        ]);

        broadcast(new UserTyping($request->receiver_id, 2))->toOthers();

        return response()->json([
            'status' => 'success'
        ]);
    }
}

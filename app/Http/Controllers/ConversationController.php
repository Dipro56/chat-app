<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ConversationController extends Controller
{
    public function index()
    {
        return DB::table('user_conversations')
            ->where('user_id', Auth::id())
            ->orderByDesc('updated_at')
            ->get();
    }
}

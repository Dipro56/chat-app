<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        try {
            // Get the current authenticated user ID
            $currentUserId = Auth::id();

            if (!$currentUserId) {
                return ApiResponse::error("Unauthorized", 401);
            }

            // Get all users except the current user
            $userList = User::where('id', '!=', $currentUserId)
                ->select(['id', 'name', 'email', 'profile_photo', 'created_at'])
                ->orderBy('name')
                ->get();

            return ApiResponse::success("User list fetched successfully", $userList,);
        } catch (Exception $e) {
            return ApiResponse::error("Failed to fetch users", 500, $e->getMessage());
        }
    }
}

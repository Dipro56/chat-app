<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    // -------- REGISTER --------
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return ApiResponse::success(
            'User registered successfully',
            $user,
            201
        );
    }

    // -------- LOGIN --------
    // public function login(Request $request)
    // {
    //     $credentials = $request->validate([
    //         'email'    => 'required|email',
    //         'password' => 'required',
    //     ]);

    //     if (!Auth::attempt($credentials)) {
    //         return ApiResponse::error('Invalid credentials', 401);
    //     }

    //     $user  = Auth::user();
    //     $token = $user->createToken('auth_token')->plainTextToken;



    //     return ApiResponse::success(
    //         'Login successful',
    //         [
    //             'token' => $token,
    //             'user'  => $user
    //         ]
    //     );
    // }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        if (!Auth::attempt($credentials)) {
            return ApiResponse::error('Invalid credentials', 401);
        }

        // Create Laravel session
        $request->session()->regenerate();

        return ApiResponse::success(
            'Login successful',
            ['user' => Auth::user()]
        );
    }


    // -------- LOGOUT --------
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return ApiResponse::success('Logged out successfully');
    }

    // -------- PROFILE UPDATE --------
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'sometimes|string|max:255',
            'profile_photo' => 'sometimes|image|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('profile_photo')) {
            // Delete old profile photo
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }

            // Store new profile photo
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            $user->profile_photo = $path;
        }

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }

        $user->save();

        return ApiResponse::success(
            'Profile updated successfully',
            $user
        );
    }
}

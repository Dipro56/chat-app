<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;

class BearerTokenAuth
{
    public function handle(Request $request, Closure $next)
    {
        $header = $request->header('Authorization');

        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return redirect()->route('login');
        }

        $token = substr($header, 7);

        $user = User::where('api_token', $token)->first();

        if (!$user) {
            return redirect()->route('login');
        }

        auth()->guard('web')->login($user);


        return $next($request);
    }
}

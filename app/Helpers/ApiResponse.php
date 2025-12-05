<?php

namespace App\Helpers;

class ApiResponse
{
    public static function success($message = 'Success', $data = null, $code = 200)
    {
        return response()->json([
            'status'  => 'success',
            'message' => $message,
            'code'    => $code,
            'data'    => $data
        ], $code);
    }

    public static function error($message = 'Error', $code = 400, $data = null)
    {
        return response()->json([
            'status'  => 'error',
            'message' => $message,
            'code'    => $code,
            'data'    => $data
        ], $code);
    }

    public static function validationError($errors, $message = 'Validation failed', $code = 422)
    {
        return response()->json([
            'status'  => 'error',
            'message' => $message,
            'code'    => $code,
            'errors'  => $errors
        ], $code);
    }
}

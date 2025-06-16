<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;

class ApiResponse
{
    public static function success($data, $message = null)
    {
        return response()->json([
            'success' => true,
            'message' => $message   ,
            'data' => $data,
        ], 200);
    }

    public static function error($message, $statusCode = 400)
    {
        return response()->json([
            'success' => false,
            'message' => 'Error',
        ], $statusCode);
    }

    public static function errorWithLog($message, $exception, $statusCode = 400)
    {
        Log::error($exception->getMessage(), ['exception' => $exception]);

        return static::error($message, $statusCode);
    }

    public static function validationError($errors)
    {
        return response()->json([
            'success' => false,
            'message' => 'Validation errors',
            'errors' => $errors,
        ], 422);
    }

}

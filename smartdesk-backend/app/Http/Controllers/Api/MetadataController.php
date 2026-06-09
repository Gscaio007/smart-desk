<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Priority;
use App\Models\TicketCategory;
use Illuminate\Http\JsonResponse;

class MetadataController extends Controller
{
    public function ticketCategories(): JsonResponse
    {
        return response()->json([
            'categories' => TicketCategory::with('department')->orderBy('name')->get(),
        ]);
    }

    public function priorities(): JsonResponse
    {
        return response()->json([
            'priorities' => Priority::orderBy('id')->get(),
        ]);
    }
}
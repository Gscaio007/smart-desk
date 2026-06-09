<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketCommentController extends Controller
{
    public function store(Request $request, Ticket $ticket): JsonResponse
    {
        $user = $request->user();

        if ($user->isCustomer() && $ticket->customer_id !== $user->id) {
            abort(403);
        }

        $data = $request->validate([
            'body' => ['required', 'string'],
            'is_internal' => ['sometimes', 'boolean'],
        ]);

        $isInternal = (bool) ($data['is_internal'] ?? false);

        if ($isInternal && $user->isCustomer()) {
            return response()->json([
                'message' => 'Clientes não podem criar comentários internos.',
            ], 403);
        }

        $comment = TicketComment::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'body' => $data['body'],
            'is_internal' => $isInternal,
        ]);

        return response()->json([
            'comment' => $comment->load('user:id,name,email,role'),
        ], 201);
    }
}
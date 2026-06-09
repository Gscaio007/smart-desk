<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Ticket::query();

        if ($user->isCustomer()) {
            $query->where('customer_id', $user->id);
        }

        if ($user->isAgent()) {
            $query->where(function ($query) use ($user) {
                $query->whereNull('assigned_agent_id')
                    ->orWhere('assigned_agent_id', $user->id);
            });
        }

        return response()->json([
            'total' => (clone $query)->count(),
            'open' => (clone $query)->where('status', Ticket::STATUS_OPEN)->count(),
            'in_progress' => (clone $query)->where('status', Ticket::STATUS_IN_PROGRESS)->count(),
            'waiting_customer' => (clone $query)->where('status', Ticket::STATUS_WAITING_CUSTOMER)->count(),
            'overdue' => (clone $query)->where('status', Ticket::STATUS_OVERDUE)->count(),
            'resolved' => (clone $query)->where('status', Ticket::STATUS_RESOLVED)->count(),
            'closed' => (clone $query)->where('status', Ticket::STATUS_CLOSED)->count(),
        ]);
    }
}
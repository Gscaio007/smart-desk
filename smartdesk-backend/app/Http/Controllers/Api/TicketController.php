<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Priority;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Ticket::query()
            ->with(['customer:id,name,email', 'assignedAgent:id,name,email', 'category.department', 'priority'])
            ->latest();

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
            'tickets' => $query->paginate(10),
        ]);
    }

public function store(Request $request): JsonResponse
{
    $user = $request->user();

    if (! $user) {
        return response()->json([
            'message' => 'Unauthenticated.',
        ], 401);
    }

    $data = $request->validate([
        'category_id' => ['required', 'exists:ticket_categories,id'],
        'priority_id' => ['required', 'exists:priorities,id'],
        'title' => ['required', 'string', 'max:255'],
        'description' => ['required', 'string'],
    ]);

    $priority = Priority::findOrFail($data['priority_id']);

    $ticket = Ticket::create([
        'customer_id' => $user->id,
        'category_id' => $data['category_id'],
        'priority_id' => $priority->id,
        'title' => $data['title'],
        'description' => $data['description'],
        'status' => Ticket::STATUS_OPEN,
        'due_at' => now()->addMinutes($priority->resolution_time_minutes),
    ]);

    return response()->json([
        'ticket' => $ticket->load(['customer:id,name,email', 'category.department', 'priority']),
    ], 201);
}

  public function show(Request $request, Ticket $ticket): JsonResponse
{
    $user = $request->user();

    if ($user->isCustomer() && $ticket->customer_id !== $user->id) {
        abort(403);
    }

    $ticket->load([
        'customer:id,name,email',
        'assignedAgent:id,name,email',
        'category.department',
        'priority',
        'comments' => function ($query) use ($user) {
            $query
                ->when($user->isCustomer(), function ($query) {
                    $query->where('is_internal', false);
                })
                ->with('user:id,name,email,role')
                ->oldest();
        },
    ]);

    return response()->json([
        'ticket' => $ticket,
    ]);
}

public function assign(Request $request, Ticket $ticket): JsonResponse
{
    $user = $request->user();

    if ($user->isCustomer()) {
        abort(403);
    }

    $ticket->update([
        'assigned_agent_id' => $user->id,
        'status' => Ticket::STATUS_IN_PROGRESS,
    ]);

    return response()->json([
        'ticket' => $ticket->load(['customer:id,name,email', 'assignedAgent:id,name,email,role', 'category.department', 'priority']),
    ]);
}

public function updateStatus(Request $request, Ticket $ticket): JsonResponse
{
    $user = $request->user();

    if ($user->isCustomer()) {
        abort(403);
    }

    $data = $request->validate([
        'status' => ['required', 'in:' . implode(',', [
    Ticket::STATUS_OPEN,
    Ticket::STATUS_IN_PROGRESS,
    Ticket::STATUS_WAITING_CUSTOMER,
    Ticket::STATUS_RESOLVED,
    Ticket::STATUS_CLOSED,
])],
    ]);

    $ticket->update([
        'status' => $data['status'],
        'resolved_at' => $data['status'] === Ticket::STATUS_RESOLVED ? now() : $ticket->resolved_at,
    ]);

    return response()->json([
        'ticket' => $ticket->load(['customer:id,name,email', 'assignedAgent:id,name,email,role', 'category.department', 'priority']),
    ]);
}
}
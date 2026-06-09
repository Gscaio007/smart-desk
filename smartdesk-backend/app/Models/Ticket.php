<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'customer_id',
    'assigned_agent_id',
    'category_id',
    'priority_id',
    'title',
    'description',
    'status',
    'due_at',
    'resolved_at',
])]
class Ticket extends Model
{
    use HasFactory;

public const STATUS_OPEN = 'open';
public const STATUS_IN_PROGRESS = 'in_progress';
public const STATUS_WAITING_CUSTOMER = 'waiting_customer';
public const STATUS_RESOLVED = 'resolved';
public const STATUS_CLOSED = 'closed';
public const STATUS_OVERDUE = 'overdue';

public const STATUSES = [
    self::STATUS_OPEN,
    self::STATUS_IN_PROGRESS,
    self::STATUS_WAITING_CUSTOMER,
    self::STATUS_RESOLVED,
    self::STATUS_CLOSED,
    self::STATUS_OVERDUE,
];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function assignedAgent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_agent_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(TicketCategory::class, 'category_id');
    }

    public function priority(): BelongsTo
    {
        return $this->belongsTo(Priority::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(TicketComment::class);
    }
}
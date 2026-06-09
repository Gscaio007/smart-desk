<?php

namespace App\Console\Commands;

use App\Models\Ticket;
use Illuminate\Console\Command;

class CheckOverdueTickets extends Command
{
    protected $signature = 'tickets:check-overdue';

    protected $description = 'Marks open tickets as overdue when the SLA due date has passed.';

    public function handle(): int
    {
        $updated = Ticket::query()
            ->whereNotNull('due_at')
            ->where('due_at', '<', now())
            ->whereNotIn('status', [
    Ticket::STATUS_RESOLVED,
    Ticket::STATUS_CLOSED,
    Ticket::STATUS_OVERDUE,
])
            ->update([
                'status' => Ticket::STATUS_OVERDUE,
            ]);

        $this->info("{$updated} ticket(s) marked as overdue.");

        return self::SUCCESS;
    }
}
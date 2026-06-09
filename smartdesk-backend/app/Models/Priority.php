<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'response_time_minutes', 'resolution_time_minutes'])]
class Priority extends Model
{
    use HasFactory;

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }
}
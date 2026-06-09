<?php

namespace Database\Seeders;

use App\Models\Priority;
use Illuminate\Database\Seeder;

class PrioritySeeder extends Seeder
{
    public function run(): void
    {
        $priorities = [
            [
                'name' => 'Baixa',
                'response_time_minutes' => 1440,
                'resolution_time_minutes' => 4320,
            ],
            [
                'name' => 'Média',
                'response_time_minutes' => 480,
                'resolution_time_minutes' => 1440,
            ],
            [
                'name' => 'Alta',
                'response_time_minutes' => 120,
                'resolution_time_minutes' => 480,
            ],
            [
                'name' => 'Crítica',
                'response_time_minutes' => 30,
                'resolution_time_minutes' => 120,
            ],
        ];

        foreach ($priorities as $priority) {
            Priority::create($priority);
        }
    }
}
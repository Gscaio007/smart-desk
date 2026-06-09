<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin SmartDesk',
            'email' => 'admin@smartdesk.test',
            'password' => 'password',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Atendente SmartDesk',
            'email' => 'agent@smartdesk.test',
            'password' => 'password',
            'role' => 'agent',
        ]);

        User::create([
            'name' => 'Cliente SmartDesk',
            'email' => 'customer@smartdesk.test',
            'password' => 'password',
            'role' => 'customer',
        ]);
    }
}
<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\TicketCategory;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            'Suporte Técnico' => [
                'Erro no sistema',
                'Dúvida de uso',
                'Acesso e login',
            ],
            'Financeiro' => [
                'Cobrança',
                'Nota fiscal',
                'Reembolso',
            ],
            'Comercial' => [
                'Planos',
                'Contratação',
                'Cancelamento',
            ],
        ];

        foreach ($departments as $departmentName => $categories) {
            $department = Department::create([
                'name' => $departmentName,
            ]);

            foreach ($categories as $categoryName) {
                TicketCategory::create([
                    'department_id' => $department->id,
                    'name' => $categoryName,
                ]);
            }
        }
    }
}
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
Schema::create('tickets', function (Blueprint $table) {
    $table->id();
    $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('assigned_agent_id')->nullable()->constrained('users')->nullOnDelete();
    $table->foreignId('category_id')->constrained('ticket_categories')->restrictOnDelete();
    $table->foreignId('priority_id')->constrained('priorities')->restrictOnDelete();
    $table->string('title');
    $table->text('description');
    $table->string('status')->default('open');
    $table->timestamp('due_at')->nullable();
    $table->timestamp('resolved_at')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};

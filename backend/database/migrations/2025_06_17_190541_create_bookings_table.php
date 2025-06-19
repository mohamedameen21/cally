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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('host_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('guest_user_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('booking_time');
            $table->text('notes')->nullable();
            $table->string('meeting_link')->nullable();
            $table->timestamps();

            // Index for performance
            $table->index(['host_user_id', 'booking_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};

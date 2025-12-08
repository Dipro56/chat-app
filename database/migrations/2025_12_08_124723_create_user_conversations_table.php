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
        Schema::create('user_conversations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('conversation_id', 26);
            $table->string('last_message_id', 26)->nullable();
            $table->integer('unread_count')->default(0);
            $table->timestamp('updated_at')->nullable();

            $table->unique(['user_id', 'conversation_id']);
            $table->index('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_conversations');
    }
};

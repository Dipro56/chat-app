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
        Schema::create('message_deletions', function (Blueprint $table) {
            $table->id();
            $table->string('message_id', 26);
            $table->unsignedBigInteger('user_id');
            $table->timestamp('deleted_at')->useCurrent();

            $table->unique(['message_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_deletions');
    }
};

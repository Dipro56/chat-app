<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->string('id', 26)->primary(); // ULID
            $table->string('conversation_id', 26);
            $table->unsignedBigInteger('sender_id');
            $table->text('body')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();

            $table->index(['conversation_id', 'created_at']);
            $table->index('sender_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('messages');
    }
};

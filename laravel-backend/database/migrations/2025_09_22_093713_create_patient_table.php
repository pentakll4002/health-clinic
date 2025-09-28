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
        Schema::create('patient', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->unique();

            $table->string('name');
            $table->enum('gender', ['male','female','other']);
            $table->date('date_of_birth');
            $table->string('id_card', 12)->unique();
            $table->string('phone', 10)->unique();
            $table->string('email')->unique();
            $table->text('address');
            $table->string('medical_record_number')->unique(); // ID cua benh nhan

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient');
    }
};

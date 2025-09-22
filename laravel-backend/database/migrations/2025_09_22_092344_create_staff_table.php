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
        Schema::create('staff', function (Blueprint $table) {
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
            $table->string('staff_id')->unique();
            $table->string('job_title');
            $table->string('status');
            $table->date('hire_date');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};

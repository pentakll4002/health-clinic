<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disease', function (Blueprint $table) {
            $table->id();
            $table->string('disease_name')->unique();      
            $table->string('icd_code', 10)->unique()->nullable(); // Ma ICD
            $table->text('description')->nullable(); 
            $table->text('treatment')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disease');
    }
};

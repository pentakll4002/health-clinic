<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('revenue_report', function (Blueprint $table) {
            $table->id();

            $table->unsignedTinyInteger('month');     
            $table->unsignedSmallInteger('year');
            $table->decimal('total_amount', 20, 2);   
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('revenue_report');
    }
};

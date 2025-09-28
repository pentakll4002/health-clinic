<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('revenue_details', function (Blueprint $table) {
            $table->id();

            // Foreign key to revenue_reports
            $table->foreignId('revenue_report_id')
                  ->constrained('revenue_report')
                  ->cascadeOnDelete();

            // Revenue detail fields
            $table->date('revenue_date');                     
            $table->integer('number_of_patients')->default(1);    
            $table->decimal('amount', 20, 2);           

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('revenue_details');
    }
};

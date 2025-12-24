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
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('dang_ky_tam_thoi');
        Schema::dropIfExists('pending_registers');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Optional: recreate if needed
    }
};

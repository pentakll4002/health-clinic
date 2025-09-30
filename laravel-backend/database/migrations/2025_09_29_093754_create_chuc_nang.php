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
        Schema::create('chuc_nang', function (Blueprint $table) {
            $table->increments("ID_ChucNang");
            $table->string("TenChucNang", 100)->nullable(false);
            $table->string("TenManHinhTuongUong", 100)->nullable(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chuc_nang');
    }
};

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
        Schema::create('loai_benh', function (Blueprint $table) {
            $table->increments("ID_LoaiBenh");
            $table->string("TenLoaiBenh", 100)->nullable(false);
            $table->string("TrieuChung", 255)->nullable(true);
            $table->string("HuongDieuTri", 255)->nullable(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loai_benh');
    }
};

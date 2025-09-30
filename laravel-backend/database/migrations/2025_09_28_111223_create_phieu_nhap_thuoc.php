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
        Schema::create('phieu_nhap_thuoc', function (Blueprint $table) {
            $table->increments("ID_PhieuNhapThuoc");
            $table->datetime("NgayNhap")->nullable(false);
            $table->decimal("TongTienNhap", 10, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phieu_nhap_thuoc');
    }
};

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
        Schema::create('toa_thuoc', function (Blueprint $table) {
            $table->unsignedInteger("ID_PhieuKham");
            $table->unsignedInteger("ID_Thuoc");
            $table->primary(['ID_PhieuKham', 'ID_Thuoc']);
            $table->foreign('ID_PhieuKham')->references('ID_PhieuKham')->on('phieu_kham');
            $table->foreign('ID_Thuoc')->references('id')->on('thuoc');
            $table->integer("SoLuong")->nullable(false);
            $table->decimal("DonGiaBan_LuocMua", 10, 2)->nullable(true);
            $table->decimal("TienThuoc", 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('toa_thuoc');
    }
};

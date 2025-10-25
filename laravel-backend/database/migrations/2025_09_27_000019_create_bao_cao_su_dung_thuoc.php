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
        Schema::create('bao_cao_su_dung_thuoc', function (Blueprint $table) {
            $table->increments("ID_BCSDT");
            $table->integer("Thang")->nullable(false);
            $table->integer("Nam")->nullable(false);
            $table->unsignedInteger("ID_Thuoc");
            $table->foreign("ID_Thuoc")->references("ID_Thuoc")->on("thuoc");
            $table->integer("TongSoLuongNhap")->nullable(false);
            $table->integer("SoLuongDung")->nullable(false);
            $table->integer("SoLanDung")->nullable(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bao_cao_su_dung_thuoc');
    }
};

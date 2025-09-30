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
        Schema::create('chi_tiet_phieu_nhap_thuoc', function (Blueprint $table) {
            $table->unsignedBigInteger("ID_PhieuNhapThuoc");
            $table->unsignedBigInteger("ID_Thuoc");
            $table->primary(["ID_PhieuNhapThuoc", "ID_Thuoc"]);
            $table->foreign("ID_PhieuNhapThuoc")->references("ID_PhieuNhapThuoc")->on("phieu_nhap_thuoc");
            $table->foreign("ID_Thuoc")->references("ID_Thuoc")->on("thuoc");
            $table->date("HanSuDung")->nullable(true);
            $table->integer("SoLuongNhap")->nullable(false);
            $table->decimal("DonGiaNhap", 10, 2)->nullable(false);
            $table->decimal("ThanhTien", 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chi_tiet_phieu_nhap_thuoc');
    }
};

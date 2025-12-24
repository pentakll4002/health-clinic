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
        Schema::table('phieu_nhap_thuoc', function (Blueprint $table) {
            // Thêm ID_NhanVien (người nhập thuốc - quản lý kho)
            $table->unsignedInteger('ID_NhanVien')->nullable()->after('ID_PhieuNhapThuoc');
            $table->foreign('ID_NhanVien')->references('ID_NhanVien')->on('nhan_vien');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('phieu_nhap_thuoc', function (Blueprint $table) {
            $table->dropForeign(['ID_NhanVien']);
            $table->dropColumn('ID_NhanVien');
        });
    }
};





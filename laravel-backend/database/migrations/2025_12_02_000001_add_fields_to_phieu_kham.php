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
        Schema::table('phieu_kham', function (Blueprint $table) {
            // Thêm ID_BacSi (bác sĩ lập phiếu khám)
            $table->unsignedInteger('ID_BacSi')->nullable()->after('ID_TiepNhan');
            $table->foreign('ID_BacSi')->references('ID_NhanVien')->on('nhan_vien');
            
            // Thêm TrangThai (Đang khám / Đã khám)
            $table->enum('TrangThai', ['DangKham', 'DaKham'])->default('DangKham')->after('TongTienThuoc');
            
            // Thêm ChanDoan (Chẩn đoán)
            $table->string('ChanDoan', 255)->nullable()->after('TrieuChung');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('phieu_kham', function (Blueprint $table) {
            $table->dropForeign(['ID_BacSi']);
            $table->dropColumn(['ID_BacSi', 'TrangThai', 'ChanDoan']);
        });
    }
};





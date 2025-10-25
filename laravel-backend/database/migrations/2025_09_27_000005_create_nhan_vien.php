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
        Schema::create('nhan_vien', function (Blueprint $table) {
            $table->increments("ID_NhanVien");
            $table->string("HoTenNV", 500)->nullable(false);
            $table->date("NgaySinh")->nullable(false);
            $table->string("GioiTinh", 10)->nullable(false);
            $table->string("CCCD", 25)->unique()->nullable(false);
            $table->string("DienThoai", 15)->unique()->nullable(false);
            $table->string("DiaChi", 500)->nullable(false);
            $table->string("Email", 500)->unique()->nullable(false);
            $table->string("HinhAnh", 255)->nullable(false);
            $table->string("TrangThai", 50)->default("Đang làm việc");
            $table->unsignedInteger("ID_Nhom");
            $table->foreign("ID_Nhom")->references("ID_Nhom")->on("nhom_nguoi_dung");
            $table->string("MatKhau", 255)->nullable(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nhan_vien');
    }
};

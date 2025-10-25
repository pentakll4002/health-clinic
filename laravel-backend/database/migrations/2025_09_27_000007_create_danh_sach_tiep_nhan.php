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
        Schema::create('danh_sach_tiep_nhan', function (Blueprint $table) {
            $table->increments("ID_TiepNhan");
            $table->unsignedInteger("ID_BenhNhan");
            $table->foreign("ID_BenhNhan")->references("ID_BenhNhan")->on("benh_nhan");
            $table->datetime("NgayTN")->nullable(false);
            $table->string("CaTN", 10)->nullable(false);
            $table->unsignedInteger("ID_NhanVien");
            $table->foreign("ID_NhanVien")->references("ID_NhanVien")->on("nhan_vien");
            $table->boolean("Is_Deleted")->default(0);
            $table->boolean("TrangThai")->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('danh_sach_tiep_nhan');
    }
};

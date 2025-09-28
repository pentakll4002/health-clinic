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
            $table->foreign("ID_BenhNhan")->references("id")->on("BenhNhan");
            $table->dateTime("NgayTN")->nullable(false);
            $table->string("CaTN", 10)->nullable(false);
            $table->unsignedInteger("ID_NhanVien");
            $table->foreign("ID_NhanVien")->references("id")->on("NhanVien");
            $table->boolean("Is_Deleted")->default(false);
            $table->boolean("TrangThai")->default(false);
            $table->timestamps();
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

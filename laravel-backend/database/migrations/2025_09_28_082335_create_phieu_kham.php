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
        Schema::create('phieu_kham', function (Blueprint $table) {
            $table->increments("ID_PhieuKham");
            $table->unsignedBigInteger("ID_TiepNhan");
            $table->foreign("ID_TiepNhan")->references("ID_TiepNhan")->on("danh_sach_tiep_nhan");
            $table->string("CaKham", 10)->nullable(false);
            $table->string("TrieuChung", 255)->nullable(true);
            $table->unsignedBigInteger("ID_LoaiBenh");
            $table->foreign("ID_LoaiBenh")->references("id")->on("loai_benh");
            $table->decimal("TienKham", 10, 2)->nullable(true);
            $table->decimal("TongTienThuoc", 10, 2)->default(0);
            $table->boolean("Is_Deleted")->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phieu_kham');
    }
};

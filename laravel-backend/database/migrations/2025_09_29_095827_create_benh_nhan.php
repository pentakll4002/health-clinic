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
        Schema::create('benh_nhan', function (Blueprint $table) {
            $table->increments("ID_BenhNhan");
            $table->string("HoTenBN", 100)->nullable(false);
            $table->date("NgaySinh")->nullable(false);
            $table->string("GioiTinh", 10)->nullable(false);
            $table->string("CCCD", 20)->unique()->nullable(false);
            $table->string("DienThoai", 15)->unique()->nullable(false);
            $table->string("DiaChi", 500)->nullable(false);
            $table->string("Email", 255)->unique()->nullable(false);
            $table->boolean("Is_Deleted")->default(0);
            $table->date("NgayDK")->nullable(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('benh_nhan');
    }
};

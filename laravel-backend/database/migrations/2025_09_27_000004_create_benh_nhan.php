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
            $table->date("NgaySinh")->nullable();
            $table->string("GioiTinh", 10)->nullable();
            $table->string("CCCD", 20)->unique()->nullable();
            $table->string("DienThoai", 15)->unique()->nullable();
            $table->string("DiaChi", 500)->nullable();
            $table->string("Email", 255)->unique()->nullable(false);
            $table->boolean("Is_Deleted")->default(0);
            $table->date("NgayDK")->nullable(false);
            $table->unsignedBigInteger('user_id')->unique();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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

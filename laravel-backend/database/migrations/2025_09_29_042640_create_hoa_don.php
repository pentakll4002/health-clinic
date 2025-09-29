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
        Schema::create('hoa_don', function (Blueprint $table) {
            $table->increments("ID_HoaDon");
            $table->unsignedInteger("ID_PhieuKham");
            $table->foreign("ID_PhieuKham")->references("ID_PhieuKham")->on("phieu_kham");
            $table->date("NgayHoaDon")->nullable(false);
            $table->decimal("TienKham", 10, 2)->nullable(true);
            $table->decimal("TienThuoc", 10, 2)->nullable(true);
            $table->decimal("TongTien", 10, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hoa_don');
    }
};

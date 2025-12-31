<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lich_kham', function (Blueprint $table) {
            $table->unsignedInteger('ID_BacSi')->nullable()->after('ID_BenhNhan');
            $table->foreign('ID_BacSi')->references('ID_NhanVien')->on('nhan_vien');
        });
    }

    public function down(): void
    {
        Schema::table('lich_kham', function (Blueprint $table) {
            $table->dropForeign(['ID_BacSi']);
            $table->dropColumn('ID_BacSi');
        });
    }
};

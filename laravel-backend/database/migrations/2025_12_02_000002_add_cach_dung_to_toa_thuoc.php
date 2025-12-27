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
        Schema::table('toa_thuoc', function (Blueprint $table) {
            // Thêm CachDung (cách dùng thuốc cho toa này - có thể khác với cách dùng mặc định của thuốc)
            $table->string('CachDung', 255)->nullable()->after('SoLuong');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('toa_thuoc', function (Blueprint $table) {
            $table->dropColumn('CachDung');
        });
    }
};











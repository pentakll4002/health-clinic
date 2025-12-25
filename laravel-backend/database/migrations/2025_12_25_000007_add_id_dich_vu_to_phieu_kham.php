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
            $table->unsignedInteger('ID_DichVu')->nullable()->after('ID_LoaiBenh');
            $table->foreign('ID_DichVu')->references('ID_DichVu')->on('dich_vu');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('phieu_kham', function (Blueprint $table) {
            $table->dropForeign(['ID_DichVu']);
            $table->dropColumn(['ID_DichVu']);
        });
    }
};

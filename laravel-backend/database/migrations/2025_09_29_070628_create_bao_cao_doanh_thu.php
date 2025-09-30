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
        Schema::create('bao_cao_doanh_thu', function (Blueprint $table) {
            $table->increments("ID_BCDT");
            $table->integer("Thang")->nullable(false);
            $table->integer("Nam")->nullable(false);
            $table->decimal("TongDoanhThu", 10, 2)->nullable(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bao_cao_doanh_thu');
    }
};

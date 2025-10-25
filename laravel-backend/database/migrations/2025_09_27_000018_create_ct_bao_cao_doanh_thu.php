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
        Schema::create('ct_bao_cao_doanh_thu', function (Blueprint $table) {
            $table->increments("ID_CTBCDT");
            $table->integer("Ngay")->nullable(false);
            $table->integer("SoBenhNhan")->nullable(false);
            $table->decimal("DoanhThu", 10, 2)->nullable(false);
            $table->decimal("TyLe", 5, 2)->nullable(false);
            $table->unsignedInteger("ID_BCDT");
            $table->foreign("ID_BCDT")->references("ID_BCDT")->on("bao_cao_doanh_thu");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ct_bao_cao_doanh_thu');
    }
};

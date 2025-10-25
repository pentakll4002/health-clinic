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
        Schema::create('phan_quyen', function (Blueprint $table) {
            $table->unsignedInteger("ID_Nhom");
            $table->unsignedInteger("ID_ChucNang");
            $table->primary(["ID_Nhom", "ID_ChucNang"]);
            $table->foreign("ID_Nhom")->references("ID_Nhom")->on("nhom_nguoi_dung");
            $table->foreign("ID_ChucNang")->references("ID_ChucNang")->on("chuc_nang");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phan_quyen');
    }
};

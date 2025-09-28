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
        Schema::create('nhom_nguoi_dung', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("ID_Nhom");
            $table->timestamps();
            $table->foreign("ID_Nhom")->references("id")->on("nhom");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nhom_nguoi_dung');
    }
};

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
        Schema::create('lich_kham', function (Blueprint $table) {
            $table->increments('ID_LichKham');
            $table->unsignedInteger('ID_BenhNhan');
            $table->foreign('ID_BenhNhan')->references('ID_BenhNhan')->on('benh_nhan')->onDelete('cascade');
            $table->date('NgayKhamDuKien')->nullable(false);
            $table->string('CaKham', 20)->nullable(false);
            $table->enum('TrangThai', ['ChoXacNhan', 'DaXacNhan', 'Huy'])->default('ChoXacNhan');
            $table->text('GhiChu')->nullable();
            $table->boolean('Is_Deleted')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lich_kham');
    }
};






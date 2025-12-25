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
        Schema::create('ct_phieu_kham_dich_vu', function (Blueprint $table) {
            $table->increments('ID_CT');
            $table->unsignedInteger('ID_PhieuKham');
            $table->unsignedInteger('ID_DichVu');
            $table->integer('SoLuong')->default(1);
            $table->decimal('DonGiaApDung', 10, 2);
            $table->decimal('ThanhTien', 10, 2);
            $table->boolean('Is_Deleted')->default(false);
            $table->timestamps();

            $table->foreign('ID_PhieuKham')->references('ID_PhieuKham')->on('phieu_kham');
            $table->foreign('ID_DichVu')->references('ID_DichVu')->on('dich_vu');

            $table->unique(['ID_PhieuKham', 'ID_DichVu']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ct_phieu_kham_dich_vu');
    }
};

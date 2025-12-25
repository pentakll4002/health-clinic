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
        Schema::create('dich_vu', function (Blueprint $table) {
            $table->increments('ID_DichVu');
            $table->string('TenDichVu', 255)->nullable(false);
            $table->decimal('DonGia', 10, 2)->nullable(false);
            $table->boolean('Is_Deleted')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dich_vu');
    }
};

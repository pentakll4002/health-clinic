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
        Schema::create('qui_dinh', function (Blueprint $table) {
            $table->increments("ID_QuyDinh");
            $table->string("TenQuyDinh", 100)->unique()->nullable(false);
            $table->decimal("GiaTri", 10, 2)->nullable(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qui_dinh');
    }
};

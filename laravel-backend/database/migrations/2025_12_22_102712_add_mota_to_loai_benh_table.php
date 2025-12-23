<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('loai_benh', function (Blueprint $table) {
            $table->string('MoTa')->nullable()->after('TenLoaiBenh');
            $table->timestamps();
        });
    }
    public function down()
    {
        Schema::table('loai_benh', function (Blueprint $table) {
            $table->dropColumn('MoTa');
            $table->dropTimestamps();
        });
    }
};

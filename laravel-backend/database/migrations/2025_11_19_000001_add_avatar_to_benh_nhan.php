<?php

use Illuminate\Database\Migrations\Migration;
<<<<<<< HEAD
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('benh_nhan', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('HoTenBN');
        });
    }

    public function down(): void
    {
        Schema::table('benh_nhan', function (Blueprint $table) {
            $table->dropColumn('avatar');
        });
    }
=======

return new class extends Migration
{
    public function up(): void {}

    public function down(): void {}
>>>>>>> 02075ae0e4d568e8f8db04bc53927e1e7039bd00
};

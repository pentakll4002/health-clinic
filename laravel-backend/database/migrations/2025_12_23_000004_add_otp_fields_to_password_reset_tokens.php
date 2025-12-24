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
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->string('ho_ten')->nullable();
            $table->string('mat_khau')->nullable();
            $table->string('otp', 6)->nullable();
            $table->timestamp('otp_het_han')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->dropColumn(['ho_ten', 'mat_khau', 'otp', 'otp_het_han']);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Deprecated: This migration was replaced by adding OTP fields to password_reset_tokens table.
     * See migration: 2025_12_23_000004_add_otp_fields_to_password_reset_tokens.php
     */
    public function up(): void
    {
        // This migration is deprecated and no longer used.
    }

    public function down(): void
    {
        // No action needed.
    }
};

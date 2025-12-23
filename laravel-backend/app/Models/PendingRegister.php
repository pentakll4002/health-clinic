<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendingRegister extends Model
{
    protected $table = 'dang_ky_tam_thoi';
    protected $guarded = [];
    public $timestamps = true;

    protected $fillable = [
        'ho_ten',
        'email',
        'mat_khau',
        'otp',
        'otp_het_han',
    ];
}


































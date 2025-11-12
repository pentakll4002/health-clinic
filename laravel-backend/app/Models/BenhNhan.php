<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BenhNhan extends Model
{
    use HasFactory;

    protected $table = 'benh_nhan';
    protected $primaryKey = 'ID_BenhNhan';
    public $timestamps = false;

    protected $fillable = [
        'HoTenBN',
        'NgaySinh',
        'GioiTinh',
        'CCCD',
        'DienThoai',
        'DiaChi',
        'Email',
        'Is_Deleted',
        'NgayDK',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}





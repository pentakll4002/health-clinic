<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NhanVien extends Model
{
    use HasFactory;

    protected $table = 'nhan_vien';
    protected $primaryKey = 'ID_NhanVien';
    public $timestamps = false;

    protected $fillable = [
        'HoTenNV',
        'NgaySinh',
        'GioiTinh',
        'CCCD',
        'DienThoai',
        'DiaChi',
        'Email',
        'HinhAnh',
        'TrangThai',
        'ID_Nhom',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}






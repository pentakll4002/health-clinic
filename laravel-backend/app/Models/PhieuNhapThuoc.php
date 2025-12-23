<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhieuNhapThuoc extends Model
{
    use HasFactory;

    protected $table = 'phieu_nhap_thuoc';
    protected $primaryKey = 'ID_PhieuNhapThuoc';
    public $timestamps = false;

    protected $fillable = [
        'ID_NhanVien',
        'NgayNhap',
        'TongTienNhap',
    ];
    
    public function nhanVien()
    {
        return $this->belongsTo(NhanVien::class, 'ID_NhanVien', 'ID_NhanVien');
    }

    protected $casts = [
        'NgayNhap' => 'datetime',
        'TongTienNhap' => 'decimal:2',
    ];

    public function chiTiet()
    {
        return $this->hasMany(ChiTietPhieuNhapThuoc::class, 'ID_PhieuNhapThuoc', 'ID_PhieuNhapThuoc');
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HoaDon extends Model
{
    use HasFactory;

    protected $table = 'hoa_don';
    protected $primaryKey = 'ID_HoaDon';
    public $timestamps = false;

    protected $fillable = [
        'ID_PhieuKham',
        'ID_NhanVien',
        'NgayHoaDon',
        'TienKham',
        'TienThuoc',
        'TienDichVu',
        'TongTien',
    ];

    protected $casts = [
        'NgayHoaDon' => 'date',
        'TienKham' => 'decimal:2',
        'TienThuoc' => 'decimal:2',
        'TienDichVu' => 'decimal:2',
        'TongTien' => 'decimal:2',
    ];

    public function nhanVien()
    {
        return $this->belongsTo(NhanVien::class, 'ID_NhanVien', 'ID_NhanVien');
    }

    public function phieuKham()
    {
        return $this->belongsTo(\App\Models\PhieuKham::class, 'ID_PhieuKham', 'ID_PhieuKham');
    }
}



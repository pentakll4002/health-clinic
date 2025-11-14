<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChiTietPhieuNhapThuoc extends Model
{
    use HasFactory;

    protected $table = 'chi_tiet_phieu_nhap_thuoc';
    protected $primaryKey = ['ID_PhieuNhapThuoc', 'ID_Thuoc'];
    public $incrementing = false;
    public $timestamps = true;

    protected $fillable = [
        'ID_PhieuNhapThuoc',
        'ID_Thuoc',
        'HanSuDung',
        'SoLuongNhap',
        'DonGiaNhap',
        'ThanhTien',
    ];

    protected $casts = [
        'ID_PhieuNhapThuoc' => 'integer',
        'ID_Thuoc' => 'integer',
        'HanSuDung' => 'date',
        'SoLuongNhap' => 'integer',
        'DonGiaNhap' => 'decimal:2',
        'ThanhTien' => 'decimal:2',
    ];

    public function phieuNhapThuoc()
    {
        return $this->belongsTo(PhieuNhapThuoc::class, 'ID_PhieuNhapThuoc', 'ID_PhieuNhapThuoc');
    }

    public function thuoc()
    {
        return $this->belongsTo(Thuoc::class, 'ID_Thuoc', 'ID_Thuoc');
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DanhSachTiepNhan extends Model
{
    use HasFactory;

    protected $table = 'danh_sach_tiep_nhan';
    protected $primaryKey = 'ID_TiepNhan';
    public $timestamps = false;

    protected $fillable = [
        'ID_BenhNhan',
        'NgayTN',
        'CaTN',
        'ID_NhanVien',
        'Is_Deleted',
        'TrangThai',
    ];

    protected $casts = [
        'NgayTN' => 'datetime',
        'Is_Deleted' => 'boolean',
        'TrangThai' => 'boolean',
    ];

    public function benhNhan()
    {
        return $this->belongsTo(BenhNhan::class, 'ID_BenhNhan', 'ID_BenhNhan');
    }

    public function nhanVien()
    {
        return $this->belongsTo(NhanVien::class, 'ID_NhanVien', 'ID_NhanVien');
    }

    public function phieuKhams()
    {
        return $this->hasMany(PhieuKham::class, 'ID_TiepNhan', 'ID_TiepNhan');
    }
}


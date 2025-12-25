<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhieuKham extends Model
{
    use HasFactory;

    protected $table = 'phieu_kham';
    protected $primaryKey = 'ID_PhieuKham';
    public $timestamps = true;

    protected $fillable = [
        'ID_TiepNhan',
        'ID_BacSi',
        'CaKham',
        'TrieuChung',
        'ChanDoan',
        'ID_LoaiBenh',
        'ID_DichVu',
        'TienKham',
        'TongTienThuoc',
        'TrangThai',
        'Is_Deleted',
    ];

    protected $casts = [
        'TienKham' => 'decimal:2',
        'TongTienThuoc' => 'decimal:2',
        'Is_Deleted' => 'boolean',
    ];
    
    public function bacSi()
    {
        return $this->belongsTo(NhanVien::class, 'ID_BacSi', 'ID_NhanVien');
    }

    public function tiepNhan()
    {
        return $this->belongsTo(DanhSachTiepNhan::class, 'ID_TiepNhan', 'ID_TiepNhan');
    }

    public function loaiBenh()
    {
        return $this->belongsTo(LoaiBenh::class, 'ID_LoaiBenh', 'ID_LoaiBenh');
    }

    public function dichVu()
    {
        return $this->belongsTo(DichVu::class, 'ID_DichVu', 'ID_DichVu');
    }

    public function ctDichVuPhu()
    {
        return $this->hasMany(CtPhieuKhamDichVu::class, 'ID_PhieuKham', 'ID_PhieuKham')
            ->where('Is_Deleted', false);
    }

    public function toaThuoc()
    {
        return $this->hasMany(ToaThuoc::class, 'ID_PhieuKham', 'ID_PhieuKham');
    }

    public function hoaDon()
    {
        return $this->hasOne(HoaDon::class, 'ID_PhieuKham', 'ID_PhieuKham');
    }
}





























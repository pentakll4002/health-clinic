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
        'CaKham',
        'TrieuChung',
        'ID_LoaiBenh',
        'TienKham',
        'TongTienThuoc',
        'Is_Deleted',
    ];

    protected $casts = [
        'TienKham' => 'decimal:2',
        'TongTienThuoc' => 'decimal:2',
        'Is_Deleted' => 'boolean',
    ];

    public function tiepNhan()
    {
        return $this->belongsTo(DanhSachTiepNhan::class, 'ID_TiepNhan', 'ID_TiepNhan');
    }

    public function loaiBenh()
    {
        return $this->belongsTo(LoaiBenh::class, 'ID_LoaiBenh', 'ID_LoaiBenh');
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













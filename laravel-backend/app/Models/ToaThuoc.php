<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToaThuoc extends Model
{
    use HasFactory;

    protected $table = 'toa_thuoc';
    protected $primaryKey = ['ID_PhieuKham', 'ID_Thuoc'];
    public $incrementing = false;
    public $timestamps = true;

    protected $fillable = [
        'ID_PhieuKham',
        'ID_Thuoc',
        'SoLuong',
        'DonGiaBan_LuocMua',
        'TienThuoc',
    ];

    protected $casts = [
        'SoLuong' => 'integer',
        'DonGiaBan_LuocMua' => 'decimal:2',
        'TienThuoc' => 'decimal:2',
    ];

    public function phieuKham()
    {
        return $this->belongsTo(PhieuKham::class, 'ID_PhieuKham', 'ID_PhieuKham');
    }

    public function thuoc()
    {
        return $this->belongsTo(Thuoc::class, 'ID_Thuoc', 'ID_Thuoc');
    }
}


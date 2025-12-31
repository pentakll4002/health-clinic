<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LichKham extends Model
{
    use HasFactory;

    protected $table = 'lich_kham';
    protected $primaryKey = 'ID_LichKham';
    public $timestamps = true;

    protected $fillable = [
        'ID_BenhNhan',
        'ID_BacSi',
        'NgayKhamDuKien',
        'CaKham',
        'TrangThai',
        'GhiChu',
        'Is_Deleted',
    ];

    protected $casts = [
        'NgayKhamDuKien' => 'date',
        'Is_Deleted' => 'boolean',
    ];

    public function benhNhan()
    {
        return $this->belongsTo(BenhNhan::class, 'ID_BenhNhan', 'ID_BenhNhan');
    }

    public function bacSi()
    {
        return $this->belongsTo(NhanVien::class, 'ID_BacSi', 'ID_NhanVien');
    }
}
















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
}















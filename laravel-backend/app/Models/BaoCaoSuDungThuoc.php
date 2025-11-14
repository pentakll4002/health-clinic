<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BaoCaoSuDungThuoc extends Model
{
    use HasFactory;

    protected $table = 'bao_cao_su_dung_thuoc';
    protected $primaryKey = 'ID_BCSDT';
    public $timestamps = false;

    protected $fillable = [
        'Thang',
        'Nam',
        'ID_Thuoc',
        'TongSoLuongNhap',
        'SoLuongDung',
        'SoLanDung',
    ];

    protected $casts = [
        'Thang' => 'integer',
        'Nam' => 'integer',
        'ID_Thuoc' => 'integer',
        'TongSoLuongNhap' => 'integer',
        'SoLuongDung' => 'integer',
        'SoLanDung' => 'integer',
    ];

    public function thuoc()
    {
        return $this->belongsTo(Thuoc::class, 'ID_Thuoc', 'ID_Thuoc');
    }
}


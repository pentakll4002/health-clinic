<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChiTietBaoCaoDoanhThu extends Model
{
    use HasFactory;

    protected $table = 'ct_bao_cao_doanh_thu';
    protected $primaryKey = 'ID_CTBCDT';
    public $timestamps = false;

    protected $fillable = [
        'ID_BCDT',
        'Ngay',
        'SoBenhNhan',
        'DoanhThu',
        'TyLe',
    ];

    protected $casts = [
        'ID_BCDT' => 'integer',
        'Ngay' => 'integer',
        'SoBenhNhan' => 'integer',
        'DoanhThu' => 'decimal:2',
        'TyLe' => 'decimal:2',
    ];

    public function baoCaoDoanhThu()
    {
        return $this->belongsTo(BaoCaoDoanhThu::class, 'ID_BCDT', 'ID_BCDT');
    }
}


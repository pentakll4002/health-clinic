<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BaoCaoDoanhThu extends Model
{
    use HasFactory;

    protected $table = 'bao_cao_doanh_thu';
    protected $primaryKey = 'ID_BCDT';
    public $timestamps = false;

    protected $fillable = [
        'Thang',
        'Nam',
        'TongDoanhThu',
    ];

    protected $casts = [
        'Thang' => 'integer',
        'Nam' => 'integer',
        'TongDoanhThu' => 'decimal:2',
    ];

    public function chiTiet()
    {
        return $this->hasMany(ChiTietBaoCaoDoanhThu::class, 'ID_BCDT', 'ID_BCDT');
    }
}


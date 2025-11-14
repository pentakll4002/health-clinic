<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Thuoc extends Model
{
    use HasFactory;

    protected $table = 'thuoc';
    protected $primaryKey = 'ID_Thuoc';
    public $timestamps = true;

    protected $fillable = [
        'TenThuoc',
        'ID_DVT',
        'ID_CachDung',
        'ThanhPhan',
        'XuatXu',
        'SoLuongTon',
        'DonGiaNhap',
        'HinhAnh',
        'TyLeGiaBan',
        'DonGiaBan',
        'Is_Deleted',
    ];

    protected $casts = [
        'SoLuongTon' => 'integer',
        'DonGiaNhap' => 'decimal:2',
        'TyLeGiaBan' => 'decimal:2',
        'DonGiaBan' => 'decimal:2',
        'Is_Deleted' => 'boolean',
    ];

    public function dvt()
    {
        return $this->belongsTo(DVT::class, 'ID_DVT', 'ID_DVT');
    }

    public function cachDung()
    {
        return $this->belongsTo(CachDung::class, 'ID_CachDung', 'ID_CachDung');
    }
}


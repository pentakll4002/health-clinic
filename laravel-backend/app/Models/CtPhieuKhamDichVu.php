<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CtPhieuKhamDichVu extends Model
{
    use HasFactory;

    protected $table = 'ct_phieu_kham_dich_vu';
    protected $primaryKey = 'ID_CT';

    protected $fillable = [
        'ID_PhieuKham',
        'ID_DichVu',
        'SoLuong',
        'DonGiaApDung',
        'ThanhTien',
        'Is_Deleted',
    ];

    protected $casts = [
        'SoLuong' => 'integer',
        'DonGiaApDung' => 'decimal:2',
        'ThanhTien' => 'decimal:2',
        'Is_Deleted' => 'boolean',
    ];

    public function phieuKham()
    {
        return $this->belongsTo(PhieuKham::class, 'ID_PhieuKham', 'ID_PhieuKham');
    }

    public function dichVu()
    {
        return $this->belongsTo(DichVu::class, 'ID_DichVu', 'ID_DichVu');
    }
}

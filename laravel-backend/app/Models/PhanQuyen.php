<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhanQuyen extends Model
{
    use HasFactory;

    protected $table = 'phan_quyen';
    public $incrementing = false;
    public $timestamps = true;

    protected $fillable = [
        'ID_Nhom',
        'ID_ChucNang',
    ];

    public function nhomNguoiDung()
    {
        return $this->belongsTo(NhomNguoiDung::class, 'ID_Nhom', 'ID_Nhom');
    }

    public function chucNang()
    {
        return $this->belongsTo(ChucNang::class, 'ID_ChucNang', 'ID_ChucNang');
    }

    /**
     * Tìm theo composite key
     */
    public static function findByCompositeKey($idNhom, $idChucNang)
    {
        return static::where('ID_Nhom', $idNhom)
            ->where('ID_ChucNang', $idChucNang)
            ->first();
    }
}


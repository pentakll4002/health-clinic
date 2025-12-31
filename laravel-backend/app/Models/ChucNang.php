<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChucNang extends Model
{
    use HasFactory;

    protected $table = 'chuc_nang';
    protected $primaryKey = 'ID_ChucNang';
    public $timestamps = false;

    protected $fillable = [
        'TenChucNang',
        'TenManHinhTuongUong',
    ];

    public function nhomNguoiDungs()
    {
        return $this->belongsToMany(NhomNguoiDung::class, 'phan_quyen', 'ID_ChucNang', 'ID_Nhom');
    }
}


























<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NhomNguoiDung extends Model
{
    use HasFactory;

    protected $table = 'nhom_nguoi_dung';
    protected $primaryKey = 'ID_Nhom';
    public $timestamps = false;

    protected $fillable = [
        'TenNhom',
        'MaNhom',
    ];

    public function nhanViens()
    {
        return $this->hasMany(NhanVien::class, 'ID_Nhom', 'ID_Nhom');
    }

    public function phanQuyens()
    {
        return $this->hasMany(PhanQuyen::class, 'ID_Nhom', 'ID_Nhom');
    }

    public function chucNangs()
    {
        return $this->belongsToMany(ChucNang::class, 'phan_quyen', 'ID_Nhom', 'ID_ChucNang');
    }
}






















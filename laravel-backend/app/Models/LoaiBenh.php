<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoaiBenh extends Model
{
    use HasFactory;

    protected $table = 'loai_benh';
    protected $primaryKey = 'ID_LoaiBenh';
    public $timestamps = false;

    protected $fillable = [
        'TenLoaiBenh',
        'TrieuChung',
        'HuongDieuTri',
    ];

    public function phieuKham()
    {
        return $this->hasMany(PhieuKham::class, 'ID_LoaiBenh', 'ID_LoaiBenh');
    }
}














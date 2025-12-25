<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DichVu extends Model
{
    use HasFactory;

    protected $table = 'dich_vu';
    protected $primaryKey = 'ID_DichVu';
    public $timestamps = true;

    protected $fillable = [
        'TenDichVu',
        'DonGia',
        'Is_Deleted',
    ];

    protected $casts = [
        'DonGia' => 'decimal:2',
        'Is_Deleted' => 'boolean',
    ];
}

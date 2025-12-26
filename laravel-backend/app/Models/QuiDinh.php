<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuiDinh extends Model
{
    use HasFactory;

    protected $table = 'qui_dinh';
    protected $primaryKey = 'ID_QuyDinh';
    public $timestamps = false;

    protected $fillable = [
        'TenQuyDinh',
        'GiaTri',
    ];

    protected $casts = [
        'GiaTri' => 'decimal:2',
    ];

    public static function getValue(string $tenQuyDinh, $default = null)
    {
        return static::query()
            ->where('TenQuyDinh', $tenQuyDinh)
            ->value('GiaTri') ?? $default;
    }
}








































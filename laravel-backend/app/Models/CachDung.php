<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CachDung extends Model
{
    use HasFactory;

    protected $table = 'cach_dung';
    protected $primaryKey = 'ID_CachDung';
    public $timestamps = false;

    protected $fillable = [
        'MoTaCachDung',
    ];

    public function thuoc()
    {
        return $this->hasMany(Thuoc::class, 'ID_CachDung', 'ID_CachDung');
    }
}


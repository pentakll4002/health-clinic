<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DVT extends Model
{
    use HasFactory;

    protected $table = 'dvt';
    protected $primaryKey = 'ID_DVT';
    public $timestamps = false;

    protected $fillable = [
        'TenDVT',
    ];

    public function thuoc()
    {
        return $this->hasMany(Thuoc::class, 'ID_DVT', 'ID_DVT');
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendingRegister extends Model
{
    protected $table = 'pending_registers';
    protected $guarded = [];
    public $timestamps = true;
}


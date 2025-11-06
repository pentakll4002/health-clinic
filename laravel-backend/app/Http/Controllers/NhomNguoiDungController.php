<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NhomNguoiDungController extends Controller
{
    public function index()
    {
        $groups = DB::table('nhom_nguoi_dung')->get();
        return response()->json($groups);
    }
}

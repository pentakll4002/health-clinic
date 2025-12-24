<?php

namespace App\Http\Controllers;

use App\Models\LoaiBenh;
use Illuminate\Http\Request;

class LoaiBenhController extends Controller
{
    public function index(Request $request)
    {
        $query = LoaiBenh::query();

        $totalCount = $query->count();
        $data = $query->get();

        return response()->json([
            'data' => $data,
            'totalCount' => $totalCount,
        ]);
    }
}





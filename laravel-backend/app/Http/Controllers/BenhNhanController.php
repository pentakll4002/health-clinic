<?php

namespace App\Http\Controllers;

use App\Models\BenhNhan;
use Illuminate\Http\Request;

class BenhNhanController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 100);
        $page = $request->get('page', 1);
        $query = BenhNhan::where('Is_Deleted', false);

        $totalCount = $query->count();
        $data = $query->offset(($page - 1) * $limit)->limit($limit)->get();

        return response()->json([
            'data' => $data,
            'totalCount' => $totalCount,
        ]);
    }
}


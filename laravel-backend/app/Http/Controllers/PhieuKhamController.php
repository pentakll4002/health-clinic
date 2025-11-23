<?php

namespace App\Http\Controllers;

use App\Models\PhieuKham;
use Illuminate\Http\Request;

class PhieuKhamController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int) $request->get('limit', 15);
        $page = (int) $request->get('page', 1);
        $onlyWithoutInvoice = filter_var($request->get('only_without_invoice', false), FILTER_VALIDATE_BOOLEAN);

        $query = PhieuKham::with(['toaThuoc', 'hoaDon'])
            ->where('Is_Deleted', false);

        if ($onlyWithoutInvoice) {
            $query->whereDoesntHave('hoaDon');
        }

        $totalCount = $query->count();
        $records = $query
            ->orderByDesc('ID_PhieuKham')
            ->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $records,
            'totalCount' => $totalCount,
        ]);
    }

    public function show($id)
    {
        $phieuKham = PhieuKham::with(['toaThuoc.thuoc', 'hoaDon'])->find($id);
        if (!$phieuKham || $phieuKham->Is_Deleted) {
            return response()->json(['message' => 'Không tìm thấy phiếu khám'], 404);
        }

        return response()->json($phieuKham);
    }
}



















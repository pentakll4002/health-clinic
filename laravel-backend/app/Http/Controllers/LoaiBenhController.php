<?php

namespace App\Http\Controllers;

use App\Models\LoaiBenh;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'TenLoaiBenh' => 'required|string|max:255',
            'TrieuChung' => 'nullable|string|max:255',
            'HuongDieuTri' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $record = LoaiBenh::create($request->only(['TenLoaiBenh', 'TrieuChung', 'HuongDieuTri']));

        return response()->json([
            'message' => 'Tạo loại bệnh thành công',
            'data' => $record,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $record = LoaiBenh::find($id);
        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy loại bệnh'], 404);
        }

        $validator = Validator::make($request->all(), [
            'TenLoaiBenh' => 'sometimes|required|string|max:255',
            'TrieuChung' => 'nullable|string|max:255',
            'HuongDieuTri' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $record->fill($request->only(['TenLoaiBenh', 'TrieuChung', 'HuongDieuTri']));
        $record->save();

        return response()->json([
            'message' => 'Cập nhật loại bệnh thành công',
            'data' => $record,
        ]);
    }

    public function destroy($id)
    {
        $record = LoaiBenh::withCount('phieuKham')->find($id);
        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy loại bệnh'], 404);
        }

        if (($record->phieu_kham_count ?? 0) > 0) {
            return response()->json([
                'message' => 'Không thể xóa loại bệnh đang được sử dụng trong phiếu khám.',
            ], 400);
        }

        $record->delete();

        return response()->json(['message' => 'Xóa loại bệnh thành công']);
    }
}










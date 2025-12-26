<?php

namespace App\Http\Controllers;

use App\Models\ChucNang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChucNangController extends Controller
{
    public function index()
    {
        return response()->json(ChucNang::query()->orderBy('ID_ChucNang')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'TenChucNang' => 'required|string|max:255',
            'TenManHinhTuongUong' => 'required|string|max:255|unique:chuc_nang,TenManHinhTuongUong',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $record = ChucNang::create($request->only(['TenChucNang', 'TenManHinhTuongUong']));

        return response()->json([
            'message' => 'Tạo chức năng thành công',
            'data' => $record,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $record = ChucNang::find($id);
        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy chức năng'], 404);
        }

        $validator = Validator::make($request->all(), [
            'TenChucNang' => 'sometimes|required|string|max:255',
            'TenManHinhTuongUong' => 'sometimes|required|string|max:255|unique:chuc_nang,TenManHinhTuongUong,' . $record->ID_ChucNang . ',ID_ChucNang',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $record->fill($request->only(['TenChucNang', 'TenManHinhTuongUong']));
        $record->save();

        return response()->json([
            'message' => 'Cập nhật chức năng thành công',
            'data' => $record,
        ]);
    }

    public function destroy($id)
    {
        $record = ChucNang::find($id);
        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy chức năng'], 404);
        }

        $record->delete();

        return response()->json(['message' => 'Xóa chức năng thành công']);
    }
}

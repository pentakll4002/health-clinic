<?php

namespace App\Http\Controllers;

use App\Models\NhomNguoiDung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NhomNguoiDungController extends Controller
{
    public function index()
    {
        return response()->json(NhomNguoiDung::query()->orderBy('ID_Nhom')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'TenNhom' => 'required|string|max:255',
            'MaNhom' => 'required|string|max:255|unique:nhom_nguoi_dung,MaNhom',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $record = NhomNguoiDung::create($request->only(['TenNhom', 'MaNhom']));

        return response()->json([
            'message' => 'Tạo nhóm người dùng thành công',
            'data' => $record,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $record = NhomNguoiDung::find($id);
        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy nhóm người dùng'], 404);
        }

        $validator = Validator::make($request->all(), [
            'TenNhom' => 'sometimes|required|string|max:255',
            'MaNhom' => 'sometimes|required|string|max:255|unique:nhom_nguoi_dung,MaNhom,' . $record->ID_Nhom . ',ID_Nhom',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $record->fill($request->only(['TenNhom', 'MaNhom']));
        $record->save();

        return response()->json([
            'message' => 'Cập nhật nhóm người dùng thành công',
            'data' => $record,
        ]);
    }

    public function destroy($id)
    {
        $record = NhomNguoiDung::find($id);
        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy nhóm người dùng'], 404);
        }

        $record->delete();

        return response()->json(['message' => 'Xóa nhóm người dùng thành công']);
    }
}

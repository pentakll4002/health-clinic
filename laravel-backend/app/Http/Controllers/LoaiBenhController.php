<?php

namespace App\Http\Controllers;

use App\Models\LoaiBenh;
use Illuminate\Http\Request;

class LoaiBenhController extends Controller
{
    public function index(Request $request)
    {
        $loaiBenh = LoaiBenh::all();
        return response()->json($loaiBenh);
    }

    public function store(Request $request)
    {
        $request->validate([
            'TenLoaiBenh' => 'required|string|max:100',
            'TrieuChung' => 'nullable|string|max:255',
            'HuongDieuTri' => 'nullable|string|max:255',
        ]);

        $loaiBenh = LoaiBenh::create($request->all());

        return response()->json([
            'message' => 'Loại bệnh được tạo thành công',
            'loaiBenh' => $loaiBenh
        ], 201);
    }

    public function show($id)
    {
        $loaiBenh = LoaiBenh::find($id);
        if (!$loaiBenh) {
            return response()->json(['message' => 'Không tìm thấy loại bệnh'], 404);
        }
        return response()->json($loaiBenh);
    }

    public function update(Request $request, $id)
    {
        $loaiBenh = LoaiBenh::find($id);
        if (!$loaiBenh) {
            return response()->json(['message' => 'Không tìm thấy loại bệnh'], 404);
        }

        $request->validate([
            'TenLoaiBenh' => 'sometimes|required|string|max:100',
            'TrieuChung' => 'nullable|string|max:255',
            'HuongDieuTri' => 'nullable|string|max:255',
        ]);

        $loaiBenh->fill($request->all());
        $loaiBenh->save();

        return response()->json([
            'message' => 'Cập nhật thành công',
            'loaiBenh' => $loaiBenh
        ]);
    }

    public function destroy($id)
    {
        $loaiBenh = LoaiBenh::find($id);
        if (!$loaiBenh) {
            return response()->json(['message' => 'Không tìm thấy loại bệnh'], 404);
        }
        $loaiBenh->delete();
        return response()->json(['message' => 'Xoá thành công']);
    }
}


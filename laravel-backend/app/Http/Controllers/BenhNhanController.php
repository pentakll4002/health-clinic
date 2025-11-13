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

    public function show($id)
    {
        $benhNhan = BenhNhan::find($id);
        if (!$benhNhan) {
            return response()->json(['message' => 'Không tìm thấy bệnh nhân'], 404);
        }
        return response()->json($benhNhan);
    }

    public function store(Request $request)
    {
        $request->validate([
            'HoTenBN' => 'required|string|max:500',
            'NgaySinh' => 'required|date',
            'GioiTinh' => 'required|string|max:10',
            'CCCD' => 'nullable|string|max:25|unique:benh_nhan',
            'DienThoai' => 'nullable|string|max:15|unique:benh_nhan',
            'DiaChi' => 'nullable|string|max:500',
            'Email' => 'nullable|email|max:255|unique:benh_nhan',
            'NgayDK' => 'nullable|date',
        ]);

        $payload = $request->all();
        if (!isset($payload['NgayDK'])) {
            $payload['NgayDK'] = now()->toDateString();
        }

        $benhNhan = BenhNhan::create($payload);
        return response()->json([
            'message' => 'Tạo bệnh nhân thành công',
            'benh_nhan' => $benhNhan,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $benhNhan = BenhNhan::find($id);
        if (!$benhNhan) {
            return response()->json(['message' => 'Không tìm thấy bệnh nhân'], 404);
        }

        $request->validate([
            'HoTenBN' => 'sometimes|required|string|max:500',
            'NgaySinh' => 'sometimes|required|date',
            'GioiTinh' => 'sometimes|required|string|max:10',
            'CCCD' => 'nullable|string|max:25|unique:benh_nhan,CCCD,' . $id . ',ID_BenhNhan',
            'DienThoai' => 'nullable|string|max:15|unique:benh_nhan,DienThoai,' . $id . ',ID_BenhNhan',
            'DiaChi' => 'nullable|string|max:500',
            'Email' => 'nullable|email|max:255|unique:benh_nhan,Email,' . $id . ',ID_BenhNhan',
            'NgayDK' => 'nullable|date',
            'Is_Deleted' => 'nullable|boolean',
        ]);

        $benhNhan->fill($request->all());
        $benhNhan->save();

        return response()->json([
            'message' => 'Cập nhật bệnh nhân thành công',
            'benh_nhan' => $benhNhan,
        ]);
    }

    public function destroy($id)
    {
        $benhNhan = BenhNhan::find($id);
        if (!$benhNhan) {
            return response()->json(['message' => 'Không tìm thấy bệnh nhân'], 404);
        }

        $benhNhan->Is_Deleted = true;
        $benhNhan->save();

        return response()->json(['message' => 'Xoá bệnh nhân thành công']);
    }
}


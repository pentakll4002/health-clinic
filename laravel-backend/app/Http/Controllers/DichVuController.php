<?php

namespace App\Http\Controllers;

use App\Helpers\RoleHelper;
use App\Models\DichVu;
use Illuminate\Http\Request;

class DichVuController extends Controller
{
    public function index(Request $request)
    {
        $records = DichVu::query()
            ->where('Is_Deleted', false)
            ->orderBy('TenDichVu')
            ->get();

        return response()->json([
            'data' => $records,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!RoleHelper::canManagerManageDichVu($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền tạo dịch vụ.',
            ], 403);
        }

        $validated = $request->validate([
            'TenDichVu' => 'required|string|max:255',
            'DonGia' => 'required|numeric|min:0',
        ]);

        $dichVu = DichVu::create([
            'TenDichVu' => $validated['TenDichVu'],
            'DonGia' => $validated['DonGia'],
            'Is_Deleted' => false,
        ]);

        return response()->json([
            'message' => 'Tạo dịch vụ thành công',
            'data' => $dichVu,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!RoleHelper::canManagerManageDichVu($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền cập nhật dịch vụ.',
            ], 403);
        }

        $dichVu = DichVu::find($id);
        if (!$dichVu || $dichVu->Is_Deleted) {
            return response()->json([
                'message' => 'Không tìm thấy dịch vụ',
            ], 404);
        }

        $validated = $request->validate([
            'TenDichVu' => 'sometimes|required|string|max:255',
            'DonGia' => 'sometimes|required|numeric|min:0',
        ]);

        $dichVu->fill($validated);
        $dichVu->save();

        return response()->json([
            'message' => 'Cập nhật dịch vụ thành công',
            'data' => $dichVu,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!RoleHelper::canManagerManageDichVu($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền xoá dịch vụ.',
            ], 403);
        }

        $dichVu = DichVu::find($id);
        if (!$dichVu || $dichVu->Is_Deleted) {
            return response()->json([
                'message' => 'Không tìm thấy dịch vụ',
            ], 404);
        }

        $dichVu->Is_Deleted = true;
        $dichVu->save();

        return response()->json([
            'message' => 'Xoá dịch vụ thành công',
        ]);
    }
}

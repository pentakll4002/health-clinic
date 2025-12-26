<?php

namespace App\Http\Controllers;

use App\Models\CachDung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CachDungController extends Controller
{
    public function index()
    {
        return response()->json(CachDung::query()->orderBy('ID_CachDung')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'MoTaCachDung' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $record = CachDung::create($request->only(['MoTaCachDung']));

        return response()->json([
            'message' => 'Tạo cách dùng thành công',
            'data' => $record,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $record = CachDung::find($id);
        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy cách dùng'], 404);
        }

        $validator = Validator::make($request->all(), [
            'MoTaCachDung' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $record->MoTaCachDung = $request->MoTaCachDung;
        $record->save();

        return response()->json([
            'message' => 'Cập nhật cách dùng thành công',
            'data' => $record,
        ]);
    }

    public function destroy($id)
    {
        $record = CachDung::withCount('thuoc')->find($id);
        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy cách dùng'], 404);
        }

        if (($record->thuoc_count ?? 0) > 0) {
            return response()->json([
                'message' => 'Không thể xóa cách dùng đang được sử dụng bởi thuốc.',
            ], 400);
        }

        $record->delete();

        return response()->json(['message' => 'Xóa cách dùng thành công']);
    }
}

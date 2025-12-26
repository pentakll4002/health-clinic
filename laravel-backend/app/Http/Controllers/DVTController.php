<?php

namespace App\Http\Controllers;

use App\Models\DVT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DVTController extends Controller
{
    public function index()
    {
        return response()->json(DVT::query()->orderBy('ID_DVT')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'TenDVT' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $record = DVT::create($request->only(['TenDVT']));

        return response()->json([
            'message' => 'Tạo đơn vị tính thành công',
            'data' => $record,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $record = DVT::find($id);
        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy đơn vị tính'], 404);
        }

        $validator = Validator::make($request->all(), [
            'TenDVT' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $record->TenDVT = $request->TenDVT;
        $record->save();

        return response()->json([
            'message' => 'Cập nhật đơn vị tính thành công',
            'data' => $record,
        ]);
    }

    public function destroy($id)
    {
        $record = DVT::withCount('thuoc')->find($id);
        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy đơn vị tính'], 404);
        }

        if (($record->thuoc_count ?? 0) > 0) {
            return response()->json([
                'message' => 'Không thể xóa đơn vị tính đang được sử dụng bởi thuốc.',
            ], 400);
        }

        $record->delete();

        return response()->json(['message' => 'Xóa đơn vị tính thành công']);
    }
}

<?php

namespace App\Http\Controllers;

use App\Helpers\RoleHelper;
use App\Models\QuiDinh;
use Illuminate\Http\Request;

class QuiDinhController extends Controller
{
    private array $allowedKeys = [
        'SoBenhNhanToiDa',
        'TienKham',
        'TyLeGiaBan',
        'GioLamViec_Sang_BatDau',
        'GioLamViec_Sang_KetThuc',
        'GioLamViec_Chieu_BatDau',
        'GioLamViec_Chieu_KetThuc',
        'GioLamViec_Toi_BatDau',
        'GioLamViec_Toi_KetThuc',
    ];

    public function index()
    {
        return response()->json([
            'data' => $this->getRegulationData(),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        if (!RoleHelper::canManagerUpdateRegulations($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền cập nhật quy định.',
            ], 403);
        }

        $validated = $request->validate([
            'SoBenhNhanToiDa' => 'sometimes|required|integer|min:1|max:1000',
            'TienKham' => 'sometimes|required|numeric|min:0',
            'TyLeGiaBan' => 'sometimes|required|numeric|min:0|max:1000',
            'GioLamViec_Sang_BatDau' => 'sometimes|required|integer|min:0|max:1439',
            'GioLamViec_Sang_KetThuc' => 'sometimes|required|integer|min:0|max:1439',
            'GioLamViec_Chieu_BatDau' => 'sometimes|required|integer|min:0|max:1439',
            'GioLamViec_Chieu_KetThuc' => 'sometimes|required|integer|min:0|max:1439',
            'GioLamViec_Toi_BatDau' => 'sometimes|required|integer|min:0|max:1439',
            'GioLamViec_Toi_KetThuc' => 'sometimes|required|integer|min:0|max:1439',
        ]);

        if (empty($validated)) {
            return response()->json([
                'message' => 'Không có dữ liệu để cập nhật',
                'data' => $this->getRegulationData(),
            ], 422);
        }

        foreach ($validated as $key => $value) {
            if (!in_array($key, $this->allowedKeys, true)) {
                continue;
            }

            QuiDinh::updateOrCreate(
                ['TenQuyDinh' => $key],
                ['GiaTri' => $value]
            );
        }

        return response()->json([
            'message' => 'Cập nhật quy định thành công',
            'data' => $this->getRegulationData(),
        ]);
    }

    private function getRegulationData(): array
    {
        $records = QuiDinh::whereIn('TenQuyDinh', $this->allowedKeys)
            ->get()
            ->pluck('GiaTri', 'TenQuyDinh');

        $data = [];
        foreach ($this->allowedKeys as $key) {
            $value = $records->get($key);

            if ($key === 'SoBenhNhanToiDa') {
                $data[$key] = $value !== null ? (int) $value : null;
            } else {
                $data[$key] = $value !== null ? (float) $value : null;
            }
        }

        return $data;
    }
}



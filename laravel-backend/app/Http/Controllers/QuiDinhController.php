<?php

namespace App\Http\Controllers;

use App\Models\QuiDinh;
use Illuminate\Http\Request;

class QuiDinhController extends Controller
{
    private array $allowedKeys = [
        'SoBenhNhanToiDa',
        'TienKham',
        'TyLeGiaBan',
    ];

    public function index()
    {
        return response()->json([
            'data' => $this->getRegulationData(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'SoBenhNhanToiDa' => 'sometimes|required|integer|min:1|max:1000',
            'TienKham' => 'sometimes|required|numeric|min:0',
            'TyLeGiaBan' => 'sometimes|required|numeric|min:0|max:1000',
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



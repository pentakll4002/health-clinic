<?php

namespace App\Http\Controllers;

use App\Models\Thuoc;
use App\Models\DVT;
use App\Models\CachDung;
use App\Helpers\RoleHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThuocController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 7);
        $page = $request->get('page', 1);
        $keyword = $request->get('keyword') ?? $request->get('search') ?? $request->get('ten') ?? $request->get('name');
        
        $query = Thuoc::with(['dvt', 'cachDung'])
            ->where('Is_Deleted', false);

        // Tìm kiếm theo tên thuốc
        if ($keyword) {
            $query->where('TenThuoc', 'like', '%' . $keyword . '%');
        }

        $totalCount = $query->count();
        $data = $query->offset(($page - 1) * $limit)->limit($limit)->get();

        return response()->json([
            'data' => $data,
            'totalCount' => $totalCount,
        ]);
    }

    public function store(Request $request)
    {
        // Kiểm tra quyền: Chỉ quản lý và admin được nhập thuốc mới
        // Bác sĩ KHÔNG được nhập thuốc
        $user = $request->user();
        if (!RoleHelper::canManagerManageDrugs($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền nhập thuốc mới. Chỉ quản lý mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $request->validate([
            'TenThuoc' => 'required|string|max:100',
            'ID_DVT' => 'required|integer|exists:dvt,ID_DVT',
            'ID_CachDung' => 'required|integer|exists:cach_dung,ID_CachDung',
            'ThanhPhan' => 'nullable|string|max:255',
            'XuatXu' => 'nullable|string|max:100',
            'SoLuongTon' => 'nullable|integer|min:0',
            'DonGiaNhap' => 'nullable|numeric|min:0',
            'HinhAnh' => 'nullable|string|max:255',
            'TyLeGiaBan' => 'nullable|numeric|min:0',
            'DonGiaBan' => 'nullable|numeric|min:0',
        ]);

        $thuoc = Thuoc::create($request->all());

        return response()->json([
            'message' => 'Thuốc được tạo thành công',
            'thuoc' => $thuoc->load(['dvt', 'cachDung'])
        ], 201);
    }

    public function show($id)
    {
        $thuoc = Thuoc::with(['dvt', 'cachDung'])->find($id);
        if (!$thuoc) {
            return response()->json(['message' => 'Không tìm thấy thuốc'], 404);
        }
        return response()->json($thuoc);
    }

    public function update(Request $request, $id)
    {
        // Kiểm tra quyền: Chỉ quản lý và admin được cập nhật thuốc
        // Bác sĩ KHÔNG được sửa giá thuốc
        $user = $request->user();
        if (!RoleHelper::canManagerManageDrugs($user)) {
            return response()->json([
                'message' => 'Bạn không có quyền cập nhật thông tin thuốc. Chỉ quản lý mới được phép thực hiện chức năng này.',
            ], 403);
        }

        $thuoc = Thuoc::find($id);
        if (!$thuoc) {
            return response()->json(['message' => 'Không tìm thấy thuốc'], 404);
        }

        $request->validate([
            'TenThuoc' => 'sometimes|required|string|max:100',
            'ID_DVT' => 'sometimes|required|integer|exists:dvt,ID_DVT',
            'ID_CachDung' => 'sometimes|required|integer|exists:cach_dung,ID_CachDung',
            'ThanhPhan' => 'nullable|string|max:255',
            'XuatXu' => 'nullable|string|max:100',
            'SoLuongTon' => 'nullable|integer|min:0',
            'DonGiaNhap' => 'nullable|numeric|min:0',
            'HinhAnh' => 'nullable|string|max:255',
            'TyLeGiaBan' => 'nullable|numeric|min:0',
            'DonGiaBan' => 'nullable|numeric|min:0',
        ]);

        $thuoc->fill($request->all());
        $thuoc->save();

        return response()->json([
            'message' => 'Cập nhật thành công',
            'thuoc' => $thuoc->load(['dvt', 'cachDung'])
        ]);
    }

    public function destroy($id)
    {
        $thuoc = Thuoc::find($id);
        if (!$thuoc) {
            return response()->json(['message' => 'Không tìm thấy thuốc'], 404);
        }
        
        // Soft delete
        $thuoc->Is_Deleted = true;
        $thuoc->save();

        return response()->json(['message' => 'Xoá thành công']);
    }

    // Get DVT list
    public function getDVT()
    {
        $dvt = DVT::all();
        return response()->json($dvt);
    }

    // Get CachDung list
    public function getCachDung()
    {
        $cachDung = CachDung::all();
        return response()->json($cachDung);
    }
}


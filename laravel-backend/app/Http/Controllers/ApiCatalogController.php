<?php

namespace App\Http\Controllers;

use App\Helpers\RoleHelper;
use Illuminate\Http\Request;

class ApiCatalogController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!RoleHelper::hasRole($user, ['@managers', '@admin'])) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập danh sách API.',
            ], 403);
        }

        return response()->json([
            'roles' => [
                '@admin' => [
                    'description' => 'Toàn quyền hệ thống',
                ],
                '@managers' => [
                    'description' => 'Quản lý dịch vụ, thuốc, quy định, báo cáo',
                ],
                '@receptionists' => [
                    'description' => 'Tiếp nhận, lập hoá đơn, thao tác phiếu khám ở mức tạo ban đầu',
                ],
                '@doctors' => [
                    'description' => 'Khám bệnh, chọn dịch vụ, kê toa, hoàn tất khám, chọn dịch vụ phụ',
                ],
                '@patient' => [
                    'description' => 'Hồ sơ, lịch hẹn, hoá đơn, thông báo',
                ],
            ],
            'endpoints' => [
                '@managers' => [
                    [
                        'method' => 'GET',
                        'path' => '/dich-vu',
                        'purpose' => 'Xem danh sách dịch vụ',
                    ],
                    [
                        'method' => 'POST',
                        'path' => '/dich-vu',
                        'purpose' => 'Thêm dịch vụ + đơn giá',
                    ],
                    [
                        'method' => 'PUT',
                        'path' => '/dich-vu/{id}',
                        'purpose' => 'Sửa dịch vụ + đơn giá',
                    ],
                    [
                        'method' => 'DELETE',
                        'path' => '/dich-vu/{id}',
                        'purpose' => 'Xoá mềm dịch vụ',
                    ],
                    [
                        'method' => 'GET',
                        'path' => '/thuoc',
                        'purpose' => 'Xem danh sách thuốc',
                    ],
                    [
                        'method' => 'POST',
                        'path' => '/thuoc',
                        'purpose' => 'Thêm thuốc',
                    ],
                    [
                        'method' => 'PUT',
                        'path' => '/thuoc/{id}',
                        'purpose' => 'Sửa thuốc',
                    ],
                    [
                        'method' => 'DELETE',
                        'path' => '/thuoc/{id}',
                        'purpose' => 'Xoá thuốc',
                    ],
                    [
                        'method' => 'GET',
                        'path' => '/qui-dinh',
                        'purpose' => 'Xem quy định',
                    ],
                    [
                        'method' => 'PUT',
                        'path' => '/qui-dinh',
                        'purpose' => 'Cập nhật quy định',
                    ],
                    [
                        'method' => 'GET',
                        'path' => '/bao-cao-doanh-thu',
                        'purpose' => 'Xem báo cáo doanh thu',
                    ],
                    [
                        'method' => 'POST',
                        'path' => '/bao-cao-doanh-thu',
                        'purpose' => 'Lập báo cáo doanh thu',
                    ],
                    [
                        'method' => 'GET',
                        'path' => '/bao-cao-su-dung-thuoc',
                        'purpose' => 'Xem báo cáo sử dụng thuốc',
                    ],
                    [
                        'method' => 'POST',
                        'path' => '/bao-cao-su-dung-thuoc',
                        'purpose' => 'Lập báo cáo sử dụng thuốc',
                    ],
                ],
                '@receptionists' => [
                    [
                        'method' => 'GET',
                        'path' => '/appointments',
                        'purpose' => 'Danh sách tiếp nhận',
                    ],
                    [
                        'method' => 'POST',
                        'path' => '/appointments',
                        'purpose' => 'Tạo tiếp nhận',
                    ],
                    [
                        'method' => 'PUT',
                        'path' => '/appointments/{id}',
                        'purpose' => 'Cập nhật tiếp nhận/trạng thái',
                    ],
                    [
                        'method' => 'POST',
                        'path' => '/phieu-kham',
                        'purpose' => 'Tạo phiếu khám rỗng (chờ khám)',
                    ],
                    [
                        'method' => 'GET',
                        'path' => '/phieu-kham?only_completed=true&only_without_invoice=true',
                        'purpose' => 'Lấy danh sách phiếu khám đã khám để lập hoá đơn',
                    ],
                    [
                        'method' => 'GET',
                        'path' => '/invoices',
                        'purpose' => 'Danh sách hoá đơn',
                    ],
                    [
                        'method' => 'GET',
                        'path' => '/invoices/preview/{phieuKham}',
                        'purpose' => 'Xem trước tiền hoá đơn',
                    ],
                    [
                        'method' => 'POST',
                        'path' => '/invoices',
                        'purpose' => 'Lập hoá đơn',
                    ],
                ],
                '@doctors' => [
                    [
                        'method' => 'PUT',
                        'path' => '/phieu-kham/{id}',
                        'purpose' => 'Cập nhật nội dung khám + chọn dịch vụ',
                    ],
                    [
                        'method' => 'POST',
                        'path' => '/phieu-kham/{id}/toa-thuoc',
                        'purpose' => 'Thêm thuốc vào toa',
                    ],
                    [
                        'method' => 'PUT',
                        'path' => '/phieu-kham/{id}/toa-thuoc/{thuocId}',
                        'purpose' => 'Cập nhật thuốc trong toa',
                    ],
                    [
                        'method' => 'DELETE',
                        'path' => '/phieu-kham/{id}/toa-thuoc/{thuocId}',
                        'purpose' => 'Xoá thuốc khỏi toa',
                    ],
                    [
                        'method' => 'POST',
                        'path' => '/phieu-kham/{id}/dich-vu-phu',
                        'purpose' => 'Thêm dịch vụ phụ',
                    ],
                    [
                        'method' => 'PUT',
                        'path' => '/phieu-kham/{id}/dich-vu-phu/{dichVuId}',
                        'purpose' => 'Cập nhật số lượng dịch vụ phụ',
                    ],
                    [
                        'method' => 'DELETE',
                        'path' => '/phieu-kham/{id}/dich-vu-phu/{dichVuId}',
                        'purpose' => 'Xoá dịch vụ phụ',
                    ],
                    [
                        'method' => 'POST',
                        'path' => '/phieu-kham/{id}/complete',
                        'purpose' => 'Hoàn tất khám (DaKham)',
                    ],
                ],
                '@patient' => [
                    [
                        'method' => 'GET',
                        'path' => '/patient/profile',
                        'purpose' => 'Xem hồ sơ bệnh nhân',
                    ],
                    [
                        'method' => 'PATCH',
                        'path' => '/patient/profile',
                        'purpose' => 'Cập nhật hồ sơ bệnh nhân',
                    ],
                    [
                        'method' => 'GET',
                        'path' => '/patient/medical-records',
                        'purpose' => 'Lịch sử phiếu khám',
                    ],
                    [
                        'method' => 'GET',
                        'path' => '/patient/invoices',
                        'purpose' => 'Lịch sử hoá đơn',
                    ],
                    [
                        'method' => 'GET',
                        'path' => '/patient/appointments',
                        'purpose' => 'Lịch hẹn',
                    ],
                    [
                        'method' => 'POST',
                        'path' => '/patient/appointments',
                        'purpose' => 'Đặt lịch hẹn',
                    ],
                ],
            ],
        ]);
    }
}

# Hệ Thống Phân Quyền - Health Clinic Management System

## Tổng Quan
Hệ thống quản lý phòng khám sử dụng hệ thống phân quyền dựa trên nhóm người dùng và chức năng. Mỗi nhóm người dùng (role) có các quyền truy cập vào các chức năng cụ thể trong hệ thống.

## Các Nhóm Người Dùng (Roles)

### 1. Quản trị hệ thống (Admin) - @admin
- **Mã nhóm**: admin
- **Mô tả**: Có toàn quyền truy cập tất cả các chức năng trong hệ thống
- **Quyền**: Tất cả các chức năng

### 2. Bác sĩ (Doctors) - @doctors
- **Mã nhóm**: doctors
- **Mô tả**: Khám bệnh, kê toa, xem lịch sử bệnh án, tiếp nhận bệnh nhân
- **Quyền**:
  - Khám và chẩn đoán (examine-patients)
  - Kê đơn thuốc (prescribe-medicine)
  - Xem lịch sử bệnh án (view-medical-history)
  - Đăng ký bệnh nhân (register-patient)
  - Tiếp nhận bệnh nhân (intake-patient)
  - Đặt lịch hẹn (schedule-appointments)
  - Tra cứu bệnh nhân (search-patient)

### 3. Lễ tân – Thu ngân (Receptionists) - @receptionists
- **Mã nhóm**: receptionists
- **Mô tả**: Tiếp nhận bệnh nhân, lập và xử lý hóa đơn, bán thuốc
- **Quyền**:
  - Đăng ký bệnh nhân (register-patient)
  - Tiếp nhận bệnh nhân (intake-patient)
  - Đặt lịch hẹn (schedule-appointments)
  - Tra cứu bệnh nhân (search-patient)
  - Quản lý hóa đơn (manage-invoices)
  - Thanh toán hóa đơn (process-payments)
  - Bán thuốc theo đơn (dispense-medicine)
  - In hóa đơn (print-invoices)
  - Quản lý danh sách hóa đơn (invoice-list)

### 4. Quản lý (Managers) - @managers
- **Mã nhóm**: managers
- **Mô tả**: Báo cáo, cấu hình hệ thống, quản lý kho thuốc
- **Quyền**:
  - Nhập thuốc vào kho (import-inventory)
  - Quản lý tồn kho (manage-inventory)
  - Cảnh báo tồn kho (inventory-alerts)
  - Quản lý thuốc (manage-drugs)
  - Xem báo cáo doanh thu (view-revenue)
  - Quản lý báo cáo (manage-reports)
  - Giám sát hoạt động (monitor-operations)
  - Theo dõi hiệu suất (monitor-staff)

### 5. Bệnh nhân (Patient) - @patient
- **Mã nhóm**: patient
- **Mô tả**: Truy cập thông tin cá nhân, lịch sử khám bệnh, hóa đơn
- **Quyền**:
  - Xem lịch sử bệnh án (view-medical-history)
  - Quản lý danh sách hóa đơn (invoice-list)

## Danh Sách Chức Năng (Functions/Permissions)

### Quản lý Nhân sự
1. **Quản lý nhân viên** (manage-employees)
   - Màn hình tương ứng: manage-employees
   - Mô tả: Quản lý thông tin nhân viên trong hệ thống

2. **Phân quyền nhân viên** (manage-permissions)
   - Màn hình tương ứng: manage-permissions
   - Mô tả: Phân quyền và quản lý quyền truy cập cho nhân viên

### Quản lý Bệnh nhân
3. **Quản lý bệnh nhân** (manage-patients)
   - Màn hình tương ứng: manage-patients
   - Mô tả: Quản lý thông tin bệnh nhân

4. **Đăng ký bệnh nhân** (register-patient)
   - Màn hình tương ứng: register-patient
   - Mô tả: Đăng ký thông tin bệnh nhân mới

5. **Tiếp nhận bệnh nhân** (intake-patient)
   - Màn hình tương ứng: intake-patient
   - Mô tả: Tiếp nhận và xử lý bệnh nhân đến khám

6. **Tra cứu bệnh nhân** (search-patient)
   - Màn hình tương ứng: search-patient
   - Mô tả: Tìm kiếm và tra cứu thông tin bệnh nhân

### Khám và Điều trị
7. **Khám và chẩn đoán** (examine-patients)
   - Màn hình tương ứng: examine-patients
   - Mô tả: Thực hiện khám bệnh và chẩn đoán cho bệnh nhân

8. **Kê đơn thuốc** (prescribe-medicine)
   - Màn hình tương ứng: prescribe-medicine
   - Mô tả: Kê đơn thuốc cho bệnh nhân sau khi khám

9. **Xem lịch sử bệnh án** (view-medical-history)
   - Màn hình tương ứng: view-medical-history
   - Mô tả: Xem lịch sử khám bệnh và điều trị của bệnh nhân

10. **Đặt lịch hẹn** (schedule-appointments)
    - Màn hình tương ứng: schedule-appointments
    - Mô tả: Đặt lịch hẹn khám cho bệnh nhân

### Quản lý Thuốc
11. **Quản lý thuốc** (manage-drugs)
    - Màn hình tương ứng: manage-drugs
    - Mô tả: Quản lý thông tin thuốc trong hệ thống

12. **Nhập thuốc vào kho** (import-inventory)
    - Màn hình tương ứng: import-inventory
    - Mô tả: Nhập thuốc mới vào kho

13. **Quản lý tồn kho** (manage-inventory)
    - Màn hình tương ứng: manage-inventory
    - Mô tả: Quản lý số lượng tồn kho thuốc

14. **Cảnh báo tồn kho** (inventory-alerts)
    - Màn hình tương ứng: inventory-alerts
    - Mô tả: Cảnh báo khi thuốc sắp hết hoặc hết hạn

15. **Bán thuốc theo đơn** (dispense-medicine)
    - Màn hình tương ứng: dispense-medicine
    - Mô tả: Bán thuốc cho bệnh nhân theo đơn đã kê

### Quản lý Hóa đơn
16. **Quản lý hóa đơn** (manage-invoices)
    - Màn hình tương ứng: manage-invoices
    - Mô tả: Tạo và quản lý hóa đơn

17. **Thanh toán hóa đơn** (process-payments)
    - Màn hình tương ứng: process-payments
    - Mô tả: Xử lý thanh toán cho hóa đơn

18. **In hóa đơn** (print-invoices)
    - Màn hình tương ứng: print-invoices
    - Mô tả: In hóa đơn cho bệnh nhân

19. **Quản lý danh sách hóa đơn** (invoice-list)
    - Màn hình tương ứng: invoice-list
    - Mô tả: Xem và quản lý danh sách tất cả hóa đơn

### Báo cáo và Giám sát
20. **Quản lý báo cáo** (manage-reports)
    - Màn hình tương ứng: manage-reports
    - Mô tả: Tạo và quản lý các báo cáo trong hệ thống

21. **Xem báo cáo doanh thu** (view-revenue)
    - Màn hình tương ứng: view-revenue
    - Mô tả: Xem báo cáo doanh thu của phòng khám

22. **Giám sát hoạt động** (monitor-operations)
    - Màn hình tương ứng: monitor-operations
    - Mô tả: Giám sát các hoạt động trong hệ thống

23. **Theo dõi hiệu suất** (monitor-staff)
    - Màn hình tương ứng: monitor-staff
    - Mô tả: Theo dõi hiệu suất làm việc của nhân viên

### Cấu hình Hệ thống
24. **Cấu hình hệ thống** (configure-system)
    - Màn hình tương ứng: configure-system
    - Mô tả: Cấu hình các thông số hệ thống

## Bảng Phân Quyền Chi Tiết

| Chức năng | Admin | Doctors | Receptionists | Managers | Patient |
|-----------|-------|---------|---------------|----------|---------|
| Quản lý nhân viên | ✅ | ❌ | ❌ | ❌ | ❌ |
| Phân quyền nhân viên | ✅ | ❌ | ❌ | ❌ | ❌ |
| Quản lý bệnh nhân | ✅ | ❌ | ❌ | ❌ | ❌ |
| Đăng ký bệnh nhân | ✅ | ✅ | ✅ | ❌ | ❌ |
| Tiếp nhận bệnh nhân | ✅ | ✅ | ✅ | ❌ | ❌ |
| Tra cứu bệnh nhân | ✅ | ✅ | ✅ | ❌ | ❌ |
| Khám và chẩn đoán | ✅ | ✅ | ❌ | ❌ | ❌ |
| Kê đơn thuốc | ✅ | ✅ | ❌ | ❌ | ❌ |
| Xem lịch sử bệnh án | ✅ | ✅ | ❌ | ❌ | ✅ |
| Đặt lịch hẹn | ✅ | ✅ | ✅ | ❌ | ❌ |
| Quản lý thuốc | ✅ | ❌ | ❌ | ✅ | ❌ |
| Nhập thuốc vào kho | ✅ | ❌ | ❌ | ✅ | ❌ |
| Quản lý tồn kho | ✅ | ❌ | ❌ | ✅ | ❌ |
| Cảnh báo tồn kho | ✅ | ❌ | ❌ | ✅ | ❌ |
| Bán thuốc theo đơn | ✅ | ❌ | ✅ | ❌ | ❌ |
| Quản lý hóa đơn | ✅ | ❌ | ✅ | ❌ | ❌ |
| Thanh toán hóa đơn | ✅ | ❌ | ✅ | ❌ | ❌ |
| In hóa đơn | ✅ | ❌ | ✅ | ❌ | ❌ |
| Danh sách hóa đơn | ✅ | ❌ | ✅ | ❌ | ✅ |
| Quản lý báo cáo | ✅ | ❌ | ❌ | ✅ | ❌ |
| Xem báo cáo doanh thu | ✅ | ❌ | ❌ | ✅ | ❌ |
| Giám sát hoạt động | ✅ | ❌ | ❌ | ✅ | ❌ |
| Theo dõi hiệu suất | ✅ | ❌ | ❌ | ✅ | ❌ |
| Cấu hình hệ thống | ✅ | ❌ | ❌ | ❌ | ❌ |

## Cấu Trúc Database

### Bảng nhom_nguoi_dung (User Groups)
- ID_Nhom: Primary key
- TenNhom: Tên nhóm người dùng
- MaNhom: Mã nhóm (admin, doctors, receptionists, managers, patient)

### Bảng chuc_nang (Functions)
- ID_ChucNang: Primary key
- TenChucNang: Tên chức năng
- TenManHinhTuongUong: Tên màn hình tương ứng (screen code)

### Bảng phan_quyen (Permissions)
- ID_Nhom: Foreign key đến nhom_nguoi_dung
- ID_ChucNang: Foreign key đến chuc_nang
- Primary key: (ID_Nhom, ID_ChucNang)
- created_at, updated_at: Timestamps

## Quy Tắc Phân Quyền

1. **Admin có toàn quyền**: Người dùng với role @admin có quyền truy cập tất cả các chức năng trong hệ thống.

2. **Phân quyền theo chức năng**: Mỗi role chỉ có quyền truy cập vào các chức năng được gán cụ thể.

3. **Kiểm tra quyền**: Hệ thống kiểm tra quyền truy cập dựa trên:
   - Role của người dùng (từ bảng nhom_nguoi_dung)
   - Chức năng được yêu cầu (từ bảng chuc_nang)
   - Bảng phan_quyen để xác định role có quyền truy cập chức năng hay không

4. **Role Code Format**: Tất cả role codes trong hệ thống sử dụng format @role_name (ví dụ: @admin, @doctors, @receptionists, @managers, @patient)

## Helper Methods trong RoleHelper

Hệ thống cung cấp các helper methods để kiểm tra quyền:

1. **getRoleCode($user)**: Lấy role code của user (trả về @admin, @doctors, @receptionists, @managers, @patient)
2. **hasRole($user, $roles)**: Kiểm tra user có một trong các role được chỉ định
3. **isRole($user, $role)**: Kiểm tra user có đúng role cụ thể
4. **canDoctorCreatePhieuKham($user)**: Kiểm tra bác sĩ có thể tạo phiếu khám
5. **canCashierCreateHoaDon($user)**: Kiểm tra thu ngân có thể lập hóa đơn
6. **canReceptionistCreateTiepNhan($user)**: Kiểm tra lễ tân có thể tiếp nhận
7. **canManagerManageDrugs($user)**: Kiểm tra quản lý có thể quản lý thuốc
8. **canManagerUpdateRegulations($user)**: Kiểm tra quản lý có thể cập nhật quy định
9. **canManagerManageDichVu($user)**: Kiểm tra quản lý có thể quản lý dịch vụ

## API Endpoints theo Role

### @managers - Quản lý
- GET /dich-vu - Xem danh sách dịch vụ
- POST /dich-vu - Thêm dịch vụ + đơn giá
- PUT /dich-vu/{id} - Sửa dịch vụ + đơn giá
- DELETE /dich-vu/{id} - Xoá mềm dịch vụ
- GET /thuoc - Xem danh sách thuốc
- POST /thuoc - Thêm thuốc
- PUT /thuoc/{id} - Sửa thuốc
- DELETE /thuoc/{id} - Xoá thuốc
- GET /qui-dinh - Xem quy định
- PUT /qui-dinh - Cập nhật quy định
- GET /bao-cao-doanh-thu - Xem báo cáo doanh thu
- POST /bao-cao-doanh-thu - Lập báo cáo doanh thu
- GET /bao-cao-su-dung-thuoc - Xem báo cáo sử dụng thuốc
- POST /bao-cao-su-dung-thuoc - Lập báo cáo sử dụng thuốc

### @receptionists - Lễ tân - Thu ngân
- GET /appointments - Danh sách tiếp nhận
- POST /appointments - Tạo tiếp nhận
- PUT /appointments/{id} - Cập nhật tiếp nhận/trạng thái
- POST /phieu-kham - Tạo phiếu khám rỗng (chờ khám)
- GET /phieu-kham?only_completed=true&only_without_invoice=true - Lấy danh sách phiếu khám đã khám để lập hoá đơn
- GET /invoices - Danh sách hoá đơn
- GET /invoices/preview/{phieuKham} - Xem trước tiền hoá đơn
- POST /invoices - Lập hoá đơn

### @doctors - Bác sĩ
- PUT /phieu-kham/{id} - Cập nhật nội dung khám + chọn dịch vụ
- POST /phieu-kham/{id}/toa-thuoc - Thêm thuốc vào toa
- PUT /phieu-kham/{id}/toa-thuoc/{thuocId} - Cập nhật thuốc trong toa
- DELETE /phieu-kham/{id}/toa-thuoc/{thuocId} - Xoá thuốc khỏi toa
- POST /phieu-kham/{id}/dich-vu-phu - Thêm dịch vụ phụ
- PUT /phieu-kham/{id}/dich-vu-phu/{dichVuId} - Cập nhật số lượng dịch vụ phụ
- DELETE /phieu-kham/{id}/dich-vu-phu/{dichVuId} - Xoá dịch vụ phụ
- POST /phieu-kham/{id}/complete - Hoàn tất khám (DaKham)

### @patient - Bệnh nhân
- GET /patient/profile - Xem hồ sơ bệnh nhân
- PATCH /patient/profile - Cập nhật hồ sơ bệnh nhân
- GET /patient/medical-records - Lịch sử phiếu khám
- GET /patient/invoices - Lịch sử hoá đơn
- GET /patient/appointments - Lịch hẹn
- POST /patient/appointments - Đặt lịch hẹn

## Ví dụ Sử dụng trong Controllers

### Kiểm tra quyền cơ bản
```php
// Kiểm tra user có role admin
if (!RoleHelper::isRole($user, '@admin')) {
    return response()->json(['message' => 'Không có quyền'], 403);
}

// Kiểm tra user có một trong các role
if (!RoleHelper::hasRole($user, ['@managers', '@admin'])) {
    return response()->json(['message' => 'Không có quyền'], 403);
}
```

### Kiểm tra quyền chuyên biệt
```php
// Kiểm tra quản lý có thể quản lý thuốc
if (!RoleHelper::canManagerManageDrugs($user)) {
    return response()->json(['message' => 'Chỉ quản lý mới được phép'], 403);
}

// Kiểm tra thu ngân có thể lập hóa đơn
if (!RoleHelper::canCashierCreateHoaDon($user)) {
    return response()->json(['message' => 'Không có quyền lập hóa đơn'], 403);
}
```

### Kiểm tra quyền với điều kiện bổ sung
```php
// Bác sĩ chỉ có thể chỉnh sửa phiếu khám của chính mình (trừ admin)
if (!RoleHelper::isRole($user, '@admin') && 
    $phieuKham->ID_BacSi && 
    $phieuKham->ID_BacSi !== $nhanVien->ID_NhanVien) {
    return response()->json(['message' => 'Chỉ bác sĩ tạo phiếu mới được chỉnh sửa'], 403);
}
```

## Lưu Ý

- Role "patient" là role đặc biệt dành cho bệnh nhân, có quyền hạn hạn chế hơn so với các role nhân viên.
- Role "admin" luôn có quyền truy cập tất cả, không cần kiểm tra trong bảng phan_quyen.
- Các role khác phải có bản ghi trong bảng phan_quyen để có quyền truy cập chức năng.
- Tất cả role codes trong hệ thống sử dụng format @role_name (ví dụ: @admin, @doctors).
- Helper methods trong RoleHelper tự động kiểm tra quyền admin, nên admin luôn có quyền truy cập.


# Hệ Thống Phân Quyền - Health Clinic Management System
## Tổng Quan
Hệ thống quản lý phòng khám sử dụng hệ thống phân quyền dựa trên nhóm người dùng và chức năng. Mỗi nhóm người dùng (role) có các quyền truy cập vào các chức năng cụ thể trong hệ thống.
## Các Nhóm Người Dùng (Roles)
### 1. Quản trị hệ thống (@admin)
- **Mã nhóm**: admin
- **Mô tả**: Có quyền truy cập 24 chức năng
- **Quyền**:
  - Quản lý nhân viên (manage-employees)
  - Phân quyền nhân viên (manage-permissions)
  - Quản lý bệnh nhân (manage-patients)
  - Quản lý thuốc (manage-drugs)
  - Quản lý hoá đơn (manage-invoices)
  - Quản lý báo cáo (manage-reports)
  - Cấu hình hệ thống (configure-system)
  - Khám và chẩn đoán (examine-patients)
  - Kê đơn thuốc (prescribe-medicine)
  - Xem lịch sử bệnh án (view-medical-history)
  - Đăng ký bệnh nhân (register-patient)
  - Tiếp nhận bệnh nhân (intake-patient)
  - Đặt lịch hẹn (schedule-appointments)
  - Tra cứu bệnh nhân (search-patient)
  - Thanh toán hoá đơn (process-payments)
  - Bán thuốc theo đơn (dispense-medicine)
  - In hoá đơn (print-invoices)
  - Quản lý danh sách hoá đơn (invoice-list)
  - Nhập thuốc vào kho (import-inventory)
  - Quản lý tồn kho (manage-inventory)
  - Cảnh báo tồn kho (inventory-alerts)
  - Xem báo cáo doanh thu (view-revenue)
  - Giám sát hoạt động (monitor-operations)
  - Theo dõi hiệu suất (monitor-staff)

### 2. Bác sĩ (@doctors)
- **Mã nhóm**: doctors
- **Mô tả**: Có quyền truy cập 7 chức năng
- **Quyền**:
  - Khám và chẩn đoán (examine-patients)
  - Kê đơn thuốc (prescribe-medicine)
  - Xem lịch sử bệnh án (view-medical-history)
  - Đăng ký bệnh nhân (register-patient)
  - Tiếp nhận bệnh nhân (intake-patient)
  - Đặt lịch hẹn (schedule-appointments)
  - Tra cứu bệnh nhân (search-patient)

### 3. Lễ tân – Thu ngân (@receptionists)
- **Mã nhóm**: receptionists
- **Mô tả**: Có quyền truy cập 9 chức năng
- **Quyền**:
  - Quản lý hoá đơn (manage-invoices)
  - Đăng ký bệnh nhân (register-patient)
  - Tiếp nhận bệnh nhân (intake-patient)
  - Đặt lịch hẹn (schedule-appointments)
  - Tra cứu bệnh nhân (search-patient)
  - Thanh toán hoá đơn (process-payments)
  - Bán thuốc theo đơn (dispense-medicine)
  - In hoá đơn (print-invoices)
  - Quản lý danh sách hoá đơn (invoice-list)

### 4. Quản lý (@managers)
- **Mã nhóm**: managers
- **Mô tả**: Có quyền truy cập 8 chức năng
- **Quyền**:
  - Quản lý thuốc (manage-drugs)
  - Quản lý báo cáo (manage-reports)
  - Nhập thuốc vào kho (import-inventory)
  - Quản lý tồn kho (manage-inventory)
  - Cảnh báo tồn kho (inventory-alerts)
  - Xem báo cáo doanh thu (view-revenue)
  - Giám sát hoạt động (monitor-operations)
  - Theo dõi hiệu suất (monitor-staff)

### 5. Bệnh nhân (@patient)
- **Mã nhóm**: patient
- **Mô tả**: Có quyền truy cập 2 chức năng
- **Quyền**:
  - Xem lịch sử bệnh án (view-medical-history)
  - Quản lý danh sách hoá đơn (invoice-list)

## Danh Sách Chức Năng (Functions/Permissions)
### 1. Quản lý nhân viên (manage-employees)
- **Màn hình tương ứng**: manage-employees
- **Mô tả**: Chức năng Quản lý nhân viên

### 2. Phân quyền nhân viên (manage-permissions)
- **Màn hình tương ứng**: manage-permissions
- **Mô tả**: Chức năng Phân quyền nhân viên

### 3. Quản lý bệnh nhân (manage-patients)
- **Màn hình tương ứng**: manage-patients
- **Mô tả**: Chức năng Quản lý bệnh nhân

### 4. Quản lý thuốc (manage-drugs)
- **Màn hình tương ứng**: manage-drugs
- **Mô tả**: Chức năng Quản lý thuốc

### 5. Quản lý hoá đơn (manage-invoices)
- **Màn hình tương ứng**: manage-invoices
- **Mô tả**: Chức năng Quản lý hoá đơn

### 6. Quản lý báo cáo (manage-reports)
- **Màn hình tương ứng**: manage-reports
- **Mô tả**: Chức năng Quản lý báo cáo

### 7. Cấu hình hệ thống (configure-system)
- **Màn hình tương ứng**: configure-system
- **Mô tả**: Chức năng Cấu hình hệ thống

### 8. Khám và chẩn đoán (examine-patients)
- **Màn hình tương ứng**: examine-patients
- **Mô tả**: Chức năng Khám và chẩn đoán

### 9. Kê đơn thuốc (prescribe-medicine)
- **Màn hình tương ứng**: prescribe-medicine
- **Mô tả**: Chức năng Kê đơn thuốc

### 10. Xem lịch sử bệnh án (view-medical-history)
- **Màn hình tương ứng**: view-medical-history
- **Mô tả**: Chức năng Xem lịch sử bệnh án

### 11. Đăng ký bệnh nhân (register-patient)
- **Màn hình tương ứng**: register-patient
- **Mô tả**: Chức năng Đăng ký bệnh nhân

### 12. Tiếp nhận bệnh nhân (intake-patient)
- **Màn hình tương ứng**: intake-patient
- **Mô tả**: Chức năng Tiếp nhận bệnh nhân

### 13. Đặt lịch hẹn (schedule-appointments)
- **Màn hình tương ứng**: schedule-appointments
- **Mô tả**: Chức năng Đặt lịch hẹn

### 14. Tra cứu bệnh nhân (search-patient)
- **Màn hình tương ứng**: search-patient
- **Mô tả**: Chức năng Tra cứu bệnh nhân

### 15. Thanh toán hoá đơn (process-payments)
- **Màn hình tương ứng**: process-payments
- **Mô tả**: Chức năng Thanh toán hoá đơn

### 16. Bán thuốc theo đơn (dispense-medicine)
- **Màn hình tương ứng**: dispense-medicine
- **Mô tả**: Chức năng Bán thuốc theo đơn

### 17. In hoá đơn (print-invoices)
- **Màn hình tương ứng**: print-invoices
- **Mô tả**: Chức năng In hoá đơn

### 18. Quản lý danh sách hoá đơn (invoice-list)
- **Màn hình tương ứng**: invoice-list
- **Mô tả**: Chức năng Quản lý danh sách hoá đơn

### 19. Nhập thuốc vào kho (import-inventory)
- **Màn hình tương ứng**: import-inventory
- **Mô tả**: Chức năng Nhập thuốc vào kho

### 20. Quản lý tồn kho (manage-inventory)
- **Màn hình tương ứng**: manage-inventory
- **Mô tả**: Chức năng Quản lý tồn kho

### 21. Cảnh báo tồn kho (inventory-alerts)
- **Màn hình tương ứng**: inventory-alerts
- **Mô tả**: Chức năng Cảnh báo tồn kho

### 22. Xem báo cáo doanh thu (view-revenue)
- **Màn hình tương ứng**: view-revenue
- **Mô tả**: Chức năng Xem báo cáo doanh thu

### 23. Giám sát hoạt động (monitor-operations)
- **Màn hình tương ứng**: monitor-operations
- **Mô tả**: Chức năng Giám sát hoạt động

### 24. Theo dõi hiệu suất (monitor-staff)
- **Màn hình tương ứng**: monitor-staff
- **Mô tả**: Chức năng Theo dõi hiệu suất

## Bảng Phân Quyền Chi Tiết
| Chức năng | @admin | @doctors | @receptionists | @managers | @patient |
|-----------|---|---|---|---|---|
| Quản lý nhân viên | [YES] | [NO] | [NO] | [NO] | [NO] |
| Phân quyền nhân viên | [YES] | [NO] | [NO] | [NO] | [NO] |
| Quản lý bệnh nhân | [YES] | [NO] | [NO] | [NO] | [NO] |
| Quản lý thuốc | [YES] | [NO] | [NO] | [YES] | [NO] |
| Quản lý hoá đơn | [YES] | [NO] | [YES] | [NO] | [NO] |
| Quản lý báo cáo | [YES] | [NO] | [NO] | [YES] | [NO] |
| Cấu hình hệ thống | [YES] | [NO] | [NO] | [NO] | [NO] |
| Khám và chẩn đoán | [YES] | [YES] | [NO] | [NO] | [NO] |
| Kê đơn thuốc | [YES] | [YES] | [NO] | [NO] | [NO] |
| Xem lịch sử bệnh án | [YES] | [YES] | [NO] | [NO] | [YES] |
| Đăng ký bệnh nhân | [YES] | [YES] | [YES] | [NO] | [NO] |
| Tiếp nhận bệnh nhân | [YES] | [YES] | [YES] | [NO] | [NO] |
| Đặt lịch hẹn | [YES] | [YES] | [YES] | [NO] | [NO] |
| Tra cứu bệnh nhân | [YES] | [YES] | [YES] | [NO] | [NO] |
| Thanh toán hoá đơn | [YES] | [NO] | [YES] | [NO] | [NO] |
| Bán thuốc theo đơn | [YES] | [NO] | [YES] | [NO] | [NO] |
| In hoá đơn | [YES] | [NO] | [YES] | [NO] | [NO] |
| Quản lý danh sách hoá đơn | [YES] | [NO] | [YES] | [NO] | [YES] |
| Nhập thuốc vào kho | [YES] | [NO] | [NO] | [YES] | [NO] |
| Quản lý tồn kho | [YES] | [NO] | [NO] | [YES] | [NO] |
| Cảnh báo tồn kho | [YES] | [NO] | [NO] | [YES] | [NO] |
| Xem báo cáo doanh thu | [YES] | [NO] | [NO] | [YES] | [NO] |
| Giám sát hoạt động | [YES] | [NO] | [NO] | [YES] | [NO] |
| Theo dõi hiệu suất | [YES] | [NO] | [NO] | [YES] | [NO] |

## Lưu Ý
- Role "patient" là role đặc biệt dành cho bệnh nhân, có quyền hạn hạn chế hơn so với các role nhân viên.
- Role "admin" luôn có quyền truy cập tất cả, không cần kiểm tra trong bảng phan_quyen.
- Các role khác phải có bản ghi trong bảng phan_quyen để có quyền truy cập chức năng.
- Tất cả role codes trong hệ thống sử dụng format @role_name (ví dụ: @admin, @doctors).

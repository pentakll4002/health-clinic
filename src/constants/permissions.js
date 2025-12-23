// Map role với các route được phép truy cập
// Lưu ý: @admin có quyền truy cập TẤT CẢ routes (không cần liệt kê hết)
export const ROLE_ROUTES = {
  '@admin': [
    // Admin có quyền truy cập TẤT CẢ routes, danh sách này chỉ để tham khảo
    'employees',        // Quản lý nhân viên, thêm/sửa/khóa tài khoản
    'doctors',          // Quản lý bác sĩ
    'patients',         // Quản lý bệnh nhân
    'patientDetail',    // Chi tiết bệnh nhân
    'reception',        // Tiếp nhận
    'drugs',            // Quản lý thuốc
    'medicalForms',     // Phiếu khám
    'invoices',         // Hóa đơn
    'appointments',     // Lịch hẹn
    'reports',          // Báo cáo & thống kê
    'regulations',      // Cấu hình hệ thống (Quy định, đơn vị tính, cách dùng, loại bệnh)
  ],
  '@doctors': [
    // Bác sĩ có quyền:
    'patients',         // Xem danh sách bệnh nhân trong ngày
    'patientDetail',    // Tra cứu hồ sơ bệnh nhân, xem lịch sử khám bệnh
    'medicalForms',     // Lập phiếu khám, cập nhật triệu chứng/chẩn đoán/loại bệnh, kê toa thuốc
    // Bác sĩ KHÔNG có quyền:
    // - invoices (Thu tiền)
    // - drugs (Quản lý kho)
    // - regulations (Chỉnh sửa quy định hệ thống)
  ],
  '@receptionists': ['reception', 'patients', 'patientDetail', 'appointments'],
  // Y tá: hỗ trợ tiếp nhận & xem thông tin, quyền thấp hơn bác sĩ
  '@nurses': ['reception', 'patients', 'patientDetail', 'medicalForms'],
  // Thu ngân: làm việc với hóa đơn
  '@cashiers': ['invoices'],
  // Kế toán: tập trung vào báo cáo & thống kê tài chính
  '@accountants': ['invoices', 'reports'],
  // Quản lý kho
  '@inventory': ['drugs'],
  // Quản lý
  '@managers': ['reports'],
  '@patient': ['patientProfile'],
  patient: ['patientProfile'], // Tương thích ngược
};

// Map route với các role được phép
// Lưu ý: @admin có quyền truy cập TẤT CẢ routes (được xử lý trong useRolePermissions)
export const ROUTE_ROLES = {
  // Quản lý nhân viên & nhóm người dùng
  employees: ['@admin'], // Quản lý nhân viên, thêm/sửa/khóa tài khoản
  // Cho phép bác sĩ xem danh sách bác sĩ (admin vẫn full quyền)
  doctors: ['@admin', '@doctors'],
  
  // Quản lý bệnh nhân
  patients: ['@admin', '@doctors', '@receptionists', '@nurses'],
  patientDetail: ['@admin', '@doctors', '@receptionists', '@nurses'],
  patientProfile: ['@patient', 'patient'], // Bệnh nhân xem profile của mình
  
  // Tiếp nhận
  reception: ['@admin', '@receptionists', '@nurses'],
  
  // Quản lý thuốc & kho (Bác sĩ KHÔNG có quyền quản lý kho)
  drugs: ['@admin', '@inventory'],
  
  // Khám bệnh & kê đơn (Bác sĩ có quyền: lập phiếu khám, cập nhật triệu chứng/chẩn đoán/loại bệnh, kê toa thuốc)
  medicalForms: ['@admin', '@doctors', '@nurses'], // Y tá hỗ trợ, backend vẫn chặn sửa chẩn đoán/kê toa nếu cần
  
  // Hóa đơn & thanh toán (Bác sĩ KHÔNG có quyền thu tiền)
  invoices: ['@admin', '@cashiers', '@accountants'], // Kế toán xem/đối soát, logic backend chặn lập hóa đơn
  
  // Lịch hẹn
  appointments: ['@admin', '@receptionists', '@nurses'],
  
  // Báo cáo & thống kê
  reports: ['@admin', '@managers', '@accountants'],
  
  // Cấu hình hệ thống (Quy định, đơn vị tính, cách dùng, loại bệnh)
  // Bác sĩ KHÔNG có quyền chỉnh sửa quy định hệ thống
  regulations: ['@admin'],
};


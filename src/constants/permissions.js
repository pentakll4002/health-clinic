// Map role với các route được phép truy cập
// Lưu ý: @admin có quyền truy cập TẤT CẢ routes (không cần liệt kê hết)
export const ROLE_ROUTES = {
  '@admin': ['employees','doctors','patients','reports','regulations'],
  '@doctor': ['patients','patientDetail','medicalForms'],
  '@receptionist': ['reception','patients','appointments'],
  '@nurses': ['reception','patients','medicalForms','nurses'],
  '@cashier': ['invoices'],
  '@accountant': ['invoices','reports'],
  '@inventory': ['drugs'],
  '@manager': ['reports'],
  '@patient': ['patientProfile'],
};


// Map route với các role được phép
// Lưu ý: @admin có quyền truy cập TẤT CẢ routes (được xử lý trong useRolePermissions)
export const ROUTE_ROLES = {
  // Quản lý nhân viên & nhóm người dùng
  employees: ['@admin'], // Quản lý nhân viên, thêm/sửa/khóa tài khoản
  permissions: ['@admin'],
  catalogs: ['@admin'],
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

  // Y tá (UI riêng)
  nurses: ['@admin', '@nurses'],
  
  // Khám bệnh & kê đơn (Bác sĩ có quyền: lập phiếu khám, cập nhật triệu chứng/chẩn đoán/loại bệnh, kê toa thuốc)
  medicalForms: ['@admin', '@doctors', '@nurses'], // Y tá hỗ trợ, backend vẫn chặn sửa chẩn đoán/kê toa nếu cần
  
  // Hóa đơn & thanh toán (Bác sĩ KHÔNG có quyền thu tiền)
  invoices: ['@admin', '@cashiers', '@accountants'], // Kế toán xem/đối soát, logic backend chặn lập hóa đơn
  
  // Lịch hẹn
  appointments: ['@admin', '@receptionists', '@nurses'],

  // Bệnh nhân (portal)
  patientAppointments: ['@patient', 'patient'],
  patientInvoices: ['@patient', 'patient'],
  patientMedicalRecords: ['@patient', 'patient'],
  
  // Báo cáo & thống kê
  reports: ['@admin', '@manager', '@managers', '@accountants'],
  
  // Cấu hình hệ thống (Quy định, đơn vị tính, cách dùng, loại bệnh)
  // Bác sĩ KHÔNG có quyền chỉnh sửa quy định hệ thống
  regulations: ['@admin', '@manager', '@managers'],
};


// Map role với các route được phép truy cập
// Lưu ý: @admin có quyền truy cập TẤT CẢ routes (không cần liệt kê hết)
export const ROLE_ROUTES = {
  '@admin': ['employees','doctors','patients','reports','regulations'],
  '@doctors': ['patients','patientDetail','medicalForms','doctorQueue','doctorExam'],
  '@receptionists': ['reception','patients','appointments','invoices'],
  '@managers': ['reports','regulations','drugs','services'],
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
  patients: ['@admin', '@doctors', '@receptionists'],
  patientDetail: ['@admin', '@doctors', '@receptionists'],
  patientProfile: ['@patient', 'patient'], // Bệnh nhân xem profile của mình
  
  // Tiếp nhận
  reception: ['@admin', '@receptionists'],
  
  // Quản lý thuốc & kho (Bác sĩ KHÔNG có quyền quản lý kho)
  drugs: ['@admin', '@managers'],
  
  // Khám bệnh & kê đơn (Bác sĩ có quyền: lập phiếu khám, cập nhật triệu chứng/chẩn đoán/loại bệnh, kê toa thuốc)
  medicalForms: ['@admin', '@doctors'],

  // Doctor workflow (queue -> exam)
  doctorQueue: ['@admin', '@doctors'],
  doctorExam: ['@admin', '@doctors'],
  
  // Hóa đơn & thanh toán (Bác sĩ KHÔNG có quyền thu tiền)
  invoices: ['@admin', '@receptionists'],
  
  // Lịch hẹn
  appointments: ['@admin', '@receptionists'],

  // Bệnh nhân (portal)
  patientAppointments: ['@patient', 'patient'],
  patientInvoices: ['@patient', 'patient'],
  patientMedicalRecords: ['@patient', 'patient'],
  
  // Báo cáo & thống kê
  reports: ['@admin', '@managers'],
  
  // Cấu hình hệ thống (Quy định, đơn vị tính, cách dùng, loại bệnh)
  // Bác sĩ KHÔNG có quyền chỉnh sửa quy định hệ thống
  regulations: ['@admin', '@managers'],

  // Dịch vụ khám & đơn giá (chỉ quản lý quyết định)
  services: ['@admin', '@managers'],
};


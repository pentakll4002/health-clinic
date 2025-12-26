export const ROLE_ROUTES = {
  '@admin': ['employees','doctors','patients','reports','regulations'],
  '@doctors': ['patients','patientDetail','medicalForms','doctorQueue','doctorExam'],
  '@receptionists': ['reception','patients','appointments','invoices'],
  '@managers': ['reports','regulations','drugs','services','catalogs'],
  '@patient': ['patientProfile'],
};



export const ROUTE_ROLES = {
  employees: ['@admin'],
  permissions: ['@admin'],
  catalogs: ['@admin', '@managers'],
  doctors: ['@admin', '@doctors'],
  
  patients: ['@admin', '@doctors', '@receptionists'],
  patientDetail: ['@admin', '@doctors', '@receptionists'],
  patientProfile: ['@patient', 'patient'],
  
  reception: ['@admin', '@receptionists'],
  
  drugs: ['@admin', '@managers'],
  
  medicalForms: ['@admin', '@doctors'],

  doctorQueue: ['@admin', '@doctors'],
  doctorExam: ['@admin', '@doctors'],
  
  invoices: ['@admin', '@receptionists'],
  
  appointments: ['@admin', '@receptionists'],

  patientAppointments: ['@patient', 'patient'],
  patientInvoices: ['@patient', 'patient'],
  patientMedicalRecords: ['@patient', 'patient'],
  
  reports: ['@admin', '@managers'],
  
  regulations: ['@admin', '@managers'],

  services: ['@admin', '@managers'],
};


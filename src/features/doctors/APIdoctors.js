export async function getDoctors({ page = 1, limit = 7 }) {
  const totalCount = 24; // Tổng số bác sĩ (4 trang × 6 người)
  
  // Tạo danh sách bác sĩ ảo
  const allDoctors = Array.from({ length: totalCount }, (_, i) => ({
    id: i + 1,
    name: `Dr. Example ${i + 1}`,
    role: ['Cardiologist', 'Dentist', 'Dermatologist', 'Pediatrician'][i % 4],
    birthday: `19${70 + (i % 20)}-01-20`,
    numberPhone: '0900123901',
    avatarUrl: `https://i.pravatar.cc/150?img=${i + 1}`,
  }));

  // Tính start-end cho trang hiện tại
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = allDoctors.slice(start, end);

  // Giả delay 0.5s để mô phỏng fetch thật
  await new Promise((resolve) => setTimeout(resolve, 500));

  return { data, totalCount };
}

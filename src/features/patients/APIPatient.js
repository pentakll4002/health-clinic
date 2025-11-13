import axiosInstance from '../../utils/axiosInstance';

export async function getPatient(ID_BenhNhan) {
  const res = await axiosInstance.get(`/benh-nhan/${ID_BenhNhan}`);
  return res.data;
}

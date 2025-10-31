import { getPatients } from './APIPatients';

export async function getPatient(ID_BenhNhan) {
  const { data } = await getPatients();

  const patient = data.find((bn) => bn.ID_BenhNhan === Number(ID_BenhNhan));

  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!patient) return null;

  return patient;
}

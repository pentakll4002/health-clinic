import axiosInstance from '../../utils/axiosInstance';

export async function getInvoices(page = 1, limit = 7) {
  const response = await axiosInstance.get('/invoices', {
    params: { page, limit },
  });
  return response.data;
}

export async function getInvoice(id) {
  const response = await axiosInstance.get(`/invoices/${id}`);
  return response.data;
}

export async function createInvoice(data) {
  const response = await axiosInstance.post('/invoices', data);
  return response.data;
}

export async function updateInvoice(id, data) {
  const response = await axiosInstance.put(`/invoices/${id}`, data);
  return response.data;
}

export async function deleteInvoice(id) {
  const response = await axiosInstance.delete(`/invoices/${id}`);
  return response.data;
}



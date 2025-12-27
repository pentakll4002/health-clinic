import axiosInstance from '../../utils/axiosInstance';

/**
 * Lấy danh sách hoá đơn
 * @param {number} page
 * @param {number} limit
 * @param {object} filters - { date_from, date_to }
 */
export async function getInvoices(
  page = 1,
  limit = 7,
  filters = {}
) {
  const response = await axiosInstance.get('/invoices', {
    params: {
      page,
      limit,
      ...filters, // date_from, date_to
    },
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

import api from './api';

export const fetchPaymentModes = async status => {
  try {
    const response = await api.get(`v1/payment-mode-mst?isActive=${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment modes:', error);
    throw error;
  }
};

export const addPayment = async data => {
  try {
    const response = await api.post(`v1/payment-mode-mst`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding branch:', error);
    throw error;
  }
};

export const deletePaymentMode = async id => {
  try {
    const response = await api.delete(`v1/payment-mode-mst?payModId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting paymnt mode:', error);
    throw error;
  }
};

export const modifyPaymentMode = async (id, data) => {
  try {
    const response = await api.put(`v1/payment-mode-mst?payModId=${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error modifying payment mode :', error);
    throw error;
  }
};

export const viewPaymentMode = async id => {
  try {
    const response = await api.get(
      `v1/payment-mode-mst/single-data?payModId=${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

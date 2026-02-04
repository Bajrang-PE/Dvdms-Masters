import api from './api';

export const fetchDeliveries = async status => {
  try {
    const response = await api.get(`v1/deliveryModes/all?isActive=${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching delivery modes:', error);
    throw error;
  }
};

export const addDelivery = async data => {
  try {
    const response = await api.post(`v1/deliveryModes`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding delivery:', error);
    throw error;
  }
};

export const deleteDelivery = async id => {
  try {
    const response = await api.delete(`v1/deliveryModes?deliveryModeId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting delivery mode :', error);
    throw error;
  }
};

export const modifyDelivery = async data => {
  try {
    const response = await api.put(`v1/deliveryModes`, data);
    return response.data;
  } catch (error) {
    console.error('Error modifying delivery :', error);
    throw error;
  }
};

export const viewDeliveryMode = async (id, isValid) => {
  try {
    const response = await api.get(
      `v1/deliveryModes?deliveryModeId=${id}&isActive=${isValid}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

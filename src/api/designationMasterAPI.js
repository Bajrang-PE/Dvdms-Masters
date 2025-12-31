import api from './api';

export const fetchDesignations = async status => {
  try {
    const response = await api.get(`v1/designations/all?isActive=${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching designation:', error);
    throw error;
  }
};

export const addDesignation = async data => {
  try {
    const response = await api.post(`v1/designations`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding designation:', error);
    throw error;
  }
};

export const deleteDesignation = async id => {
  try {
    const response = await api.delete(`v1/designations?designationId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting designation :', error);
    throw error;
  }
};

export const modifyDesignation = async data => {
  try {
    const response = await api.put(`v1/designations`, data);
    return response.data;
  } catch (error) {
    console.error('Error modifying designation :', error);
    throw error;
  }
};

export const viewDesignation = async (id, isValid) => {
  try {
    const response = await api.get(
      `v1/designations?designationId=${id}&isActive=${isValid}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

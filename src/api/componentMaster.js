import api from './api';

export const fetchComponents = async status => {
  try {
    const response = await api.get(`v1/components/all?isActive=${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment modes:', error);
    throw error;
  }
};

export const addComponent = async data => {
  try {
    const response = await api.post(`v1/components`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding component:', error);
    throw error;
  }
};

export const deleteComponentMode = async id => {
  try {
    const response = await api.delete(`v1/components?componentId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting component :', error);
    throw error;
  }
};

export const modifyComponentMode = async data => {
  try {
    const response = await api.put(`v1/components`, data);
    return response.data;
  } catch (error) {
    console.error('Error modifying component mode :', error);
    throw error;
  }
};

export const viewComponentMode = async (id, isValid) => {
  try {
    const response = await api.get(
      `v1/components?componentId=${id}&isActive=${isValid}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

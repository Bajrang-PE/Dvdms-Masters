import api from './api';

export const fetchCommittees = async status => {
  try {
    const response = await api.get(`v1/committees/all?isActive=${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment modes:', error);
    throw error;
  }
};

export const addCommittee = async data => {
  try {
    const response = await api.post(`v1/committees`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding committee:', error);
    throw error;
  }
};

export const deleteCommittee = async id => {
  try {
    const response = await api.delete(`v1/committees?commmitteeTypeId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting committee :', error);
    throw error;
  }
};

export const modifyCommittee = async data => {
  try {
    const response = await api.put(`v1/committees`, data);
    return response.data;
  } catch (error) {
    console.error('Error modifying committee :', error);
    throw error;
  }
};

export const viewCommittee = async (id, isValid) => {
  try {
    const response = await api.get(
      `v1/committees?commmitteeTypeId=${id}&isActive=${isValid}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

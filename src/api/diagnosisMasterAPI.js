import api from './api';

export const fetchDiagnosis = async status => {
  try {
    const response = await api.get(`v1/diagnosiss/all?isActive=${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching diagnosis:', error);
    throw error;
  }
};

export const addDiagnosis = async data => {
  try {
    const response = await api.post(`v1/diagnosiss`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding diagnosis:', error);
    throw error;
  }
};

export const deleteDiagnosis = async id => {
  try {
    const response = await api.delete(`v1/diagnosiss?diagnosisId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting diagnosis :', error);
    throw error;
  }
};

export const modifyDiagnosis = async data => {
  try {
    const response = await api.put(`v1/diagnosiss`, data);
    return response.data;
  } catch (error) {
    console.error('Error modifying diagnosis :', error);
    throw error;
  }
};

export const viewDiagnosis = async (id, isValid) => {
  try {
    const response = await api.get(
      `v1/diagnosiss?diagnosisId=${id}&isActive=${isValid}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

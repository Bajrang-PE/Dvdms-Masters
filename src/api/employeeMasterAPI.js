import api from './api';

export const fetchEmployees = async status => {
  try {
    const response = await api.get(`v1/employeeDetails/all?isActive=${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
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

export const deleteEmployee = async id => {
  try {
    const response = await api.delete(
      `v1/employeeDetails?employeeDetailId=${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting employee :', error);
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

export const viewEmployee = async (id, isValid) => {
  try {
    const response = await api.get(
      `v1/employeeDetails?employeeDetailId=${id}&isActive=${isValid}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const fetchDesignations = async (hospitalCode, isValid) => {
  try {
    const response = await api.get(
      `v1/employeeDetails/designation?hsopitalCode=${hospitalCode}&isActive=${isValid}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const fetchStates = async isValid => {
  try {
    const response = await api.get(`v1/employeeDetails/State/${isValid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

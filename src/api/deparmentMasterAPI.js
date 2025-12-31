import api from './api';

export const fetchDepartments = async status => {
  try {
    const response = await api.get(`v1/departments/all?isActive=${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const addDepartment = async data => {
  try {
    const response = await api.post(`v1/departments`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding department:', error);
    throw error;
  }
};

export const deleteDepartment = async id => {
  try {
    const response = await api.delete(`v1/departments?departmentId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting department :', error);
    throw error;
  }
};

export const modifyDepartment = async data => {
  try {
    const response = await api.put(`v1/departments`, data);
    return response.data;
  } catch (error) {
    console.error('Error modifying department :', error);
    throw error;
  }
};

export const viewDepartment = async (id, isValid) => {
  try {
    const response = await api.get(
      `v1/departments?departmentId=${id}&isActive=${isValid}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

import api from './api';

export const fetchDepartmentEmployees = async hospitalCode => {
  try {
    const response = await api.get(
      `v1/departmentEmployees/all?gnumHospitalCode =${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

import api from "./api";

export const fetchBankList = async (status) => {
  try {
    const response = await api.get(
      `/assam-masters/api/v1/bank-mst?status=${status}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const addBank = async (data) => {
  try {
    const response = await api.post("/assam-masters/api/v1/bank-mst", data);
    return response.data;
  } catch (error) {
    console.error("Error adding bank:", error);
    throw error;
  }
};

export const deleteBank = async (id) => {
  try {
    const response = await api.delete(
      `/assam-masters/api/v1/bank-mst/${Number(id)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error adding bank:", error);
    throw error;
  }
};

export const modifyBank = async (data, id) => {
  try {
    const response = await api.put(
      `/assam-masters/api/v1/bank-mst/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error modifying bank:", error);
    throw error;
  }
};

export const viewBank = async (id) => {
  try {
    const response = await api.get(`/assam-masters/api/v1/bank-mst/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

import {
  fetchData,
  fetchDeleteData,
  fetchPostData,
  fetchUpdateData,
} from "../../../utils/ApiHook";

export const fetchBankList = async (status) => {
  try {
    const response = await fetchData(
      `/jhk-masters/api/v1/bank-mst?status=${status}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const addBank = async (data) => {
  try {
    const response = await fetchPostData("/jhk-masters/api/v1/bank-mst", data);
    return response;
  } catch (error) {
    console.error("Error adding bank:", error);
    throw error;
  }
};

export const deleteBank = async (id) => {
  try {
    const response = await fetchDeleteData(
      `/jhk-masters/api/v1/bank-mst/${Number(id)}`
    );
    return response;
  } catch (error) {
    console.error("Error adding bank:", error);
    throw error;
  }
};

export const modifyBank = async (data, id) => {
  try {
    const response = await fetchUpdateData(
      `/jhk-masters/api/v1/bank-mst/${id}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error modifying bank:", error);
    throw error;
  }
};

export const viewBank = async (id) => {
  try {
    const response = await fetchData(`/jhk-masters/api/v1/bank-mst/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

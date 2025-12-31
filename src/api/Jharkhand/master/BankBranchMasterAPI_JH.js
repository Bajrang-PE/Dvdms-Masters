import {
  fetchData,
  fetchDeleteData,
  fetchPostData,
  fetchUpdateData,
} from "../../../utils/ApiHook";

export const fetchBankBranchList = async (status, id) => {
  try {
    const response = await fetchData(
      `/jhk-masters/v1/bank-branch-mst?status=${status}&bankId=${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const fetchStates = async (hospitalCode = 998) => {
  try {
    const response = await fetchData(
      `/jhk-masters/v1/bank-branch-mst/state-combo?hospCode=${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching states:", error);
    throw error;
  }
};

export const fetchDistrict = async (stateID) => {
  try {
    const response = await fetchData(
      `/jhk-masters/v1/bank-branch-mst/district-combo?stateCode=${stateID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching states:", error);
    throw error;
  }
};

export const addBranch = async (bankId, data) => {
  try {
    const response = await fetchPostData(
      `/jhk-masters/v1/bank-branch-mst?bankId=${bankId}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error adding branch:", error);
    throw error;
  }
};

export const deleteBankBranch = async (bankId, branchId) => {
  try {
    const response = await fetchDeleteData(
      `/jhk-masters/v1/bank-branch-mst?bankId=${bankId}&branchId=${branchId}`
    );
    return response;
  } catch (error) {
    console.error("Error adding bank branch:", error);
    throw error;
  }
};

export const modifyBranch = async (data, bankId, branchId) => {
  try {
    const response = await fetchUpdateData(
      `/jhk-masters/v1/bank-branch-mst?bankId=${bankId}&branchId=${branchId}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error modifying branch:", error);
    throw error;
  }
};

export const viewBranch = async (bankID, branchID) => {
  try {
    const response = await fetchData(
      `/jhk-masters/v1/bank-branch-mst/single-data?bankId=${bankID}&branchId=${branchID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

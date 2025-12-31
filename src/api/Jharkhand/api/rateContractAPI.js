import { fetchData, fetchPostData } from "../../../utils/ApiHook";

export const getContractTypes = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/contract-type-combo?hospCode=${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getLevelTypeCmb = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/level-type-combo?hospCode=${hospitalCode}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getUnitCombo = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/unit-combo?hospCode=${hospitalCode}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getSuppliers = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/supplier-combo?hospCode=${hospitalCode}`
    );
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getSuppliersWithContractCmb = async (hospitalCode, contractId) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/contract-dtls-supp-cmb?hospCode=${hospitalCode}&contractTypeId=${contractId}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getDrugNames = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/drug-combo?hospCode=${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching drugs:", error);
    throw error;
  }
};

export const getStoreName = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/storeName-combo?hospCode=${hospitalCode}`
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching store name : ", err);
    throw err;
  }
};

export const getRateContractList = async (
  hospitalCode,
  supplierID,
  contractID,
  isActive,
  storeId,
  itemBrandId
) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/ratecontract-list?hospCode=${hospitalCode}&supplierId=${supplierID}&contractTypeId=${contractID}&status=${isActive}&storeId=${storeId}&itemBrandId=${itemBrandId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getTenderNameForAddTender = async (hospitalCode, storeID) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/tender-no-for-add-tender?hospCode=${hospitalCode}&storeId=${storeID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getBanks = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/bank-combo?hospCode=${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching banks:", error);
    throw error;
  }
};

export const getExistingRC = async (
  hospitalCode,
  storeID,
  itemBrandId,
  contractID
) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/existing-rate-Contract?hospCode=${hospitalCode}&storeId=${storeID}&itemBrandId=${itemBrandId}&contractTypeId=${contractID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Existing RCs:", error);
    throw error;
  }
};

export const getBgDetailList = async (hospitalCode, suppID, rcId, tenderNo) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/bg-details?hospCode=${hospitalCode}&supplierId=${suppID}&rcId=${rcId}&tenderNo=${tenderNo}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching Existing RCs:", error);
    throw error;
  }
};

export const getContractDetails = async (hospitalCode, suppID, tenderNo) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/contract-details?hospCode=${hospitalCode}&supplierId=${suppID}&tenderNo=${tenderNo}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching Existing RCs:", error);
    throw error;
  }
};

export const getTenderNumber = async (hospitalCode, suppID) => {
  try {
    const response = await fetchData(
      `/jhk-services/api/v1/rate-contract-dtl/tender-no?hospCode=${hospitalCode}&supplierId=${suppID}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching Existing RCs:", error);
    throw error;
  }
};

export const addTenderdetails = async (data) => {
  try {
    const response = await fetchPostData(
      `/jhk-services/api/v1/rate-contract-dtl/save-tender-dtls`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error adding branch:", error);
    throw error;
  }
};
export const uploadFileTenderdetails = async (data) => {
  try {
    const response = await fetchPostData(
      `/jhk-services/api/v1/rate-contract-dtl/upload-file`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error adding branch:", error);
    throw error;
  }
};

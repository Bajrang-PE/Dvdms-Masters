import { fetchData } from '../../../utils/ApiHook';

export const getContractTypes = async hospitalCode => {
  try {
    const response = await fetchData(
      `/v1/rate-contract-dtl/contract-type-combo?hospCode=${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const getSuppliers = async hospitalCode => {
  try {
    const response = await fetchData(
      `/v1/rate-contract-dtl/supplier-combo?hospCode=${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const getDrugNames = async hospitalCode => {
  try {
    const response = await fetchData(
      `/v1/rate-contract-dtl/drug-combo?hospCode=${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching drugs:', error);
    throw error;
  }
};

export const getStoreName = async hospitalCode => {
  try {
    const response = await fetchData(
      `/v1/rate-contract-dtl/storeName-combo?hospCode=${hospitalCode}`
    );
    return response.data;
  } catch (err) {
    console.error('Error fetching store name : ', err);
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
      `/v1/rate-contract-dtl/ratecontract-list?hospCode=${hospitalCode}&supplierId=${supplierID}&contractTypeId=${contractID}&status=${isActive}&storeId=${storeId}&itemBrandId=${itemBrandId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const getTenderNameForAddTender = async (hospitalCode, storeID) => {
  try {
    const response = await fetchData(
      `/v1/rate-contract-dtl/tender-no-for-add-tender?hospCode=${hospitalCode}&storeId=${storeID}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const getBanks = async hospitalCode => {
  try {
    const response = await fetchData(
      `/v1/rate-contract-dtl/bank-combo?hospCode=${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching banks:', error);
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
      `/v1/rate-contract-dtl/existing-rate-Contract?hospCode=${hospitalCode}&storeId=${storeID}&itemBrandId=${itemBrandId}&contractTypeId=${contractID}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching Existing RCs:', error);
    throw error;
  }
};

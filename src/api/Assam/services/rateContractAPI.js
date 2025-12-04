import { fetchData } from "../../../utils/ApiHook";

export const getManufacturers = async userID => {
  try {
    const response = await fetchData(
      `/v1/supplierMaster/getSupplier?userId=${userID}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const getContractTypes = async hospitalCode => {
  try {
    const response = await fetchData(
      `/v1/rateContracttype/getContractType?hospCode=${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const getBudgetClasses = async hospitalCode => {
  try {
    const response = await fetchData(
      `/v1/budgetMaster/getBudgetClassification?hospCode=${hospitalCode}`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const getDrugNames = async (hospitalCode, storeId, itemCatNo) => {
  try {
    const response = await fetchData(
      `/v1/drugMaster/drugList?hospitalCode=${hospitalCode}&storeId=${storeId}&itemCatno=${itemCatNo}`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching drugs:', error);
    throw error;
  }
};

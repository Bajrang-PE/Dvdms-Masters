import { fetchData, fetchPostData, fetchPutData } from "../../../utils/ApiHook";

export const getManufacturers = async (userID) => {
  try {
    const response = await fetchData(
      `/assam-services/api/assam/supplierMaster/getSupplier?userId=${userID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getMenuList = async () => {
  try {
    const response = await fetchData(`/assam-services/api/assam/menu/hierarchy`);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getContractTypes = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/assam-services/api/assam/rateContracttype/getContractType?hospCode=${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getBudgetClasses = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/assam-services/api/assam/budgetMaster/getBudgetClassification?hospCode=${hospitalCode}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getDrugNames = async (hospitalCode, storeId, itemCatNo) => {
  try {
    const response = await fetchData(
      `/assam-services/api/assam/drugMaster/drugList?hospitalCode=${hospitalCode}&storeId=${storeId}&itemCatno=${itemCatNo}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching drugs:", error);
    throw error;
  }
};

export const getPieChartData = async (
  hospCode,
  contractTypeID,
  supplierID,
  itemBrandID,
  itemCatNo
) => {
  try {
    let url = ``;

    if (!supplierID && itemBrandID) {
      url = `/assam-services/api/assam/rateContractCount/getRateContractcountNew?hospitalCode=${hospCode}&contractType=${contractTypeID}&itemBrandId=${itemBrandID}&itemCatNo=${itemCatNo}`;
    }

    if (!itemBrandID && supplierID) {
      url = `/assam-services/api/assam/rateContractCount/getRateContractcountNew?hospitalCode=${hospCode}&contractType=${contractTypeID}&supplierId=${supplierID}&itemCatNo=${itemCatNo}`;
    }

    if (itemBrandID && supplierID) {
      url = `/assam-services/api/assam/rateContractCount/getRateContractcountNew?hospitalCode=${hospCode}&contractType=${contractTypeID}&supplierId=${supplierID}&itemBrandId=${itemBrandID}&itemCatNo=${itemCatNo}`;
    }

    if (!itemBrandID && !supplierID) {
      url = `/assam-services/api/assam/rateContractCount/getRateContractcountNew?hospitalCode=${hospCode}&contractType=${contractTypeID}&itemCatNo=${itemCatNo}`;
    }

    const response = await fetchData(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getRcTableData = async (data) => {
  try {
    let url = `/assam-services/api/assam/rateContract/getAllRateContractList`;
    const response = await fetchPostData(url, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const loadTenderList = async (hospitalCode, isValid, itemCatNo) => {
  try {
    let url = `/assam-services/api/assam/TenderMaster/getTenderCombo?hospitalCode=${hospitalCode}&isvalid=${isValid}&itemcatno=${itemCatNo}`;
    const response = await fetchData(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching tender list:", error);
    throw error;
  }
};

export const getExistingTenderDetails = async (
  hospitalCode,
  isValid,
  itemCatNo,
  tenderNo
) => {
  try {
    let url = `/assam-services/api/assam/TenderMaster/getExistingTableDetails?hospitalCode=${hospitalCode}&isvalid=${isValid}&itemCatNo=${itemCatNo}&tRef=${tenderNo}`;
    const response = await fetchData(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching tender list:", error);
    throw error;
  }
};

export const modifyTenderDetails = async (data) => {
  try {
    let url = `/assam-services/api/assam/TenderMaster/updateTender`;
    const response = await fetchPutData(url, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching tender list:", error);
    throw error;
  }
};

export const getStoreDetails = async (hospCode) => {
  try {
    let url = `/assam-services/api/assam/storeMaster/getStores?hospCode=${hospCode}`;
    const response = await fetchData(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching tender list:", error);
    throw error;
  }
};

export const getLevelTypes = async (hospCode) => {
  try {
    let url = `/assam-services/api/assam/levelMaster/getLevel?hospCode=${hospCode}`;
    const response = await fetchData(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching tender list:", error);
    throw error;
  }
};

export const getPackagingType = async (hospCode) => {
  try {
    let url = `/assam-services/api/assam/PackageMaster/getPackagingList?hospitalCode=${hospCode}`;
    const response = await fetchData(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching tender list:", error);
    throw error;
  }
};

export const saveRateContract = async (data) => {
  try {
    let url = `/assam-services/api/assam/CreateRateContractMaster/saveRateContract`;
    const response = await fetchPostData(url, data);
    return response.data;
  } catch (error) {
    console.error("Error saving rate contract", error);
    throw error;
  }
};

import { fetchData, fetchPostData, fetchPutData } from "../../../utils/ApiHook";

export const getManufacturers = async (userID) => {
  try {
    const response = await fetchData(
      `/assam-services/api/v1/supplierMaster/getSupplier?userId=${userID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getMenuList = async () => {
  try {
    const response = await fetchData(`/assam-services/menu/hierarchy`);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getContractTypes = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/assam-services/api/v1/rateContracttype/getContractType?hospCode=${hospitalCode}`
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
      `/assam-services/api/v1/budgetMaster/getBudgetClassification?hospCode=${hospitalCode}`
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
      `/assam-services/api/v1/drugMaster/drugList?hospitalCode=${hospitalCode}&storeId=${storeId}&itemCatno=${itemCatNo}`
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
      url = `/assam-services/api/v1/rateContractCount/getRateContractcountNew?hospitalCode=${hospCode}&contractType=${contractTypeID}&itemBrandId=${itemBrandID}&itemCatNo=${itemCatNo}`;
    }

    if (!itemBrandID && supplierID) {
      url = `/assam-services/api/v1/rateContractCount/getRateContractcountNew?hospitalCode=${hospCode}&contractType=${contractTypeID}&supplierId=${supplierID}&itemCatNo=${itemCatNo}`;
    }

    if (itemBrandID && supplierID) {
      url = `/assam-services/api/v1/rateContractCount/getRateContractcountNew?hospitalCode=${hospCode}&contractType=${contractTypeID}&supplierId=${supplierID}&itemBrandId=${itemBrandID}&itemCatNo=${itemCatNo}`;
    }

    if (!itemBrandID && !supplierID) {
      url = `/assam-services/api/v1/rateContractCount/getRateContractcountNew?hospitalCode=${hospCode}&contractType=${contractTypeID}&itemCatNo=${itemCatNo}`;
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
    let url = `/assam-services/api/v1/rateContract/getAllRateContractList`;
    const response = await fetchPostData(url, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const loadTenderList = async (hospitalCode, isValid, itemCatNo) => {
  try {
    let url = `/assam-services/api/v1/TenderMaster/getTenderCombo?hospitalCode=${hospitalCode}&isvalid=${isValid}&itemcatno=${itemCatNo}`;
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
    let url = `/assam-services/api/v1/TenderMaster/getExistingTableDetails?hospitalCode=${hospitalCode}&isvalid=${isValid}&itemCatNo=${itemCatNo}&tRef=${tenderNo}`;
    const response = await fetchData(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching tender list:", error);
    throw error;
  }
};

export const modifyTenderDetails = async (data) => {
  try {
    let url = `/assam-services/api/v1/TenderMaster/updateTender`;
    const response = await fetchPutData(url, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching tender list:", error);
    throw error;
  }
};

export const getStoreDetails = async (hospCode) => {
  try {
    let url = `/assam-services/api/v1/storeMaster/getStores?hospCode=${hospCode}`;
    const response = await fetchData(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching tender list:", error);
    throw error;
  }
};

export const getLevelTypes = async (hospCode) => {
  try {
    let url = `/assam-services/api/v1/levelMaster/getLevel?hospCode=${hospCode}`;
    const response = await fetchData(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching tender list:", error);
    throw error;
  }
};

export const getPackagingType = async (hospCode) => {
  try {
    let url = `/assam-services/api/v1/PackageMaster/getPackagingList?hospitalCode=${hospCode}`;
    const response = await fetchData(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching tender list:", error);
    throw error;
  }
};

export const saveRateContract = async (data) => {
  try {
    let url = `/assam-services/api/v1/CreateRateContractMaster/saveRateContract`;
    const response = await fetchPostData(url, data);
    return response.data;
  } catch (error) {
    console.error("Error saving rate contract", error);
    throw error;
  }
};

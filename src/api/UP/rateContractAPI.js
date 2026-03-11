
import { fetchData, fetchPostData, fetchPutData } from "../../../utils/ApiHook";


export const getContractType = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/dvdms/contract/combo/${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getMenuList = async () => {
  try {
    const response = await fetchData(
      `/dvdms/store/combo/${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getManufacturers = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/dvdms/supplier/combo/${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};



export const getDrugName = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/dvdms/drugbrand/combo/${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};



export const getStatus = async (hospitalCode) => {
  try {
    const response = await fetchData(
      `/dvdms/drugbrand/combo/${hospitalCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};


export const getRcTableData = async (data) => {
  try {
    let url = ` ​/rate-contract​/list`;
    const response = await fetchPostData(url, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};








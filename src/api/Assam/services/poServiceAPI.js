import { fetchData, fetchPostData, fetchPutData } from "../../../utils/ApiHook";

export const getFinancialData = async () => {
  try {
    const response = await fetchData(
      `/assam-services/api/assam/PO/financialYear`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

import { fetchData, fetchPostData, fetchPutData } from "../../../utils/ApiHook";



export const getFinancialYears = async () => {
  try {
    const response = await fetchData(
      `/api/assam/PO/financialYear`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};


export const getCountList = async (financialYear) => {
  try {
    
    const response = await fetchData(
      `/api/assam/PO/getPOrderGenrationcountNew?financialYear=${financialYear}`
    );
 return response.data || response; 
  } catch (error) {
    console.error("Count fetch karne mein error:", error);
    throw error;
  }
};
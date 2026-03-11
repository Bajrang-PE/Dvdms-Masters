import { fetchData } from "../../../utils/ApiHook"


export const fetchCPListData = async (hospCode, storeId, poStoreId, poStatus, itemId, challanStatus, PoNo) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/list-data?gnumHospitalCode=${hospCode}&hstnumStoreId=${storeId}&poStoreId=${poStoreId}&poStatus=${poStatus}&hstnumItembrandId=${itemId}&hstnumChallanStatus=${challanStatus}&hstnumPoNo=${PoNo}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}

export const fetchStoreNameDrpDt = async (hospCode, userId) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/stores?hospitalCode=${hospCode}&userId=${userId}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
export const fetcDrugNameDrpDt = async (hospCode, storeId, userId) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/drugs?hospitalCode=${hospCode}&storeId=${storeId}&poStatus=${userId}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
export const fetcSuppliersDrpDt = async (hospCode, storeId, poNo) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/suppliers?hospitalCode=${hospCode}&storeId=${storeId}&poNo=${poNo}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
export const fetcPoNumberDrpDt = async (hospCode, storeId, poStatus) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/po-no?hospitalCode=${hospCode}&storeId=${storeId}&poStatus=${poStatus}&itemBrandId=${itemId}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
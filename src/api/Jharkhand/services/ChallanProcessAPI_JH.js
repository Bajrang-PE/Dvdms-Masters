import { fetchData, fetchPostData } from "../../../utils/ApiHook"


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
export const fetchDrugNameDrpDt = async (hospCode, storeId, poStatus) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/drugs?hospitalCode=${hospCode}&storeId=${storeId}&poStatus=${poStatus}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
export const fetchSuppliersDrpDt = async (hospCode, storeId, poNo) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/suppliers?hospitalCode=${hospCode}&storeId=${storeId}&poNo=${poNo}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
export const fetchPoNumberDrpDt = async (hospCode, storeId, poStatus, itemId) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/po-no?hospitalCode=${hospCode}&storeId=${storeId}&poStatus=${poStatus}&itemBrandId=${itemId}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
export const fetchChallanReceiveDetails = async (hospCode, poStoreId, storeId, poNo, suppFlag) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/receive-details?hospitalCode=${hospCode}&poStoreId=${poStoreId}&storeId=${storeId}&poNo=${poNo}&suppInterfaceFlag=${suppFlag}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
export const fetchChallanBatchItemDetails = async (hospCode, itemBrandId, location, storeId, poNo, schNo, delNo) => {
    try {
        const params = new URLSearchParams({
            gnumHospitalCode: hospCode,
            hstnumItembrandId: itemBrandId,
            hstnumDeliveryLocation: location,
            hstnumStoreId: storeId,
            hstnumPoNo: poNo,
            hstnumScheduleNo: schNo,
            hstnumDeliveryNo: delNo
        });
        const response = await fetchData(`/api/v1/challan-process/online-item-receive-dtls?${params}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
export const receiveOnlineChallanData = async (data) => {
    try {
        const response = await fetchPostData(`/api/v1/challan-process/online-receive-save`, data);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}

/////////////////////////////////////////VERIFY CHALLAN////////////////////////////////////////////////

export const fetchChallanVerifyDetails = async (hospCode, poStoreId, storeId, poNo, itemId, itemBrandId, challanNo, scheduleNo) => {
    try {
        const params = new URLSearchParams({
            hospitalCode: hospCode,
            poStoreId: poStoreId,
            storeId: storeId,
            poNo: poNo,
            itemId: itemId,
            itemBrandId: itemBrandId,
            challanNo: challanNo,
            scheduleNo: scheduleNo,
        });
        const response = await fetchData(`/api/v1/challan-process/verify-details?${params}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
export const fetchChallanVerifyProgHelpDetails = async (hospCode, storeId, itemId, itemBrandId, challanNo, batchNo) => {
    try {
        const params = new URLSearchParams({
            hospitalCode: hospCode,
            storeId: storeId,
            itemId: itemId,
            itemBrandId: itemBrandId,
            challanNo: challanNo,
            batchNo: batchNo,
        });
        const response = await fetchData(`/api/v1/challan-process/verify-program-hlp?${params}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
export const saveVerifyChallanData = async (data) => {
    try {
        const response = await fetchPostData(`/api/v1/challan-process/verify-save`, data);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}

/////////////////////////////////////////CANCEL CHALLAN////////////////////////////////////////////////

export const cancelChallan = async (data) => {
    try {
        const response = await fetchPostData(`/api/v1/challan-process/cancel-challan`, data);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
export const fetchCancelChallanDetails = async (hospCode, storeId, challanNo) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/cancel-challan-details?hospitalCode=${hospCode}&poStoreId=${storeId}&challanNo=${challanNo}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}

/////////////////////////////////////////VIEW CHALLAN////////////////////////////////////////////////

export const fetchViewChallanProcess = async (hospCode, storeId, challanNo) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/view-challan?hospitalCode=${hospCode}&storeId=${storeId}&challanNo=${challanNo}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}

export const fetchRecItemChallanDetails = async (hospCode, storeId, challanNo) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/view-received-item-details?hospitalCode=${hospCode}&storeId=${storeId}&challanNo=${challanNo}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
export const fetchVerifyItemChallanDetails = async (hospCode, storeId, challanNo,brandId,batchNo) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/view-item-verification-details?hospitalCode=${hospCode}&storeId=${storeId}&challanNo=${challanNo}&itemBrandId=${brandId}&batchNo=${batchNo}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}

/////////////////////////////////////////FREEZE CHALLAN////////////////////////////////////////////////

export const saveFreezeChallan = async (data) => {
    try {
        const response = await fetchPostData(`/api/v1/challan-process/freeze-save`, data);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
export const fetchFreezeChallanDetails = async (hospCode, poStoreId, storeId, poNo, challanNo, itemBrandId) => {
    try {
        const response = await fetchData(`/api/v1/challan-process/freeze-details?hospitalCode=${hospCode}&poStoreId=${poStoreId}&storeId=${storeId}&poNo=${poNo}&challanNo=${challanNo}&itemBrandId=${itemBrandId}`);
        return response?.data;
    } catch (error) {
        console.error('API Error : ', error);
        throw error;
    }
}
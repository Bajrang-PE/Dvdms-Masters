import { fetchData, fetchDeleteData, fetchPostData, fetchPostFormData } from "../../../utils/ApiHook";

export const getSuppIntDeskSuppliersCmb = async (hospitalCode, seatId) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/suppliers?hospitalCode=${hospitalCode}&seatId=${seatId}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskListData = async (hospitalCode, suppId, status) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/list-data?hospitalCOde=${hospitalCode}&supplierId=${suppId}&status=${status}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskScheduleNoCmb = async (hospitalCode, storeId, delStoreId, poNo) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/get-schedule-no-cmb?hospCode=${hospitalCode}&storeId=${storeId}&delStoreId=${delStoreId}&poNo=${poNo}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskConsigneeWrhsCmb = async (hospitalCode, storeId, poNo) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/consignee-warehouse-cmb?hospCode=${hospitalCode}&poStoreId=${storeId}&poNo=${poNo}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskDeliveryDetails = async (hospitalCode, poNo, poStoreId) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/delivery-dtls?hospCode=${hospitalCode}&poNo=${poNo}&poStoreId=${poStoreId}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskPrevBatchDtls = async (hospitalCode, supplierId, itemBrandId) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/get-previous-batch-details?hospitalCode=${hospitalCode}&supplierId=${supplierId}&itemBrandId=${itemBrandId}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskBatchDtlItemCmb = async (hospitalCode, supplierId) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/batch-details?hospitalCode=${hospitalCode}&supplierId=${supplierId}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskVeiwDeldetail = async (hospitalCode, poNo, scheduleNo, delStoreId, deliveryNo) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/view-delivery-dtl?hospCode=${hospitalCode}&poNo=${poNo}&scheduleNo=${scheduleNo}&delStoreId=${delStoreId}&deliveryNo=${deliveryNo}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskDrugCmbData = async (hospitalCode, poNo, storeId, scheduleNo, delStoreId) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/get-drugs?hospCode=${hospitalCode}&poNo=${poNo}&storeId=${storeId}&scheduleNo=${scheduleNo}&delStoreId=${delStoreId}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskDccReqBatchDetails = async (hospitalCode, suppId, poNo, storeId) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/dcc-req-dtl?hospCode=${hospitalCode}&suppId=${suppId}&poNo=${poNo}&poStoreId=${storeId}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskQRBatchDetails = async (hospitalCode, suppId, poNo, storeId) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/get-qr-batch-dtl?hospCode=${hospitalCode}&suppId=${suppId}&poNo=${poNo}&poStoreId=${storeId}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskReceiveDetails = async (hospitalCode, storeId, poNo) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/receive-details?gnumHospitalCode=${hospitalCode}&poStoreId=${storeId}&hstnumPoNo=${poNo}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskBillDetails = async (hospitalCode, storeId, poNo) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/get-bill-details?gnumHospitalCode=${hospitalCode}&poStoreId=${storeId}&hstnumPoNo=${poNo}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};


export const deleteSuppIntDeskDelDetail = async (data) => {
    try {
        const response = await fetchPostData(
            `/api/v1/supplier-interface-desk/by-batch`, data
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const fetchSuppIntDeskItemDetails = async (data) => {
    try {
        const response = await fetchPostData(
            `/api/v1/supplier-interface-desk/get-item-details`, data
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskPopUpSuppInvDetails = async (deliveryNo, poStoreId) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/pop-on-supp-challan-no?deliveryNo=${deliveryNo}&poStoreId=${poStoreId}&scheduleNo=1&poNo=10282000004`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSuppIntDeskBankDetails = async (hospCode, suppId) => {
    try {
        const response = await fetchData(
            `/api/v1/supplier-interface-desk/bank-dtl?hospCode=${hospCode}&suppId=${suppId}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const deleteSuppIntDeskBatchDetail = async (hospitalCode, supplierId, itemBrandId, batchNo) => {
    try {
        const response = await fetchPostData(
            `/api/v1/supplier-interface-desk/delete-batch?hospitalCode=${hospitalCode}&supplierId=${supplierId}&itemBrandId=${itemBrandId}&batchNo=${batchNo}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const modifyPrevBatchDetails = async (data) => {
    try {
        const response = await fetchPostFormData(
            `/api/v1/supplier-interface-desk/update-nabl-dtl`,
            data
        );
        return response?.data;
    } catch (error) {
        console.error("Error adding branch:", error);
        throw error;
    }
};

export const addNewBatchDetails = async (data) => {
    try {
        const response = await fetchPostFormData(
            `/api/v1/supplier-interface-desk/save-batch-details`,
            data
        );
        return response?.data;
    } catch (error) {
        console.error("Error adding branch:", error);
        throw error;
    }
};
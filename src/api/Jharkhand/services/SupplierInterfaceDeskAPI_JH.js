import { fetchData, fetchPostData } from "../../../utils/ApiHook";

export const getSuppIntDeskSuppliersCmb = async (hospitalCode, seatId) => {
    try {
        const response = await fetchData(
            `/jhk-services/api/v1/supplier-interface-desk/suppliers?hospitalCode=${hospitalCode}&seatId=${seatId}`
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
            `/jhk-services/api/v1/supplier-interface-desk/list-data?hospitalCOde=${hospitalCode}&supplierId=${suppId}&status=${status}`
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
            `/jhk-services/api/v1/supplier-interface-desk/delivery-dtls?hospCode=${hospitalCode}&poNo=${poNo}&poStoreId=${poStoreId}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};


export const modifySinglePoDwhPoModifySave = async (data) => {
    try {
        const response = await fetchPostData(
            `/jhk-services/api/v1/single-po-gen/po-modify-details`, data
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};
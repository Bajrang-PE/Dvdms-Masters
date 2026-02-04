import { fetchData, fetchPostData } from "../../../utils/ApiHook";

export const getSinglePoStoreName = async (hospitalCode, seatId) => {
    try {
        const response = await fetchData(
            `/jhk-services/api/v1/single-po-gen/store-name?hospCode=${hospitalCode}&seatId=${seatId}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSinglePoListData = async (hospitalCode, storeId, status) => {
    try {
        const response = await fetchData(
            `/jhk-services/api/v1/single-po-gen/list-data?hospCode=${hospitalCode}&storeId=${storeId}&status=${status}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSinglePoCancelPoData = async (hospitalCode, storeId, poNo) => {
    try {
        const response = await fetchData(
            `/jhk-services/api/v1/single-po-gen/cancel-purchase-order?hospCode=${hospitalCode}&StoreId=${storeId}&poNo=${poNo}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSinglePoComponentDetails = async (hosCode, poType, mode, storeId, poNo) => {
    try {
        const response = await fetchData(
            `/jhk-services/api/v1/single-po-gen/component-details?hospCode=${hosCode}&poTypeId=${poType}&mode=${mode}&storeId=${storeId}&poNo=${poNo}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSinglePoPrograammeCombo = async (hosCode, storeId, brandId, identPrd) => {
    try {
        const response = await fetchData(
            `/jhk-services/api/v1/single-po-gen/programme-combo?hospCode=${hosCode}&storeId=${storeId}&brandId=${brandId}&indentPeriod=${identPrd}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSinglePoFundingSrcCmbWithGst = async (hosCode, storeId, budgetClassId, programmeId) => {
    try {
        const response = await fetchData(
            `/jhk-services/api/v1/single-po-gen/fundingsrc-combo-with-gst?hospCode=${hosCode}&storeId=${storeId}&budgetClassId=${budgetClassId}&programmeId=${programmeId}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSinglePoTestingData = async (data) => {
    try {
        const response = await fetchPostData(
            `/jhk-services/api/v1/single-po-gen/testing`, data
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSinglePoDwhPoDetails = async (data) => {
    try {
        const response = await fetchPostData(
            `/jhk-services/api/v1/single-po-gen/dwh-po-details`, data
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const modifySinglePoDwhPoCancelSave = async (data) => {
    try {
        const response = await fetchPostData(
            `/jhk-services/api/v1/single-po-gen/cancel-save`, data
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
            `/jhk-services/api/v1/single-po-gen/update-po`, data
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};
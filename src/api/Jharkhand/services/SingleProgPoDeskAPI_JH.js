import { fetchData, fetchPostData } from "../../../utils/ApiHook";

export const getSinglePoStoreName = async (hospitalCode, seatId) => {
    try {
        const response = await fetchData(
            `/api/v1/single-po-gen/store-name?hospCode=${hospitalCode}&seatId=${seatId}`
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
            `/api/v1/single-po-gen/list-data?hospCode=${hospitalCode}&storeId=${storeId}&status=${status}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getSinglePoItemCmbData = async (hospitalCode, authType) => {
    try {
        const response = await fetchData(
            `/api/v1/single-po-gen/po-item-list?hospCode=${hospitalCode}&authType=${authType}`
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
            `/api/v1/single-po-gen/cancel-purchase-order?hospCode=${hospitalCode}&StoreId=${storeId}&poNo=${poNo}`
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
            `/api/v1/single-po-gen/component-details?hospCode=${hosCode}&poTypeId=${poType}&mode=${mode}&storeId=${storeId}&poNo=${poNo}`
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
            `/api/v1/single-po-gen/programme-combo?hospCode=${hosCode}&storeId=${storeId}&brandId=${brandId}&indentPeriod=${identPrd}`
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
            `/api/v1/single-po-gen/fundingsrc-combo-with-gst?hospCode=${hosCode}&storeId=${storeId}&budgetClassId=${budgetClassId}&programmeId=${programmeId}`
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
            `/api/v1/single-po-gen/testing`, data
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
            `/api/v1/single-po-gen/dwh-po-details`, data
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
            `/api/v1/single-po-gen/cancel-save`, data
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
            `/api/v1/single-po-gen/update-po`, data
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getPoTypeCombo = async (hospitalCode, storeId, cat) => {
    try {
        const response = await fetchData(
            `/api/v1/single-po-gen/po-types-combo?hospCode=${hospitalCode}&storeId=${storeId}&itemCat=${cat}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getJHPoProgramCombo = async (hospitalCode, storeId, brandId, period) => {
    try {
        const response = await fetchData(
            `/api/v1/single-po-gen/programme-combo?hospCode=${hospitalCode}&storeId=${storeId}&brandId=${brandId}&indentPeriod=${period}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getJHPoFundingSrcCombo = async (hospitalCode, storeId, drugClCode, prgId, period) => {
    try {
        const response = await fetchData(
            `/api/v1/single-po-gen/funding-source-combo?hospCode=${hospitalCode}&storeId=${storeId}&drugClassCode=${drugClCode}&programmeId=${prgId}&poGenPeriod=${period}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getJHPoInitDataVerifyByCombo = async (hospitalCode, storeId) => {
    try {
        const response = await fetchData(
            `/api/v1/single-po-gen/init-data?hospCode=${hospitalCode}&storeId=${storeId}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getJHPoSupplierValues = async (data) => {
    try {
        const response = await fetchPostData(
            `/api/v1/single-po-gen/get-supplier-values`, data
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getJHPoDwhPoDetails = async (data) => {
    try {
        const response = await fetchPostData(
            `/api/v1/single-po-gen/get-dwh-po-hlp`, data
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};


export const saveJhGenerateNewPo = async (data) => {
    try {
        const response = await fetchPostData(
            `/api/v1/single-po-gen/insert-new-po`, data
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

///////////////////////////////////////INDENT APIS /////////////////////////////////////////////////////

export const getJHPoIndentNumberCombo = async () => {
    try {
        const response = await fetchData(
            `/api/v1/single-po-gen/indent-cell-po-dtl`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getJHPoIndentProgramCombo = async (hospitalCode, indentNo) => {
    try {
        const response = await fetchData(
            `/api/v1/single-po-gen/indent-cell-po-prog-dtl?hospCode=${hospitalCode}&indentPoNo=${indentNo}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getJHPoIndentFundingSrcCombo = async (hospitalCode, storeId, indentNo, prgId, period) => {
    try {
        const response = await fetchData(
            `/api/v1/single-po-gen/indent-cell-po-funding-src?hospCode=${hospitalCode}&storeId=${storeId}&indentPoNo=${indentNo}&programmeId=${prgId}&indentPeriod=${period}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getJHPoIndenDrugNameCombo = async (hospitalCode, indentNo) => {
    try {
        const response = await fetchData(
            `/api/v1/single-po-gen/indent-cell-po-drug-dtl?hospCode=${hospitalCode}&indentPoNo=${indentNo}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};

export const getJHSinglePoGstNo = async (hospitalCode, storeId) => {
    try {
        const response = await fetchData(
            `/api/v1/single-po-gen/gst-no?hospCode=${hospitalCode}&storeId=${storeId}`
        );
        return response.data;
    } catch (err) {
        console.error("Error fetching store name : ", err);
        throw err;
    }
};
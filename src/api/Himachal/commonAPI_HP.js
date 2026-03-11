import { fetchData } from "../../utils/ApiHook";


export const getCommonHpStoreNameCmb = async (hospitalCode, seatid) => {
    try {
        const response = await fetchData(
            `/hp-api/stores/${seatid}?hospitalCode=${hospitalCode}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getCommonHpFinYearCmb = async (hospitalCode, size) => {
    try {
        const response = await fetchData(
            `/hp-api/common/fy-combo?hospitalCode=${hospitalCode}&size=${size}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getCommonHpStoreDetailsCmb = async (hospitalCode, storeId) => {
    try {
        const response = await fetchData(
            `/hp-api/stores/details/${storeId}?hospitalCode=${hospitalCode}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getCommonHpBudgetDetailsCmb = async (hospitalCode, storeId, fundingId, prgId, finYear) => {
    try {
        const response = await fetchData(
            `/hp-api/budget/budget-details?hospitalCode=${hospitalCode}&fundingSourceId=${fundingId}&programmeId=${prgId}&storeId=${storeId}&financialYear=${finYear}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpRcListData = async (hospitalCode, itemBrandId, suppId, contractTypeId, status, pageNo, size) => {
    try {
        const params = new URLSearchParams();
        // required
        params.append("hospitalCode", hospitalCode);
        if (suppId) params.append("supplierId", suppId);
        if (itemBrandId) params.append("itemBrandId", itemBrandId);
        if (contractTypeId) params.append("contractTypeId", contractTypeId);
        if (status) params.append("status", status);
        if (pageNo !== undefined) params.append("page", pageNo);
        params.append("size", size || 10000);

        const response = await fetchData(
            `/hp-api/rate-contracts?${params.toString()}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};
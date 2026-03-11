import { fetchData } from "../../../utils/ApiHook";


export const getHpPoGenStatusCmb = async () => {
    try {
        const response = await fetchData(
            `/hp-api/purchase-orders/status-combo`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpPoGenListData = async (hospitalCode, storeId, financialYear, status, pageNo, size) => {
    try {
        const params = new URLSearchParams();
        // required
        params.append("hospitalCode", hospitalCode);
        if (storeId) params.append("storeId", storeId);
        if (financialYear) params.append("financialYear", financialYear);
        if (status) params.append("status", status);
        if (pageNo !== undefined) params.append("page", pageNo);
        params.append("size", size || 10000);

        const response = await fetchData(
            `/hp-api/purchase-orders/po-list?${params.toString()}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpPoGenGraphDataCounts = async (hospitalCode, storeId, financialYear) => {
    try {
        const response = await fetchData(
            `/hp-api/purchase-orders/po-kpi-data?hospitalCode=${hospitalCode}&storeId=${storeId}&financialYear=${financialYear}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpPoTypeCmb = async (hospitalCode, storeId) => {
    try {
        const response = await fetchData(
            `/hp-api/purchase-orders/po-type-combo?hospitalCode=${hospitalCode}&storeId=${storeId}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpPoItemCmb = async (hospitalCode, storeId, poTypeId, finYear) => {
    try {
        const response = await fetchData(
            `/hp-api/purchase-orders/po-item-combo?hospitalCode=${hospitalCode}&poStoreId=${storeId}&poTypeId=${encodeURIComponent(poTypeId)}&financialYear=${finYear}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpPoProgrammeCmb = async (hospitalCode, storeId, itemId, finYear) => {
    try {
        const response = await fetchData(
            `/hp-api/purchase-orders/program-combo?hospitalCode=${hospitalCode}&storeId=${storeId}&itemBrandId=${itemId}&financialYear=${finYear}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpPoFundingSourceCmb = async (hospitalCode, prgId, finYear) => {
    try {
        const response = await fetchData(
            `/hp-api/purchase-orders/funding-source-combo?hospitalCode=${hospitalCode}&programId=${prgId}&financialYear=${finYear}&drugClassId=10`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

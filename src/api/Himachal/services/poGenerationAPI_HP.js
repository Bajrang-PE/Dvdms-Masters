import { fetchData, fetchPostData } from "../../../utils/ApiHook";


export const getHpPoGenStatusCmb = async () => {
    try {
        const response = await fetchData(
            `/hp-po-api/purchase-orders/status-combo`
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
            `/hp-po-api/purchase-orders/po-list?${params.toString()}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpPoGenGraphDataCounts = async (hospitalCode, storeId, financialYear) => {
    try {
        const params = new URLSearchParams();

        params.append("hospitalCode", hospitalCode);
        if (storeId) params.append("storeId", storeId);
        if (financialYear) params.append("financialYear", financialYear);

        const response = await fetchData(
            `/hp-po-api/purchase-orders/po-kpi-data?${params.toString()}`
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
            `/hp-po-api/purchase-orders/po-type-combo?hospitalCode=${hospitalCode}&storeId=${storeId}`
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
            `/hp-po-api/purchase-orders/po-item-combo?hospitalCode=${hospitalCode}&poStoreId=${storeId}&poTypeId=${encodeURIComponent(poTypeId)}&financialYear=${finYear}`
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
            `/hp-po-api/purchase-orders/program-combo?hospitalCode=${hospitalCode}&storeId=${storeId}&itemBrandId=${itemId}&financialYear=${finYear}`
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
            `/hp-po-api/purchase-orders/funding-source-combo?hospitalCode=${hospitalCode}&programId=${prgId}&financialYear=${finYear}&drugClassId=10`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};
export const getHpPoPrefixCmb = async (hospitalCode) => {
    try {
        const response = await fetchData(
            `/hp-po-api/purchase-orders/po-prefix-combo?hospitalCode=${hospitalCode}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};
export const addPoHpPODetails = async (data) => {
    try {
        const response = await fetchPostData(
            `/hp-po-api/purchase-orders/save`, data
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpPoDetails = async (hospitalCode, poNo, storeId) => {
    try {
        const response = await fetchData(
            `/hp-po-api/purchase-orders/details?hospitalCode=${hospitalCode}&poNo=${poNo}&storeId=${storeId}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpComponentDetails = async (hospitalCode, poNo, storeId) => {
    try {
        const response = await fetchData(
            `/hp-po-api/purchase-orders/po-components?hospitalCode=${hospitalCode}&poNo=${poNo}&storeId=${storeId}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};


/////////////////////////////////////////PO APPROVAL///////////////////////////////////////////////

export const getHpPoApprStatusCmbDetails = async () => {
    try {
        const response = await fetchData(
            `/hp-po-api/purchase-orders/approval-status-combo`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpPoApprKpiDataCountsDetails = async (hospitalCode, storeId) => {
    try {
        const response = await fetchData(
            `/hp-po-api/purchase-orders/approval-kpi-data?hospitalCode=${hospitalCode}&storeId=${storeId}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const saveApprovedPoDetails = async (data) => {
    try {
        const response = await fetchPostData(`/hp-po-api/purchase-orders/approve`, data);
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};



///////////////////////////////////PO CANCELATION//////////////////////////////////////

export const getHpPoCancScheduleCmbDetails = async (poNo, storeId, hospitalCode) => {
    try {
        const response = await fetchData(
            `/hp-po-api/purchase-orders/schedules-combo?poNo=${poNo}&storeId=${storeId}&hospitalCode=${hospitalCode}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpPoCancItemCmbBySchDetails = async (poNo, scheduleNo, hospitalCode) => {
    try {
        const response = await fetchData(
            `/hp-po-api/purchase-orders/items-by-schedule-combo?poNo=${poNo}&scheduleNo=${scheduleNo}&hospitalCode=${hospitalCode}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpPoCancPoNoCombo = async (hospitalCode, storeId, suppId) => {
    try {
        const response = await fetchData(
            `/hp-po-api/purchase-orders/stop-delivery-po-combo?hospitalCode=${hospitalCode}&storeId=${storeId}&suppId=${suppId}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpPoCancProgramCombo = async (hospitalCode, storeId, poNo, suppId, schNo, brandId) => {
    try {
        const response = await fetchData(
            `/hp-po-api/purchase-orders/stop-delivery-programme-combo?hospitalCode=${hospitalCode}&storeId=${storeId}&poNo=${poNo}&suppId=${suppId}&schNo=${schNo}&brandId=${brandId}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpPoCancConsigneeDetails = async (hospitalCode, storeId, poNo) => {
    try {
        const response = await fetchData(
            `/hp-po-api/purchase-orders/po-item-details?hospitalCode=${hospitalCode}&storeId=${storeId}&poNo=${poNo}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const saveHpPoCancelDetails = async (data) => {
    try {
        const response = await fetchPostData(`/hp-po-api/purchase-orders/cancel`, data);
        return response.data;
    } catch (error) {
        console.error("API Error : ", err);
        throw err;
    }
}
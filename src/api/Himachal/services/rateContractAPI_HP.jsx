import { fetchData, fetchPostData, fetchPostFormData, fetchPutData } from "../../../utils/ApiHook";


export const getHpRcContractTypesCmb = async (hospitalCode, status) => {
    try {
        const response = await fetchData(
            `/hp-api/rate-contracts/type-combo?hospitalCode=${hospitalCode}&status=${status}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
};

export const getHpRcSuppliersCmb = async (hospitalCode, contractTypeId, status) => {
    try {
        const response = await fetchData(
            `/hp-api/rate-contracts/supplier-combo?hospitalCode=${hospitalCode}&contractTypeId=${contractTypeId || ""}&status=${status || ""}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
};

export const getHpRcDrugNamesCmb = async (hospitalCode, supplierId, contractTypeId, status) => {
    try {
        const response = await fetchData(
            `/hp-api/rate-contracts/item-combo?hospitalCode=${hospitalCode}&supplierId=${supplierId || ""}&contractTypeId=${contractTypeId || ""}&status=${status || ""}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching drugs:", error);
        throw error;
    }
};

export const getHpRcStoreNameCmb = async (hospitalCode, seatid) => {
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

export const getHpRcStatusCmb = async () => {
    try {
        const response = await fetchData(
            `/hp-api/rate-contracts/rc-status-combo`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpRcSingleRcDetails = async (hospitalCode, rcId) => {
    try {
        const response = await fetchData(
            `/hp-api/rate-contracts/${rcId}?hospitalCode=${hospitalCode}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpRcGraphDataCounts = async (hospitalCode, suppId, itemBrandId, contractTypeId) => {
    try {
        const response = await fetchData(
            `/hp-api/rate-contracts/rc-kpi-data?hospitalCode=${hospitalCode}&supplierId=${suppId}&itemBrandId=${itemBrandId}&contractTypeId=${contractTypeId}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

export const getHpRcListData = async (hospitalCode, suppId, itemBrandId, contractTypeId, status, pageNo, size) => {
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

export const getHpRcTenderCombo = async (hospitalCode, storeId, rcId) => {
    try {
        const response = await fetchData(
            `/hp-api/tenders/combo-by-store-rc-type?hospitalCode=${hospitalCode}&storeId=${storeId}&rcTypeId=${rcId}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};
export const getHpRcSupplierCombo = async (hospitalCode, status) => {
    try {
        const response = await fetchData(
            `/hp-api/supplier/combo?hospitalCode=${hospitalCode}&status=${status || 1}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};
export const getHpRcSuppTenderDetails = async (hospitalCode, tenderNo) => {
    try {
        const response = await fetchData(
            `/hp-api/tenders/tender-list?hospitalCode=${hospitalCode}&tenderNo=${tenderNo}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};
export const getHpRcSuppEmdDetails = async (hospitalCode, suppId, tenderNo) => {
    try {
        const response = await fetchData(
            `/hp-api/tenders/bg-details?hospitalCode=${hospitalCode}&supplierId=${suppId}&tenderNo=${tenderNo}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};
export const getHpRcEmdRefundDetails = async (hospitalCode, tenderNo) => {
    try {
        const response = await fetchData(
            `/hp-api/tenders/refund-details?hospitalCode=${hospitalCode}&tenderNo=${tenderNo}`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};
export const saveHpRcTenderDetails = async (data) => {
    try {
        const response = await fetchPostData(`/hp-api/tenders/create`, data);
        return response?.data;
    } catch (error) {
        console?.error("API Error : ", error)
        throw error
    }
}
export const saveHpRcNewEmdDetails = async (data) => {
    try {
        const response = await fetchPostData(`/hp-api/tenders/bg-save`, data);
        return response?.data;
    } catch (error) {
        console?.error("API Error : ", error)
        throw error
    }
}
export const saveHpRcFileUpload = async (data) => {
    try {
        const response = await fetchPostFormData(`/hp-api/files/upload`, data);
        return response?.data;
    } catch (error) {
        console?.error("API Error : ", error)
        throw error
    }
}
export const saveHpRcRefundEmdDetails = async (data) => {
    try {
        const response = await fetchPutData(`/hp-api/tenders/bg-refund`, data);
        return response?.data;
    } catch (error) {
        console?.error("API Error : ", error)
        throw error
    }
}
export const saveHpRcBankCombo = async (hospitalCode) => {
    try {
        const response = await fetchData(`/hp-api/banks/combo?hospitalCode=${hospitalCode}`);
        return response?.data;
    } catch (error) {
        console?.error("API Error : ", error)
        throw error
    }
}
export const saveHpRcBankBranches = async (hospitalCode, bankId, distId) => {
    try {
        const response = await fetchData(`/hp-api/banks/combo-branches?hospitalCode=${hospitalCode}&bankId=${bankId}&districtId=${distId || 0}`);
        return response?.data;
    } catch (error) {
        console?.error("API Error : ", error)
        throw error
    }
}


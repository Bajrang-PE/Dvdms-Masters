import { fetchData, fetchPostData } from "../../../utils/ApiHook";


export const getPoStatusComboData = async () => {
    try {
        const response = await fetchData("/api/v1/po-approval/po-status");
        return response?.data;
    } catch (error) {
        console.error("API Error", error)
        throw error;
    }
}

export const getPoStoreNameComboData = async (hospCode) => {
    try {
        const response = await fetchData(`/api/v1/po-approval/store-names?hospitalCode=${hospCode}`);
        return response?.data;
    } catch (error) {
        console.error("API Error", error)
        throw error;
    }
}

export const getPoApprovalGraphData = async (hospCode, storeId) => {
    try {
        const response = await fetchData(`/api/v1/po-approval/graph-data?hospitalCode=${hospCode}&storeId=${storeId}`);
        return response?.data;
    } catch (error) {
        console.error("API Error", error)
        throw error;
    }
}

export const getPoApprovalListData = async (hospCode, storeId, status) => {
    try {
        const response = await fetchData(`/api/v1/po-approval/list?hospCode=${hospCode}&storeId=${storeId}&poStatus=${status}`);
        return response?.data;
    } catch (error) {
        console.error("API Error", error)
        throw error;
    }
}

export const rejectPoGenerationData = async (data) => {
    try {
        const response = await fetchPostData(`/api/v1/po-approval/po-reject`, data);
        return response?.data;
    } catch (error) {
        console.error("API Error", error)
        throw error;
    }
}

export const approvePoGenerationData = async (data) => {
    try {
        const response = await fetchPostData(`/api/v1/po-approval/po-approve-save`, data);
        return response?.data;
    } catch (error) {
        console.error("API Error", error)
        throw error;
    }
}
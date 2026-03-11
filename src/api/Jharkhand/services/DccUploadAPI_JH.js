import { fetchData, fetchPostData } from "../../../utils/ApiHook"

export const fetchPendingDccDetails = async (hospitalCode) => {
    try {
        const response = await fetchData(`/api/v1/dcc-uploads/pending?hospitalCode=${hospitalCode}`);
        return response?.data;
    } catch (error) {
        console.error('API Error', error);
        throw error;
    }
}

export const fetchDccInitDetails = async (poNo) => {
    try {
        const response = await fetchData(`/api/v1/dcc-uploads/dcc-init-details/${poNo}`);
        return response?.data;
    } catch (error) {
        console.error('API Error', error);
        throw error;
    }
}

export const addDccUploadDetails = async (data) => {
    try {
        const response = await fetchPostData(`/api/v1/dcc-uploads`, data);
        return response?.data;
    } catch (error) {
        console.error('API Error', error);
        throw error;
    }
}

export const fetchViewDccDetails = async (hospitalCode, status, poNo) => {
    try {

        const response = await fetchData(`/api/v1/dcc-uploads/view-dcc-details?hospCode=${hospitalCode}&poNo=${poNo || 0}&status=${status}`);
        return response?.data;
    } catch (error) {
        console.error('API Error', error);
        throw error;
    }
}
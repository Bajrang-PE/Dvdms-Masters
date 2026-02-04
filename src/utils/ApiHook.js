import axios from "axios";

const BaseUrl = '  http://10.226.27.173:8094';
// const BaseUrl = 'http://10.226.17.6:8084';
// const BaseUrl = 'http://10.226.29.202:8091';

//const BaseUrl = "http://10.226.29.154:8080/api"; //AD AS
// const BaseUrl = "http://10.226.30.86:8091"; //Main Gateway

axios.defaults.baseURL = BaseUrl;

// const getAccessToken = () => {
//     return sessionStorage.getItem('accessToken');
// };

// const getCsrfToken = () => {
//     return Cookies.get('csrfToken');
// };

// Set the Authorization header globally using an interceptor
// axios.interceptors.request.use(
//     (config) => {
//         const accessToken = getAccessToken();
//         const CsrfToken = getCsrfToken();
//         if (accessToken) {
//             config.headers['Authorization'] = `Bearer ${accessToken}`;
//             config.headers['X-CSRF-TOKEN'] = CsrfToken;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// axios.interceptors.response.use(
//     async (response) => {
//         if (response?.data?.status && response?.data?.status === 401) {
//             ToastAlert('Session expired. Please log in again.', 'error');
//         } else {
//             return response;
//         }
//     },
//     async (error) => {
//         if (error.response) {
//             const { status, data } = error.response;
//             if (status === 401 || status === 403) {
//                 ToastAlert(data?.error, 'error');
//             }
//         }
//         return Promise.reject(error);
//     }
// );

export const fetchData = async (url, params = null) => {
  try {
    const response = await axios.get(url, { params: params || "" });
    const decryptedData = response;
    return decryptedData;
  } catch (error) {
    console.error("Error in fetchData:", error);
    throw error;
  }
};

export const fetchPostData = async (url, data) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error in fetchPostData:", error);
    throw error;
  }
};

export const fetchPutData = async (url, data) => {
  try {
    const response = await axios.put(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error in fetchPutData:", error);
    throw error;
  }
};

export const fetchDeleteData = async (url, payload) => {
  try {
    const response = await axios.delete(url, { data: payload }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log("API Error:", error);
  }
};

export const fetchUpdateData = async (url, data) => {
  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    console.log("API Error:", error);
  }
};


// New function specifically for FormData/multipart requests
export const fetchPostFormData = async (url, formData) => {
  try {
    const response = await axios.post(url, formData, {
      headers: {
        // Don't set Content-Type - let browser set it with boundary
        // This is important for FormData to work correctly
      },
    });
    return response;
  } catch (error) {
    console.error("Error in fetchFormData:", error);
    throw error;
  }
};
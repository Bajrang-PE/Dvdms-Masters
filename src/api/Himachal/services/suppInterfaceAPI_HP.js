import { fetchBlobData, fetchData, fetchPatchData, fetchPostData, fetchPostFormData, fetchPutData } from "../../../utils/ApiHook";


export const getHpRcSuppliersCmb = async (hospitalCode, contractTypeId, status) => {
    try {
        const response = await fetchData(
            `/hp-po-api/rate-contracts/supplier-combo?hospitalCode=${hospitalCode}&contractTypeId=${contractTypeId || ""}&status=${status || ""}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
};



export const getHpRcStatusCmb = async () => {
    try {
        const response = await fetchData(
            `/hp-po-api/supplier/status-combo`
        );
        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};



export const getHpSupplierListData = async (hospitalCode, suppId, status, pageNo, size) => {
    try {
        const params = new URLSearchParams();

        params.append("hospCode", hospitalCode);

        if (suppId && suppId !== "0") {
            params.append("supplierId", suppId);
        }

        if (status) {
            params.append("status", status);
        }

        // if (pageNo !== undefined) params.append("page", pageNo);
        // params.append("size", size || 10000);

        const response = await fetchData(
            `/hp-po-api/supplier/list-data?${params.toString()}`
        );

        return response.data;
    } catch (err) {
        console.error("API Error : ", err);
        throw err;
    }
};

// export const getHpSupplierListData = async (hospitalCode, suppId, status, pageNo, size) => {
//     try {
//         const params = new URLSearchParams();
//         // required
//         params.append("hospCode", hospitalCode);
//         if (suppId) params.append("supplierId", suppId);
//         if (status) params.append("status", status);
//         // if (pageNo !== undefined) params.append("page", pageNo);
//         // params.append("size", size || 10000);

//         const response = await fetchData(
//             `/hp-po-api/supplier/supplier-list?${params.toString()}`
//         );
//         return response.data;
//     } catch (err) {
//         console.error("API Error : ", err);
//         throw err;
//     }
// };


export const getHpRcDrugNamesCmb = async (supplierId , hospitalCode) => {
    try {
        const response = await fetchData(
            `/hp-po-api/supplier/batch-dtl-drugs?supplierId=${supplierId}&hospitalCode=${hospitalCode || ""}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching drugs:", error);
        throw error;
    }
};


export const getHpsubBatchDrugListCmb = async (supplierId , hospitalCode,brandId,nablFlag ) => {
    try {
        const response = await fetchData(
            `/hp-po-api/supplier/batch-dtl-previous?supplierId=${supplierId}&hospitalCode=${hospitalCode}&brandId=${brandId || ""}&nablFlag=${nablFlag}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching drugs:", error);
        throw error;
    }
};



export const getHpSupplierDeliveryDetails = async (poNo, storeId, hospitalCode) => {
    try {
        const response = await fetchData(
            `/hp-po-api/supplier/delivery-details?hospCode=${hospitalCode}&poNo=${poNo}&storeId=${storeId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier delivery details:", error);
        throw error;
    }
};
//-------------------------------------------/supplier/supplier-delivery-details-------------------------------------------------------------------



export const getHpSupplierDeliveryDetailsdata = async (poNo, storeId, hospitalCode) => {
    try {
        const response = await fetchData(
            `/hp-po-api/supplier/supplier-delivery-details?hospCode=${hospitalCode}&poNo=${poNo}&storeId=${storeId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier delivery details:", error);
        throw error;
    }
};



export const getHpScheduleNoChDrugName = async (poNo, storeId, hospitalCode) => {
    try {
        const response = await fetchData(
            `/hp-po-api/supplier/item-details?hospCode=${hospitalCode}&poNo=${poNo}&storeId=${storeId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier delivery details:", error);
        throw error;
    }
};



export const getHpViewDetails = async (params) => {
    try {
        const { hospCode, poStoreId, delStoreId, poNo, poTypeId, itemCat } = params;
        const response = await fetchData(
            `/hp-po-api/supplier/view-details?hospCode=${hospCode}&poStoreId=${poStoreId}&delStoreId=${delStoreId}&poNo=${poNo}&poTypeId=${poTypeId}&itemCat=${itemCat}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier delivery details:", error);
        throw error;
    }
};

//-------------------------------------------/supplier/batch-save-------------------------------------------------------------------
export const saveBatchDetaildetails = async (data) => {
    try {
        const response = await fetchPostData(`/hp-po-api/supplier/batch-save`, data);
        return response?.data;
    } catch (error) {
        console?.error("API Error : ", error)
        throw error
    }
}

export const deleteBatchDetails = async (data) => {
    try {
        const response = await fetchPostData(`/hp-po-api/supplier/delete-batch-details`, data);
        return response?.data;
    } catch (error) {
        console.error("Delete API Error: ", error);
        throw error;
    }
}
//-------------------------------------------/supplier/delivery-save-------------------------------------------------------------------

export const savesupplierdeliverysave = async (data) => {
    try {
        const response = await fetchPostData(`/hp-po-api/supplier/delivery-save`, data);
        return response?.data;
    } catch (error) {
        console?.error("API Error : ", error)
        throw error
    }
}




//---------------------------------/supplier/update-nabl-reports----------------------------------------------------------------------
export const supplierupdatenablreportssave = async (data) => {
    try {
        const response = await fetchPostData(`/hp-po-api/supplier/update-nabl-reports`, data);
        return response?.data;
    } catch (error) {
        console.error("Delete API Error: ", error);
        throw error;
    }
}


//---------------------------------/supplier/receive-save----------------------------------------------------------------------
export const supplierreceivesave = async (data) => {
    try {
        const response = await fetchPostData(`/hp-po-api/supplier/receive-save`, data);
        return response;
    } catch (error) {
        console.error("Delete API Error: ", error);
        throw error;
    }
}




//---------------------------------/supplier/fdr-save----------------------------------------------------------------------
export const supplierfdrsave = async (data) => {
    try {
        const response = await fetchPostData(`/hp-po-api/supplier/fdr-save`, data);
        return response?.data;
    } catch (error) {
        console.error("Delete API Error: ", error);
        throw error;
    }
}




//--------------------------------/supplier/delete-delivery-details----------------------------------------------------------------------
export const supplierdeletedeliverydetails = async (data) => {
    try {
        const response = await fetchPostData(`/hp-po-api/supplier/delete-delivery-details`, data);
        return response;
    } catch (error) {
        console.error("Delete API Error: ", error);
        throw error;
    }
}





//--------------------------------/supplier/bill-save----------------------------------------------------------------------
export const supplierbillsave = async (data) => {
    try {
        const response = await fetchPostData(`/hp-po-api/supplier/bill-save`, data);
        return response;
    } catch (error) {
        console.error("Delete API Error: ", error);
        throw error;
    }
}




//--------------------------------/supplier/acceptance-save----------------------------------------------------------------------
export const supplieracceptancesave= async (data) => {
    try {
        const response = await fetchPostData(`/hp-po-api/supplier/acceptance-save`, data);
        return response;
    } catch (error) {
        console.error("Delete API Error: ", error);
        throw error;
    }
}






//--------------------------------/supplier/view-delivery-details----------------------------------------------------------------------

// export const supplierviewdeliverydetails = async (params) => {
//     try {
//         const { hospCode, poStoreId, delStoreId,schNo, poNo } = params;
//         const response = await fetchData(
//             `/hp-po-api/supplier/view-delivery-details?hospCode=${hospCode}&poStoreId=${poStoreId}&delStoreId=${delStoreId}&schNo=${schNo}&poNo=${poNo}`
//         );
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching supplier delivery details:", error);
//         throw error;
//     }
// };





//--------------------------------/supplier/view-delivery-details----------------------------------------------------------------------

export const supplierviewdeliverydetails = async (params) => {
    try {
        const { hospCode, poStoreId, delStoreId,schNo, poNo } = params;
        const response = await fetchData(
            `/hp-po-api/supplier/view-delivery-details?hospCode=${hospCode}&poStoreId=${poStoreId}&delStoreId=${delStoreId}&schNo=${schNo}&poNo=${poNo}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier delivery details:", error);
        throw error;
    }
};






//--------------------------------/supplier/receive-view-details----------------------------------------------------------------------

export const supplierreceiveviewdetails = async (params) => {
    try {
        const { hospCode, deliveryNo,schNo, poNo } = params;
        const response = await fetchData(
            `/hp-po-api/supplier/receive-view-details?hospCode=${hospCode}&deliveryNo=${deliveryNo}&schNo=${schNo}&poNo=${poNo}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier delivery details:", error);
        throw error;
    }
};




//--------------------------------/supplier/receive-details----------------------------------------------------------------------

export const supplierreceivedetails = async (params) => {
    try {
        const { gnumHospitalCode, poStoreId,hstnumPoNo} = params;
        const response = await fetchData(
            `/hp-po-api/supplier/receive-details?gnumHospitalCode=${gnumHospitalCode}&poStoreId=${poStoreId}&hstnumPoNo=${hstnumPoNo}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier delivery details:", error);
        throw error;
    }
};




//-------------------------------------------/supplier/schedule-no-------------------------------------------------------------------



export const getsupplierscheduleno = async (poNo, poStoreId, delStoreId,hospCode) => {
    try {
        const response = await fetchData(
            `/hp-po-api/supplier/schedule-no?poNo=${poNo}&poStoreId=${poStoreId}&delStoreId=${delStoreId}&hospCode=${hospCode}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier delivery details:", error);
        throw error;
    }
};




//-------------------------------------------/supplier/drug-names-------------------------------------------------------------------



export const getsupplierdrugnames = async (hospCode, poStoreId, delStoreId,schNo,poNo) => {
    try {
        const response = await fetchData(
            `/hp-po-api/supplier/drug-names?hospCode=${hospCode}&poStoreId=${poStoreId}&delStoreId=${delStoreId}&schNo=${schNo}&poNo=${poNo}`

 );
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier delivery details:", error);
        throw error;
    }
};





//-------------------------------------------/supplier/item-details-------------------------------------------------------------------



export const getsupplieritemdetails = async (hospCode, poStoreId,itemBrandId, deliveryStoreId,scheduleNo,poNo,itemId,supplierId) => {
    try {
        const response = await fetchData(
            `/hp-po-api/supplier/item-details?hospCode=${hospCode}&poStoreId=${poStoreId}&itemBrandId=${itemBrandId}&deliveryStoreId=${deliveryStoreId}&scheduleNo=${scheduleNo}&poNo=${poNo}&itemId=${itemId}&supplierId=${supplierId}`


 );
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier delivery details:", error);
        throw error;
    }
};


//------------------------------------------/supplier/receive-save-------------------------------------------------------------------

export const savesupplierreceivesave = async (data) => {
    try {
        const response = await fetchPostData(`/hp-po-api/supplier/receive-save`, data);
        return response?.data;
    } catch (error) {
        console?.error("API Error : ", error)
        throw error
    }
}



//--------------------------------/supplier/bill-details----------------------------------------------------------------------

export const supplierbilldetails = async (params) => {
    try {
        const { gnumHospitalCode, poStoreId,hstnumPoNo} = params;
        const response = await fetchData(
            `/hp-po-api/supplier/bill-details?gnumHospitalCode=${gnumHospitalCode}&poStoreId=${poStoreId}&hstnumPoNo=${hstnumPoNo}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier delivery details:", error);
        throw error;
    }
};



//--------------------------------/supplier/bank-dtl----------------------------------------------------------------------


export const supplierbankdtl = async (params) => {
    try {
        const { hospCode, suppId } = params;
        const response = await fetchData(
            `/hp-po-api/supplier/bank-dtl?hospCode=${hospCode}&suppId=${suppId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier bank details:", error);
        throw error;
    }
};





//-------------------------------------------/supplier/fdr-details-------------------------------------------------------------------



export const getsupplierfdrdetails = async (gnumHospitalCode,poStoreId,hstnumPoNo ) => {
    try {
        const response = await fetchData(
            `/hp-po-api/supplier/fdr-details?gnumHospitalCode=${gnumHospitalCode}&poStoreId=${poStoreId}&hstnumPoNo=${hstnumPoNo}`


 );
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier delivery details:", error);
        throw error;
    }
};

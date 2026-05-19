import React, { useEffect, useState } from 'react'
import BottomButtons from '../../../../commons/BottomButtons'
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import ReactDataTable from '../../../../commons/ReactDataTable';
import { cancelChallan, fetchCancelChallanDetails, fetchFreezeChallanDetails, fetchRecItemChallanDetails, fetchVerifyItemChallanDetails, fetchViewChallanProcess, saveFreezeChallan } from '../../../../../api/Jharkhand/services/ChallanProcessAPI_JH';
import { ToastAlert } from '../../../../../utils/Toast';

//FOR CANCEL,VIEW AND FREEZE CHALLAN PROCESS
const CancelAndViewChallanJH = ({ selectedData, actionMode, challanStatus }) => {

    const dispatch = useDispatch();
    const SEAT_ID = 14462;
    const [remarks, setRemarks] = useState('');
    const [selectedRowRec, setSelectedRowRec] = useState(null);
    const [selectedRowItem, setSelectedRowItem] = useState(null);
    const [challanItemData, setChallanItemData] = useState([]);
    const [cancelItemData, setCancelItemData] = useState([]);
    const [freezeItemData, setFreezeItemData] = useState([]);
    const [challanDetails, setChallanDetails] = useState([]);
    const [selectedSingleItem, setSelectedSingleItem] = useState([]);
    const [viewDetails, setViewDetails] = useState([]);
    const [errors, setErrors] = useState({ remarksErr: "" });
    const [values, setValues] = useState({
        "storeName": "",
        "poNo": "",
        "challanNo": "",
        "suppInvNo": "",
        "suppInvDate": "",
        "scheduleType": "",
        "SuppName": "",
        "manufacName": "",
        "rejectedBatch": "",
    })

    function handleClose() {
        dispatch(hidePopup());
    }

    const reset = () => {
        setRemarks('');
        setErrors({ remarksErr: "" });
        setSelectedRowRec(null);
        setSelectedRowItem(null);
        setChallanItemData([]);
        setFreezeItemData([]);
        setCancelItemData([]);
        setCancelItemData([]);
        setChallanDetails([]);
    }

    //GET CANCEL CHALLAN DETAILS
    const getCancelChallanDetails = (storeId, challanNo) => {
        fetchCancelChallanDetails(998, storeId, challanNo)?.then((res) => {
            if (res?.status === 1) {
                setChallanDetails(res?.data?.challanDetails || []);
                const dtls = res?.data?.challanDetails[0];
                setValues({
                    ...values,
                    "storeName": dtls?.strDdwName,
                    "poNo": dtls?.numPoNo,
                    "challanNo": dtls?.numChallanNo,
                    "suppInvNo": dtls?.numSuppRecieptNo,
                    "suppInvDate": dtls?.strSuppRecieptDate,
                    "scheduleType": dtls?.strScheduleType,
                    "SuppName": dtls?.strSupplierName
                })
                setCancelItemData(res?.data?.receivedItemDetails || []);
            } else {
                ToastAlert(res?.message, 'error');
                setCancelItemData([]);
                setChallanDetails([]);
            }
        })
    }

    //GET VIEW CHALLAN DETAILS
    const getViewChallanDetails = (storeId, challanNo) => {
        fetchViewChallanProcess(998, storeId, challanNo)?.then((res) => {
            if (res?.status === 1) {
                setViewDetails(res?.data || []);
            } else {
                ToastAlert(res?.message, 'error');
                setViewDetails([]);
            }
        })
    }

    //GET VIEW RECEIVED CHALLAN DETAILS
    const getViewRecChallanDetails = (storeId, challanNo) => {
        fetchRecItemChallanDetails(998, storeId, challanNo)?.then((res) => {
            if (res?.status === 1) {
                setChallanItemData(res?.data || []);
            } else {
                ToastAlert(res?.message, 'error');
                setChallanItemData([]);
            }
        })
    }

    //GET VIEW ITEM VERIFICATION CHALLAN DETAILS
    const getViewItemVerifyChallanDetails = (storeId, challanNo, brandId, batchNo) => {
        fetchVerifyItemChallanDetails(998, storeId, challanNo, brandId, batchNo)?.then((res) => {
            if (res?.status === 1) {
                // setViewDetails(res?.data || []);
            } else {
                ToastAlert(res?.message, 'error');
                // setViewDetails([]);
            }
        })
    }

    //GET FREEZE CHALLAN DETAILS
    const getFreezeChallanDetails = (poStoreId, storeId, poNo, challanNo, itemBrandId) => {
        fetchFreezeChallanDetails(998, poStoreId, storeId, poNo, challanNo, itemBrandId)?.then((res) => {
            if (res?.status === 1) {
                setFreezeItemData(res?.data?.verifiedItemdtls || []);
                const dtls = res?.data?.challanDtls;
                setValues({
                    ...values,
                    "storeName": dtls?.storeName,
                    "poNo": dtls?.poNo,
                    "challanNo": dtls?.challanNo,
                    "suppInvNo": dtls?.suppRecNo,
                    "suppInvDate": dtls?.suppRecDate,
                    "scheduleType": dtls?.schType,
                    "SuppName": dtls?.supplierName,
                    "manufacName": dtls?.manufName,
                    "rejectedBatch": dtls?.rej,
                })
            } else {
                ToastAlert(res?.message, 'error');
                setFreezeItemData([]);
            }
        })
    }

    //FOR CANCEL
    useEffect(() => {
        if (actionMode === "cancel" && selectedData?.length > 0) {
            getCancelChallanDetails(selectedData[0]?.hstnumStoreId, selectedData[0]?.hstnumChallanNo);
        }
    }, [selectedData, actionMode])

    //FOR VIEW
    useEffect(() => {
        if (actionMode === "view" && selectedData?.length > 0) {
            getViewChallanDetails(selectedData[0]?.hstnumStoreId, selectedData[0]?.hstnumChallanNo);
        }
    }, [selectedData, actionMode])

    //FOR FREEZE
    useEffect(() => {
        if (actionMode === "freeze" && selectedData?.length > 0) {
            const { hstnumStoreId, poStoreId, hstnumPoNo, hstnumChallanNo, hstnumItembrandId } = selectedData[0];
            getFreezeChallanDetails(hstnumStoreId, poStoreId, hstnumPoNo, hstnumChallanNo, hstnumItembrandId);
        }
    }, [selectedData, actionMode])

    useEffect(() => {
        if (selectedRowRec !== null && selectedRowRec) {
            getViewRecChallanDetails(selectedRowRec?.hstnumStoreId, selectedRowRec?.numChallanNo)
        }
    }, [selectedRowRec])


    useEffect(() => {
        if (selectedRowItem !== null && selectedRowItem) {
            getViewItemVerifyChallanDetails(selectedRowItem?.storeId, selectedRowRec?.numChallanNo, selectedRowItem?.itemBrandId, selectedRowItem?.batchSlNo)
        }
    }, [selectedRowItem])



    //TO CANCEL SAVE
    const handleCancelSave = () => {
        let isValid = true;
        if (!remarks?.trim()) {
            setErrors(prev => ({ ...prev, "remarksErr": "Please enter cancel remarks!" }));
            isValid = false;
        }
        if (!selectedSingleItem?.length || selectedSingleItem === null) {
            ToastAlert("Please select an item", 'error');
            isValid = false;
        }

        if (isValid) {
            const val = {
                "hstnumStoreId": selectedData[0]?.hstnumStoreId,
                "hstnumChallanNo": selectedData[0]?.hstnumChallanNo,
                "gnumHospitalCode": 998,
                "gnumSeatId": SEAT_ID,
                "strRemarks": remarks,
                "challanVerifiedItem": selectedSingleItem?.map((item) => ({
                    "hstnumItemBrandId": item?.itembrandId,
                    "hstnumItemId": item?.itemId,
                    "hstnumStoreId": item?.storeId,
                    "strBatchSlno": item?.batchSlNo,
                    "gnumIsvalid": item?.isValid
                }))
            }
            cancelChallan(val)?.then((res) => {
                if (res?.status === 1) {
                    ToastAlert(res?.message, 'success');
                } else {
                    ToastAlert(res?.message, 'warning');
                }
            })
        }
    }

    //TO FREEZE SAVE
    const handleFreezeSave = () => {
        let isValid = true;
        if (!remarks?.trim()) {
            setErrors(prev => ({ ...prev, "remarksErr": "Please enter cancel remarks!" }));
            isValid = false;
        }
        const val = {
            "hstnumStoreId": selectedData[0]?.hstnumStoreId,
            "hstnumChallanNo": selectedData[0]?.hstnumChallanNo,
            "hstnumItemId": selectedData[0]?.hstnumItemId,
            "hstnumItembrandId": selectedData[0]?.hstnumItembrandId,
            "gnumHospitalCode": 998,
            "strPoNo": selectedData[0]?.hstnumPoNo?.toString(),
            "poStoreId": selectedData[0]?.poStoreId,
            "strRemarks": remarks,
            "gnumSeatId": SEAT_ID,
            "strRejectedBatchListString": ""
        }

        if (isValid) {
            saveFreezeChallan(val)?.then((res) => {
                if (res?.status === 1) {
                    ToastAlert(res?.message, "success");
                } else {
                    ToastAlert(res?.message, "error");
                }
            })
        }

    }

    //COMMON SAVE
    const handleAllSave = () => {
        const isSave = confirm("Do you want to save this data ?");
        if (isSave) {
            if (actionMode === "freeze") {
                handleFreezeSave();
            } else {
                handleCancelSave();
            }
        }
    }

    const handleRowSelect = (row, index) => {
        const upRow = { ...row, "index": index }
        setSelectedRowRec(upRow);
    };

    const handleRowSelectItem = (row, index) => {
        const upRow = { ...row, "index": index }
        setSelectedRowItem(upRow);
    };

    const handleRowSelectSingleItem = (row, index) => {
        const upRow = { ...row, index };

        const isAlreadySelected = selectedSingleItem.some(
            item => item.index === index
        );

        let finalList;

        if (isAlreadySelected) {
            finalList = selectedSingleItem.filter(
                item => item.index !== index
            );
        } else {
            finalList = [...selectedSingleItem, upRow];
        }

        setSelectedSingleItem(finalList);
    };

    const challanRecCols = [
        {
            name: <input
                type="checkbox"
                disabled={true}
                className="form-check-input log-select"
            />,
            cell: (row, index) =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="checkbox"
                            checked={selectedRowRec?.index === index}
                            onChange={(e) => { handleRowSelect(row, index) }}
                        />
                    </span>
                </div>,
            width: "5%"
        },
        {
            name: (<span className='text-center'>Challan No.</span>),
            selector: row => row.numChallanNo,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Received Date</span>),
            selector: row => row.strReceivedDate,
            width: "9%",
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Supplier Invoice No.</span>),
            selector: row => row.numSuppRecieptNo,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Supplier Invoice Date</span>),
            selector: row => row.strSuppRecieptDate,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Schedule Type</span>),
            selector: row => row.strScheduleTypeText,
            center: "true",
            wrap: true,
            sortable: true,
        },
        {
            name: (<span className='text-center'>Delivery Mode</span>),
            selector: row => row.hststrDeliverymodeName,
            center: "true",
            wrap: true,
            sortable: true
        }
    ];

    const challanItemCols = [
        {
            name: <input
                type="checkbox"
                disabled={true}
                className="form-check-input log-select"
            />,
            cell: (row, index) =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="checkbox"
                            checked={selectedRowItem?.index === index}
                            onChange={(e) => { handleRowSelectItem(row, index) }}
                        />
                    </span>
                </div>,
            width: "5%"
        },
        {
            name: (<span className='text-center'>Drug Name</span>),
            selector: row => row.itemName,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Batch No.</span>),
            selector: row => row.batchSlNo,
            width: "9%",
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Expiry Date</span>),
            selector: row => row.expiryDate,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Supplied Qty.</span>),
            selector: row => row.receivedQty,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Accepted Qty.</span>),
            selector: row => row.acceptedQty,
            center: "true",
            wrap: true,
            sortable: true,
        },
        {
            name: (<span className='text-center'>Excess Qty.</span>),
            selector: row => row.excessQty,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Status</span>),
            selector: row => row.strStatus,
            center: "true",
            wrap: true,
            sortable: true
        }
    ];

    const cancelItemCols = [
        {
            name: <input
                type="checkbox"
                disabled={true}
                className="form-check-input log-select"
            />,
            cell: (row, index) =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="checkbox"
                            checked={selectedSingleItem?.some(dt => dt?.index === index)}
                            onChange={(e) => { handleRowSelectSingleItem(row, index) }}
                        />
                    </span>
                </div>,
            width: "5%"
        },
        {
            name: (<span className='text-center'>Drug Name</span>),
            selector: row => row.itemName,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Batch No.</span>),
            selector: row => row.batchSlNo,
            width: "9%",
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Expiry Date</span>),
            selector: row => row.expiryDate,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Receive qty.</span>),
            selector: row => row.receivedQty,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Accepted Qty.</span>),
            selector: row => row.acceptedQty,
            center: "true",
            wrap: true,
            sortable: true,
        },
        {
            name: (<span className='text-center'>Breakage Qty.</span>),
            selector: row => row.breakageQty,
            center: "true",
            wrap: true,
            sortable: true,
        },
        {
            name: (<span className='text-center'>Rejected Qty.</span>),
            selector: row => row.rejectedQty,
            center: "true",
            wrap: true,
            sortable: true,
        },
        {
            name: (<span className='text-center'>Excess Qty.</span>),
            selector: row => row.excessQty,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Status</span>),
            selector: row => row.strStatus,
            center: "true",
            wrap: true,
            sortable: true
        }
    ];

    const freezeItemCols = [
        {
            name: (<span className='text-center'>Drug Name</span>),
            selector: row => row.itemName,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Batch No.</span>),
            selector: row => row.batchSlNo,
            width: "9%",
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Expiry Date</span>),
            selector: row => row.expiryDate,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Supplied Qty.</span>),
            selector: row => row.receivedQty,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Accepted Qty.</span>),
            selector: row => row.acceptedQty,
            center: "true",
            wrap: true,
            sortable: true,
        },
        {
            name: (<span className='text-center'>Rejected Qty.</span>),
            selector: row => row.rejectedQty,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Breakage Qty.</span>),
            selector: row => row.breakageQty,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>In-House Test / CDL Required</span>),
            selector: row => row.strInhouseTestFile,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>In-House Test / CDL Report</span>),
            selector: row => row.fileName,
            center: "true",
            wrap: true,
            sortable: true
        }
    ];

    const actionName = (actionMode) => {
        switch (actionMode) {
            case "view":
                return "View";
            case "cancel":
                return "Cancel"
            case "freeze":
                return "Freeze"
            default:
                break;
        }
    }

    console.log('selectedData', selectedData)
    console.log('viewDetails', viewDetails)

    return (
        <>
            <h3 className="employeeMaster__heading"> {`Challan Process >> ${actionName(actionMode)}`}</h3>
            <div className="rateContractAddJHK__container mb-3 pb-3">
                <h4 className="rateContractAddJHK__container-heading">
                    {actionMode === "cancel" ? 'Cancel Remarks' : "Store Details"}
                </h4>

                {actionMode === "view" &&
                    <>
                        <div>
                            <label htmlFor="" className="rateContractAddJHK__label mb-0">
                                Store Name :{" "}
                                <span className="fs-6 fw-normal">{viewDetails[0]?.strDdwName}</span>{" "}
                            </label>
                        </div>
                        <div>
                            <label htmlFor="" className="rateContractAddJHK__label mb-0">
                                Supplier Name :{" "}
                                <span className="fs-6 fw-normal">{viewDetails[0]?.strSupplierName}</span>{" "}
                            </label>
                        </div>
                        <div>
                            <label htmlFor="" className="rateContractAddJHK__label mb-0">
                                Manufacturer Name	 :{" "}
                                <span className="fs-6 fw-normal">{viewDetails[0]?.strManufacturerName}</span>{" "}
                            </label>
                        </div>
                        <div>
                            <label htmlFor="" className="rateContractAddJHK__label mb-0">
                                PO No :{" "}
                                <span className="fs-6 fw-normal">{`${viewDetails[0]?.numPoNo}(${viewDetails[0]?.strPoPrefix})`}</span>{" "}
                            </label>
                        </div>
                    </>
                }

                {(actionMode === "freeze" || (actionMode === "cancel" && (challanStatus === 2 || challanStatus === 9))) &&
                    <>
                        <div>
                            <label htmlFor="" className="rateContractAddJHK__label mb-0">
                                Store Name :{" "}
                                <span className="fs-6 fw-normal">{values?.storeName}</span>{" "}
                            </label>
                        </div>

                        <div>
                            <label htmlFor="" className="rateContractAddJHK__label mb-0">
                                PO No :{" "}
                                <span className="fs-6 fw-normal">{values?.poNo}</span>{" "}
                            </label>
                        </div>

                        <div>
                            <label htmlFor="" className="rateContractAddJHK__label mb-0">
                                Challan No. :{" "}
                                <span className="fs-6 fw-normal">{values?.challanNo}</span>{" "}
                            </label>
                        </div>

                        <div>
                            <label htmlFor="" className="rateContractAddJHK__label mb-0">
                                Supplier Invoice No. :{" "}
                                <span className="fs-6 fw-normal">{values?.suppInvNo}</span>{" "}
                            </label>
                        </div>

                        <div>
                            <label htmlFor="" className="rateContractAddJHK__label mb-0">
                                Supplier Invoice Date :{" "}
                                <span className="fs-6 fw-normal">{values?.suppInvDate}</span>{" "}
                            </label>
                        </div>

                        <div>
                            <label htmlFor="" className="rateContractAddJHK__label mb-0">
                                Schedule Type :{" "}
                                <span className="fs-6 fw-normal">{values?.scheduleType}</span>{" "}
                            </label>
                        </div>

                        <div>
                            <label htmlFor="" className="rateContractAddJHK__label mb-0">
                                Supplier Name :{" "}
                                <span className="fs-6 fw-normal">{values?.SuppName}</span>{" "}
                            </label>
                        </div>


                        {actionMode !== "cancel" &&
                            <>
                                <div>
                                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                                        Manufacturer Name :{" "}
                                        <span className="fs-6 fw-normal">{values?.manufacName}</span>{" "}
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                                        Rejected Batch :{" "}
                                        <span className="fs-6 fw-normal">{values?.rejectedBatch}</span>{" "}
                                    </label>
                                </div>
                            </>
                        }
                    </>
                }

                {(actionMode === "cancel" && (challanStatus === 2 || challanStatus === 9)) &&
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Delivery No. :{" "}
                            <span className="fs-6 fw-normal">{challanDetails[0]?.hstnumScheduleType}</span>{" "}
                        </label>
                    </div>
                }

                {(actionMode === "cancel" && (challanStatus !== 2 && challanStatus !== 9)) &&
                    <div>
                        <label htmlFor="remarks" className="employeeMaster__label required-label">
                            Remarks :
                        </label>
                        <textarea
                            id="remarks"
                            className="rateContractAddJHK__input"
                            type="text"
                            name={"remarks"}
                            placeholder="Enter here..."
                            value={remarks}
                            onChange={(e) => { setRemarks(e?.target?.value); setErrors(prev => ({ ...prev, "remarksErr": "" })); }}
                        />
                        {errors?.remarksErr &&
                            <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                {errors?.remarksErr}
                            </span>
                        }
                    </div>
                }

            </div>

            {actionMode === "view" &&
                <>
                    <div className="flex items-center mb-1 mt-2">
                        <div className="w-10 border-1 border-[#097080]"></div>
                        <span className="mx-3 font-bold text-[#097080]">
                            Challan Received Details
                        </span>
                        <div className="flex-grow border-1 border-[#097080]"></div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <ReactDataTable column={challanRecCols} data={viewDetails} isPagination={false} showSerialNumber={false} isSearchReq={false} />
                    </div>

                    {(selectedRowRec !== null && selectedRowRec) &&
                        <>
                            <div className="flex items-center mb-1 mt-1">
                                <div className="w-10 border-1 border-[#097080]"></div>
                                <span className="mx-3 font-bold text-[#097080]">
                                    Received Item Details
                                </span>
                                <div className="flex-grow border-1 border-[#097080]"></div>
                            </div>

                            <div style={{ marginBottom: "2rem" }}>
                                <ReactDataTable column={challanItemCols} data={challanItemData} isPagination={false} showSerialNumber={false} isSearchReq={false} />
                            </div>
                        </>
                    }
                </>
            }

            {actionMode === "freeze" &&
                <>
                    <div className="flex items-center mb-1 mt-2">
                        <div className="w-10 border-1 border-[#097080]"></div>
                        <span className="mx-3 font-bold text-[#097080]">
                            Verified Item Detail
                        </span>
                        <div className="flex-grow border-1 border-[#097080]"></div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <ReactDataTable column={freezeItemCols} data={freezeItemData} isPagination={false} showSerialNumber={false} isSearchReq={false} />
                    </div>
                </>
            }

            {(actionMode === "cancel" && (challanStatus === 2 || challanStatus === 9)) &&
                <>
                    <div className="flex items-center mb-1 mt-1">
                        <div className="w-10 border-1 border-[#097080]"></div>
                        <span className="mx-3 font-bold text-[#097080]">
                            Received Item Details
                        </span>
                        <div className="flex-grow border-1 border-[#097080]"></div>
                    </div>

                    <div style={{ marginBottom: "2rem" }}>
                        <ReactDataTable column={cancelItemCols} data={cancelItemData} isPagination={false} showSerialNumber={false} isSearchReq={false} />
                    </div>
                </>
            }

            {(actionMode === "freeze" || (actionMode === "cancel" && (challanStatus === 2 || challanStatus === 9))) &&

                <div>
                    <label htmlFor="remarks" className="employeeMaster__label required-label">
                        Remarks :
                    </label>
                    <textarea
                        id="remarks"
                        className="rateContractAddJHK__input"
                        type="text"
                        name={"remarks"}
                        placeholder="Enter here..."
                        value={remarks}
                        onChange={(e) => { setRemarks(e?.target?.value); setErrors(prev => ({ ...prev, "remarksErr": "" })); }}
                    />
                    {errors?.remarksErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.remarksErr}
                        </span>
                    }
                </div>
            }

            <BottomButtons isSave={true} isReset={true} isClose={true} isDraft={false} onSave={handleAllSave} onReset={reset} onClose={handleClose} />
        </>
    )
}

export default CancelAndViewChallanJH

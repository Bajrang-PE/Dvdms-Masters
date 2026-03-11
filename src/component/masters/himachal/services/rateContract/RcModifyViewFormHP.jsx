import React, { useEffect, useReducer, useState } from 'react'
import { ComboDropDown, InputField } from '../../../../commons/FormElements';
import SelectBox from '../../../../commons/SelectBox';
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { parseDate } from '../../../../commons/utilFunctions';
import { getHpRcDownloadFile, getHpRcEMDDetailsByRc, getHpRcFullDetails, getHpRcSuppLevelCombo, getHpRcTaxTypeCombo, getHpRcTenderCmbOnSuppId, getHpRcUnitCombo, mpdifyHpRcDetail, saveHpRcFileUpload } from '../../../../../api/Himachal/services/rateContractAPI_HP';
import { ToastAlert } from '../../../../../utils/Toast';
import ReactDataTable from '../../../../commons/ReactDataTable';
import MasterPopUpModal from '../../../../commons/MasterPopUpModal';

const RcModifyViewFormHP = (props) => {
    const { selectedData, actionMode } = props;


    const { value: storeID, label: storeName } = useSelector(
        (state) => state.himachalMst.storeID
    );
    const { value: contractID, label: contractName } = useSelector(
        (state) => state.himachalMst.contractDetails
    );

    const batchSizeOptions = Array.from({ length: 50 }, (_, i) => ({
        value: i + 1,
        label: String(i + 1),
    }));

    const initialState = {
        //contract detail
        supplierName: "",
        tenderNo: "",
        contractFrom: "",
        contractTo: "",
        quotationNo: "",
        acceptanceDate: "",
        financeCommitteDate: "",

        //tender detail
        contractedQty: "0",
        shelfLife: "0",
        noOfBatches: "",
        level: "",
        allocationQty: "",
        taxType: "",
        cgst: "",
        sgst: "",
        rate: "",
        unit: "",
        deliveryDay: "60",
        discount: "",
        remarks: "",
        tenderDate: "",
        whetherImported: 0
    };

    function addFormReducer(state, action) {
        switch (action.type) {
            case "SET_FIELD":
                return { ...state, [action.field]: action.value };
            case "SET_FIELDS":
                return { ...state, ...action.payload };
            case "RESET_FORM":
                return initialState;
            default:
                return state;
        }
    }

    const [formState, dispatcher] = useReducer(addFormReducer, initialState);
    const dispatch = useDispatch();
    const [rCDetails, setRCDetails] = useState({});
    const [levelType, setLevelType] = useState([]);
    const [taxTypes, setTaxTypes] = useState([]);
    const [unitDrpDt, setUnitDrpDt] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [tenderNoList, setTenderNoList] = useState([]);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [fileName, setFileName] = useState('');
    const [viewDetails, setViewDetails] = useState([]);
    const [viewModal, setViewModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [errors, seterrors] = useState({
        discountErr: "", supplierNameErr: "", tenderNoErr: "", shelfLifeErr: "", noOfBatchesErr: "", whetherImportedErr: "", levelErr: "", taxTypeErr: "", cgstErr: "", sgstErr: "", rateUnitErr: "", deliveryDayErr: "", allocationQtyErr: "", contractFromErr: "", contractToErr: "", acceptanceDateErr: "", tenderDateErr: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('e.target', e.target)
        const errName = name + "Err";
        dispatcher({ type: "SET_FIELD", field: name, value });
        if (name === 'rate' || name === 'unit') {
            seterrors({ ...errors, 'rateUnitErr': "" });
        } else {
            seterrors({ ...errors, [errName]: "" });
        }
    };

    function handleClose() {
        dispatch(hidePopup());
    }

    function handleReset() {
        dispatcher({ type: "RESET_FORM" });
    }

    const levelTypeDrpData = () => {
        getHpRcSuppLevelCombo(998)?.then((res) => {
            if (res?.status === 1) {
                const drpDt = res?.data?.map((dt) => ({
                    value: dt?.value,
                    label: dt?.display,
                }));
                setLevelType(drpDt);
            } else {
                setLevelType([]);
            }
        });
    };
    const getTaxTypeDrpDt = () => {
        getHpRcTaxTypeCombo(998)?.then((res) => {
            if (res?.status === 1) {
                const dt = res?.data?.map((dt) => ({
                    value: dt?.value,
                    label: dt?.display
                }))
                setTaxTypes(dt);
            } else {
                setTaxTypes([]);
            }
        })
    }
    const unitDrpData = () => {
        getHpRcUnitCombo(998)?.then((res) => {
            if (res?.status === 1) {
                const drpDt = res?.data?.map((dt) => ({
                    value: dt?.value,
                    label: dt?.display,
                }));
                setUnitDrpDt(drpDt);
                dispatcher({ type: "SET_FIELD", field: 'unit', value: drpDt?.find(dt => dt?.label == selectedData[0]?.ratePerUnit?.split('/')[1]?.trim())?.value });
            } else {
                setUnitDrpDt([]);
            }
        });
    };
    const getContractDetailsWithTender = () => {
        getHpRcTenderCmbOnSuppId(998, selectedData[0]?.numSupplierId, contractID).then((res) => {
            console.log("res", res);
            if (res?.status === 1) {
                const drpDt = res?.data?.length > 0 && res?.data?.map((dt) => ({
                    value: dt?.value,
                    label: dt?.display
                }))
                console.log('drpDt', drpDt)
                if (drpDt?.length > 1) {
                    setTenderNoList(drpDt);
                } else if (drpDt?.length === 1) {
                    const tendNo = drpDt[0]?.value;
                    setTenderNoList(drpDt);
                    dispatcher({ type: "SET_FIELD", field: 'tenderNo', value: tendNo });
                } else {
                    setTenderNoList([]);
                }
            }
        });
    };
    const getRateContractAllDetails = (rcId, suppId) => {
        getHpRcFullDetails(998, rcId, suppId)?.then((res) => {
            if (res?.status === 1) {
                setRCDetails(res?.data);
                dispatcher({
                    type: "SET_FIELDS",
                    payload: {
                        supplierName: res?.data?.strSupplierName,
                        tenderNo: res?.data?.numTenderNo,
                        contractFrom: res?.data?.dtContractFrmdate,
                        contractTo: res?.data?.dtContractTodate,
                        quotationNo: res?.data?.strQuotationRefNo,
                        acceptanceDate: res?.data?.dtAcceptanceDate,
                        financeCommitteDate: res?.data?.dtFinancialCommDate,
                        tenderDate: res?.data?.dtTenderDate,
                        contractedQty: "0",
                        shelfLife: res?.data?.numShelfLife || "0",
                        noOfBatches: res?.data?.numBatchSize,
                        level: res?.data?.numLevelTypeId?.toString(),
                        taxType: res?.data?.numTaxType?.toString(),
                        cgst: res?.data?.numCgst,
                        sgst: res?.data?.numSgst,
                        rate: res?.data?.ratePerUnit?.split('/')[0],
                        unit: res?.data?.numRateUnitid,
                        deliveryDay: res?.data?.numDeliveryDays || "60",
                        discount: res?.data?.numDiscount,
                        remarks: "",
                        whetherImported: res?.data?.numImportedFlag || 0,
                        allocationQty: res?.data?.numAllocationOrderQty,
                        strLevelTypeName: res?.data?.strLevelTypeName,
                        strTax: res?.data?.strTax,
                        ratePerUnit: res?.data?.ratePerUnit,
                        numRcNo: res?.data?.numRcId,
                        strBankName: res?.data?.strBankName,
                        strBranchName: res?.data?.strBranchName,
                        strIfscCode: res?.data?.strIfscCode,
                    },
                });
            } else {
                setRCDetails({})
            }
        })
    }

    useEffect(() => {
        if (selectedData?.length > 0 && actionMode === 'modify') {
            getContractDetailsWithTender();
            getRateContractAllDetails(selectedData[0]?.hstnumRcId, selectedData[0]?.numSupplierId);
        }
    }, [selectedData]);

    useEffect(() => {
        if (actionMode === 'modify') {
            levelTypeDrpData();
            unitDrpData();
            getTaxTypeDrpDt();
        }
    }, [actionMode]);

    useEffect(() => {
        if (selectedRow) {
            getRateContractAllDetails(selectedRow?.hstnumRcId, selectedRow?.numSupplierId)
        }
    }, [selectedRow])

    const existingRcTableCols = [
        ...(actionMode === 'view' ?
            [{
                name: <input
                    type="checkbox"
                    // checked={selectAll}
                    // onChange={(e) => handleSelectAll(e.target.checked, "gnumUserId")}
                    disabled={true}
                    className="form-check-input log-select"
                />,
                cell: (row, index) =>
                    <div style={{ position: 'absolute', top: 4, left: 10 }}>
                        <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                            <input
                                type="checkbox"
                                checked={selectedRow?.hstnumRcId === row?.hstnumRcId}
                                onChange={(e) => { setSelectedRow(row) }}
                            />
                        </span>
                    </div>,
                width: "6%"
            }]
            : []),
        {
            name: (<span>Supplier Name</span>),
            selector: row => row.strSupplierName,
            width: "18%",
            wrap: true,
            sortable: true
        },
        {
            name: "Level",
            selector: row => row.strLevelTypeName,
            width: "8%",
            wrap: true,
            sortable: true
        },
        {
            name: "Rate/Unit",
            selector: row => row.ratePerUnit,
            wrap: true,
            sortable: true
        },
        {
            name: "RC No.",
            selector: row => row.hstnumRcId,
            wrap: true,
            sortable: true
        },
        {
            name: "Contract Validity",
            width: "20%",
            center: true,
            wrap: true,
            sortable: true,
            cell: row => (
                <span>
                    {`${parseDate(row?.hstdtContractFrmdate)} To ${parseDate(row?.hstdtContractTodate)}`}
                </span>
            ),
        },
        {
            name: "Tender No.",
            width: "18%",
            center: true,
            wrap: true,
            sortable: true,
            cell: row => (
                <span>
                    {`${row?.strTenderRefNo} (${row?.hstnumTenderNo})`}
                </span>
            ),
        },
        {
            name: (<span>{actionMode === 'modify' ? 'Action' : 'Specification File'}</span>),
            // width: "10%",
            center: true,
            wrap: true,
            sortable: true,
            cell: row => (
                actionMode === 'modify' ?
                    <span
                        role="button"
                        title="Delete"
                        onClick={() => alert("bb")}
                    >
                        <FontAwesomeIcon icon={faTrash} color="#e05000" size="lg" />
                    </span>
                    :
                    <span
                        role="button"
                        title="Download file"
                        onClick={() => getHpRcDownloadFile(row?.strFileName)}
                    >
                        <FontAwesomeIcon icon={faDownload} color="#e05000" size="lg" />
                    </span>

            ),
        },
    ];

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile, selectedFile?.name);
            saveHpRcFileUpload(formData)?.then((res) => {
                console.log('res', res);
                if (res?.status === 1) {
                    setIsFileUploaded(true);
                    setFileName(res?.data?.fileName);
                    setSelectedFile(null);
                    ToastAlert("File uploaded", 'success')
                } else {
                    ToastAlert(res?.msg, 'error');
                }
            })
        } else {
            ToastAlert("Please select a file", 'error');
        }
    }

    const handleSave = (draft) => {
        let isValid = true;

        if (!formState?.supplierName?.trim()) {
            seterrors((prev => ({ ...prev, 'supplierNameErr': "Supplier Name is Required!" })));
            isValid = false;
        }
        if (!formState?.allocationQty?.toString()?.trim()) {
            seterrors((prev => ({ ...prev, 'allocationQtyErr': "Allocation Qty is Required!" })));
            isValid = false;
        }
        if (!formState?.tenderNo) {
            seterrors((prev => ({ ...prev, 'tenderNoErr': "Tendor number is Required!" })));
            isValid = false;
        }
        if (!formState?.shelfLife?.toString()?.trim()) {
            seterrors((prev => ({ ...prev, 'shelfLifeErr': "Shelf life is Required!" })));
            isValid = false;
        }
        if (!formState?.noOfBatches) {
            seterrors((prev => ({ ...prev, 'noOfBatchesErr': "No. of batches is Required!" })));
            isValid = false;
        }
        if (!formState?.level) {
            seterrors((prev => ({ ...prev, 'levelErr': "Please select a level!" })));
            isValid = false;
        }
        if (!formState?.taxType?.toString()?.trim()) {
            seterrors((prev => ({ ...prev, 'taxTypeErr': "Please select tax type!" })));
            isValid = false;
        }
        if (!formState?.cgst?.toString()?.trim()) {
            seterrors((prev => ({ ...prev, 'cgstErr': "CGST is required!" })));
            isValid = false;
        }
        if (!formState?.sgst?.toString()?.trim()) {
            seterrors((prev => ({ ...prev, 'sgstErr': "SGST is required!" })));
            isValid = false;
        }
        if (!formState?.rate?.trim() || !formState?.unit?.trim()) {
            seterrors((prev => ({ ...prev, 'rateUnitErr': "Rate and Unit are required!" })));
            isValid = false;
        }
        if (!formState?.deliveryDay?.toString()?.trim()) {
            seterrors((prev => ({ ...prev, 'deliveryDayErr': "Delivery days is required!" })));
            isValid = false;
        }
        if (!formState?.discount?.toString()?.trim()) {
            seterrors((prev => ({ ...prev, 'discountErr': "Discount is required!" })));
            isValid = false;
        }

        if (isValid) {
            saveContractdetails(draft);
        }

    }

    const saveContractdetails = (isdraft) => {
        const y = new Date().getFullYear();
        const val = {
            "hstnumRcId": selectedData[0]?.hstnumRcId,
            "gnumHospitalCode": 998,
            "hstnumContractTypeId": contractID,
            "hstnumSupplierId": parseInt(selectedData[0]?.numSupplierId),
            "hstnumStoreId": storeID,
            "hstnumItembrandId": parseInt(selectedData[0]?.hstnumItembrandId),
            "gnumSeatid": 10001,
            "gnumIsvalid": 1,
            "hstnumItemId": parseInt(selectedData[0]?.hstnumItemId),

            "hststrTenderNo": formState?.tenderNo?.toString(),//bbbb
            "hstnumContractQty": parseInt(formState?.contractedQty),//bbb
            "hstnumShelfLife": parseInt(formState?.shelfLife),
            "hstnumBatchSize": parseInt(formState?.noOfBatches),
            "hstnumImportedFlag": formState?.whetherImported,//bbb
            "sstnumLevelTypeId": parseInt(formState?.level),
            "hstnumAllocationOrderQty": parseInt(formState?.allocationQty),//bbb
            "hstnumTaxType": parseInt(formState?.taxType),
            "hstnumRateUnitid": parseInt(formState?.unit?.split('^')[0]),
            "hstnumRate": parseInt(formState?.rate),
            "hstnumDeliveryDays": parseInt(formState?.deliveryDay),//bbb
            "hstnumCgst": parseInt(formState?.cgst),
            "hstnumSgst": parseInt(formState?.sgst),
            "hstnumDiscount": parseInt(formState?.discount),//bbb
            "gstrRemarks": formState?.remarks,
            "hstdtContractFrmdate": new Date(formState?.contractFrom),
            "hstdtContractTodate": new Date(formState?.contractTo),

            "hstdtFinancialStartDate": `${y - 1}-04-01T00:00:00`,
            "hstdtFinancialEndDate": `${y}-03-31T00:00:00`,
            "hstdtTenderDate": new Date(formState?.tenderDate),
            "hststrFileName": fileName,
            'strDraftFlag': isdraft
        }

        console.log('val', val)

        mpdifyHpRcDetail(val)?.then((data) => {
            if (data?.status === 1) {
                ToastAlert('Rate Contract Updated Successfully', 'success');
                handleReset();
                dispatch(hidePopup());
            } else {
                ToastAlert(data?.message, 'error');
            }
            console.log('data', data)
        })

    }

    const handleViewAction = () => {
        getHpRcEMDDetailsByRc(998, selectedData[0]?.hstnumRcId)?.then((res) => {
            if (res?.status === 1) {
                setViewDetails(res?.data);
                setViewModal(true);
            }
        })
    }

    const onCloseModal = () => {
        setViewModal(false);
        setViewDetails([]);
    }
    const mstModalColumn = [
        { label: "Supplier Name", key: "suppDtl" },
        { label: "Tender No.", key: "tenderRefNo" },
        { label: "EMD Amount(₹)", key: "hstnumBgAmt" },
        { label: "EMD From Date", key: "hstdtBgFrmDate" },
        { label: "EMD To Date", key: "hstdtBgToDate" },
        { label: "EMD No.", key: "hstnumBgNo" },
        { label: "Refund Amount(₹)", key: "hstnumRefundAmount" },
    ]


    return (
        <section className="rateContractAddJHK">
            <h3 className="rateContractAddJHK__heading">
                Rate Contract Itemwise Details (Modify)
            </h3>
            <div className="rateContractAddJHK__container pb-2">
                <h4 className="rateContractAddJHK__container-heading">
                    RC Type Details
                </h4>
                <div>
                    <label htmlFor="supplierName" className="rateContractAddJHK__label">
                        <b>Store Name</b> : {storeName}
                    </label>

                    <label htmlFor="contractType" className="rateContractAddJHK__label">
                        <b>Contract Type</b> : {contractName}
                    </label>
                    <label htmlFor="contractType" className="rateContractAddJHK__label">
                        <b>Drug Name</b> : {selectedData[0]?.strItemName}
                    </label>
                </div>
            </div>

            <div className="flex items-center mb-2 mt-3">
                <div className="w-10 border-1 border-[#097080]"></div>
                <span className="mx-3 font-bold text-[#097080]">
                    Existing Rate Contract
                </span>
                <div className="flex-grow border-1 border-[#097080]"></div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
                <ReactDataTable title={'existingratecontract'} column={existingRcTableCols} data={selectedData} isSearchReq={false} isPagination={false} />
            </div>

            <div className="rateContractAddJHK__container">
                <h4 className="rateContractAddJHK__container-heading">
                    Contract Details
                </h4>
                {actionMode === 'modify' && <>
                    <div>
                        <label
                            htmlFor="taxType"
                            className="rateContractAddJHK__label required-label"
                        >
                            Tender No.:
                        </label>
                        <SelectBox
                            id="tenderNo"
                            options={tenderNoList}
                            onChange={handleChange}
                            name={"tenderNo"}
                            value={formState?.tenderNo}
                            placeholder={`${formState?.tenderNo ? formState?.tenderNo : 'select value'}`}
                            className="Wrapper__select p-4"
                            disabled={formState?.tenderNo}
                            error={formState?.tenderNo ? "" : errors?.tenderNoErr}
                        />
                    </div>

                    <div>
                        <label htmlFor="quotationNo" className="employeeMaster__label">
                            Quotation No.
                        </label>
                        <InputField
                            id="quotationNo"
                            className="rateContractAddJHK__input"
                            type="text"
                            name={"quotationNo"}
                            placeholder="Enter Qty."
                            value={formState?.quotationNo}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="shelfLife"
                            className="employeeMaster__label"
                        >
                            Shelf Life(In days)
                        </label>
                        <InputField
                            id="shelfLife"
                            className="rateContractAddJHK__input"
                            type="text"
                            name={"shelfLife"}
                            placeholder="Enter value"
                            value={formState?.shelfLife}
                            onChange={handleChange}
                        />
                        {errors?.shelfLifeErr &&
                            <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                {errors?.shelfLifeErr}
                            </span>
                        }
                    </div>

                    <div>
                        <label
                            htmlFor="taxType"
                            className="rateContractAddJHK__label required-label"
                        >
                            Batch Size :
                        </label>
                        <ComboDropDown
                            options={batchSizeOptions}
                            onChange={handleChange}
                            name={"noOfBatches"}
                            value={formState?.noOfBatches}
                        />
                        {errors?.noOfBatchesErr &&
                            <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                {errors?.noOfBatchesErr}
                            </span>
                        }
                    </div>
                </>}

                {actionMode === 'view' && <>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0 required-label">
                            Tender No. :{" "}
                            <span className="fs-6 fw-normal">{formState?.tenderNo}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0 required-label">
                            Quotation No. :{" "}
                            <span className="fs-6 fw-normal">{formState?.quotationNo}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0 required-label">
                            Shelf Life(In days) :{" "}
                            <span className="fs-6 fw-normal">{formState?.shelfLife}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0 required-label">
                            Batch Size :{" "}
                            <span className="fs-6 fw-normal">{formState?.noOfBatches}</span>{" "}
                        </label>
                    </div>
                </>}

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0 required-label">
                        Tender Date :{" "}
                        <span className="fs-6 fw-normal">{parseDate(formState?.tenderDate)}</span>{" "}
                    </label>
                </div>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Financial Committee Date :{" "}
                        <span className="fs-6 fw-normal">
                            {parseDate(formState?.financeCommitteDate)}
                        </span>{" "}
                    </label>
                </div>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0 required-label">
                        Contract From :{" "}
                        <span className="fs-6 fw-normal">{parseDate(formState?.contractFrom)}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0 required-label">
                        Contract To :{" "}
                        <span className="fs-6 fw-normal">{parseDate(formState?.contractTo)}</span>{" "}
                    </label>
                </div>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0 required-label">
                        Acceptance Date :{" "}
                        <span className="fs-6 fw-normal">{parseDate(formState?.acceptanceDate)}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0 required-label">
                        Whether Imported :{" "}
                        <span className="fs-6 fw-normal">{formState?.whetherImported === 1 ? 'Yes' : "No"}</span>{" "}
                    </label>
                </div>
            </div>

            <div className="rateContractAddJHK__container">
                <h4 className="rateContractAddJHK__container-heading">
                    Supplier Details
                </h4>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0 required-label">
                        Supplier Name :{" "}
                        <span className="fs-6 fw-normal">{formState?.supplierName}</span>{" "}
                    </label>
                    {errors?.supplierNameErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.supplierNameErr}
                        </span>
                    }
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0 required-label">
                        Allocation of Ordered Qty.(%) :{" "}
                        <span className="fs-6 fw-normal">{formState?.allocationQty}</span>{" "}
                    </label>
                    {errors?.allocationQtyErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.allocationQtyErr
                            }
                        </span>
                    }
                </div>
                {actionMode === 'view' && <>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Level :{" "}
                            <span className="fs-6 fw-normal">{formState?.strLevelTypeName}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Contracted Qty. :{" "}
                            <span className="fs-6 fw-normal">{formState?.contractedQty}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Tax Type :{" "}
                            <span className="fs-6 fw-normal">{formState?.taxType}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Tax(%) :{" "}
                            <span className="fs-6 fw-normal">{formState?.strTax}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Rate/Unit :{" "}
                            <span className="fs-6 fw-normal">{formState?.ratePerUnit}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            RC No. :{" "}
                            <span className="fs-6 fw-normal">{formState?.numRcNo}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Delivery Days :{" "}
                            <span className="fs-6 fw-normal">{formState?.deliveryDay}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Bank Name :{" "}
                            <span className="fs-6 fw-normal">{formState?.strBankName}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Branch Name :{" "}
                            <span className="fs-6 fw-normal">{formState?.strBranchName}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            IFSC Code :{" "}
                            <span className="fs-6 fw-normal">{formState?.strIfscCode}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            EMD Details :{" "}
                            <button className="btn btn-success btn-sm px-2 py-0 rounded rounded-5 fs-13" title={"View EMD Detail"} onClick={handleViewAction}>
                                View
                            </button>
                        </label>
                    </div>
                </>}
                {actionMode === 'modify' && <>
                    <div>
                        <label htmlFor="contractedQty" className="employeeMaster__label">
                            Contracted Qty.
                        </label>
                        <InputField
                            id="contractedQty"
                            className="rateContractAddJHK__input"
                            type="text"
                            name={"contractedQty"}
                            placeholder="Enter Qty."
                            value={formState?.contractedQty}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="level"
                            className="rateContractAddJHK__label required-label"
                        >
                            Level
                        </label>
                        <ComboDropDown
                            options={levelType}
                            onChange={handleChange}
                            name={"level"}
                            value={formState?.level}
                        />
                        {errors?.levelErr &&
                            <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                {errors?.levelErr}
                            </span>
                        }
                    </div>

                    <div>
                        <label
                            htmlFor="taxType"
                            className="rateContractAddJHK__label required-label"
                        >
                            Tax Type
                        </label>
                        <ComboDropDown
                            options={taxTypes}
                            onChange={handleChange}
                            name={"taxType"}
                            value={formState?.taxType}
                        />
                        {errors?.taxTypeErr &&
                            <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                {errors?.taxTypeErr}
                            </span>
                        }
                    </div>

                    <div>
                        <label
                            htmlFor="cgst"
                            className="employeeMaster__label required-label"
                        >
                            CGST (%)
                        </label>
                        <InputField
                            id="cgst"
                            className="rateContractAddJHK__input"
                            type="text"
                            name={"cgst"}
                            placeholder="Enter value"
                            value={formState?.cgst}
                            onChange={handleChange}
                        />
                        {errors?.cgstErr &&
                            <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                {errors?.cgstErr}
                            </span>
                        }
                    </div>

                    <div>
                        <label
                            htmlFor="sgst"
                            className="employeeMaster__label required-label"
                        >
                            SGST (%)
                        </label>
                        <InputField
                            id="sgst"
                            className="rateContractAddJHK__input"
                            type="text"
                            name={"sgst"}
                            placeholder="Enter value"
                            value={formState?.sgst}
                            onChange={handleChange}
                        />
                        {errors?.sgstErr &&
                            <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                {errors?.sgstErr}
                            </span>
                        }
                    </div>

                    <div>
                        <label
                            htmlFor="rate"
                            className="employeeMaster__label required-label"
                        >
                            Rate/Unit
                        </label>
                        <div className="row">
                            <div className="col-4">
                                <InputField
                                    id="rate"
                                    className="rateContractAddJHK__input"
                                    type="text"
                                    name={"rate"}
                                    placeholder="Enter value"
                                    value={formState?.rate}
                                    onChange={handleChange}
                                />
                            </div>
                            <ComboDropDown
                                options={unitDrpDt}
                                onChange={handleChange}
                                name={"unit"}
                                value={formState?.unit}
                                addOnClass="col-8"
                            />
                        </div>
                        {errors?.rateUnitErr &&
                            <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                {errors?.rateUnitErr}
                            </span>
                        }
                    </div>

                    <div>
                        <label
                            htmlFor="deliveryDay"
                            className="employeeMaster__label required-label"
                        >
                            Delivery Day(s)
                        </label>
                        <InputField
                            id="deliveryDay"
                            className="rateContractAddJHK__input"
                            type="text"
                            name={"deliveryDay"}
                            placeholder="Enter days"
                            value={formState?.deliveryDay}
                            onChange={handleChange}
                        />
                        {errors?.deliveryDayErr &&
                            <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                {errors?.deliveryDayErr
                                }
                            </span>
                        }
                    </div>

                    <div>
                        <label htmlFor="discount" className="employeeMaster__label required-label">
                            Discount (%)
                        </label>
                        <InputField
                            id="discount"
                            className="rateContractAddJHK__input"
                            type="text"
                            name={"discount"}
                            placeholder="Enter discount"
                            value={formState?.discount}
                            onChange={handleChange}
                        />
                        {errors?.discountErr &&
                            <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                {errors?.discountErr
                                }
                            </span>
                        }
                    </div>
                </>}
            </div>

            {actionMode === 'modify' &&
                <div className="rateContractAddJHK__container">
                    <h4 className="rateContractAddJHK__container-heading">
                        Specification Upload
                    </h4>

                    <div>
                        <label htmlFor="file" className="employeeMaster__label">
                            Upload File (PDF) :
                        </label>
                        {isFileUploaded ?
                            (<>
                                <span
                                    style={{ color: 'blue', cursor: 'pointer' }}
                                    onClick={() => getHpRcDownloadFile(fileName)}
                                >
                                    {fileName}
                                </span>
                                <span className="text-danger ms-2" title="Remove File" onClick={() => { setIsFileUploaded(false); setFileName("") }} role="button"> <FontAwesomeIcon icon={faClose} size="sm" /></span>
                            </>) :
                            (<>
                                <input
                                    className="rateContractAddJHK__fileUpload"
                                    type="file"
                                    onChange={onFileChange}
                                />

                                <button
                                    className="bankmaster__container-controls-btn"
                                    onClick={handleFileUpload}
                                >
                                    Upload File
                                </button>
                            </>)
                        }
                    </div>

                    <div>
                        <label htmlFor="remarks" className="employeeMaster__label">
                            Remarks :
                        </label>
                        <textarea
                            id="remarks"
                            className="rateContractAddJHK__input"
                            type="text"
                            name={"remarks"}
                            placeholder="Enter here..."
                            value={formState?.remarks}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            }

            {viewModal &&
                <MasterPopUpModal title={'EMD(Earnest Money Deposit) Details'} onCloseModal={onCloseModal} column={mstModalColumn} data={viewDetails} />
            }

            <div className="bankmaster__container-controls">
                {actionMode !== 'view' && <>
                    <button className="bankmaster__container-controls-btn" onClick={() => handleSave('1')}>Save Draft</button>
                    <button className="bankmaster__container-controls-btn" onClick={() => handleSave('0')}>Save</button>
                    <button
                        className="bankmaster__container-controls-btn"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                </>}
                <button
                    className="bankmaster__container-controls-btn"
                    onClick={handleClose}
                >
                    Close
                </button>
            </div>
        </section>
    )
}

export default RcModifyViewFormHP

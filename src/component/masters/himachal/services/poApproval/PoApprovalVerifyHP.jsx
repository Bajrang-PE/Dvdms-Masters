import React, { useEffect, useReducer, useState } from 'react'
import ReactDataTable from '../../../../commons/ReactDataTable';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { DatePickerComponent, InputField } from '../../../../commons/FormElements';
import RichTextEditor from '../../../../commons/RichTextEditor';
import { getSinglePoComponentDetails } from '../../../../../api/Jharkhand/services/SingleProgPoDeskAPI_JH';
import { getHpPoDetails, saveApprovedPoDetails } from '../../../../../api/Himachal/services/poGenerationAPI_HP';
import { fetchData } from '../../../../../utils/ApiHook';
import InputBox from '../../../../commons/InputBox';
import { ToastAlert } from '../../../../../utils/Toast';

const PoApprovalVerifyHP = (props) => {
    const { store, selectedData, actionType } = props;

    const { value: storeID, label: storeName } = store;

    const initialState = {
        //PO detail 
        poType: "",
        poGenPeriod: "",
        poDate: '',
        poNumber: "",
        supplierName: "",
        drugName: "",
        itemCategory: "",
        itemSpecification: "",
        programmeName: "",
        fundingSource: "",
        budgetAvail: "",
        gstNo: "",

        //Purchase Details
        poRef: "",
        totalPoCost: "",
        pCommitteeMeetDate: "",
        pCommitteeMeetCopy: "",
        remarks: "",
        rateUnit: "",
        suggestedQty: '',
        poOrdQty: '',

        //component details
        tAndc: "",
        tAndcAccept: false
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

    const SEAT_ID = 14462;
    const dispatch = useDispatch();
    const [formState, dispatcher] = useReducer(addFormReducer, initialState);
    const [rcDetailsList, setRcDetailsList] = useState([]);
    const [poDetailsList, setPoDetailsList] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [orderQuantity, setOrderQuantity] = useState(0);
    const [allPoData, setAllPoData] = useState({});
    const [totalOrderQuantity, setTotalOrderQuantity] = useState(0);
    const [componentDetails, setComponentDetails] = useState([]);

    console.log('rcDetailsList', rcDetailsList)
    console.log('poDetailsList', poDetailsList)

    const handleReset = () => {
        dispatcher({ type: 'RESET_FORM' });
    }

    function handleClose() {
        dispatch(hidePopup());
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        // const errname = name + "Err";
        if (name === 'tAndcAccept') {
            dispatcher({ type: "SET_FIELD", field: name, value: e.target.checked });
        } else {
            dispatcher({ type: "SET_FIELD", field: name, value });
        }
        // setErrors({ ...errors, [errname]: "" });
    };

    const handleDateChange = (value, fieldName) => {
        const errname = fieldName + "Err";
        const formattedDate = value
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .replace(/ /g, "-");

        dispatcher({
            type: "SET_FIELD",
            field: fieldName,
            value: formattedDate,
        });
    };


    const handleRowSelect = (row, index) => {
        const upRow = { ...row, "index": index }
        setSelectedRowId(upRow);
    };
    const handleQuantityChange = (field, value) => {
        setPoDetailsList(prev => [{ ...prev[0], [field]: value }]);
        setOrderQuantity(value);
    };

    useEffect(() => {
        if (selectedData?.length > 0 && storeID) {
            getAllPoDataTesting(selectedData[0]?.poNo, storeID)
            getPoComponentDetails(selectedData[0]?.poTypeId, 3, storeID, selectedData[0]?.poNo)
        }
    }, [selectedData])

    const getRCDetailsList = (rcId) => {
        fetchData(`/hp-api/rate-contracts?hospitalCode=998&rcId=${rcId}`)?.then((res) => {
            if (res?.data?.status === 1) {
                setRcDetailsList(res?.data?.data?.content)
                const poDt = [{ storeName: storeName, anualDmdQty: 0, QtyPipeline: 0, currentStock: 0, reorderLevel: 0, suggestedQty: formState?.suggestedQty, orderQty: formState?.poOrdQty }]
                setPoDetailsList(poDt)
            } else {
                setRcDetailsList([]);
            }
        })
    }

    useEffect(() => {
        if (formState?.rcId) {
            getRCDetailsList(formState?.rcId);
        }

    }, [formState?.rcId])

    const getAllPoDataTesting = (poNo, storeId) => {

        getHpPoDetails(998, poNo, storeId)?.then((data) => {
            if (data?.status === 1) {
                setAllPoData(data?.data);
                const poData = data?.data;
                dispatcher({
                    type: 'SET_FIELDS', payload: {
                        poType: poData?.strPoType,
                        poGenPeriod: poData?.strFinancialYear,
                        poDate: poData?.dtPoDate,
                        poNumber: poData?.numPoNo,
                        supplierName: poData?.strSupplierName,
                        drugName: poData?.strItemCatName,
                        itemCategory: poData?.strItemCatName,
                        itemSpecification: poData?.strItemSpecifile,
                        programmeName: poData?.strProgrammeName,
                        fundingSource: poData?.strFundingSourceName,
                        budgetAvail: '',
                        gstNo: data?.gstNo,
                        //Purchase Details
                        poRef: poData?.strPoPrefixNo,
                        totalPoCost: poData?.numPoNetAmount,
                        pCommitteeMeetDate: poData?.dtPurCommitteeDate === '---' ? '' : poData?.dtPurCommitteeDate,
                        pCommitteeMeetCopy: 'NA',
                        remarks: poData?.strPoRemarks,
                        rateUnit: data?.rateUnit,
                        suggestedQty: poData?.numRcSuggestQty,
                        poOrdQty: poData?.numPoOrdQty,
                        numItemCatNo: poData?.numItemCatNo,

                        //component details
                        tAndc: '',
                        rcId: poData?.numRcId
                    }
                });
                setTotalOrderQuantity(poData?.numPoOrdQty);
            } else {
                setAllPoData({});
            }
        })
    }

    const getPoComponentDetails = (poType, mode, storeId, poNo) => {
        getSinglePoComponentDetails(998, poType, mode, storeId, poNo)?.then((res) => {
            if (res?.status === 1) {
                const allData = res?.data?.map((dt) => ({ ...dt, isCheck: false }))
                setComponentDetails(allData);
            } else {
                setComponentDetails([]);
            }
        })
    }

    const handleTotalQuantity = () => {
        const quantities = parseInt(orderQuantity) || 0;
        setTotalOrderQuantity(quantities);

        const ratePerUnit = Number(rcDetailsList[0]?.ratePerUnit?.split('/')[0]) || 0;
        const tax = Number(rcDetailsList[0]?.strTax?.split('%')[0]) || 0;
        const discount = rcDetailsList[0]?.numDiscount;

        const finalRate = handleAllRateChange(ratePerUnit, allPoData?.numBaseUnitvalue, discount, tax)
        const totalCost = quantities * finalRate;

        dispatcher({
            type: "SET_FIELD",
            field: "totalPoCost",
            value: totalCost.toFixed(2)
        });
    };


    const saveModifyPoDetails = () => {
        const val = {
            "gnumHospitalCode": 998,
            "hstnumStoreId": parseInt(storeID),
            "sstnumItemCatNo": parseInt(allPoData?.numItemCatNo),
            "strComboPOTypeId": allPoData?.numPoTypeId,
            "hstnumPoNo": allPoData?.numPoNo,
            "sstnumPurchaseSourceId": allPoData?.numPurchaseSourceId || 0,
            "hstnumSupplierId": allPoData?.numSupplierId,
            "hstdtPoDate": new Date(allPoData?.dtPoDate),
            "gnumSeatid": SEAT_ID,
            "hststrApprovedBy": "",
            "financialYear": allPoData?.strFinancialYear,
            "gstrPoRemarks": formState?.remarks,
            "hstnumRcId": allPoData?.numRcId,
            "hstnumProgramId": allPoData?.numProgrammeId,
            "hstnumFundingSourceId": allPoData?.numFundingSourceId || 0,
            "StrApproveType": "1",//DHS" or "3" and "NORMAL" or "1"

            "items": [
                {
                    "hstnumItemBrandId": rcDetailsList[0]?.hstnumItembrandId,
                    "hstnumItemId": rcDetailsList[0]?.hstnumItemId,
                    "hstnumRate": Number(rcDetailsList[0]?.ratePerUnit?.split('/')[0]),
                    "hstnumRateUnitid": rcDetailsList[0]?.numRateUnitid,
                    "hstnumItemTax": Number(rcDetailsList[0]?.strTax?.split('%')[0]),
                    "hstnumOrderQty": totalOrderQuantity,
                    "hstnumDeliveryLocation": parseInt(storeID),
                    "strDDeliveryDays": rcDetailsList[0]?.numDeliveryDays,
                    "hstnumTotDemandedQty": rcDetailsList[0]?.hstnumItembrandId,
                    "hstnumTotOrderedQty": totalOrderQuantity,
                    "hstnumManufId": allPoData?.numSupplierId

                }
            ]
        }
        saveApprovedPoDetails(val)?.then((data) => {
            console.log('data', data)
            if (data?.status === 1) {
                ToastAlert(data?.msg, 'success');
                handleReset();
                handleClose();
            } else {
                ToastAlert(data?.msg, 'error');
            }
        })
    }

    const handleModifyPo = () => {
        let isValid = true;
        if (!formState?.remarks?.trim()) {
            ToastAlert("Please enter approval remarks", 'error');
            isValid = false;
        }
        if (!totalOrderQuantity) {
            ToastAlert("Total order quantity should not empty", 'error');
            isValid = false;
        }
        if (rcDetailsList?.length === 0) {
            ToastAlert("Rate Contract list not available", 'error');
            isValid = false;
        }
        if (isValid) {
            saveModifyPoDetails();
        }
    }

    const handleComponentChange = (index, name, e) => {
        const value =
            name === 'isCheck' ? e.target.checked : e;
        setComponentDetails(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    };

    const handleAllRateChange = (ratePerUnit, unitVal, numDiscount, strTax) => {
        const rate = Number(ratePerUnit);
        const unit = Number(unitVal);
        const discount = Number(numDiscount);
        const tax = Number(strTax);

        const total = (rate / unit) - (rate / unit * discount) / 100;

        const rateWithTax = (total / unit) + (total / unit * tax) / 100;

        return rateWithTax
    };

    const rcDetailsColms = [
        {
            name: <input
                type="checkbox"
                disabled={true}
                className="form-check-input log-select text-start"
            />,
            cell: (row, index) =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="checkbox"
                            checked={selectedRowId?.index === index}
                            onChange={(e) => { handleRowSelect(row, index) }}
                        />
                    </span>
                </div>,
            width: "5%"
        },
        {
            name: (<span>Supplier</span>),
            selector: row => row?.strSupplierName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Rate</span>),
            selector: row => row?.ratePerUnit,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Discount(%)</span>),
            selector: row => row?.numDiscount,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Tax (%)</span>),
            selector: row => row?.strTax?.split('%')[0],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Rate With Tax</span>),
            selector: row => handleAllRateChange(parseInt(row?.ratePerUnit?.split('/')[0]), allPoData?.numBaseUnitvalue, row?.numDiscount, parseInt(row?.strTax?.split('%')[0])),
            sortable: true,
            wrap: true,
        }
    ]

    const poDetailsCols = [
        {
            name: (<span>Store Name</span>),
            selector: row => row?.storeName,
            sortable: true,
            wrap: true,
            // width: "20%"
        },
        {
            name: (<span>Annual Demanded Quantity</span>),
            selector: row => row?.anualDmdQty,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Quantity. In Pipeline(Transit)</span>),
            selector: row => row?.QtyPipeline,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Current Stock</span>),
            selector: row => row?.currentStock,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Reorder Level</span>),
            selector: row => row?.reorderLevel,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Suggested Qty.</span>),
            selector: row => row?.suggestedQty,
            sortable: true,
            wrap: true,
        },
        // {
        //     name: (<span>*Order Quantity(No.)</span>),
        //     selector: row => row?.orderQty,
        //     sortable: true,
        //     wrap: true,
        // },
        {
            name: (<span>*Order Quantity(No.)</span>),
            cell: (row, index) =>
                <div style={{ position: 'absolute', top: 3, left: 0 }}>
                    <InputBox
                        id="orderQuantiy"
                        className=""
                        type="text"
                        name={"orderQuantiy"}
                        placeholder=""
                        value={row?.orderQty}
                        // disabled={selectedRowId?.index !== index}
                        onChange={(e) => { handleQuantityChange("orderQty", e?.target?.value); }}
                        onBlur={handleTotalQuantity}
                    />

                </div>,
            sortable: false,
        },
    ]


    return (
        <section className="rateContractAddJHK">
            <h3 className="rateContractAddJHK__heading">
                {`Purchase Order Approval Form ( Centrally Po )`}
            </h3>

            <div className="rateContractAddJHK__container">
                <h4 className="rateContractAddJHK__container-heading">
                    PO Details
                </h4>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Store Name :{" "}
                        <span className="fs-6 fw-normal">{storeName}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO Type	 :{" "}
                        <span className="fs-6 fw-normal">{formState?.poType}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO Generation Period :{" "}
                        <span className="fs-6 fw-normal">{formState?.poGenPeriod}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Purchase Order Date :{" "}
                        <span className="fs-6 fw-normal">{formState?.poDate}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO No. :{" "}
                        <span className="fs-6 fw-normal">{formState?.poNumber}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Supplier Name :{" "}
                        <span className="fs-6 fw-normal">
                            {formState?.supplierName}
                        </span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Drug Name :{" "}
                        <span className="fs-6 fw-normal">{formState?.drugName}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Item Category :{" "}
                        <span className="fs-6 fw-normal text-success">{formState?.itemCategory}</span>{" "}
                    </label>
                </div>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Item Specification :{" "}
                        <span className="fs-6 fw-normal">{formState?.itemSpecification}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Programme Name :{" "}
                        <span className="fs-6 fw-normal">{formState?.programmeName}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Funding Source :{" "}
                        <span className="fs-6 fw-normal">{formState?.fundingSource}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Budget Available :{" "}
                        <span className="fs-6 fw-normal text-danger">{formState?.budgetAvail}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        GST No. :{" "}
                        <span className="fs-6 fw-normal text-danger">{formState?.gstNo}</span>{" "}
                    </label>
                </div>

            </div>

            <div className="">
                <h5 className="bg-[#097080] text-white p-1 rounded fw-normal ">Rate Contract Details</h5>
                <div style={{ marginBottom: "2rem" }}>
                    <ReactDataTable
                        title={''}
                        column={rcDetailsColms}
                        data={rcDetailsList?.length > 0 ? rcDetailsList : []}
                        isSearchReq={false}
                        isPagination={false}
                    />
                </div>
            </div>

            <div className={`employeeMaster__container d-block`}>
                <h4 className="employeeMaster__container-heading">Purchase Order Details</h4>
                {/* PURCHASE ORDER DETAILS */}
                <div className="">
                    <ReactDataTable
                        title={''}
                        column={poDetailsCols}
                        data={poDetailsList?.length > 0 ? poDetailsList : []}
                        isSearchReq={false}
                        isPagination={false}
                    />
                    <div className='d-flex row m-0 border-1 fs-13'>
                        <div className='col-10 text-end'>Total Order Quantity</div>
                        <span className='col-2 text-center fw-bold'>{totalOrderQuantity}</span>
                    </div>
                </div>
            </div>

            <div className="employeeMaster__container">
                <h4 className="employeeMaster__container-heading">Purchase Details</h4>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Total PO Cost (INR) :{" "}
                        <span className="fs-6 fw-normal text-danger">{formState?.totalPoCost}</span>{" "}
                    </label>
                </div>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Purchase Committee Meeting Copy :{" "}
                        <span className="fs-6 fw-normal">{formState?.pCommitteeMeetCopy}</span>{" "}
                    </label>
                </div>

                <div>
                    <label htmlFor="tenderNo" className="employeeMaster__label">
                        PO Reference
                    </label>
                    <InputField
                        id="poRef"
                        className="employeeMaster__input"
                        type="text"
                        name={"poRef"}
                        placeholder="Enter..."
                        value={formState?.poRef}
                        onChange={handleChange}
                    />
                </div>

                <div>

                    <DatePickerComponent
                        selectedDate={formState.pCommitteeMeetDate}
                        setSelectedDate={(e) => handleDateChange(e, "pCommitteeMeetDate")}
                        labelText={"Purchase Committee Meeting Date"}
                        labelFor={"pCommitteeMeetDate"}
                        name={"pCommitteeMeetDate"}
                        allowMin={true}
                        isRequired
                    />

                </div>

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
                        value={formState?.remarks}
                        onChange={handleChange}
                    />

                </div>
            </div>

            <div className="employeeMaster__container d-block">
                <h4 className="employeeMaster__container-heading">Component Details</h4>

                {componentDetails?.map((data, index) => (

                    <React.Fragment key={index}>
                        <div>
                            <label htmlFor="tAndc" className="employeeMaster__label">
                                {data?.component}:
                            </label>
                            {actionType === "Modify" ?
                                <RichTextEditor
                                    id={data?.component}
                                    name={data?.component}
                                    value={data?.nvl}
                                    onChange={(e) => { handleComponentChange(index, 'nvl', e) }}
                                />
                                :
                                <div
                                    className='inner'
                                    dangerouslySetInnerHTML={{ __html: data?.nvl || "" }}
                                />
                            }
                        </div>
                        {actionType === "Modify" &&
                            <div className='pt-2'>
                                <label className="employeeMaster__label mb-0">
                                    Acceptance :
                                    <input
                                        id={data?.component}
                                        className="ms-2 rounded"
                                        type="checkbox"
                                        name={'isCheck'}
                                        checked={!!data?.isCheck}
                                        onChange={(e) => { handleComponentChange(index, "isCheck", e) }}
                                        style={{ width: "15px", height: "15px" }}
                                    />
                                </label>
                            </div>
                        }
                    </React.Fragment>
                ))}
            </div>

            <div className="bankmaster__container-controls">

                <button className="bankmaster__container-controls-btn" onClick={handleModifyPo}>Approve</button>
                <button className="bankmaster__container-controls-btn" onClick={null}>Reject</button>

                <button
                    className="bankmaster__container-controls-btn"
                    onClick={handleClose}
                >
                    Close
                </button>
            </div>
            <style>
                {`
          .inner ol{
               list-style: auto !important;
          }
        `}
            </style>
        </section>

    );
}

export default PoApprovalVerifyHP

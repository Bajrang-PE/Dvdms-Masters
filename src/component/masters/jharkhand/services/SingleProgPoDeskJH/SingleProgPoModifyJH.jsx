import React, { useEffect, useReducer, useState } from 'react'
import DataTable from '../../../../commons/Datatable';
import ReactDataTable from '../../../../commons/ReactDataTable';
import InputBox from '../../../../commons/InputBox';
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { DatePickerComponent, InputField } from '../../../../commons/FormElements';
import RichTextEditor from '../../../../commons/RichTextEditor';
import { getSinglePoComponentDetails, getSinglePoDwhPoDetails, getSinglePoTestingData, modifySinglePoDwhPoModifySave } from '../../../../../api/Jharkhand/services/SingleProgPoDeskAPI_JH';

const SingleProgPoModifyJH = (props) => {
    const { selectedData, actionType, getAllListData } = props;

    const { value: storeID, label: storeName } = useSelector(
        (state) => state.rateContractJHK.storeID
    );

    const rcDetailsColms = [
        { header: "Supplier", field: "supplier" },
        { header: "Rate/Unit(Inclusive Of Tax)", field: "rateUnit" },
        { header: "Tax(%)", field: "tax" },
    ]

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
    const [orderQuantity, setOrderQuantity] = useState({});
    const [allPoData, setAllPoData] = useState([]);
    const [totalOrderQuantity, setTotalOrderQuantity] = useState(0);
    const [componentDetails, setComponentDetails] = useState([]);

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

    const handleQuantityChange = (rowId, value) => {
        setOrderQuantity(prev => {
            const updated = [...prev];
            updated[rowId] = value;
            return updated;
        });

    };

    useEffect(() => {
        if (selectedData?.length > 0 && storeID) {
            getAllPoDataTesting(selectedData[0]?.poNo, storeID, selectedData[0]?.poDate)
            getPoComponentDetails(selectedData[0]?.poTypeId, 3, storeID, selectedData[0]?.poNo)
        }
    }, [selectedData])

    useEffect(() => {
        if (allPoData?.length > 0 && storeID) {
            getAllPoDetailsList();
        }
    }, [allPoData])

    useEffect(() => {
        if (poDetailsList?.length > 0) {
            const orderQuantity = poDetailsList?.map((dt, index) => (dt[5]?.split('#')[0]));

            const totalBudget = poDetailsList?.reduce(
                (sum, row) => sum + (row[9] ?? 0),
                0
            );
            const totalQuantity = orderQuantity?.reduce((a, b) => parseInt(a) + parseInt(b || 0));
            const totalAvailBudget = (totalBudget || 0) + (allPoData[0]?.poDetails?.po_net_amount || 0)
            dispatcher({ type: "SET_FIELD", field: "budgetAvail", value: totalAvailBudget || 0 });
            setOrderQuantity(orderQuantity);
            setTotalOrderQuantity(totalQuantity);
        }
    }, [poDetailsList])

    const getAllPoDataTesting = (poNo, storeId, poDate) => {
        const val = {
            "gnumHospitalCode": 998,
            "hstnumPoNo": poNo,
            "hstnumStoreId": storeId,
            "strFinancialStartDate": "1-Apr-2024",
            "strFinancialToDate": "31-Mar-2025",
            "hstnumSupplierId": 0,
            "hstdtPoDate": new Date(poDate)
        }

        getSinglePoTestingData(val)?.then((data) => {
            if (data?.status === 1) {
                setAllPoData([data?.data]);
                const poData = data?.data?.poDetails;
                dispatcher({
                    type: 'SET_FIELDS', payload: {
                        poType: poData?.po_type,
                        poGenPeriod: poData?.fin_year,
                        poDate: poData?.po_date,
                        poNumber: poData?.hstnum_po_no,
                        supplierName: poData?.supp_name,
                        drugName: poData?.item_name,
                        itemCategory: poData?.item_cat_dtl,
                        itemSpecification: poData?.item_specifile,
                        programmeName: poData?.programme_name,
                        fundingSource: poData?.funding_source_name,
                        budgetAvail: '',
                        gstNo: data?.data?.gstNo,
                        //Purchase Details
                        poRef: poData?.po_prefix_no,
                        totalPoCost: poData?.po_net_amount,
                        pCommitteeMeetDate: poData?.pur_committee_date === '---' ? '' : poData?.pur_committee_date,
                        pCommitteeMeetCopy: 'NA',
                        remarks: poData?.po_remarks,
                        rateUnit: data?.data?.rateUnit,

                        //component details
                        tAndc: ''
                    }
                });
                setRcDetailsList([{ "supplier": poData?.supp_name, "rateUnit": data?.data?.rateUnit, "tax": poData?.hstnum_tax }])
            } else {
                setAllPoData([]);
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

    const getAllPoDetailsList = () => {
        const val = {
            gnumHospitalCode: 998,
            hstnumStoreId: storeID,
            strIndentPeriodValue: allPoData[0]?.poDetails?.fin_year,
            strComboPOTypeId: `${allPoData[0]?.poDetails?.sstnum_potype_id}^${allPoData[0]?.poDetails?.auth_type}^${allPoData[0]?.poDetails?.rc_flag}`,
            hstdtPoDate: new Date(allPoData[0]?.poDetails?.po_date),
            hstnumItembrandId: parseInt(allPoData[0]?.itemBrandId),
            programmeId: allPoData[0]?.poDetails?.hstnum_programme_id,
            strIndentCellPOCombo: "0",
            hstnumSupplierId: parseInt(allPoData[0]?.poDetails?.hstnum_supplier_id),
            hstnumPoNo: allPoData[0]?.poDetails?.hstnum_po_no,
            fundingSourceId: allPoData[0]?.poDetails?.hstnum_funding_source_id,
            strContractType: allPoData[0]?.poDetails?.sstnum_potype_id,
            strViewFlg: "1",
        }

        getSinglePoDwhPoDetails(val).then((res) => {
            if (res?.status === 1) {
                setPoDetailsList(res?.data)
            } else {
                setPoDetailsList([]);
            }
        })
    }

    const handleTotalQuantity = () => {
        const totalQuantity = orderQuantity?.reduce((a, b) => Number(a) + Number(b || 0));
        setTotalOrderQuantity(totalQuantity);
        const rate = Number(formState?.rateUnit?.split("/")?.[0] || 0);
        const totalpocost = totalQuantity * rate;
        dispatcher({ type: "SET_FIELD", field: "totalPoCost", value: totalpocost?.toFixed(2) || 0 });
    }

    const saveModifyPoDetails = () => {
        const val = {
            "hstnumPoNo": formState?.poNumber,
            "gnumHospitalCode": 998,
            "hstnumStoreId": storeID,
            "strVerifiedBy": allPoData[0]?.poDetails?.hststr_verify_by,
            "strDRemarks": formState?.remarks,
            "strPODetailsHidValue": poDetailsList?.map(dt => dt.slice(0, 6).join("^")) || [],
            "strQrderQty1": orderQuantity || [],
            "strQrderQty2": poDetailsList?.map((dt, index) => (dt[5]?.split('#')[1])) || [],
            "strQrderQty3": poDetailsList?.map((dt, index) => (dt[5]?.split('#')[2])) || [],
            "strQrderQty4": poDetailsList?.map((dt, index) => (dt[5]?.split('#')[3])) || [],

            "newStrPoTypeId": allPoData[0]?.poDetails?.sstnum_potype_id,
            "strPOFinancialYear": allPoData[0]?.poDetails?.fin_year,
            "hstdtPoDate": new Date(allPoData[0]?.poDetails?.po_date),
            "programmeId": allPoData[0]?.poDetails?.hstnum_programme_id,
            "fundingSourceId": allPoData[0]?.poDetails?.hstnum_funding_source_id,
            "hstnumRcId": allPoData[0]?.poDetails?.rc_id,
            "hstnumSupplierId": allPoData[0]?.poDetails?.hstnum_supplier_id,
            "poItemIdValues": allPoData[0]?.poItemIdValues,
            "strComboPOTypeId": allPoData[0]?.poDetails?.sstnum_potype_id,
            "hstnumTax": allPoData[0]?.poDetails?.hstnum_tax,
            "strItemManufacturerId": allPoData[0]?.poDetails?.hstnum_supplier_id,
            "strDDeliveryDays": allPoData[0]?.deliveryDaysMap?.delivery_days1,//
            "strDDeliveryDays2": allPoData[0]?.deliveryDaysMap?.delivery_days2,//
            "strDDeliveryDays3": allPoData[0]?.deliveryDaysMap?.delivery_days3,//
            "strDDeliveryDays4": allPoData[0]?.deliveryDaysMap?.delivery_days4,//
            "gnumSeatId": SEAT_ID,
            // "strChk": allPoData[0]?.poDetails?.po_date,//
            "strDPurchaseSource": allPoData[0]?.poDetails?.sstnum_purchase_source_id,
            "strDQuotationNo": allPoData[0]?.poDetails?.quotation_no,
            "strDQuotationDate": allPoData[0]?.poDetails?.quotation_date,
            "strVerifiedDate": allPoData[0]?.poDetails?.verify_date,
            "strPoRefrenceNo": allPoData[0]?.poDetails?.hstnum_ref_po_no,
            "strPoRefrenceNoText": formState?.poRef,
            "strNextPoDate": allPoData[0]?.poDetails?.next_po_date,
            "strPurchaseCommitteMeetingDate": formState?.pCommitteeMeetDate,
            "strRPPONo": '',//
            "strIndentCellPOCombo": '',
            "strDComponentId": componentDetails?.map((dt) => (dt?.hstnum_component_id?.toString())),
            "strDComponentValue": componentDetails?.map((dt) => (dt?.nvl?.toString()))

        }
        console.log('val', val)
        modifySinglePoDwhPoModifySave(val)?.then((data) => {
            if (data?.status === 1) {
                alert("Po Modified successfully");
                handleClose();
                handleReset();
                getAllListData();
            } else {
                alert('failed');
            }
        })
    }

    const handleModifyPo = () => {
        let isValid = true;
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


    const poDetailsCols = [
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
            name: (<span>Store Name</span>),
            selector: row => row[0],
            sortable: true,
            wrap: true,
            width: "20%"
        },
        {
            name: (<span>Available Budget</span>),
            selector: row => row[9],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Annual Demanded Quantity (A)</span>),
            selector: row => row[1]?.split('#')[0],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Ordered Quantity (B)</span>),
            selector: row => row[1]?.split('#')[1],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Current Stock</span>),
            selector: row => row[1]?.split('#')[4],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Suggested Qty. (A-B)</span>),
            selector: row => row[1]?.split('#')[0] - row[1]?.split('#')[1],
            sortable: true,
            wrap: true,
        },
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
                        value={orderQuantity[index] || ""}
                        disabled={selectedRowId?.index !== index}
                        onChange={(e) => { handleQuantityChange(index, e?.target?.value); }}
                        onBlur={handleTotalQuantity}
                    />

                </div>,
            sortable: false,
        },
    ]


    return (
        <section className="rateContractAddJHK">
            <h3 className="rateContractAddJHK__heading">
                {`${actionType === "View" ? "Purchase Order View Form ( Centrally Rc )" : "Purchase Order Modify Form ( Centrally Rc )"}`}
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
                <h4 className="bg-[#097080] text-white p-1 rounded fw-normal ">Rate Contract Details</h4>
                <div style={{ marginBottom: "2rem" }}>
                    <DataTable
                        masterName={"Rate Contract Details"}
                        ref={null}
                        columns={rcDetailsColms}
                        data={rcDetailsList}
                        isPagination={false}
                        isSearchReq={false}
                        isReport={false}
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
                    {actionType === "Modify" ?
                        <>
                            <label htmlFor="tenderNo" className="employeeMaster__label required-label">
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
                        </>
                        :
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            PO Reference :{" "}
                            <span className="fs-6 fw-normal">{formState?.poRef}</span>
                        </label>
                    }
                </div>

                <div>
                    {actionType === "Modify" ?
                        <DatePickerComponent
                            selectedDate={formState.pCommitteeMeetDate}
                            setSelectedDate={(e) => handleDateChange(e, "pCommitteeMeetDate")}
                            labelText={"Purchase Committee Meeting Date"}
                            labelFor={"pCommitteeMeetDate"}
                            name={"pCommitteeMeetDate"}
                            allowMin={true}
                        />
                        :
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Purchase Committee Meeting Date :{" "}
                            <span className="fs-6 fw-normal">{formState.pCommitteeMeetDate || "NA"}</span>{" "}
                        </label>
                    }
                </div>

                <div>
                    {actionType === "Modify" ?
                        <>
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
                        </>
                        :
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Remarks :{" "}
                            <span className="fs-6 fw-normal">{formState.remarks}</span>{" "}
                        </label>
                    }
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
                {actionType === "Modify" &&
                    <button className="bankmaster__container-controls-btn" onClick={handleModifyPo}>Save</button>
                }
                {/* <button
                    className="bankmaster__container-controls-btn"
                    onClick={handleReset}
                >
                    Reset
                </button> */}
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

export default SingleProgPoModifyJH

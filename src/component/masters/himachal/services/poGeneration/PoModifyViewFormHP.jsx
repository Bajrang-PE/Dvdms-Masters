import React, { useEffect, useReducer, useState } from 'react'
import ReactDataTable from '../../../../commons/ReactDataTable';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { DatePickerComponent, InputField } from '../../../../commons/FormElements';
import RichTextEditor from '../../../../commons/RichTextEditor';
import { getSinglePoComponentDetails, modifySinglePoDwhPoModifySave } from '../../../../../api/Jharkhand/services/SingleProgPoDeskAPI_JH';
import { getHpComponentDetails, getHpPoDetails } from '../../../../../api/Himachal/services/poGenerationAPI_HP';
import { fetchData } from '../../../../../utils/ApiHook';

const PoModifyViewFormHP = (props) => {
    const { store, selectedData, actionType } = props;

    console.log('selectedData', selectedData)

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

        //component details
        tAndc: "",
        tAndcAccept: false,
        rcId: ""
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

    const handleQuantityChange = (rowId, value) => {
        setOrderQuantity(prev => {
            const updated = [...prev];
            updated[rowId] = value;
            return updated;
        });

    };

    useEffect(() => {
        if (selectedData?.length > 0 && storeID) {
            getAllPoDataTesting(selectedData[0]?.poNo, storeID)
            getPoComponentDetails(storeID, selectedData[0]?.poNo)
        }
    }, [selectedData])


    // useEffect(() => {
    //     if (poDetailsList?.length > 0) {
    //         const orderQuantity = poDetailsList?.map((dt, index) => (dt[5]?.split('#')[0]));

    //         const totalBudget = poDetailsList?.reduce(
    //             (sum, row) => sum + (row[9] ?? 0),
    //             0
    //         );
    //         const totalQuantity = orderQuantity?.reduce((a, b) => parseInt(a) + parseInt(b || 0));
    //         const totalAvailBudget = (totalBudget || 0) + (allPoData[0]?.poDetails?.po_net_amount || 0)
    //         dispatcher({ type: "SET_FIELD", field: "budgetAvail", value: totalAvailBudget || 0 });
    //         setOrderQuantity(orderQuantity);
    //         setTotalOrderQuantity(totalQuantity);
    //     }
    // }, [poDetailsList])

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
                setAllPoData([data?.data]);
                const poData = data?.data;
                dispatcher({
                    type: 'SET_FIELDS', payload: {
                        poType: poData?.strPoType,
                        poGenPeriod: poData?.strFinancialYear,
                        poDate: poData?.dtPoDate,
                        poNumber: poData?.numPoNo,
                        supplierName: poData?.strSupplierName,
                        drugName: poData?.strItemName,
                        itemCategory: poData?.strItemCatName,
                        itemSpecification: poData?.strItemSpecifile,
                        programmeName: poData?.strProgrammeName,
                        fundingSource: poData?.strFundingSourceName,
                        budgetAvail: poData?.numBudget,
                        gstNo: poData?.strSupplierGstin,
                        //Purchase Details
                        poRef: poData?.strPoPrefix,
                        totalPoCost: poData?.numPoNetAmount,
                        pCommitteeMeetDate: poData?.dtPurCommitteeDate === '---' ? '' : poData?.dtPurCommitteeDate,
                        pCommitteeMeetCopy: 'NA',
                        remarks: poData?.strPoRemarks,
                        rateUnit: poData?.rateUnit,
                        suggestedQty: poData?.numRcSuggestQty,
                        poOrdQty: poData?.numPoOrdQty,
                        //component details
                        tAndc: '',
                        rcId: poData?.numRcId
                    }
                });
                setTotalOrderQuantity(poData?.numPoOrdQty);

            } else {
                setAllPoData([]);
            }
        })
    }

    const getPoComponentDetails = (storeId, poNo) => {
        getHpComponentDetails(998, poNo, storeId)?.then((res) => {
            if (res?.status === 1) {
                const allData = res?.data?.map((dt) => ({ ...dt, isCheck: false }))
                setComponentDetails(allData);
            } else {
                setComponentDetails([]);
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

    const rcDetailsColms = [
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
            selector: row => parseInt(row?.ratePerUnit?.split('/')[0]) * parseInt(row?.strTax?.split('%')[0]) / 100 + parseInt(row?.ratePerUnit?.split('/')[0]),
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
        {
            name: (<span>*Order Quantity(No.)</span>),
            selector: row => row?.orderQty,
            sortable: true,
            wrap: true,
        },
        // {
        //     name: (<span>*Order Quantity(No.)</span>),
        //     cell: (row, index) =>
        //         <div style={{ position: 'absolute', top: 3, left: 0 }}>
        //             <InputBox
        //                 id="orderQuantiy"
        //                 className=""
        //                 type="text"
        //                 name={"orderQuantiy"}
        //                 placeholder=""
        //                 value={orderQuantity[index] || ""}
        //                 // disabled={selectedRowId?.index !== index}
        //                 onChange={(e) => { handleQuantityChange(index, e?.target?.value); }}
        //                 onBlur={handleTotalQuantity}
        //             />

        //         </div>,
        //     sortable: false,
        // },
    ]

    console.log('formState', formState)

    return (
        <section className="rateContractAddJHK">
            <h3 className="rateContractAddJHK__heading">
                {`${actionType === "View" ? "Purchase Order View ( Centrally Rc )" : "Purchase Order Modify Form ( Centrally Rc )"}`}
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

export default PoModifyViewFormHP

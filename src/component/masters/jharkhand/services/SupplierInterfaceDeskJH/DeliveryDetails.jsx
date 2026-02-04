import React, { useEffect, useReducer, useState } from 'react'
import { ComboDropDown, DatePickerComponent, InputField } from '../../../../commons/FormElements';
import ReactDataTable from '../../../../commons/ReactDataTable';
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { deleteSuppIntDeskDelDetail, fetchSuppIntDeskItemDetails, getSuppIntDeskConsigneeWrhsCmb, getSuppIntDeskDeliveryDetails, getSuppIntDeskDrugCmbData, getSuppIntDeskPrevBatchDtls, getSuppIntDeskScheduleNoCmb, getSuppIntDeskVeiwDeldetail } from '../../../../../api/Jharkhand/services/SupplierInterfaceDeskAPI_JH';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEye, faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import { MasterViewModal } from '../../MasterViewModal';
import MiniTable from '../../../../commons/Minitable';
import { isISODateString, parseDate } from '../../../../commons/utilFunctions';

const DeliveryDetails = (props) => {

    const { selectedData, actionType } = props;

    console.log('selectedData', selectedData)

    const { value: supplierID, label: supplierName } = useSelector(
        (state) => state.jhMst.supplierID
    );

    const initialValues = {
        suppName: "",
        poType: "",
        poDate: "",
        poGenPer: "",
        PoNumber: "",
        suppBankDtls: "",

        consigneeWarehouse: "",
        scheduleNo: "",
        expDelDays: "",
        expDelDate: "",
        challanInvoiceNo: "",
        challanInvoiceDate: "",
        deliveryMode: "",
        vehicleNumber: "",
        transName: "",
        transMobileNo: "",

        drugName: "",

        storeId: "",
        remarks: ""
    }

    const reducerActions = (state, action) => {
        switch (action.type) {
            case "SET_VALUE":
                return { ...state, [action?.name]: action?.value }
            case "SET_VALUES":
                return { ...state, ...action?.payload };
            case "RESET":
                return initialValues
            default:
                return state;
        }
    }

    const SEAT_ID = 14462;
    const dispatch = useDispatch();
    const [values, dispatcher] = useReducer(reducerActions, initialValues);
    const [preDelDetailList, setPreDelDetailList] = useState([]);
    const [poDetails, setPoDetails] = useState();
    const [delModeDrpData, setDelModeDrpData] = useState([]);
    const [scheduleNoDrpData, setScheduleNoDrpData] = useState([]);
    const [consigneeWrhsDrpData, setConsigneeWrhsDrpData] = useState([]);
    const [prevBatchDetailsDrpData, setPrevBatchDetailsDrpData] = useState([]);
    const [itemDetails, setItemDetails] = useState([]);
    const [unitDrpData, setUnitDrpData] = useState([]);
    const [drugNameDrpData, setDrugNameDrpData] = useState([]);
    const [viewModal, setViewModal] = useState(false);
    const [viewDetails, setViewDetails] = useState([]);
    const [viewStatus, setViewStatus] = useState('view');
    const [selectedRows, setSelectedRows] = useState([]);
    const [clickedRow, setClickedrow] = useState();
    const [isViewBalQtyModal, setIsViewBalQtyModal] = useState(false);


    const [rows, setRows] = useState([
        { batchNo: "", menuFacName: "", mfgDate: "", expDate: "", unit: "", suppQtyLimit: "", NPCDCS: "", totalQty: '' }
    ]);

    const [addedRows, setAddedRows] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // const errname = name + "Err";
        if (name === 'tAndcAccept') {
            dispatcher({ type: "SET_VALUE", name: name, value: e.target.checked });
        } else if (name === "scheduleNo") {
            dispatcher({ type: "SET_VALUES", payload: { "scheduleNo": value, "expDelDate": value?.split('^')[1] } });
        } else {
            dispatcher({ type: "SET_VALUE", name: name, value });
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
            type: "SET_VALUE",
            name: fieldName,
            value: formattedDate,
        });
    };

    useEffect(() => {
        if (selectedData?.length > 0) {
            dispatcher({
                type: "SET_VALUES",
                payload: {
                    suppName: supplierName,
                    poType: selectedData[0]?.sstnum_potype_id,
                    poDate: selectedData[0]?.po_date,
                    poGenPer: selectedData[0]?.sstnum_potype_id,
                    PoNumber: selectedData[0]?.hstnum_po_no,
                    suppBankDtls: selectedData[0]?.sstnum_potype_id,
                    storeId: selectedData[0]?.hstnum_store_id,
                }
            });
            getDeliveryDetails(selectedData[0]?.hstnum_po_no, selectedData[0]?.hstnum_store_id);
            getConsigneeWrhsDrpData(selectedData[0]?.hstnum_po_no, selectedData[0]?.hstnum_store_id);
        }
    }, [selectedData])

    useEffect(() => {
        if (values?.consigneeWarehouse) {
            getScheduleNoDrpData(selectedData[0]?.hstnum_po_no, selectedData[0]?.hstnum_store_id, values?.consigneeWarehouse);
        }
    }, [values?.consigneeWarehouse])

    useEffect(() => {
        if (values?.consigneeWarehouse && values?.scheduleNo) {
            getDrugNameDrpData(selectedData[0]?.hstnum_po_no, selectedData[0]?.hstnum_store_id, values?.scheduleNo?.split('^')[0], values?.consigneeWarehouse);
        }
    }, [values?.consigneeWarehouse, values?.scheduleNo])

    useEffect(() => {
        if (values?.drugName) {
            // getPrevBatchDetails(selectedData[0]?.hstnum_supplier_id, values?.drugName);
            getItemDetailsWithBatchUnitCmb();
        } else {
            // setPrevBatchDetailsDrpData([]);
        }
    }, [values?.drugName])


    const getDeliveryDetails = (poNum, poStId) => {
        getSuppIntDeskDeliveryDetails(998, poNum, poStId)?.then((res) => {
            if (res?.status === 1) {
                setPreDelDetailList(res?.data?.prevDeliveryDtls || []);
                setPoDetails(res?.data?.poDetails);
                const delCmb = res?.data?.deliveryModeCmb?.map((data) => ({
                    value: data?.hstnumDeliverymodeId,
                    label: data?.hststrDeliverymodeName
                }))

                setDelModeDrpData(delCmb || []);
            }
        })
    }

    const getScheduleNoDrpData = (poNum, poStId, delStId) => {
        getSuppIntDeskScheduleNoCmb(998, poStId, delStId, poNum)?.then((res) => {
            if (res?.status === 1) {
                const drpData = res?.data?.map((dt) => ({
                    value: dt?.sch_id,
                    label: dt?.hstnum_schedule_no
                }))
                setScheduleNoDrpData(drpData);
            }
        })
    }

    const getConsigneeWrhsDrpData = (poNum, poStId) => {
        getSuppIntDeskConsigneeWrhsCmb(998, poStId, 10281800001)?.then((res) => {
            if (res?.status === 1) {
                const drpData = res?.data?.map((dt) => ({
                    value: dt?.consignee_id,
                    label: dt?.consignee_name
                }))
                setConsigneeWrhsDrpData(drpData);
            } else {
                setConsigneeWrhsDrpData([]);
            }
        })
    }

    const getDrugNameDrpData = (poNo, stId, schNo, delStId) => {
        getSuppIntDeskDrugCmbData(998, poNo, stId, schNo, delStId)?.then((res) => {
            if (res?.status === 1) {
                const drpData = res?.data?.map((dt) => ({
                    value: dt?.hstnum_item_id,
                    label: dt?.item_name,
                    itemBrandId: dt?.hstnum_itembrand_id
                }))
                setDrugNameDrpData(drpData);
            } else {
                setDrugNameDrpData([]);
            }
        })
    }

    const getItemDetailsWithBatchUnitCmb = () => {
        const val = {
            gnumHospitalCode: 998,
            hstnumItemId: values?.drugName,
            hstnumPoNo: selectedData[0]?.hstnum_po_no,
            poStoreId: selectedData[0]?.hstnum_store_id,
            hstnumSupplierId: selectedData[0]?.hstnum_supplier_id,
            deliveryStoreId: values?.consigneeWarehouse,
            hstnumScheduleNo: values?.scheduleNo?.split('^')[0],
            hstnumItembrandId: drugNameDrpData?.find(dt => dt?.value == values?.drugName)?.itemBrandId,
            // StrItemBrandId: drugNameDrpData?.find(dt => dt?.value == values?.drugName)?.itemBrandId,
        }

        fetchSuppIntDeskItemDetails(val)?.then((res) => {
            if (res?.status === 1) {
                const mdArr = res?.data?.batchCombo?.map((dt) => ({
                    ...dt,
                    value: `${dt?.hststr_batch_no}^${dt?.hstdt_expiry_date}^${dt?.hstdt_manuf_date}^${dt?.manuf_name}^${dt?.hstnum_supplier_id}^${dt?.hstnum_dccsupply_qty_limit}^${dt?.hstnum_dcc_request_id}`
                }))
                setPrevBatchDetailsDrpData(mdArr);
                setUnitDrpData(res?.data?.unitCombo);
                setItemDetails(res?.data?.itemDtl);
            } else {
                setPrevBatchDetailsDrpData([]);
                setUnitDrpData({});
                setItemDetails([]);
            }
            console.log('fetchSuppIntDeskItemDetails', res)
        })
    }

    function handleClose() {
        dispatch(hidePopup());
    }

    const columns = [
        {
            name: (<span className='text-center'>Schedule No.</span>),
            selector: row => row?.hstnumScheduleNo,
            sortable: true,
            wrap: true,
            width: "9%"
        },
        {
            name: (<span className='text-center'>Consignee Store Name</span>),
            selector: row => row?.consigneeName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Delivery No</span>),
            selector: row => row?.deliveryNo,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Supplier Invoice No.</span>),
            selector: row => row?.hststrSuppReceiptNo,
            sortable: true,
            wrap: true,
            cell: (row, index) =>
                <span
                    style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={() => alert('bbb')}
                >
                    {row?.hststrSuppReceiptNo}
                </span>
        },
        {
            name: (<span className='text-center'>Supplier Invoice Date</span>),
            selector: row => row?.hstdtSuppReceiptDate,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Transporter Name</span>),
            selector: row => row?.hststrTransporterName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Lorry Number</span>),
            selector: row => row?.hststrLrno,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Status</span>),
            selector: row => row?.challanStatus,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Action</span>),
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white py-0 d-flex gap-1" >
                        <button className="btn btn-success btn-sm px-1 py-0 rounded rounded-5 fs-13" title={"View Record"} onClick={() => { viewRecord(row, 'view') }}>
                            <FontAwesomeIcon icon={faEye} size="xs" />
                        </button>

                        {row?.action === 1 &&
                            <button
                                className="btn btn-danger btn-sm px-1 py-0 rounded rounded-5 fs-13"
                                title={`Delete Details`}
                                // disabled={row?.rcCount !== 0}
                                onClick={() => { viewRecord(row, 'delete') }}>
                                <FontAwesomeIcon icon={faTrash} size="xs" />
                            </button>
                        }

                    </span>
                </div>,
            sortable: false,
            width: "8%"
        },

    ]

    const drugColumns = [
        {
            name: (<span className='text-center'>S.No.</span>),
            selector: (row, index) => index + 1,
            sortable: true,
            wrap: true,
            width: "8%"
        },
        {
            name: (<span className='text-center'>Drug Name</span>),
            selector: row => row?.drugName || '---',
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Manufacturer Name</span>),
            selector: row => row?.menuFacName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Batch No.</span>),
            selector: row => row?.batchNoName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Expiry Date</span>),
            selector: row => row?.expDate,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Mfg. Date</span>),
            selector: row => row?.mfgDate,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Balance Qty. (No.)</span>),
            selector: row => row?.balanceQty,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Delivered Qty. (No.)</span>),
            selector: row => row?.NPCDCS,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Action</span>),
            cell: (row, index) =>
                <div style={{ position: 'absolute' }}>
                    <button
                        className="btn btn-danger btn-sm px-1 py-0 rounded rounded-5 fs-13"
                        title={`Delete Details`}
                        onClick={() => { handleRemoveRow(index, 'cart') }}
                    >
                        <FontAwesomeIcon icon={faTrash} size="xs" />
                    </button>
                </div>,
            sortable: false,
            width: "7%"
        },
    ]

    const handleAddRow = () => {

        const newRow = {
            batchNo: "", menuFacName: "", mfgDate: "", expDate: "", unit: "", suppQtyLimit: "", NPCDCS: "", totalQty: ''
        };
        setRows([...rows, newRow]);
    };

    const handleRemoveRow = (index, key) => {
        if (key === "cart") {
            if (addedRows.length > 0) {
                const updatedRows = addedRows
                    .filter((_, i) => i !== index)
                    .map((r, i) => ({ ...r, columnNo: i + 1 }));
                setAddedRows(updatedRows);
            } else {
                alert("No rows available");
            }
        } else {
            if (rows.length > 0) {
                const updatedRows = rows
                    .filter((_, i) => i !== index)
                    .map((r, i) => ({ ...r, columnNo: i + 1 }));
                setRows(updatedRows);
            } else {
                alert("No rows available");
            }
        }

    };

    const handleInputChange = (index, field, value) => {

        if (field === "batchNo") {
            if (!value) return;
            const [batchNo, expDate, mfgDate, menuFacName, supplierId, suppQtyLimit, requestId] = value.split("^");
            const updatedRows = [...rows];

            updatedRows[index] = {
                ...updatedRows[index],
                batchNo: value,
                expDate,
                mfgDate,
                menuFacName,
                suppQtyLimit,
                NPCDCS: "",
                unit: "",
                batchNoName: batchNo,
                supplierId,
                requestId,
                balanceQty: itemDetails?.balance_qty,
                drugName: drugNameDrpData?.find(dt => dt?.value == values?.drugName)?.label
            };

            setRows(updatedRows);
        } else {
            const updatedRows = [...rows];
            updatedRows[index][field] = value;
            setRows(updatedRows);
        }
    };


    const viewRecord = (row, mode) => {
        setClickedrow(row);
        getSuppIntDeskVeiwDeldetail(998, row?.hstnumPoNo, row?.hstnumScheduleNo, row?.hstnumStoreId, row?.hstnumDeliveryNo)?.then((res) => {
            if (res?.status === 1) {
                setViewStatus(mode);
                setViewDetails(res?.data)
                setViewModal(true);
            } else {
                setViewDetails([])
                setViewModal(false);
                setViewStatus('view');
            }
        })
    }

    const deleteRecord = () => {
        const val = {
            strHospitalCode: 998,
            strScheduleNo: clickedRow?.hstnumScheduleNo,
            strDeliveryStoreId: clickedRow?.hstnumStoreId,
            strDeliveryNo: clickedRow?.hstnumDeliveryNo,
            strDeleteRemarks: values?.remarks?.toString(),
            strPoNo: clickedRow?.hstnumPoNo,
            strSeatId: SEAT_ID,
            strMultiRowBatchNo: selectedRows,
            strDccRequestNo: clickedRow?.strDccRequestNo?.toString() || null,
        }
        deleteSuppIntDeskDelDetail(val)?.then((res) => {
            console.log('res', res)
        })
    }

    const addToCart = () => {
        setAddedRows(rows);
    }

    const onCloseModal = () => {
        setViewModal(false);
        setIsViewBalQtyModal(false);
    }

    const handleRowSelect = (rowId) => {
        setSelectedRows((prev) => {
            if (prev.includes(rowId)) {
                return prev.filter(id => id !== rowId);
            }
            return [...prev, rowId];
        });
    };

    const balQtyModalColumns = [
        { label: 'Ordered Qty. [A] :', key: 'hstnum_order_qty' },
        { label: 'Stop Qty. [B] :', key: 'hstnum_stop_qty' },
        { label: 'Received Qty. till Date [C] :', key: 'hstnum_supplied_qty' },
        { label: 'Rejected Qty. till Date [D] :', key: 'hstnum_rejected_qty' },
        { label: 'Shortage Qty. till Date [E] :', key: 'hstnum_shortage_qty' },
        { label: 'Rejected Qty. After Verify [F] :', key: 'hstnum_rejqty_aft_verify' },
        { label: 'Supplier Return Qty. [G] :', key: 'hstnum_supp_return_qty' },
        { label: 'Replacement Order Qty. till Date [H] :', key: 'repl_order_qty' },
        { label: 'Balanced Qty. [(A-B)-(C-D-E-H)] :', key: 'balance_qty' },
    ]

    console.log('itemSetails', itemDetails)

    return (
        <>
            <h3 className="employeeMaster__heading">Supplier Delivery Details</h3>
            <div className="rateContractAddJHK__container">
                <h4 className="rateContractAddJHK__container-heading">
                    Supplier Details
                </h4>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Supplier Name :{" "}
                        <span className="fs-6 fw-normal">{supplierName}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO Type	 :{" "}
                        <span className="fs-6 fw-normal">{poDetails?.po_type}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO Generation Period :{" "}
                        <span className="fs-6 fw-normal">{poDetails?.fin_year}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Purchase Order Date :{" "}
                        <span className="fs-6 fw-normal">{values?.poDate}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO No. :{" "}
                        <span className="fs-6 fw-normal">{`${poDetails?.sststr_po_prefix}(${poDetails?.hstnum_po_no})`}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Supplier Bank Deatils :{" "}
                        <span className="fs-6 fw-normal">
                            {values?.suppBankDtls}
                        </span>{" "}
                    </label>
                </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
                <ReactDataTable title={'delDetails'} column={columns} data={preDelDetailList} isSearchReq={false} isPagination={false} />
            </div>

            <div className="employeeMaster__container">
                <h4 className="employeeMaster__container-heading">Supplier Delivery Details</h4>

                <ComboDropDown
                    options={consigneeWrhsDrpData}
                    onChange={handleChange}
                    name={"consigneeWarehouse"}
                    label={'Consignee Warehouse :'}
                    value={values?.consigneeWarehouse}
                />

                <ComboDropDown
                    options={scheduleNoDrpData}
                    onChange={handleChange}
                    name={"scheduleNo"}
                    label={'Schedule No.:'}
                    value={values?.scheduleNo}
                />

                <div>
                    <label htmlFor="expDelDays" className="employeeMaster__label required-label">
                        Expected Delivery Days:
                    </label>
                    <InputField
                        id="expDelDays"
                        className="employeeMaster__input"
                        type="text"
                        name={"expDelDays"}
                        placeholder="Enter Tender Number"
                        value={values?.expDelDays}
                        onChange={handleChange}
                    />
                </div>

                <DatePickerComponent
                    selectedDate={values?.expDelDate}
                    setSelectedDate={(e) => handleDateChange(e, "expDelDate")}
                    labelText={"Expected Delivery Date:"}
                    labelFor={"expDelDate"}
                    name={"expDelDate"}
                    allowMin={true}
                // disabled={formState.tender !== 1}
                />

                <div>
                    <label htmlFor="challanInvoiceNo" className="employeeMaster__label required-label">
                        Challan/Invoice No:
                    </label>
                    <InputField
                        id="challanInvoiceNo"
                        className="employeeMaster__input"
                        type="text"
                        name={"challanInvoiceNo"}
                        placeholder="Enter Tender Number"
                        value={values?.challanInvoiceNo}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <DatePickerComponent
                        selectedDate={values?.challanInvoiceDate}
                        setSelectedDate={(e) => handleDateChange(e, "challanInvoiceDate")}
                        labelText={"Challan/Invoice Date:"}
                        labelFor={"challanInvoiceDate"}
                        name={"challanInvoiceDate"}
                        allowMin={true}
                        isRequired={true}
                    // disabled={formState.tender !== 1}
                    />
                </div>

                <ComboDropDown
                    options={delModeDrpData}
                    onChange={handleChange}
                    name={"deliveryMode"}
                    label={'Delivery Mode:'}
                    isRequired={true}
                    value={values?.deliveryMode}
                />

                <div>
                    <label htmlFor="vehicleNumber" className="employeeMaster__label required-label">
                        Vehicle Number:
                    </label>
                    <InputField
                        id="vehicleNumber"
                        className="employeeMaster__input"
                        type="text"
                        name={"vehicleNumber"}
                        placeholder="Enter Tender Number"
                        value={values?.vehicleNumber}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="transName" className="employeeMaster__label required-label">
                        Transporter Name:
                    </label>
                    <InputField
                        id="transName"
                        className="employeeMaster__input"
                        type="text"
                        name={"transName"}
                        placeholder="Enter Tender Number"
                        value={values?.transName}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="transMobileNo" className="employeeMaster__label">
                        Transporter Mobile Number:
                    </label>
                    <InputField
                        id="transMobileNo"
                        className="employeeMaster__input"
                        type="text"
                        name={"transMobileNo"}
                        placeholder="Enter Tender Number"
                        value={values?.transMobileNo}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="file" className="employeeMaster__label required-label">
                        LR Copy (pdf) :
                    </label>
                    <input
                        className="rateContractAddJHK__fileUpload"
                        type="file"
                        placeholder='Choose file...'
                    // onChange={onFileChange}
                    />
                </div>
                <div>
                    <label htmlFor="file" className="employeeMaster__label required-label">
                        E-Way Bill (pdf) :
                    </label>
                    <input
                        className="rateContractAddJHK__fileUpload"
                        type="file"
                        placeholder='Choose file...'
                    // onChange={onFileChange}
                    />
                </div>
                <div>
                    <label htmlFor="file" className="employeeMaster__label required-label">
                        Invoice Copy (pdf) :
                    </label>
                    <input
                        className="rateContractAddJHK__fileUpload"
                        type="file"
                        placeholder='Choose file...'
                    // onChange={onFileChange}
                    />
                </div>

            </div>

            <div className="employeeMaster__container d-block">
                <h4 className="employeeMaster__container-heading">Delivery Drug Details</h4>

                <ComboDropDown
                    options={drugNameDrpData}
                    onChange={handleChange}
                    name={"drugName"}
                    label={'Drug Name:'}
                    isRequired
                    value={values?.drugName}
                />

                <div className="flex items-center mb-0 mt-4">
                    <div className="w-10 border-1 border-[#097080]"></div>
                    <span className="mx-3 font-bolder text-[#097080]">
                        Item Details
                    </span>
                    <div className="flex-grow border-1 border-[#097080]"></div>
                </div>

                <div className="table-responsive mt-1" style={{ maxHeight: "65vh" }}>
                    <table className="table text-center mb-0 table-bordered" style={{ borderColor: "#23646e" }}>
                        <thead className="text-white">
                            <tr className='m-0' style={{ fontSize: "12px", verticalAlign: "middle" }}>
                                <th className='p-1'>{'Batch No.'}</th>
                                <th className='p-1'>{'Manufacture Name'}</th>
                                <th className='p-1'>{'Mfg. Date[dd-Mon-yyyy]'}</th>
                                <th className='p-1'>{'Expiry Date'}</th>
                                <th className='p-1'>{'Unit'}</th>
                                <th className='p-1'>{'Supply Qty Limit'}</th>
                                <th className='p-1'>{'NPCDCS'}</th>
                                <th className='p-1'>{'Total Qty. (Unit)	'}</th>
                                <th className='p-1'>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={handleAddRow}
                                        style={{ padding: "0 4px" }}
                                    >
                                        <FontAwesomeIcon icon={faAdd} size='sm' />
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='' style={{ fontSize: "11px" }}>
                                <td className='p-1 text-end' colSpan={5}>Balance Qty. (InUnit)</td>
                                <td className='p-1 fw-bolder text-info-emphasis text-center cursor-pointer'
                                    onClick={() => { setIsViewBalQtyModal(true) }}
                                >{itemDetails?.balance_qty}</td>
                                <td className='p-1'>{itemDetails?.balance_qty}</td>
                            </tr>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    <td className='p-1'>
                                        <select name="batchNo" className="form-select form-select-sm" value={row?.batchNo} onChange={(e) => handleInputChange(index, 'batchNo', e.target.value)}>
                                            <option value="">Select</option>
                                            {/* <option value="2">Two</option> */}
                                            {prevBatchDetailsDrpData?.length > 0 && prevBatchDetailsDrpData?.map((drg, index) => (
                                                <option
                                                    value={drg?.value}
                                                    key={index}
                                                >{drg?.hststr_batch_no}</option>
                                            ))
                                            }
                                        </select>
                                    </td>

                                    <td className='p-1'>
                                        <input
                                            className="form-control form-control-sm"
                                            type="text"
                                            placeholder=""
                                            name='menuFacName'
                                            value={row?.menuFacName}
                                            onChange={(e) => handleInputChange(index, 'menuFacName', e.target.value)}
                                            readOnly
                                        />
                                    </td>

                                    <td className='p-1'>
                                        <input
                                            className="form-control form-control-sm"
                                            type="text"
                                            placeholder=""
                                            name='mfgDate'
                                            value={row?.mfgDate}
                                            onChange={(e) => handleInputChange(index, 'mfgDate', e.target.value)}
                                            readOnly
                                        />
                                    </td>
                                    <td className='p-1'>
                                        <input
                                            className="form-control form-control-sm"
                                            type="text"
                                            placeholder=""
                                            name='expDate'
                                            value={row?.expDate}
                                            onChange={(e) => handleInputChange(index, 'expDate', e.target.value)}
                                            readOnly
                                        />
                                    </td>
                                    <td className='p-1'>
                                        <select name='unit' value={row?.unit} className="form-select form-select-sm" onChange={(e) => handleInputChange(index, 'unit', e.target.value)}>
                                            <option value="">Select</option>
                                            {unitDrpData?.length > 0 && unitDrpData?.map((unit, index) => (
                                                <option value={unit?.unit_id}>{unit?.unit_name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className='p-1'>
                                        <input
                                            className="form-control form-control-sm"
                                            type="text"
                                            placeholder=""
                                            name='suppQtyLimit'
                                            value={row?.suppQtyLimit}
                                            onChange={(e) => handleInputChange(index, 'suppQtyLimit', e.target.value)}
                                            readOnly
                                        />
                                    </td>
                                    <td className='p-1'>
                                        <input
                                            className="form-control form-control-sm"
                                            type="text"
                                            placeholder=""
                                            name='NPCDCS'
                                            value={row?.NPCDCS}
                                            onChange={(e) => handleInputChange(index, 'NPCDCS', e.target.value)}
                                        />
                                    </td>
                                    <td className='p-1'>{row?.NPCDCS ? row?.NPCDCS : 0}</td>
                                    <td className='p-1'>
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => handleRemoveRow(index)}
                                            style={{ padding: "0 4px" }}
                                        >
                                            <FontAwesomeIcon icon={faMinus} size='sm' />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='text-end pt-2'>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={addToCart}
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-1 fw-bold text-warning" size='lg' />
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center mb-2 mt-6">
                <div className="w-10 border-1 border-[#097080]"></div>
                <span className="mx-3 font-bold text-[#097080]">
                    Added Drug Details
                </span>
                <div className="flex-grow border-1 border-[#097080]"></div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
                <ReactDataTable title={'drugDetails'} column={drugColumns} data={addedRows} isSearchReq={false} isPagination={false} />
            </div>


            <div className="bankmaster__container-controls">
                <button
                    className="bankmaster__container-controls-btn"
                    onClick={handleChange}
                >
                    Save
                </button>
                <button
                    className="bankmaster__container-controls-btn"
                    onClick={handleChange}
                >
                    Reset
                </button>
                <button
                    className="bankmaster__container-controls-btn"
                    onClick={handleClose}
                >
                    Close
                </button>
            </div>

            {viewModal &&
                <Modal show={true} onHide={onCloseModal} size={'xl'} dialogClassName="dialog-min" style={{ zIndex: "1201" }}>
                    <Modal.Header closeButton className='py-1 px-2 cms-login'>

                        <b><h6 className='m-1 p-0'>
                            {viewStatus === "delete" ? `Delete Drug For [ JMHIDPCL ]` : `Drug Details`}</h6></b>

                    </Modal.Header>
                    <Modal.Body className='px-2 py-1'>
                        <table className="table text-center mb-0 table-bordered" style={{ borderColor: "#23646e" }}>
                            <thead className="text-white">
                                <tr className='m-0' style={{ fontSize: "13px", verticalAlign: "middle" }}>
                                    <th className='p-2'>{'Drug Name'}</th>
                                    <th className='p-2'>{'Batch No.'}</th>
                                    <th className='p-2'>{'Manufacturer Name'}</th>
                                    <th className='p-2'>{'Mfg. Date'}</th>
                                    <th className='p-2'>{'Expiry Date'}</th>
                                    <th className='p-2'>{'Supply Qty.'}</th>
                                    <th className='p-2'>{viewStatus === "delete" ? "Option" : 'Programme Name'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {viewDetails?.length > 0 && viewDetails?.map((dt, index) => (
                                    <tr className='' style={{ fontSize: "12px" }} key={index}>
                                        <td className='p-2'>{dt?.item_name}</td>
                                        <td className='p-2 '>{dt?.hststr_batch_no}</td>
                                        <td className='p-2'>{dt?.get_supp_dtl}</td>
                                        <td className='p-2'>{dt?.manuf_date}</td>
                                        <td className='p-2'>{dt?.exp_date}</td>
                                        <td className='p-2'>{dt?.supp_qty}</td>
                                        {viewStatus === "delete" ?
                                            <td className='p-2 fw-bolder text-info-emphasis text-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(dt.hststr_batch_no)}
                                                    onChange={() => { handleRowSelect(dt.hststr_batch_no) }}
                                                />
                                            </td>
                                            :
                                            <td className='p-2 fw-bolder text-info-emphasis text-center'>
                                                {dt?.prg_name}
                                            </td>
                                        }
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {viewStatus === "delete" &&
                            <div className='py-4 px-10'>
                                <label htmlFor="remarks" className="">
                                    Remarks :
                                </label>
                                <textarea
                                    id="remarks"
                                    className="form-control"
                                    type="text"
                                    name={"remarks"}
                                    placeholder="Enter here..."
                                    value={values?.remarks}
                                    onChange={(e) => { dispatcher({ type: "SET_VALUE", name: "remarks", value: e?.target?.value }); }}
                                />
                            </div>
                        }

                        <hr className='my-2' />
                        <div className='text-center'>
                            {viewStatus === "delete" ?
                                <button className='btn cms-login-btn m-1 btn-sm' onClick={deleteRecord}>
                                    <i className="fa fa-trash me-1"></i> Delete
                                </button>
                                :
                                <button className='btn cms-login-btn m-1 btn-sm' onClick={onCloseModal}>
                                    <i className="fa fa-broom me-1"></i> Close
                                </button>
                            }
                        </div>
                    </Modal.Body>
                </Modal>

            }

            {isViewBalQtyModal &&
                <Modal show={true} onHide={onCloseModal} size={'md'} dialogClassName="dialog-min" style={{ zIndex: "1201" }}>
                    <Modal.Header closeButton className='py-1 px-2 cms-login'>
                        <b><h6 className='m-1 p-0'>Drug Bal. Qty. Detail(s)</h6></b>

                    </Modal.Header>
                    <Modal.Body className='px-2 py-1'>

                        {/* <MiniTable columns={balQtyModalColumns} data={[itemDetails]} /> */}
                        <div className='vertical-table'>
                            {[itemDetails].map((row, rowIndex) => (
                                <div key={rowIndex} className="vertical-table-row">
                                    {balQtyModalColumns.map(({ key, label }) => {
                                        return (
                                            <div key={key} className="vertical-table-cell">
                                                <span className="label">{label}</span>
                                                <span className="value">
                                                    {" "}
                                                    {isISODateString(row[key]) ? parseDate(row[key]) : row[key]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        <div className="bankmaster__container-controls">
                            <button
                                className="bankmaster__container-controls-btn"
                                onClick={onCloseModal}
                            >
                                Close
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
            }
        </>
    );
}

export default DeliveryDetails

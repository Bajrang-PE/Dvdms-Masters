import React, { useEffect, useReducer, useState } from 'react'
import { ComboDropDown, DatePickerComponent, InputField } from '../../../../commons/FormElements';
import ReactDataTable from '../../../../commons/ReactDataTable';
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { getSuppIntDeskDeliveryDetails } from '../../../../../api/Jharkhand/services/SupplierInterfaceDeskAPI_JH';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import SelectBox from '../../../../commons/SelectBox';
import InputBox from '../../../../commons/InputBox';

const DeliveryDetails = (props) => {

    const { selectedData, actionType } = props;

    console.log('selectedData', selectedData)
    console.log('actionType', actionType)

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

        storeId: ""
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        // const errname = name + "Err";
        if (name === 'tAndcAccept') {
            dispatcher({ type: "SET_VALUE", name: name, value: e.target.checked });
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
        }
    }, [selectedData])

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
            console.log('res', res)
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
            cell: (row, index) =>
                <div style={{ position: 'absolute', top: 3, left: 0 }}>
                    <button>bb</button>

                </div>,
            sortable: false,
            width: "8%"
        },
    ]

    const drugColumns = [
        {
            name: (<span className='text-center'>S.No.</span>),
            selector: row => row[0],
            sortable: true,
            wrap: true,
            width: "9%"
        },
        {
            name: (<span className='text-center'>Drug Name</span>),
            selector: row => row[9],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Manufacturer Name</span>),
            selector: row => row[1]?.split('#')[0],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Batch No.</span>),
            selector: row => row[1]?.split('#')[1],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Expiry Date</span>),
            selector: row => row[1]?.split('#')[4],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Mfg. Date</span>),
            selector: row => row[1]?.split('#')[0] - row[1]?.split('#')[1],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Balance Qty. (No.)</span>),
            selector: row => row[1]?.split('#')[0] - row[1]?.split('#')[1],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Delivered Qty. (No.)</span>),
            selector: row => row[1]?.split('#')[0] - row[1]?.split('#')[1],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Action</span>),
            cell: (row, index) =>
                <div style={{ position: 'absolute', top: 3, left: 0 }}>
                    <button>bb</button>
                </div>,
            sortable: false,
            width: "9%"
        },
    ]

    const [rows, setRows] = useState([
        { batchNo: "", menuFacName: "", mfgDate: "", expDate: "", unit: "", suppQtyLimit: "", NPCDCS: "", totalQty: '' }
    ]);

    const handleAddRow = () => {
        const newRow = {
            columnNo: rows.length + 1,
            columnForReport: "",
            columnAlignment: "",
            columnWidth: ""
        };
        setRows([...rows, newRow]);
    };

    const handleRemoveRow = (index) => {
        if (rows.length > 0) {
            const updatedRows = rows
                .filter((_, i) => i !== index)
                .map((r, i) => ({ ...r, columnNo: i + 1 }));
            setRows(updatedRows);
        } else {
            alert("No rows available");
        }
    };

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

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
                    options={[{ label: "New", value: 1 }]}
                    onChange={handleChange}
                    name={"consigneeWarehouse"}
                    label={'Consignee Warehouse :'}
                    value={values?.consigneeWarehouse}
                />

                <ComboDropDown
                    options={[{ label: "New", value: 1 }]}
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
                    options={[{ label: "New", value: 1 }]}
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
                                <td className='p-1 fw-bolder text-info-emphasis text-center'>127</td>
                                <td className='p-1'>127</td>
                            </tr>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    <td className='p-1'>
                                        <select name="batchNo" className="form-select form-select-sm" value={row?.batchNo} onChange={(e) => handleInputChange(index, 'batchNo', e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
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
                                        />
                                    </td>
                                    <td className='p-1'>
                                        <select name='unit' value={row?.unit} className="form-select form-select-sm" onChange={(e) => handleInputChange(index, 'unit', e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
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
                            onClick={""}
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
                <ReactDataTable title={'drugDetails'} column={drugColumns} data={[]} isSearchReq={false} isPagination={false} />
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
        </>
    );
}

export default DeliveryDetails

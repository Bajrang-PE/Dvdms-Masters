import React, { useEffect, useState } from 'react'
import { ComboDropDown, DatePickerComponent, InputField } from '../../../../commons/FormElements'
import BottomButtons from '../../../../commons/BottomButtons';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { useDispatch } from 'react-redux';
import { fetchChallanBatchItemDetails, fetchChallanReceiveDetails, receiveOnlineChallanData } from '../../../../../api/Jharkhand/services/ChallanProcessAPI_JH';
import { parseDate } from '../../../../commons/utilFunctions';
import { ToastAlert } from '../../../../../utils/Toast';

const ReceiveChallanProcess = ({ selectedData, actionMode }) => {

    const dispatch = useDispatch();
    const SEAT_ID = 14462;
    const [delNoDrpDt, setDelNoDrpDt] = useState([]);
    const [receivePoData, setReceivePoData] = useState({});
    const [recByDrpDt, setRecByDrpDt] = useState([]);
    const [scheduleNoDrpDt, setScheduleNoDrpDt] = useState([]);
    const [delModeDrpDt, setDelModeDrpDt] = useState([]);
    const [drugNameDrpDt, setDrugNameDrpDt] = useState([]);
    const [manuFacDrpDt, setManuFacDrpDt] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [receiveDelNoData, setReceiveDelNoData] = useState({});
    const [recItemBatchDt, setRecItemBatchDt] = useState([]);
    const [recItemDt, setRecItemDt] = useState({});

    const [values, setValues] = useState({
        storeName: "", poType: "", poNo: "", poDate: "", suppName: "", schNo: "", delNo: "", recDate: parseDate(new Date()), remarks: "ok", manRecDate: parseDate(new Date()), recBy: "", challInvoiceNo: "", challInvoiceDate: "", packageWeight: "", noOfPackets: "", transporterName: "", vehNumber: "", manufacName: "", drugName: ""
    })

    const [errors, setErrors] = useState({
        delNoErr: "", recDateErr: "", recByErr: ""
    })

    const handleChange = (e) => {
        const { name, value } = e?.target;
        const errName = name + "Err";
        setValues({ ...values, [name]: value });
        setErrors({ ...errors, [errName]: "" })
    }

    const handleDateChange = (value, fieldName) => {
        const errName = fieldName + "Err";
        const formattedDate = value
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .replace(/ /g, "-");

        setValues({ ...values, [fieldName]: formattedDate });

        setErrors({ ...errors, [errName]: "" })
    };

    function handleClose() {
        dispatch(hidePopup());
    }

    const getReceiveDetails = (poStoreId, storeId, poNo) => {
        setIsLoading(true);
        fetchChallanReceiveDetails(998, poStoreId, storeId, poNo, 1)?.then((res) => {
            if (res?.status === 1) {
                setReceivePoData(res?.data?.poDetails);
                const recByCmb = res?.data?.recByCombo?.map(dt => ({
                    value: dt?.value,
                    label: dt?.display
                }))
                setRecByDrpDt(recByCmb);

                if (res?.data?.poDetails?.supplierInterfaceFlag === 0) {
                    const schNoCmb = res?.data?.scheduleNo?.map(dt => ({
                        value: dt?.sch_id,
                        label: dt?.hstnum_schedule_no
                    }))
                    const delMdCmb = res?.data?.deliveryModes?.map(dt => ({
                        value: dt?.hstnumDeliverymodeId,
                        label: dt?.hststrDeliverymodeName
                    }))
                    setScheduleNoDrpDt(schNoCmb);
                    setDelModeDrpDt(delMdCmb);
                } else {
                    const delNoCmb = res?.data?.deliveryNoCmb?.map(dt => ({
                        ...dt,
                        value: dt?.scheduleNo + "/" + dt?.deliveryNo,
                        label: "SchNo -" + dt?.scheduleNo + "/" + dt?.deliveryNo
                    }))
                    setDelNoDrpDt(delNoCmb);
                }
                setIsLoading(false);

            } else {
                setReceivePoData({});
                setDelNoDrpDt([]);
                setRecByDrpDt([]);
                setIsLoading(false);
            }
        })
    }

    const getItemBatchDetails = (itemBrandId, location, storeId, poNo, schNo, delNo) => {
        fetchChallanBatchItemDetails(998, itemBrandId, location, storeId, poNo, schNo, delNo)?.then((res) => {
            console.log('res', res)
            if (res?.status === 1) {
                setRecItemDt(res?.data?.recItemDetails);
                setRecItemBatchDt(res?.data?.recItemBatchDetails);
            } else {
                setRecItemDt({});
                setRecItemBatchDt([]);
            }
        })
    }

    useEffect(() => {
        if (selectedData?.length > 0) {
            getReceiveDetails(selectedData[0]?.poStoreId, selectedData[0]?.hstnumStoreId, selectedData[0]?.hstnumPoNo)
        }
    }, [selectedData])

    useEffect(() => {
        if (values?.delNo && selectedData?.length > 0) {
            const { hstnumItembrandId, hstnumStoreId, hstnumPoNo } = selectedData[0];
            getItemBatchDetails(hstnumItembrandId, hstnumStoreId, hstnumStoreId, hstnumPoNo, values?.delNo?.split("/")[0], values?.delNo?.split("/")[1]);
        }
    }, [values?.delNo])

    const handleSave = () => {
        let isValid = true;

        if (!values?.delNo?.trim()) {
            setErrors(prev => ({ ...prev, "delNoErr": "Please select delivery no." }));
            isValid = false;
        }
        if (!values?.recDate?.trim()) {
            setErrors(prev => ({ ...prev, "recDateErr": "Please select received date" }));
            isValid = false;
        }
        if (!values?.recBy?.trim()) {
            setErrors(prev => ({ ...prev, "recByErr": "Please select a value" }));
            isValid = false;
        }


        if (isValid) {
            const isConfirm = confirm("Do you want to save this data");
            if (isConfirm) {
                saveOnlineReceiveData();
            }
        }
    }

    const saveOnlineReceiveData = () => {
        const val = {
            "gnumHospitalCode": 998,
            "hstnumPoNo": selectedData[0]?.hstnumPoNo,
            "poStoreId": selectedData[0]?.hstnumStoreId,
            "hstnumDeliveryLocation": selectedData[0]?.hstnumStoreId,
            "hstnumDeliveryNo": parseInt(values?.delNo?.split("/")[1]),
            "hstnumScheduleNo": parseInt(values?.delNo?.split("/")[0]),
            "strReceiveDate": values?.recDate,
            "strRemarks": values?.remarks,
            "gnumSeatId": SEAT_ID,
            "hststrReceiveBy": values?.recBy,
            "strManualReceiveDate": values?.manRecDate
        }
        receiveOnlineChallanData(val)?.then(res => {
            if (res?.status === 1) {
                ToastAlert(res?.message, 'success');
            }else{
                ToastAlert(res?.message, 'error');
            }
        })
    }


    if (isLoading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }


    return (
        <>
            <h3 className="employeeMaster__heading"> {'Challan Process >> Receive'}</h3>
            <div className="rateContractAddJHK__container mb-3 pb-3">
                <h4 className="rateContractAddJHK__container-heading">
                    {'PO And Store Details'}
                </h4>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Store Name :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.storeName}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO Type	 :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.poType}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO No :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.poNumber}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO Date :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.poDate}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Supplier Name :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.supplierName}</span>{" "}
                    </label>
                </div>
                {receivePoData?.supplierInterfaceFlag === 0 &&
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Late Delivery Days :{" "}
                            <span className="fs-6 fw-normal">{receivePoData?.lateDays}</span>{" "}
                        </label>
                    </div>
                }

                {receivePoData?.supplierInterfaceFlag === 0 ?
                    <ComboDropDown
                        options={scheduleNoDrpDt}
                        onChange={handleChange}
                        value={values?.schNo}
                        label={"Schedule No. :"}
                        addOnClass="rateContract__container--dropdown"
                        name={'schNo'}
                        isRequired
                    /> :
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Schedule No. :{" "}
                            <span className="fs-6 fw-normal">{receivePoData?.oneFlag}</span>{" "}
                        </label>
                    </div>}

                {receivePoData?.supplierInterfaceFlag === 1 &&
                    <div>
                        <ComboDropDown
                            options={delNoDrpDt}
                            onChange={(e) => {
                                handleChange(e);
                                setReceiveDelNoData(delNoDrpDt?.find(dt => dt?.value == e?.target?.value));
                            }}
                            value={values?.delNo}
                            label={"Delivery No :"}
                            addOnClass="rateContract__container--dropdown"
                            name={'delNo'}
                            isRequired
                        />
                        {errors?.delNoErr &&
                            <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                {errors?.delNoErr}
                            </span>
                        }
                    </div>
                }
                <div>
                    <DatePickerComponent
                        selectedDate={values?.recDate}
                        setSelectedDate={(e) => handleDateChange(e, "recDate")}
                        labelText={"Received Date :"}
                        labelFor={"recDate"}
                        name={"recDate"}
                        allowMin={true}
                        isRequired
                    />
                    {errors?.recDateErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.recDateErr}
                        </span>
                    }
                </div>

            </div>

            <div className="flex items-center mb-1 mt-4">
                <div className="w-10 border-1 border-[#097080]"></div>
                <span className="mx-3 font-bold text-[#097080]">
                    Receive Details
                </span>
                <div className="flex-grow border-1 border-[#097080]"></div>
            </div>

            <div className="rateContractAddJHK__container mb-3 pb-3 pt-2">
                {receivePoData?.supplierInterfaceFlag === 0 ?
                    <InputField
                        id="challInvoiceNo"
                        className="employeeMaster__input"
                        type="text"
                        name={"challInvoiceNo"}
                        placeholder="Enter..."
                        value={values?.challInvoiceNo}
                        onChange={handleChange}
                        label="Challan/Invoice No :"
                    /> :
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Challan/Invoice No :{" "}
                            <span className="fs-6 fw-normal">{receiveDelNoData?.receiptNo}</span>{" "}
                        </label>
                    </div>}

                {receivePoData?.supplierInterfaceFlag === 0 ?
                    <DatePickerComponent
                        selectedDate={values?.challInvoiceDate}
                        setSelectedDate={(e) => handleDateChange(e, "challInvoiceDate")}
                        labelText={"Challan/Invoice Date :"}
                        labelFor={"challInvoiceDate"}
                        name={"challInvoiceDate"}
                        allowMin={true}
                        isRequired
                    /> :
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Challan/Invoice Date :{" "}
                            <span className="fs-6 fw-normal">{receiveDelNoData?.receiptDate}</span>{" "}
                        </label>
                    </div>}

                {receivePoData?.supplierInterfaceFlag === 0 && <>
                    <InputField
                        id="noOfPackets"
                        className="employeeMaster__input"
                        type="text"
                        name={"noOfPackets"}
                        placeholder="Enter..."
                        value={values?.noOfPackets}
                        onChange={handleChange}
                        label="No. of Packets :"
                    />
                    <InputField
                        id="packageWeight"
                        className="employeeMaster__input"
                        type="text"
                        name={"packageWeight"}
                        placeholder="Enter..."
                        value={values?.packageWeight}
                        onChange={handleChange}
                        label="Package Weight (Kg) :"
                    />
                </>}

                {receivePoData?.supplierInterfaceFlag === 0 ?
                    <ComboDropDown
                        options={delModeDrpDt}
                        onChange={handleChange}
                        value={values?.delMode}
                        label={"Delivery Mode :"}
                        addOnClass="rateContract__container--dropdown"
                        name={'delMode'}
                        isRequired
                    /> :
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Delivery Mode :{" "}
                            <span className="fs-6 fw-normal">{receiveDelNoData?.deliveryModeName}</span>{" "}
                        </label>
                    </div>}

                {receivePoData?.supplierInterfaceFlag === 0 ?
                    <InputField
                        id="transporterName"
                        className="employeeMaster__input"
                        type="text"
                        name={"transporterName"}
                        placeholder="Enter..."
                        value={values?.transporterName}
                        onChange={handleChange}
                        label="Transporter Name :"
                    /> :
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Transporter Name :{" "}
                            <span className="fs-6 fw-normal">{receiveDelNoData?.transporterName}</span>{" "}
                        </label>
                    </div>}


                {receivePoData?.supplierInterfaceFlag === 0 ?
                    <InputField
                        id="vehNumber"
                        className="employeeMaster__input"
                        type="text"
                        name={"vehNumber"}
                        placeholder="Enter..."
                        value={values?.vehNumber}
                        onChange={handleChange}
                        label="Vehicle Number :"
                    /> :
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Vehicle Number :{" "}
                            <span className="fs-6 fw-normal">{receiveDelNoData?.lrNo}</span>{" "}
                        </label>
                    </div>}


                {receivePoData?.supplierInterfaceFlag === 0 &&
                    <ComboDropDown
                        options={drugNameDrpDt}
                        onChange={handleChange}
                        value={values?.drugName}
                        label={"Drug Name :"}
                        addOnClass="rateContract__container--dropdown"
                        name={'drugName'}
                        isRequired
                    />}

                {receivePoData?.supplierInterfaceFlag === 0 &&
                    <ComboDropDown
                        options={manuFacDrpDt}
                        onChange={handleChange}
                        value={values?.manufacName}
                        label={"Manufacturer Name :"}
                        addOnClass="rateContract__container--dropdown"
                        name={'manufacName'}
                        isRequired
                    />}

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Delivery Date :{" "}
                        <span className="fs-6 fw-normal">{receiveDelNoData?.expectedDeliveryDate}</span>{" "}
                    </label>
                </div>

                {receivePoData?.supplierInterfaceFlag === 1 &&
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Supplier Dispatch date :{" "}
                            <span className="fs-6 fw-normal">{receiveDelNoData?.entryDate}</span>{" "}
                        </label>
                    </div>
                }
            </div>
            <div className="table-responsive mt-1" style={{ maxHeight: "65vh" }}>
                <div className='fs-13 fw-bold text-end required-label'>Drug Name :<span className='text-success ms-2'>{recItemBatchDt[0]?.itemName}</span> </div>
                <table className="table text-center mb-0 table-bordered" style={{ borderColor: "#23646e" }}>
                    <thead className="text-white">
                        <tr className='m-0' style={{ fontSize: "12px", verticalAlign: "middle" }}>
                            <th className='p-1 required-label'>{'Batch No.'}</th>
                            <th className='p-1 required-label'>{'Manufacture Name'}</th>
                            <th className='p-1 required-label'>{'DCC File Name'}</th>
                            <th className='p-1 required-label'>{'Mfg. Date[dd-Mon-yyyy]'}</th>
                            <th className='p-1 required-label'>{'Expiry Date'}</th>
                            <th className='p-1 required-label'>{'Unit'}</th>
                            <th className='p-1'>{'NPCDCS'}</th>
                            <th className='p-1'>{'Total Qty. (Unit)	'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='' style={{ fontSize: "11px" }}>
                            <td className='p-1 text-end fw-bold' colSpan={4}>Balance Qty. (InUnit)</td>
                            <td className='p-1 fw-bolder text-info-emphasis text-center cursor-pointer'
                                onClick={null}
                            >{recItemDt?.balanceQty}</td>
                            <td className='p-1'>222</td>
                            <td className='p-1' colSpan={2}></td>
                        </tr>
                        {recItemBatchDt?.length > 0 && recItemBatchDt?.map((item, index) => (
                            <tr className='fs-13'>
                                <td className='p-1'>{item?.batchNo}</td>
                                <td className='p-1'>{item?.manufacturerName}</td>
                                <td className='p-1' style={{ color: 'blue', cursor: 'pointer' }}>{item?.dccFileName}</td>
                                <td className='p-1'>{item?.manufDate}</td>
                                <td className='p-1'>{item?.expiryDate}</td>
                                <td className='p-1'>{item?.baseUnitName}</td>
                                <td className='p-1'>{item?.suppliedQty}</td>
                                <td className='p-1'>{item?.suppQtyBase}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="rateContractAddJHK__container pb-3 pt-2 mt-3">
                <div>
                    <ComboDropDown
                        options={recByDrpDt}
                        onChange={handleChange}
                        value={values?.recBy}
                        name="recBy"
                        label={"Received By :"}
                        addOnClass="rateContract__container--dropdown m-0"
                        isRequired
                    />
                    {errors?.recByErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.recByErr}
                        </span>
                    }
                </div>
                {receivePoData?.supplierInterfaceFlag === 1 &&
                    <div>
                        <DatePickerComponent
                            selectedDate={values.manRecDate}
                            setSelectedDate={(e) => handleDateChange(e, "manRecDate")}
                            labelText={"Manual Receive Date :"}
                            labelFor={"manRecDate"}
                            name={"manRecDate"}
                            allowMin={true}
                        />
                        {/* {errors?.verifyDateErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.verifyDateErr}
                        </span>
                    } */}
                    </div>
                }

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
                        value={values?.remarks}
                        onChange={handleChange}
                    />
                    {/* {errors?.remarksErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.remarksErr}
                        </span>
                    } */}
                </div>
            </div>

            <BottomButtons isSave={true} isReset={false} isClose={true} isDraft={false} onSave={handleSave} onReset={null} onClose={handleClose} />
        </>
    )
}

export default ReceiveChallanProcess

import React, { useEffect, useState } from 'react'
import { ComboDropDown, DatePickerComponent, InputField, RadioButton } from '../../../../commons/FormElements'
import { useDispatch } from 'react-redux';
import ReactDataTable from '../../../../commons/ReactDataTable';
import InputBox from '../../../../commons/InputBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import BottomButtons from '../../../../commons/BottomButtons';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { fetchChallanVerifyDetails, fetchChallanVerifyProgHelpDetails, saveVerifyChallanData } from '../../../../../api/Jharkhand/services/ChallanProcessAPI_JH';
import { parseDate } from '../../../../commons/utilFunctions';
import { ToastAlert } from '../../../../../utils/Toast';

const VerifyChallanProcess = ({ selectedData, actionMode }) => {

    const dispatch = useDispatch();
    const SEAT_ID = 14462;
    const [receivePoData, setReceivePoData] = useState({});
    const [programListData, setProgramListData] = useState([]);
    const [unitDrpData, setUnitDrpData] = useState([]);
    const [batchDrpData, setBatchDrpData] = useState([]);
    const [itemVarificationEle, setItemVarificationEle] = useState([]);
    const [tempValues, setTempValues] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [values, setValues] = useState({ batchNo: "", batchLabel: "", unitId: "", mfgDate: "", expiryDate: "", rackNo: "", stockRegNo: "", stockPageNo: "", testRptNo: "", testRptDate: parseDate(new Date()), refFileNo: "", refPageNo: "", remarks: "", fileName: "NA", isInGoodCondition: "1", isNotForSale: "1", isNameNotWritten: "1", isPriceNotPrinted: "1", inHouseReport: "1" });

    const [errors, setErrors] = useState({
        batchNoErr: "", unitIdErr: "", expiryDateErr: "", stockRegNoErr: "", stockPageNoErr: "", isInGoodConditionErr: "", isNotForSaleErr: "1", isNameNotWrittenErr: "1", isPriceNotPrintedErr: "1",
    })


    const handleChange = (e) => {
        const { name, value } = e?.target;
        const errName = name + "Err";
        if (name === "batchNo") {
            setValues({
                ...values,
                [name]: value,
                "batchLabel": value?.split("^")[0] || "",
                "mfgDate": value?.split("^")[5] || "",
                "expiryDate": value?.split("^")[4] || "",
                "fileName": value?.split("^")[6] || "",
                "inHouseReport": value?.split("^")[7] || "",
            })
        } else {
            setValues({ ...values, [name]: value });
        }
        setErrors({ ...errors, [errName]: "" })
    }

    const getVerifyDetails = (poStoreId, storeId, poNo, itemId, itemBrandId, challanNo, scheduleNo) => {
        fetchChallanVerifyDetails(998, poStoreId, storeId, poNo, itemId, itemBrandId, challanNo, scheduleNo)?.then(res => {
            if (res?.status === 1) {
                setReceivePoData(res?.data?.poChallanDetails);
                const batchCmb = res?.data?.batchCmbData?.map((dt) => ({
                    ...dt,
                    value: `${dt?.batchSlNo}^${dt?.unitBaseValue}^${dt?.unitId}^${dt?.receivedQty}^${dt?.expiryDate}^${dt?.manufDate}^${dt?.fileName}^${dt?.labReportNo}`,
                    label: dt?.batchSlNo
                }))
                setBatchDrpData(batchCmb);
            } else {
                setReceivePoData({});
                setBatchDrpData([]);
            }
        })
    }

    const getVerifyProgHelpDetails = (storeId, itemId, itemBrandId, challanNo, batchNo) => {
        fetchChallanVerifyProgHelpDetails(998, storeId, itemId, itemBrandId, challanNo, batchNo?.split("^")[0])?.then(res => {
            if (res?.status === 1) {
                const prgData = res?.data?.programmeDetails || [];
                const units = res?.data?.unitCombo?.map(ut => ({
                    ...ut,
                    label: ut?.display
                })) || [];
                setProgramListData(prgData);
                setUnitDrpData(units);
                const eleData = res?.data?.itemVarificatinDtls?.map((item) => ({
                    ...item,
                    value: item?.parameterTypeId === 3 ? "Yes" : "",
                    valueId: item?.parameterTypeId === 3 ? "1" : ""
                }))
                setItemVarificationEle(eleData);
                // const dynamicFields = res?.data?.itemVarificatinDtls?.reduce((acc, dt) => {
                //     acc[`param_${dt.parameterId}`] = "1";
                //     return acc;
                // }, {});

                // setValues(prev => ({ ...prev, ...dynamicFields, "unitId": units?.find(dt => dt?.label == prgData[0]?.unitName)?.value }));
            } else {
                setProgramListData([]);
                setUnitDrpData([]);
            }
        })
    }

    useEffect(() => {
        if (selectedData?.length > 0) {
            const { hstnumStoreId, poStoreId, hstnumPoNo, hstnumItemId, hstnumItembrandId, hstnumChallanNo, hstnumScheduleNo } = selectedData[0];
            getVerifyDetails(poStoreId, hstnumStoreId, hstnumPoNo, hstnumItemId, hstnumItembrandId, hstnumChallanNo, hstnumScheduleNo);
        }
    }, [selectedData])

    useEffect(() => {
        if (values?.batchNo && selectedData?.length > 0) {
            const { hstnumStoreId, hstnumItemId, hstnumItembrandId, hstnumChallanNo } = selectedData[0];
            getVerifyProgHelpDetails(hstnumStoreId, hstnumItemId, hstnumItembrandId, hstnumChallanNo, values?.batchNo)
        }
    }, [values?.batchNo, selectedData])


    function handleClose() {
        dispatch(hidePopup());
    }

    const handleReset = () => {
        setValues({ ...values, batchNo: "", batchLabel: "", unitId: "", mfgDate: "", expiryDate: "", rackNo: "", stockRegNo: "", stockPageNo: "", testRptNo: "", testRptDate: parseDate(new Date()), refFileNo: "", refPageNo: "", remarks: "", fileName: "", isInGoodCondition: "1", isNotForSale: "1", isNameNotWritten: "1", isPriceNotPrinted: "1", inHouseReport: "1" });

        setErrors({ ...errors, batchNoErr: "", unitIdErr: "", expiryDateErr: "", stockRegNoErr: "", stockPageNoErr: "", isInGoodConditionErr: "", isNotForSaleErr: "1", isNameNotWrittenErr: "1", isPriceNotPrintedErr: "1", });

        setProgramListData([]);
    }

    const handleSave = () => {

        let isValid = true;

        if (!values?.batchNo?.trim()) {
            setErrors(prev => ({ ...prev, "batchNoErr": "Please select batch no." }))
            isValid = false;
        }
        if (!values?.unitId?.trim()) {
            setErrors(prev => ({ ...prev, "unitIdErr": "Unit Id is required!" }))
            isValid = false;
        }
        if (!values?.expiryDate?.trim()) {
            setErrors(prev => ({ ...prev, "expiryDateErr": "Expiry date is required!" }))
            isValid = false;
        }
        if (!values?.stockRegNo?.trim() || !values?.stockPageNo?.trim()) {
            setErrors(prev => ({ ...prev, "stockRegNoErr": "Stock register no & Page no are required!" }))
            isValid = false;
        }
        if (itemVarificationEle?.length > 0) {
            itemVarificationEle.forEach(item => {
                const fieldName = `param_${item.parameterId}`;
                if (!item?.valueId && item?.isMandatory === 1) {
                    setErrors(prev => ({ ...prev, [fieldName + "Err"]: "This field is required!" }))
                    isValid = false;
                }
            });
        }

        if (isValid) {
            const isSave = confirm("Do you want to save this data ?");
            if (isSave) {
                saveVerifyDetails();
            }
        }
    }

    const saveVerifyDetails = () => {
        const val = {
            "hstnumStoreId": selectedData[0]?.hstnumStoreId,
            "hstnumChallanNo": selectedData[0]?.hstnumChallanNo,
            "hstnumItemId": selectedData[0]?.hstnumItemId,
            "hstnumItembrandId": selectedData[0]?.hstnumItembrandId,
            "strBatchNo": values?.batchNo?.split("^")[0],
            "strTextBatchNo": values?.batchNo?.split("^")[0],
            "hstnumPoNo": selectedData[0]?.hstnumPoNo,
            "poStoreId": selectedData[0]?.poStoreId,
            "hstnumScheduleNo": selectedData[0]?.hstnumScheduleNo,
            "gnumSeatId": SEAT_ID,
            "gnumHospitalCode": 998,
            "strExpiryDate": values?.batchNo?.split("^")[4],
            "strManufactureDate": values?.batchNo?.split("^")[5],
            "hstnumUnitId": values?.unitId?.split("^")[0],
            "hstnumSupplierId": receivePoData?.supplierId,
            "hstnumDeliveryNo": receivePoData?.delNoId,
            "strReceiveDate": receivePoData?.recDate,
            "strRemarks": values?.remarks,
            "strStockRegisterNumber": values?.stockRegNo,
            "strPageNumber": values?.stockPageNo,
            "strRackNumber": values?.rackNo,
            "strNablReportFlg": values?.inHouseReport || "1",

            "freezeReqDto": programListData?.map((item) => ({
                "hstnumProgrammeId": item?.programmeId,
                "hstnumReceivedQty": item?.receivedBaseQty,
                "strHlpOldRecQty": "0",
                "strHlpActualCountQty": item?.receivedQty,
                "strHlpExcessQty": item?.excess,
                "strHlpAcceptedQty": item?.receivedQty,
                "strHlpBkgQty": item?.stopQty,
                "strHlpRejectedQty": item?.rejectedQty
            })),

            "drugParamDto": itemVarificationEle?.map((item) => ({
                "sstnumParameterId": item?.parameterId,
                "hststrParameterValue": item?.value,
                "hststrParameterValueId": item?.valueId
            }))
        }

        saveVerifyChallanData(val)?.then((res) => {
            if (res?.status === 1) {
                ToastAlert(res?.message, 'success');
                handleReset();
            } else {
                ToastAlert(res?.message, 'error');
            }
        })
    }


    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            alert('pending');
        } else {
            alert("Please select a file", 'error');
        }
    }

    const handleDateChange = (value, fieldName) => {
        // const errName = fieldName + "Err";
        const formattedDate = value
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .replace(/ /g, "-");

        setValues({ ...values, [fieldName]: formattedDate });

        // setErrors({ ...errors, [errName]: "" })
    };

    const handleEleChange = (e) => {
        const { name, value } = e.target;

        setItemVarificationEle(prev =>
            prev.map(item => {
                const fieldName = `param_${item.parameterId}`;
                const valueId = item?.parameterTypeId === 3 ? (value == "Yes" ? "1" : "0") : value;

                if (fieldName === name) {
                    return { ...item, value, valueId };
                }
                return item;
            })
        );
    };

    const handleEleDateChange = (date, fieldName) => {
        setItemVarificationEle(prev =>
            prev.map(item => {
                const name = `param_${item.parameterId}`;

                if (name === fieldName) {
                    return { ...item, value: parseDate(date), valueId: parseDate(date) };
                }
                return item;
            })
        );
    };

    const handleProgChange = (e, row) => {
        const { name, value } = e.target;

        setTempValues(prev => ({
            ...prev,
            [row]: {
                ...prev[row],
                [name]: value
            }
        }));
    };

    const handleProgBlur = (e, row) => {
        const { name } = e.target;

        const updatedValue = tempValues[row];

        setProgramListData(prev =>
            prev.map((item, index) =>
                index == row
                    ? { ...item, ...updatedValue }
                    : item
            )
        );
    };

    const programDtlCols = [
        {
            name: (<span className='text-center'>Manufacturer Name</span>),
            selector: row => row?.suppName,
            sortable: true,
            wrap: true,

        },
        {
            name: (<span className='text-center'>Programme Name</span>),
            selector: row => row?.programmeName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Quantity To Be Received</span>),
            selector: row => row?.netPendingQty,
            sortable: true,
            wrap: true,

        },
        {
            name: (<span className='text-center'>Received Qty</span>),
            selector: row => row?.receivedBaseQty,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Accepted Qty.</span>),
            cell: (row, index) => (
                <div style={{ position: 'absolute', top: 3, left: 0 }}>
                    <InputBox
                        id="receivedQty"
                        className="bg-[#d2d0c6]"
                        type="text"
                        name={"receivedQty"}
                        placeholder=""
                        value={tempValues[index]?.receivedQty ?? row.receivedQty ?? ""}
                        onChange={(e) => handleProgChange(e, index)}
                        onBlur={(e) => handleProgBlur(e, index)}
                    />
                </div>
            ),
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Breakage</span>),
            // selector: row => row?.stopQty,
            cell: (row, index) => (
                <div style={{ position: 'absolute', top: 3, left: 0 }}>
                    <InputBox
                        id="stopQty"
                        className="bg-[#d2d0c6]"
                        type="text"
                        name={"stopQty"}
                        placeholder=""
                        value={tempValues[index]?.stopQty ?? row.stopQty ?? ""}
                        onChange={(e) => handleProgChange(e, index)}
                        onBlur={(e) => handleProgBlur(e, index)}
                    />
                </div>
            ),
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Rejected</span>),
            // selector: row => row?.rejectedQty,
            cell: (row, index) => (
                <div style={{ position: 'absolute', top: 3, left: 0 }}>
                    <InputBox
                        id="rejectedQty"
                        className="bg-[#d2d0c6]"
                        type="text"
                        name={"rejectedQty"}
                        placeholder=""
                        value={tempValues[index]?.rejectedQty ?? row.rejectedQty ?? ""}
                        onChange={(e) => handleProgChange(e, index)}
                        onBlur={(e) => handleProgBlur(e, index)}
                    />
                </div>
            ),
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Excess Qty.</span>),
            cell: (row, index) => (
                <div style={{ position: 'absolute', top: 3, left: 0 }}>
                    <InputBox
                        id="excess"
                        className="bg-[#d2d0c6]"
                        type="text"
                        name={"excess"}
                        placeholder=""
                        value={tempValues[index]?.excess ?? row.excess ?? "0"}
                        onChange={(e) => handleProgChange(e, index)}
                        onBlur={(e) => handleProgBlur(e, index)}
                    />
                </div>
            ),
            sortable: true,
            wrap: true,
        },
    ]

    console.log('values', values)
    console.log('selectedData', selectedData)
    console.log('itemVarificationEle', itemVarificationEle)
    console.log('batchDrpData', batchDrpData)

    return (
        <>
            <h3 className="employeeMaster__heading"> {'Challan Process >> Verify'}</h3>
            <div className="rateContractAddJHK__container mb-3 pb-3">
                <h4 className="rateContractAddJHK__container-heading">
                    {'PO Details'}
                </h4>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO Type	 :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.indentTypeName}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO No :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.poNo}</span>{" "}
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
            </div>

            <div className="rateContractAddJHK__container mb-3 pb-3">
                <h4 className="rateContractAddJHK__container-heading">
                    {'Challan Details'}
                </h4>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Supplier Invoice No. :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.suppRecNo}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Supplier Invoice Date :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.suppRecDate}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Challan No. :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.challanNo}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Received Date :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.recDate}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Expected Delivery Date :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.deliveryDate}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Delivery No. :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.delNoDisplay}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Drug Name :{" "}
                        <span className="fs-6 fw-normal">{receivePoData?.itemName}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        In-House Report No. :{" "}
                        <span className="fs-6 fw-normal">{values?.inHouseReport || 0}</span>{" "}
                    </label>
                </div>

                <div className='row'>
                    <label htmlFor="poNumber" className="Wrapper__label align-content-center required-label">
                        Batch No. :
                    </label>
                    <ComboDropDown
                        options={batchDrpData}
                        onChange={handleChange}
                        value={values?.batchNo}
                        // label={"Batch No. :"}
                        addOnClass="rateContract__container--dropdown col-8"
                        name={'batchNo'}
                    />
                    <InputField
                        id="batchLabel"
                        className="employeeMaster__input"
                        type="text"
                        name={"batchLabel"}
                        placeholder="Batch No"
                        value={values?.batchLabel}
                        onChange={handleChange}
                        addOnClass={"col-4 ps-0"}
                        disabled
                    />
                    {errors?.batchNoErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.batchNoErr}
                        </span>
                    }
                </div>
                <div>
                    <ComboDropDown
                        options={unitDrpData}
                        onChange={handleChange}
                        value={values?.unitId}
                        label={"Unit :"}
                        addOnClass="rateContract__container--dropdown"
                        name={'unitId'}
                        isRequired
                    />
                    {errors?.unitIdErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.unitIdErr}
                        </span>
                    }
                </div>
                <InputField
                    id="mfgDate"
                    className="employeeMaster__input"
                    type="text"
                    name={"mfgDate"}
                    placeholder="Mfg date"
                    value={values?.mfgDate || ""}
                    onChange={handleChange}
                    label="Mfg. Date [dd-Mon-yyyy] :"
                    readOnly
                />
                <div>
                    <InputField
                        id="expiryDate"
                        className="employeeMaster__input"
                        type="text"
                        name={"expiryDate"}
                        placeholder="Expiry date"
                        value={values?.expiryDate || ""}
                        onChange={handleChange}
                        label="Expiry Date [dd-Mon-yyyy] :"
                        isRequired
                        readOnly
                    />
                    {errors?.expiryDateErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.expiryDateErr}
                        </span>
                    }
                </div>

                <InputField
                    id="rackNo"
                    className="employeeMaster__input"
                    type="text"
                    name={"rackNo"}
                    placeholder="Enter Rack no"
                    value={values?.rackNo}
                    onChange={handleChange}
                    label="Rack No. :"
                />
                <div className='row'>
                    <label htmlFor="poNumber" className="Wrapper__label align-content-center required-label">
                        Stock Register No./Page No :
                    </label>

                    <InputField
                        id="stockRegNo"
                        className="employeeMaster__input"
                        type="text"
                        name={"stockRegNo"}
                        placeholder="Enter register no"
                        value={values?.stockRegNo}
                        onChange={handleChange}
                        addOnClass={"col-6"}
                    />

                    <InputField
                        id="stockPageNo"
                        className="employeeMaster__input"
                        type="text"
                        name={"stockPageNo"}
                        placeholder="Enter page no"
                        value={values?.stockPageNo}
                        onChange={handleChange}
                        addOnClass={"col-6 ps-0"}
                    />

                    {errors?.stockRegNoErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.stockRegNoErr}
                        </span>
                    }
                </div>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Report Attachment :{" "}
                        <span className="fs-6 fw-normal">{values?.fileName}</span>{" "}
                    </label>
                </div>
            </div>

            <div className="flex items-center mb-2 mt-6">
                <div className="w-10 border-1 border-[#097080]"></div>
                <span className="mx-3 font-bold text-[#097080]">
                    Programme Details
                </span>
                <div className="flex-grow border-1 border-[#097080]"></div>
            </div>

            <div className="mb-6">
                <ReactDataTable
                    title={''}
                    column={programDtlCols}
                    data={programListData}
                    isSearchReq={false}
                    isPagination={false}
                />
            </div>

            <div className="rateContractAddJHK__container mb-3 pb-3">
                <h4 className="rateContractAddJHK__container-heading">
                    {'Item Verification Details'}
                </h4>
                {/* {itemVarificationEle?.length > 0 && itemVarificationEle?.map((item, index) => (
                    <React.Fragment key={item?.parameterId}>

                        {item?.parameterTypeId === 2 &&
                            <InputField
                                id="testRptNo"
                                className="employeeMaster__input"
                                type="text"
                                name={"testRptNo"}
                                placeholder="Enter..."
                                value={values?.testRptNo}
                                onChange={handleChange}
                                addOnClass={""}
                                // label={'1.Test Report No (If Material Write NA)'}
                                label={item?.parameterName}
                            />}

                        {item?.parameterTypeId === 1 &&
                            <DatePickerComponent
                                selectedDate={values.testRptDate}
                                setSelectedDate={(e) => handleDateChange(e, "testRptDate")}
                                // labelText={"2.Test Report Date :"}
                                labelText={item?.parameterName}
                                labelFor={"testRptDate"}
                                name={"testRptDate"}
                                allowMin={true}
                            />}

                        {item?.parameterTypeId === 3 &&
                            <div className="branchmaster__container">
                                <label className="bankmaster__label">{item?.parameterName}</label>
                                <RadioButton
                                    label="Yes"
                                    name="isInGoodCondition"
                                    value="1"
                                    checked={values?.isInGoodCondition === '1'}
                                    onChange={handleChange}
                                    className={'ms-2'}
                                />
                                <RadioButton
                                    label="No"
                                    name="isInGoodCondition"
                                    value="0"
                                    checked={values?.isInGoodCondition === '0'}
                                    onChange={handleChange}
                                />
                            </div>}
                    </React.Fragment>
                ))} */}

                {itemVarificationEle?.length > 0 && itemVarificationEle?.map((item) => {
                    const fieldName = `param_${item.parameterId}`;

                    return (
                        <React.Fragment key={item?.parameterId}>

                            {/* TEXT INPUT */}
                            {item?.parameterTypeId === 2 &&
                                <div>
                                    <InputField
                                        id={fieldName}
                                        className="employeeMaster__input"
                                        type="text"
                                        name={fieldName}
                                        placeholder="Enter..."
                                        value={item?.value || ""}
                                        onChange={handleEleChange}
                                        label={item?.parameterName}
                                        isRequired={item?.isMandatory === 1}
                                    />
                                    {errors[fieldName] &&
                                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                            {errors[fieldName]}
                                        </span>
                                    }
                                </div>
                            }

                            {/* DATE PICKER */}
                            {item?.parameterTypeId === 1 &&
                                <div>
                                    <DatePickerComponent
                                        selectedDate={item?.value || new Date()}
                                        setSelectedDate={(date) => handleEleDateChange(date, fieldName)}
                                        labelText={item?.parameterName}
                                        labelFor={fieldName}
                                        name={fieldName}
                                        allowMin={true}
                                        isRequired={item?.isMandatory === 1}
                                    />
                                    {errors[fieldName] &&
                                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                            {errors[fieldName]}
                                        </span>
                                    }
                                </div>
                            }

                            {/* RADIO BUTTON */}
                            {item?.parameterTypeId === 3 &&
                                <div className="branchmaster__container">
                                    <label className={`bankmaster__label ${item?.isMandatory === 1 && "required-label"}`}>{item?.parameterName}</label>

                                    <RadioButton
                                        label="Yes"
                                        name={fieldName}
                                        value="Yes"
                                        checked={item?.value === 'Yes'}
                                        onChange={handleEleChange}
                                        className="ms-2"
                                    />

                                    <RadioButton
                                        label="No"
                                        name={fieldName}
                                        value="No"
                                        checked={item?.value === 'No'}
                                        onChange={handleEleChange}
                                    />

                                    {errors[fieldName] &&
                                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                            {errors[fieldName]}
                                        </span>
                                    }
                                </div>
                            }

                        </React.Fragment>
                    );
                })}
                <div className="branchmaster__container">
                    <label className="bankmaster__label">In-House Report</label>
                    <RadioButton
                        label="Yes"
                        name="inHouseReport"
                        value="1"
                        checked={values?.inHouseReport === '1'}
                        onChange={handleChange}
                        className={'ms-2'}
                    />
                    <RadioButton
                        label="No"
                        name="inHouseReport"
                        value="0"
                        checked={values?.inHouseReport === '0'}
                        onChange={handleChange}
                    />
                </div>

            </div>

            <div className="rateContractAddJHK__container mb-3 pb-3">
                <h4 className="rateContractAddJHK__container-heading">
                    {'Reference Details'}
                </h4>
                <div className='row'>
                    <label htmlFor="poNumber" className="Wrapper__label align-content-center">
                        File No./Page No. :
                    </label>

                    <InputField
                        id="refFileNo"
                        className="employeeMaster__input"
                        type="text"
                        name={"refFileNo"}
                        placeholder="Enter register no"
                        value={values?.refFileNo}
                        onChange={handleChange}
                        addOnClass={"col-6"}
                    />

                    <InputField
                        id="refPageNo"
                        className="employeeMaster__input"
                        type="text"
                        name={"refPageNo"}
                        placeholder="Enter page no"
                        value={values?.refPageNo}
                        onChange={handleChange}
                        addOnClass={"col-6 ps-0"}
                    />
                </div>

                <div>
                    <label htmlFor="file" className="Wrapper__label d-block">
                        Attach (PDF) :
                    </label>
                    {values?.isFileUploaded ?
                        (<>
                            <span
                                style={{ color: 'blue', cursor: 'pointer' }}

                            >
                                {values?.fileName}
                            </span>
                            <span className="text-danger ms-2" title="Remove File" role="button"> <FontAwesomeIcon icon={faClose} size="sm" /></span>
                        </>) :
                        (<>
                            <input
                                className="Wrapper__inputs fileUpload w-50"
                                type="file"
                                onChange={onFileChange}
                                role='button'
                            />

                            <button
                                className="buttons__container-controls-btn ms-2"
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
                        value={values?.remarks}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <BottomButtons isSave={true} isReset={true} isClose={true} isDraft={false} onSave={handleSave} onReset={handleReset} onClose={handleClose} />

        </>
    )
}

export default VerifyChallanProcess

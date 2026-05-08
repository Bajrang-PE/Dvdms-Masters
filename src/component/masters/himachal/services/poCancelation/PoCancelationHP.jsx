import React, { useEffect, useState } from 'react'
import { ComboDropDown, DatePickerComponent } from '../../../../commons/FormElements';
import ReactDataTable from '../../../../commons/ReactDataTable';
import { getCommonHpApprByCmbCombo, getCommonHpStoreNameCmb, getCommonHpSupplierCombo } from '../../../../../api/Himachal/commonAPI_HP';
import { getHpPoCancConsigneeDetails, getHpPoCancItemCmbBySchDetails, getHpPoCancPoNoCombo, getHpPoCancProgramCombo, getHpPoCancScheduleCmbDetails, saveHpPoCancelDetails } from '../../../../../api/Himachal/services/poGenerationAPI_HP';
import { ToastAlert } from '../../../../../utils/Toast';
import InputBox from '../../../../commons/InputBox';

const PoCancelationHP = () => {

    const SEAT_ID = 14409;
    const [isRelease, setIsRelease] = useState(false);
    const [isGoClicked, setIsGoClicked] = useState(false);
    const [consigneeListData, setConsigneeListData] = useState([]);
    const [releasePoListData, setReleasePoListData] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState([]);

    const [storeNameDrpDt, setStoreNameDrpDt] = useState([]);
    const [suppNameDrpDt, setSuppNameDrpDt] = useState([]);
    const [poNoDrpDt, setPoNoDrpDt] = useState([]);
    const [scheduleNoDrpDt, setScheduleNoDrpDt] = useState([]);
    const [drugNameDrpDt, setDrugNameDrpDt] = useState([]);
    const [programNameDrpDt, setProgramNameDrpDt] = useState([]);
    const [verifyByDrpDt, setVerifyByDrpDt] = useState([]);


    const [values, setValues] = useState({
        storeName: "", suppName: "", poNo: "", scheduleNo: "", drugName: "", programName: "", poDate: "---", poType: "---", poRefNo: "---", delDate: "---", verifyBy: "", verifyDate: new Date(), remarks: ""
    });
    const [errors, setErrors] = useState({
        storeNameErr: "", suppNameErr: "", poNoErr: "", verifyDateErr: "", remarksErr: "", verifyByErr: ""
    })

    const handleChange = (e) => {
        const { name, value } = e?.target;
        const errname = name + "Err";
        setValues({ ...values, [name]: value });
        setErrors({ ...errors, [errname]: "" });
    }

    const handleDateChange = (value, fieldName) => {
        const formattedDate = value
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .replace(/ /g, "-");

        setValues({ ...values, [fieldName]: formattedDate, });
    };

    const loadDrugDrpData = async (poNo, scheduleNo) => {
        try {
            let status = [];
            const data = await getHpPoCancItemCmbBySchDetails(poNo?.split('^')[1], scheduleNo?.split('^')[0], 998);
            if (data?.status === 1) {
                data?.data.forEach((element) => {
                    const obj = {
                        label: element.display,
                        value: element.value,
                    };
                    status.push(obj);
                });
                setDrugNameDrpDt(status);
            } else {
                setDrugNameDrpDt([]);
            }

        } catch (err) {
            console.log("Failed to fetch drugs.", err);
        }
    };
    const loadScheduleDrpData = async (poNo, storeId) => {
        try {
            let status = [];
            const data = await getHpPoCancScheduleCmbDetails(poNo?.split('^')[1], storeId, 998);
            if (data?.status === 1) {
                data?.data.forEach((element) => {
                    const obj = {
                        label: element.display,
                        value: element.value,
                    };
                    status.push(obj);
                });
                setScheduleNoDrpDt(status);
            } else {
                setScheduleNoDrpDt([]);
            }

        } catch (err) {
            console.log("Failed to fetch drugs.", err);
        }
    };
    const loadVerifyByDrpData = async (storeId) => {
        try {
            let list = [];
            const data = await getCommonHpApprByCmbCombo(998, storeId);
            if (data?.status === 1) {
                data?.data.forEach((element) => {
                    const obj = {
                        label: element.display,
                        value: element.value,
                    };
                    list.push(obj);
                });
                setVerifyByDrpDt(list);
            } else {
                setVerifyByDrpDt([]);
            }

        } catch (err) {
            console.log("Failed to fetch drugs.", err);
        }
    };
    const loadPoNoDrpData = async (storeId, suppId) => {
        try {
            let list = [];
            const data = await getHpPoCancPoNoCombo(998, storeId, suppId);
            if (data?.status === 1) {
                data?.data.forEach((element) => {
                    const obj = {
                        label: element.display,
                        value: element.value,
                    };
                    list.push(obj);
                });
                setPoNoDrpDt(list);
            } else {
                setPoNoDrpDt([]);
            }

        } catch (err) {
            console.log("Failed to fetch drugs.", err);
        }
    };
    const loadProgramDrpData = async (storeId, poNo, suppId, schNo, brandId) => {
        try {
            let list = [];
            const data = await getHpPoCancProgramCombo(998, storeId, poNo?.split('^')[1], suppId, schNo?.split('^')[0], brandId);
            if (data?.status === 1) {
                data?.data.forEach((element) => {
                    const obj = {
                        label: element.display,
                        value: element.value,
                    };
                    list.push(obj);
                });
                setProgramNameDrpDt(list);
            } else {
                setProgramNameDrpDt([]);
            }

        } catch (err) {
            console.log("Failed to fetch drugs.", err);
        }
    };

    const getConsigneeListDetails = () => {
        getHpPoCancConsigneeDetails(998, values?.storeName, values?.poNo?.split('^')[1])?.then((res) => {
            if (res?.status === 1) {
                setConsigneeListData(res?.data);
                setValues({ ...values, 'stopQty': res?.data[0]?.numBalanceQty })
            } else {
                setConsigneeListData([]);
            }
            console.log('res', res);
        })
    }

    useEffect(() => {
        const loadSupplierDrpDt = async () => {
            try {
                let suppList = [];
                const data = await getCommonHpSupplierCombo(998, 10);
                if (data?.status === 1) {
                    data?.data.forEach((element) => {
                        const obj = {
                            label: element?.display,
                            value: element?.value,
                        };
                        suppList.push(obj);
                    });
                    setSuppNameDrpDt(suppList?.filter(dt => dt?.value !== "0"));
                } else {
                    setSuppNameDrpDt([]);
                }
            } catch (err) {
                console.log("Failed to fetch drugs.", err);
            }
        };
        const loadStoreNameDrpData = async () => {
            try {
                let stores = [];
                const data = await getCommonHpStoreNameCmb(998, SEAT_ID);
                if (data?.status === 1) {
                    data?.data.forEach((element) => {

                        const obj = {
                            label: element.display,
                            value: element.value,
                        };
                        stores.push(obj);
                    });
                    setStoreNameDrpDt(stores);
                    setValues({ ...values, ['storeName']: stores.at(1).value })
                } else {
                    setStoreNameDrpDt([]);
                }

            } catch (err) {
                console.log("Failed to fetch drugs.", err);
            }
        };

        loadSupplierDrpDt();
        loadStoreNameDrpData();
    }, []);

    useEffect(() => {
        if (values?.storeName && values?.suppName && values?.poNo && values?.scheduleNo && values?.drugName) {
            loadProgramDrpData(values?.storeName, values?.poNo, values?.suppName, values?.scheduleNo, values?.drugName);
        }
    }, [values?.storeName, values?.suppName, values?.poNo, values?.scheduleNo, values?.drugName])

    const handleGoClick = () => {
        let isValid = true;
        if (!values?.storeName?.trim() || values?.storeName === "0") {
            setErrors(prev => ({ ...prev, "storeNameErr": "Please select a store" }));
            isValid = false;
        }
        if (!values?.suppName?.trim()) {
            setErrors(prev => ({ ...prev, "suppNameErr": "Please select a supplier" }));
            isValid = false;
        }
        if (!values?.poNo?.trim()) {
            setErrors(prev => ({ ...prev, "poNoErr": "Please select PO number" }));
            isValid = false;
        }
        if (isValid) {
            getConsigneeListDetails();
            setIsGoClicked(true);
            loadVerifyByDrpData(values?.storeName);
        }
    }
    const handleIsReleaseClicked = (e) => {
        setIsRelease(e?.target?.checked);
        reset();
    }

    const handleRowSelect = (row, index) => {
        const upRow = { ...row, "index": index }
        setSelectedRowId(upRow);
    };

    const reset = () => {
        setIsGoClicked(false);
        setValues({ storeName: values?.storeName, suppName: "", poNo: "", scheduleNo: "", drugName: "", programName: "", poDate: "---", poType: "---", poRefNo: "---", delDate: "---", verifyBy: "", verifyDate: new Date(), remarks: "" });
        setErrors({ storeNameErr: "", suppNameErr: "", poNoErr: "" });
    }

    const onSaveCancelationData = () => {
        let isValid = true;

        if (!values?.verifyBy?.trim()) {
            setErrors(prev => ({ ...prev, "verifyByErr": "Please select a value" }));
            isValid = false;
        }
        if (!values?.remarks?.trim()) {
            setErrors(prev => ({ ...prev, "remarksErr": "Please enter cancelation remarks" }));
            isValid = false;
        }
        if (!values?.verifyDate) {
            setErrors(prev => ({ ...prev, "verifyDateErr": "Please select verify date" }));
            isValid = false;
        }

        if (isValid) {
            const isConfirm = confirm('Do you want to save this data');

            if (isConfirm) {

                const val = {
                    "gnumHospitalCode": 998,
                    "hstnumStoreId": parseInt(values?.storeName),
                    "hstnumPoNo": parseInt(values?.poNo?.split('^')[1]),
                    "gnumSeatid": SEAT_ID,
                    "hststrCancelBy": values?.verifyBy,
                    "gstrPoRemarks": values?.remarks
                }

                saveHpPoCancelDetails(val)?.then((res) => {
                    console.log('res', res)
                    if (res?.status === 1) {
                        ToastAlert(res?.msg, 'success');
                        reset();
                    } else {
                        ToastAlert(res?.message, 'success');
                    }
                })
            }
        }
    }

    const poConsigneeColmns = [
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
            name: (<span>Consignee Name</span>),
            selector: row => row?.strConsigneeName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Ordered Qty</span>),
            selector: row => row?.numOrderQty,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Balance Qty</span>),
            selector: row => row?.numBalanceQty,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Stop Qty</span>),
            // selector: row => row?.strTax?.split('%')[0],
            cell: row => (
                <div style={{ position: 'absolute', top: 3, left: 0 }}>
                    <InputBox
                        id="stopQty"
                        className="bg-[#d2d0c6]"
                        type="text"
                        name={"stopQty"}
                        placeholder=""
                        value={values?.stopQty || ""}
                        onChange={handleChange}
                    // onBlur={}
                    />
                </div>
            ),
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Last Supply Date</span>),
            selector: row => row?.dtLastSupplyDate || "---",
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Status</span>),
            selector: row => row?.strStatus,
            sortable: true,
            wrap: true,
        }
    ]

    const poReleaseDtlColmns = [
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
            name: (<span>PO No</span>),
            selector: row => row?.strSupplierName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>PO Ref. No</span>),
            selector: row => row?.ratePerUnit,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Stop Delivery No</span>),
            selector: row => row?.numDiscount,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Stop Delivery Date</span>),
            selector: row => row?.strTax?.split('%')[0],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Action</span>),
            selector: row => '',
            sortable: true,
            wrap: true,
        },

    ]

    console.log('values', values)

    return (
        <>
            <div className="masters__navbar p-2">
                <div className="masters__navbar--control-panel">
                    <p className="masters__navbar--text">{isRelease ? 'Release/Cancel Delivery Details' : 'Stop Delivery Details'}</p>
                    <div>
                        <label className="rateContractAddJHK__label mb-0 text-primary">
                            <input
                                id="isRelease"
                                className="me-2 rounded"
                                type="checkbox"
                                name="isRelease"
                                checked={!!isRelease}
                                onChange={(e) => { handleIsReleaseClicked(e); }}
                            />
                            Release/Cancel
                        </label>
                    </div>
                </div>
            </div>

            <section className="unified-wrapper">
                <div className='row'>
                    <div className="col-md-4 mb-3">
                        <div className="align-items-center gap-2">
                            <label className="mb-0 Wrapper__label align-content-center required-label">Store Name :</label>
                            <ComboDropDown
                                options={storeNameDrpDt}
                                name="storeName"
                                addOnClass="homeWrapper__container--dropdown"
                                onChange={(e) => {
                                    handleChange(e);
                                    if (values?.poNo) {
                                        loadScheduleDrpData(values?.poNo, e?.target?.value);
                                    }
                                    if (values?.suppName) {
                                        loadPoNoDrpData(e?.target?.value, values?.suppName);
                                    }

                                }}
                                value={values?.storeName}
                            />
                            {errors?.storeNameErr &&
                                <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                    {errors?.storeNameErr}
                                </span>
                            }
                        </div>
                    </div>

                    <div className="col-md-4 mb-3">
                        <div className="align-items-center gap-2">
                            <label className="mb-0 Wrapper__label align-content-center required-label">Supplier Name :</label>

                            <ComboDropDown
                                options={suppNameDrpDt}
                                name="suppName"
                                addOnClass="homeWrapper__container--dropdown"
                                onChange={(e) => { handleChange(e); loadPoNoDrpData(values?.storeName, e?.target?.value); }}
                                value={values?.suppName}
                            />
                            {errors?.suppNameErr &&
                                <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                    {errors?.suppNameErr}
                                </span>
                            }
                        </div>
                    </div>

                    {!isRelease && <>

                        <div className="col-md-4 mb-3">
                            <div className="align-items-center gap-2">
                                <label className="mb-0 Wrapper__label align-content-center required-label">PO No. :</label>

                                <ComboDropDown
                                    options={poNoDrpDt}
                                    name="poNo"
                                    addOnClass="homeWrapper__container--dropdown"
                                    onChange={(e) => {
                                        handleChange(e);
                                        loadScheduleDrpData(e?.target?.value, values?.storeName);
                                    }}
                                    value={values?.poNo}
                                />
                                {errors?.poNoErr &&
                                    <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                        {errors?.poNoErr}
                                    </span>
                                }
                            </div>
                        </div>

                        <div className="col-md-4 mb-3">
                            <div className="align-items-center gap-2">
                                <label className="mb-0 Wrapper__label align-content-center">Schedule No. :</label>

                                <ComboDropDown
                                    options={scheduleNoDrpDt}
                                    name="scheduleNo"
                                    addOnClass="homeWrapper__container--dropdown"
                                    onChange={(e) => { handleChange(e); loadDrugDrpData(values?.poNo, e?.target?.value) }}
                                    value={values?.scheduleNo}
                                />
                            </div>
                        </div>

                        <div className="col-md-4 mb-3">
                            <div className="align-items-center gap-2">
                                <label className="mb-0 Wrapper__label align-content-center">Drug Name :</label>
                                <ComboDropDown
                                    options={drugNameDrpDt}
                                    name="drugName"
                                    addOnClass="homeWrapper__container--dropdown"
                                    onChange={handleChange}
                                    value={values?.drugName}
                                />
                            </div>
                        </div>

                        <div className="col-md-4 mb-3">
                            <div className="align-items-center gap-2">
                                <label className="mb-0 Wrapper__label align-content-center">Programme Name :</label>

                                <ComboDropDown
                                    options={programNameDrpDt}
                                    name="programName"
                                    addOnClass="homeWrapper__container--dropdown"
                                    onChange={handleChange}
                                    value={values?.programName}
                                />
                            </div>
                        </div>

                        <div className='col-md-3 mb-3'>
                            <label htmlFor="" className="Wrapper__label mb-0">
                                PO Date :{" "}
                                <span className="fs-6 fw-normal">{values?.poNo?.split('^')[2]}</span>{" "}
                            </label>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label htmlFor="" className="Wrapper__label mb-0">
                                PO Type :{" "}
                                <span className="fs-6 fw-normal">{values?.poNo?.split('^')[3]}</span>{" "}
                            </label>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label htmlFor="" className="Wrapper__label mb-0">
                                PO Reference No. :{" "}
                                <span className="fs-6 fw-normal">{values?.poNo?.split('^')[0]}</span>{" "}
                            </label>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label htmlFor="" className="Wrapper__label mb-0">
                                Delivery Date :{" "}
                                <span className="fs-6 fw-normal">{values?.scheduleNo?.split('^')[1]}</span>{" "}
                            </label>
                        </div>
                    </>}
                </div>

                {(!isGoClicked && !isRelease) &&
                    <div className='align-content-center text-center mt-2'>
                        <button type='submit' className="btn btn-success btn-sm rounded rounded-3 h-75 fw-bold" title={"Go"} onClick={handleGoClick}>
                            Go
                        </button>
                    </div>
                }

                {(isGoClicked || isRelease) && <>

                    <div className="flex items-center mb-2 mt-3">
                        <div className="w-10 border-1 border-[#097080]"></div>
                        <span className="mx-3 font-bold text-[#097080]">
                            {isRelease ? 'PO Details' : 'Consignee Details'}
                        </span>
                        <div className="flex-grow border-1 border-[#097080]"></div>
                    </div>

                    <div style={{ marginBottom: "2rem" }}>
                        {isRelease ?
                            <ReactDataTable column={poReleaseDtlColmns} data={releasePoListData} isSearchReq={false} isPagination={false} />
                            :
                            <ReactDataTable column={poConsigneeColmns} data={consigneeListData} isSearchReq={false} isPagination={false} />
                        }
                    </div>
                    {!isRelease &&
                        <div className="rateContractAddJHK__container pb-3">
                            <h4 className="rateContractAddJHK__container-heading">
                                Approval Details
                            </h4>
                            <div>
                                <ComboDropDown
                                    options={verifyByDrpDt}
                                    onChange={handleChange}
                                    value={values?.verifyBy}
                                    name="verifyBy"
                                    label={"Verify By :"}
                                    addOnClass="rateContract__container--dropdown m-0"
                                    isRequired
                                />
                                {errors?.verifyByErr &&
                                    <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                        {errors?.verifyByErr}
                                    </span>
                                }
                            </div>

                            <div>
                                <DatePickerComponent
                                    selectedDate={values.verifyDate}
                                    setSelectedDate={(e) => handleDateChange(e, "verifyDate")}
                                    labelText={"Verify Date :"}
                                    labelFor={"verifyDate"}
                                    name={"verifyDate"}
                                    allowMin={true}
                                    isRequired
                                />
                                {errors?.verifyDateErr &&
                                    <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                        {errors?.verifyDateErr}
                                    </span>
                                }
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
                                    value={values?.remarks}
                                    onChange={handleChange}
                                />
                                {errors?.remarksErr &&
                                    <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                        {errors?.remarksErr}
                                    </span>
                                }
                            </div>
                        </div>
                    }
                </>}
            </section>

            {!isRelease &&
                <div className="bankmaster__container-controls" >
                    {isGoClicked && <>
                        <button className="bankmaster__container-controls-btn" onClick={onSaveCancelationData}>Save</button>

                        <button
                            className="bankmaster__container-controls-btn"
                            onClick={reset}
                        >
                            Clear
                        </button>
                    </>}
                </div>
            }
        </>
    )
}

export default PoCancelationHP

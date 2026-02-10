import React, { useEffect, useState } from 'react'
import { ComboDropDown, DatePickerComponent, InputField } from '../../../../commons/FormElements'
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import ReactDataTable from '../../../../commons/ReactDataTable';
import SelectBox from '../../../../commons/SelectBox';
import { addNewBatchDetails, deleteSuppIntDeskBatchDetail, getSuppIntDeskBatchDtlItemCmb, getSuppIntDeskPrevBatchDtls, modifyPrevBatchDetails } from '../../../../../api/Jharkhand/services/SupplierInterfaceDeskAPI_JH';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import BottomButtons from '../../../../commons/BottomButtons';

const SuppIntBatchDetails = (props) => {

    const { selectedData, actionType } = props;

    const { value: supplierID, label: supplierName } = useSelector(
        (state) => state.jhMst.supplierID
    );
    const [prevBatchDetailsListData, setPrevBatchDetailsListData] = useState([]);
    const [itemNameDrpData, setItemNameDrpData] = useState([]);
    const [manuFacNameDrpData, setManuFacNameDrpData] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});

    const [values, setValues] = useState({
        suppName: "",
        itemName: "",
        batchNo: "",
        manufacName: "",
        mfgDate: "",
        expiryDate: "",
        inHouseCdlNo: "",
        reportDate: "",
        whetherInHouseReq: "",
        shelfLifeCalc: "",
        mdApproveSpeCaseCheck: "",
        mdApprovalDate: "",

        inHouseCdlFile: "",
        uploadAppFile: "",
        affidavitShortShelfFile: "",
        nablCdlTestFile: "",
        mdMailLetterSpeCaseFile: "",
    })
    const [isEditMode, setIsEditMode] = useState(false);

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { value, name } = e?.target;
        if (name === "mdApproveSpeCaseCheck") {
            setValues({ ...values, [name]: e?.target?.checked });
        } else if (name) {
            setValues({ ...values, [name]: value });
        }
    }
    const handleDateChange = (value, fieldName) => {
        const errname = fieldName + "Err";
        const formattedDate = value
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .replace(/ /g, "-");

        setValues({ ...values, [fieldName]: formattedDate });
    };

    const onFileChange = (e) => {
        const { name, files } = e?.target;
        setValues({ ...values, [name]: files[0] });
        // setSelectedFile(event.target.files[0]);
    };

    useEffect(() => {
        if (values?.itemName && supplierID) {
            getPrevBatchDetails(supplierID, values?.itemName);
        }
    }, [values?.itemName, supplierID])

    useEffect(() => {
        if (supplierID) {
            getBatchDtlsItemDrpDt(supplierID);
        }
    }, [supplierID])

    const getPrevBatchDetails = (suppId, itemBrandId) => {
        getSuppIntDeskPrevBatchDtls(998, suppId, itemBrandId?.split("^")[0])?.then((res) => {
            if (res?.status === 1) {
                setPrevBatchDetailsListData(res?.data);
            } else {
                setPrevBatchDetailsListData([]);
            }
        })
    }

    const getBatchDtlsItemDrpDt = (suppId) => {
        getSuppIntDeskBatchDtlItemCmb(998, suppId)?.then((res) => {
            if (res?.status === 1) {
                console.log('res', res)
                const drpData = res?.data?.itemNames?.map((dt) => ({
                    value: dt?.item_id,
                    label: dt?.name
                }))
                const drpManuFac = res?.data?.manufNames?.map((dt) => ({
                    value: dt?.hstnum_supplier_id,
                    label: dt?.supp_name
                }))
                setItemNameDrpData(drpData);
                setManuFacNameDrpData(drpManuFac);
            } else {
                setItemNameDrpData([]);
            }
        })
    }

    const deleteBatchData = (row) => {
        const isConfirmed = confirm("Do you want to delete this record!")
        if (isConfirmed) {
            deleteSuppIntDeskBatchDetail(998, supplierID, values?.itemName?.split("^")[0], row?.hststr_batch_no)?.then((res) => {
                if (res?.status === 1) {
                    alert("Batch deleted successfully");
                    getPrevBatchDetails(supplierID, values?.itemName);
                } else {
                    alert(data?.message);
                }
            })
        }

    }

    const updatePrevBatchDetails = () => {

        const val = {
            strFileName: "",
            strReportNo: values?.inHouseCdlNo,
            hstdtReportDate: new Date(values?.reportDate),
            gnumHospitalCode: 998,
            strBatchNo: selectedRow?.hststr_batch_no,
            hstnumItembrandId: values?.itemName?.split("^")[0],
            hstnumSupplierId: supplierID

        }
        console.log('val', val)
        const formData = new FormData();

        formData.append("data", JSON.stringify(val));

        if (values?.inHouseCdlFile) {
            formData.append("file", values?.inHouseCdlFile, values?.inHouseCdlFile?.name);
        }

        modifyPrevBatchDetails(formData)?.then((data) => {
            if (data?.status === 1) {
                alert('Rate Contract Added Successfully');
                getPrevBatchDetails(supplierID, values?.itemName);
                // dispatch(hidePopup());
                setIsEditMode(false);
            } else {
                alert(data?.message);
            }
            console.log('data', data)
        })
    }

    const saveNewBatchDetails = () => {

        const val = {
            strFileName: "",
            strReportNo: values?.inHouseCdlNo,
            hstdtReportDate: new Date(values?.reportDate),
            gnumHospitalCode: 998,
            strBatchNo: values?.batchNo,
            hstnumItembrandId: values?.itemName?.split("^")[0],
            hstnumSupplierId: supplierID,

            hstdtExpiryDate: new Date(values?.expiryDate),
            hstdtManufDate: new Date(values?.mfgDate),
            strItemManufacturerId: values?.manufacName,
            strShortShelfLife: values?.itemName?.split("^")[3],
            isMdApprove: values?.mdApproveSpeCaseCheck,
            strMdApprovalDate: new Date(values?.mdApprovalDate)


        }
        console.log('val', val)
        const formData = new FormData();

        formData.append("data", JSON.stringify(val));

        const fileKeys = ["uploadAppFile", "affidavitShortShelfFile", "nablCdlTestFile", "mdMailLetterSpeCaseFile", "inHouseCdlFile"];

        fileKeys.forEach((key) => {
            const file = values?.[key];
            if (file) {
                formData.append("files", file, file.name);
            } else {
                formData.append("files", new Blob([]), "");
            }
        });

        addNewBatchDetails(formData)?.then((data) => {
            if (data?.status === 1) {
                alert('Added Successfully');
                getPrevBatchDetails(supplierID, values?.itemName);
                // dispatch(hidePopup());
            } else {
                alert(data?.message);
            }
            console.log('data', data)
        })
    }

    const handleSave = () => {
        let isValid = true;
        if (isValid) {
            if (isEditMode) {
                updatePrevBatchDetails();
            } else {
                saveNewBatchDetails();
            }
        }
    }

    const billDtlsCols = [
        {
            name: (<span>S.No.</span>),
            selector: (row, index) => index + 1,
            sortable: true,
            wrap: true,
            width: "8%"
        },
        {
            name: (<span>Batch No.</span>),
            selector: row => row?.hststr_batch_no,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Manufacture Name</span>),
            selector: row => row?.manuf_name,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Expiry Date</span>),
            selector: row => row?.exp_date,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Mfg. Date</span>),
            selector: row => row?.manuf_date,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>NABL Required</span>),
            selector: row => values?.itemName?.split("^")[1] === "1" ? "Yes" : "No",
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Report No.</span>),
            selector: row => row?.lab_rpt_no,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Report Date</span>),
            selector: row => row?.report_date,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>File Name</span>),
            selector: row => row?.file_name,
            sortable: true,
            wrap: true,
            cell: (row, index) =>
                <span
                    style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={() => alert('bbb')}
                >
                    {row?.file_name}
                </span>
        },
        {
            name: (<span>DCC status</span>),
            selector: row => row?.dcc_rpt_name,
            sortable: true,
            wrap: true,
            cell: (row, index) =>
                <>
                    {
                        (row?.dcc_rpt_name === "NA" || row?.dcc_rpt_name === "") ?

                            <span>{row?.dcc_rpt_name}</span>
                            :
                            <span
                                style={{ color: 'blue', cursor: 'pointer' }}
                                onClick={() => alert('bbb')}
                            >
                                {row?.dcc_rpt_name}
                            </span>
                    }
                </>
        },
        {
            name: (<span className='text-center'>Action</span>),
            cell: row =>
                <>
                    {(row?.hstnum_qc_rejected_flag == "0" && row?.hstnum_dcc_status != 1 && row?.hstnum_dcc_status != 2) ? (
                        row?.hstnum_receive_count == 0 ?
                            (
                                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                                    <span className="btn btn-sm text-white py-0 d-flex gap-1" >

                                        <button className="btn btn-success btn-sm px-1 py-0 rounded rounded-5 fs-13" title={"Edit NABL Report"} onClick={() => { setIsEditMode(true); setSelectedRow(row) }}>
                                            <FontAwesomeIcon icon={faEdit} size="xs" />
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm px-1 py-0 rounded rounded-5 fs-13"
                                            title={`Delete Record`}
                                            onClick={() => { deleteBatchData(row) }}>
                                            <FontAwesomeIcon icon={faTrash} size="xs" />
                                        </button>

                                    </span>
                                </div>
                            ) : (
                                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                                    <span className="btn btn-sm text-white py-0 d-flex gap-1" >

                                        <button
                                            className="btn btn-danger btn-sm px-1 py-0 rounded rounded-5 fs-13"
                                            title={`Delete Record Not Allowed`}
                                            onClick={null} disabled >
                                            <FontAwesomeIcon icon={faTrash} size="xs" />
                                        </button>

                                        {row?.hstnum_edit_status == "0" ? (

                                            <button className="btn btn-success btn-sm px-1 py-0 rounded rounded-5 fs-13" title={"Edit NABL Report"} onClick={() => { setIsEditMode(true); setSelectedRow(row) }}>
                                                <FontAwesomeIcon icon={faEdit} size="xs" />
                                            </button>
                                        ) : (

                                            <button className="btn btn-success btn-sm px-1 py-0 rounded rounded-5 fs-13" title={"Modification of Record Not Allowed"} onClick={null} disabled>
                                                <FontAwesomeIcon icon={faEdit} size="xs" />
                                            </button>
                                        )}
                                    </span>
                                </div>
                            ))
                        :
                        <span className='fw-bold' style={{ position: 'absolute', top: 4, left: 10 }}>No Action</span>
                    }
                </>,
            sortable: true,
            wrap: true,
        },
    ]


    function handleClose() {
        dispatch(hidePopup());
    }

    console.log('values', values)
    console.log('selectedRow', prevBatchDetailsListData?.find(dt => dt?.hststr_batch_no == "TEST201BG"))

    return (
        <>
            <h3 className="employeeMaster__heading"> Batch Details</h3>
            <div className="rateContractAddJHK__container pb-2">
                <h4 className="rateContractAddJHK__container-heading">
                    Supplier Batch Details
                </h4>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Supplier Name :{" "}
                        <span className="fs-6 fw-normal">{supplierName}</span>{" "}
                    </label>
                </div>

                <div className='row align-items-center'>
                    <label htmlFor="itemName" className="rateContractAddJHK__label col-4">
                        Item Name :
                    </label>
                    <SelectBox
                        id="itemName"
                        options={itemNameDrpData}
                        onChange={(e) => { handleChange(e); setIsEditMode(false); setSelectedRow({}) }}
                        name={"itemName"}
                        value={values?.itemName}
                        className="Wrapper__select p-4"
                        selectClass="col-8"
                    // error={errors?.supplierNameErr}
                    />
                </div>
            </div>

            <div className="flex items-center mb-2 mt-6">
                <div className="w-10 border-1 border-[#097080]"></div>
                <span className="mx-3 font-bold text-[#097080]">
                    Previous Batch Details
                </span>
                <div className="flex-grow border-1 border-[#097080]"></div>
            </div>

            <div className="mb-6">
                <ReactDataTable
                    title={''}
                    column={billDtlsCols}
                    data={prevBatchDetailsListData}
                    isSearchReq={false}
                    isPagination={false}
                />
            </div>

            {!isEditMode &&
                <div className="employeeMaster__container">
                    <h4 className="employeeMaster__container-heading">New Batch Details</h4>

                    <div>
                        <label htmlFor="batchNo" className="employeeMaster__label required-label">
                            Batch No:
                        </label>
                        <InputField
                            id="batchNo"
                            className="employeeMaster__input"
                            type="text"
                            name={"batchNo"}
                            placeholder="Enter Tender Number"
                            value={values?.batchNo}
                            onChange={handleChange}
                        />
                    </div>

                    <ComboDropDown
                        options={manuFacNameDrpData}
                        onChange={handleChange}
                        name={"manufacName"}
                        label={'Manufacturer Name :'}
                        value={values?.manufacName}
                    />

                    <DatePickerComponent
                        selectedDate={values?.mfgDate}
                        setSelectedDate={(e) => handleDateChange(e, "mfgDate")}
                        labelText={"Mfg Date:"}
                        labelFor={"mfgDate"}
                        name={"mfgDate"}
                        allowMin={true}
                    // disabled={formState.tender !== 1}
                    />

                    <DatePickerComponent
                        selectedDate={values?.expiryDate}
                        setSelectedDate={(e) => handleDateChange(e, "expiryDate")}
                        labelText={"Expiry Date:"}
                        labelFor={"expiryDate"}
                        name={"expiryDate"}
                        allowMin={true}
                    // disabled={formState.tender !== 1}
                    />

                    <div>
                        <label htmlFor="inHouseCdlNo" className="employeeMaster__label required-label">
                            In-House Test / CDL Report No.:
                        </label>
                        <InputField
                            id="inHouseCdlNo"
                            className="employeeMaster__input"
                            type="text"
                            name={"inHouseCdlNo"}
                            placeholder="Enter Tender Number"
                            value={values?.inHouseCdlNo}
                            onChange={handleChange}
                        />
                    </div>

                    <DatePickerComponent
                        selectedDate={values?.reportDate}
                        setSelectedDate={(e) => handleDateChange(e, "reportDate")}
                        labelText={"Report Date:"}
                        labelFor={"reportDate"}
                        name={"reportDate"}
                        allowMin={true}
                    // disabled={formState.tender !== 1}
                    />

                    <div>
                        <label htmlFor="file" className="employeeMaster__label required-label">
                            In-House Test / CDL Report (pdf) :
                        </label>
                        <input
                            className="rateContractAddJHK__fileUpload"
                            type="file"
                            placeholder='Choose file...'
                            onChange={onFileChange}
                            name={"inHouseCdlFile"}
                        />
                    </div>

                    <div>
                        <label htmlFor="file" className="employeeMaster__label required-label">
                            Upload Application (pdf) :
                        </label>
                        <input
                            className="rateContractAddJHK__fileUpload"
                            type="file"
                            placeholder='Choose file...'
                            onChange={onFileChange}
                            name={"uploadAppFile"}
                        />
                    </div>

                    <div>
                        <label htmlFor="file" className="employeeMaster__label required-label">
                            Affidavit for Short shelf Life (pdf) :
                        </label>
                        <input
                            className="rateContractAddJHK__fileUpload"
                            type="file"
                            placeholder='Choose file...'
                            onChange={onFileChange}
                            name={"affidavitShortShelfFile"}
                        />
                    </div>

                    <div>
                        <label htmlFor="file" className="employeeMaster__label required-label">
                            Nabl / CDL Test Report (pdf) :
                        </label>
                        <input
                            className="rateContractAddJHK__fileUpload"
                            type="file"
                            placeholder='Choose file...'
                            onChange={onFileChange}
                            name={"nablCdlTestFile"}
                        />
                    </div>

                    <div>
                        <label htmlFor="file" className="employeeMaster__label required-label">
                            MD Approval Mail or Letter For Specials Case (pdf) :
                        </label>
                        <input
                            className="rateContractAddJHK__fileUpload"
                            type="file"
                            placeholder='Choose file...'
                            onChange={onFileChange}
                            name={"mdMailLetterSpeCaseFile"}
                        />
                    </div>

                    <DatePickerComponent
                        selectedDate={values?.mdApprovalDate}
                        setSelectedDate={(e) => handleDateChange(e, "mdApprovalDate")}
                        labelText={"MD Approval Date For Specials Case:"}
                        labelFor={"mdApprovalDate"}
                        name={"mdApprovalDate"}
                        allowMin={true}
                    // disabled={formState.tender !== 1}
                    />

                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Whether In-House Required :{" "}
                            <span className="fs-6 fw-normal">{"Yes"}</span>{" "}
                        </label>
                    </div>

                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Self life calculator :{" "}
                            <span className="fs-6 fw-normal">{"0 days"}</span>{" "}
                        </label>
                    </div>

                    <div>
                        <label className="rateContractAddJHK__label mb-0">
                            MD Approval For Specials Case :
                            <input
                                id="mdApproveSpeCaseCheck"
                                className="ms-2 rounded"
                                type="checkbox"
                                name="mdApproveSpeCaseCheck"
                                checked={!!values?.mdApproveSpeCaseCheck}
                                onChange={handleChange}
                                style={{ width: "15px", height: "15px" }}
                            />
                        </label>
                    </div>


                </div>
            }

            {isEditMode &&
                <div className="employeeMaster__container">
                    <h4 className="employeeMaster__container-heading">Edit NABL Report Details</h4>
                    <div>
                        <label htmlFor="inHouseCdlNo" className="employeeMaster__label required-label">
                            In-House Test / CDL Report No.:
                        </label>
                        <InputField
                            id="inHouseCdlNo"
                            className="employeeMaster__input"
                            type="text"
                            name={"inHouseCdlNo"}
                            placeholder="Enter Tender Number"
                            value={values?.inHouseCdlNo}
                            onChange={handleChange}
                        />
                    </div>

                    <DatePickerComponent
                        selectedDate={values?.reportDate}
                        setSelectedDate={(e) => handleDateChange(e, "reportDate")}
                        labelText={"Report Date:"}
                        labelFor={"reportDate"}
                        name={"reportDate"}
                        allowMin={true}
                    // disabled={formState.tender !== 1}
                    />

                    <div>
                        <label htmlFor="file" className="employeeMaster__label required-label">
                            In-House Test / CDL Report (pdf) :
                        </label>
                        <input
                            className="rateContractAddJHK__fileUpload"
                            type="file"
                            placeholder='Choose file...'
                            onChange={onFileChange}
                            name={"inHouseCdlFile"}
                        />
                    </div>

                </div>
            }

            <BottomButtons isSave={true} isReset={true} isClose={true} onSave={handleSave} onReset={null} onClose={handleClose} />
        </>
    )
}

export default SuppIntBatchDetails

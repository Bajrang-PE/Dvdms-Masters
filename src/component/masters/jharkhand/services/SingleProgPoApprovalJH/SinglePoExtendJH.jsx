import React, { useReducer, useState } from 'react'
import ReactDataTable from '../../../../commons/ReactDataTable'
import { DatePickerComponent, InputField } from '../../../../commons/FormElements'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackspace, faBroom, faClose, faEraser, faRemove, faSave } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { hidePopup } from '../../../../../features/commons/popupSlice'
import { ToastAlert } from '../../../../../utils/Toast'

const SinglePoExtendJH = (props) => {

    const { store, selectedData, actionType } = props;

    const storeID = store?.value?.split("^")[0] || "";
    const storeName = store?.label || "";

    const initialState = {
        poType: "",
        poGenPeriod: "",
        poDate: '',
        poNumber: "",
        supplierName: "",
        drugName: "",
        programmeName: "",
        fundingSource: "",
        delDate: "",
        extendedDays: "",
        letterDate: "",
        remarks: "",
        fileName: "",
        isFileUploaded: ""
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
    const [poExtenData, setPoExtenData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [values, dispatcher] = useReducer(addFormReducer, initialState);
    const [errors, setErrors] = useState({

    })

    const handleReset = () => {
        dispatcher({ type: 'RESET_FORM' });
    }

    function handleClose() {
        dispatch(hidePopup());
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const errname = name + "Err";
        dispatcher({ type: "SET_FIELD", field: name, value });
        setErrors({ ...errors, [errname]: "" });
    };

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile, selectedFile?.name);
            // saveHpRcFileUpload(formData)?.then((res) => {
            //     if (res?.status === 1) {
            //         setIsFileUploaded(true);
            //         setFileName(res?.data?.fileName);
            //         setSelectedFile(null);
            //         ToastAlert("File uploaded", 'success')
            //     } else {
            //         ToastAlert(res?.msg, 'error');
            //     }
            //     console.log('res', res);
            // })
        } else {
            ToastAlert("Please select a file", 'error');
        }

    }

    const handleSave = () => {

    }

    const poExtenCols = [
        {
            name: (<span>S.No.</span>),
            selector: row => row[0],
            sortable: true,
            wrap: true,
            width: "20%"
        },
        {
            name: (<span>Extension No</span>),
            selector: row => row[9],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Extension Date</span>),
            selector: row => row[1]?.split('#')[0],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Extended Days</span>),
            selector: row => row[1]?.split('#')[1],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Letter No</span>),
            selector: row => row[1]?.split('#')[4],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Letter Date</span>),
            selector: row => row[1]?.split('#')[0] - row[1]?.split('#')[1],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>File Name</span>),
            selector: row => row[1]?.split('#')[0] - row[1]?.split('#')[1],
            sortable: true,
            wrap: true,
        }
    ]

    return (
        <section className="rateContractAddJHK">
            <h3 className="rateContractAddJHK__heading">
                {`Purchase Order Extend Form`}
            </h3>

            <div className="rateContractAddJHK__container">
                <h4 className="rateContractAddJHK__container-heading">
                    PO And Store Details
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
                        <span className="fs-6 fw-normal">{values?.poType}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO Generation Period :{" "}
                        <span className="fs-6 fw-normal">{values?.poGenPeriod}</span>{" "}
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
                        <span className="fs-6 fw-normal">{values?.poNumber}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Supplier Name :{" "}
                        <span className="fs-6 fw-normal">
                            {values?.supplierName}
                        </span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Drug Name :{" "}
                        <span className="fs-6 fw-normal">{values?.drugName}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Delivery Date :{" "}
                        <span className="fs-6 fw-normal">{values?.drugName}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Programme Name :{" "}
                        <span className="fs-6 fw-normal">{values?.programmeName}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Funding Source :{" "}
                        <span className="fs-6 fw-normal">{values?.fundingSource}</span>{" "}
                    </label>
                </div>
            </div>

            <div className={`employeeMaster__container d-block`}>
                <h4 className="employeeMaster__container-heading">Previous PO Extension Detail
                </h4>
                <div className="">
                    <ReactDataTable
                        title={''}
                        column={poExtenCols}
                        data={poExtenData}
                        isSearchReq={false}
                        isPagination={false}
                    />
                </div>
            </div>

            <div className="employeeMaster__container">
                <h4 className="employeeMaster__container-heading">New PO Extension Detail</h4>

                <div>
                    <label htmlFor="tenderNo" className="employeeMaster__label required-label">
                        Letter No :
                    </label>
                    <InputField
                        id="letterNo"
                        className="employeeMaster__input"
                        type="text"
                        name={"letterNo"}
                        placeholder="Enter..."
                        value={values?.letterNo}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="tenderNo" className="employeeMaster__label required-label">
                        Extended Days :
                    </label>
                    <InputField
                        id="extendedDays"
                        className="employeeMaster__input"
                        type="text"
                        name={"extendedDays"}
                        placeholder="Enter..."
                        value={values?.extendedDays}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <DatePickerComponent
                        selectedDate={values.letterDate}
                        setSelectedDate={(e) => handleDateChange(e, "letterDate")}
                        labelText={"Letter Date :"}
                        labelFor={"letterDate"}
                        name={"letterDate"}
                        allowMin={true}
                    />
                </div>

                <div>
                    <label htmlFor="file" className="Wrapper__label d-block">
                        File Name (PDF) :
                    </label>

                    {isFileUploaded ?
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

            <div className="bankmaster__container-controls">

                {actionType !== "View" && <>
                    <button className="bankmaster__container-controls-btn" onClick={handleSave}><FontAwesomeIcon icon={faSave} className="text-info" size='lg' />Save</button>

                    <button className="bankmaster__container-controls-btn" onClick={handleReset}><FontAwesomeIcon icon={faBroom} className="text-warning" size='lg' />Clear</button>
                </>}
                <button
                    className="bankmaster__container-controls-btn"
                    onClick={handleClose}
                >
                    <FontAwesomeIcon icon={faBackspace} className="text-danger mr-1" size='lg' />
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
    )
}

export default SinglePoExtendJH

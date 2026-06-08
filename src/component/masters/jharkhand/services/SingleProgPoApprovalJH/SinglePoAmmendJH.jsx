import { faBackspace, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useReducer } from 'react'
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';

const SinglePoAmmendJH = () => {
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
    const [values, dispatcher] = useReducer(addFormReducer, initialState);

    const handleReset = () => {
        dispatcher({ type: 'RESET_FORM' });
    }

    function handleClose() {
        dispatch(hidePopup());
    }


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
                        Item Category :{" "}
                        <span className="fs-6 fw-normal text-success">{values?.itemCategory}</span>{" "}
                    </label>
                </div>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Item Specification :{" "}
                        <span className="fs-6 fw-normal">{values?.itemSpecification}</span>{" "}
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

            {/* <div className={`employeeMaster__container d-block`}>
                <h4 className="employeeMaster__container-heading">Rate Contract Detail's
                </h4>
                <div className="">
                    <ReactDataTable
                        title={''}
                        column={[]}
                        data={[]}
                        isSearchReq={false}
                        isPagination={false}
                    />
                </div>
            </div> */}


            <div className="bankmaster__container-controls">
                <button className="bankmaster__container-controls-btn" onClick={null}><FontAwesomeIcon icon={faEdit} className="text-info" size='lg' />Po Ammend</button>
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

export default SinglePoAmmendJH

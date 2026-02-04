import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { ComboDropDown } from '../../../../commons/FormElements';
import { getSinglePoCancelPoData, modifySinglePoDwhPoCancelSave } from '../../../../../api/Jharkhand/services/SingleProgPoDeskAPI_JH';

const CancelSingleProgPoJH = (props) => {

    const { selectedData } = props;
    const initialState = {
        poType: "",
        poDate: '',
        poNumber: "",
        supplierName: "",
        category: "",
        poRefNo: "",
        remarks: "",
        cancelBy: "",
        poDateFrmt: "",
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

    const { value: storeID, label: storeName } = useSelector(
        (state) => state.rateContractJHK.storeID
    );
    const SEAT_ID = 14462;
    const dispatch = useDispatch();
    const [formState, dispatcher] = useReducer(addFormReducer, initialState);
    const [cancelByDrpData, setCancelByDrpData] = useState([]);
    const [errors, setErrors] = useState({
        cancelByErr: "", remarksErr: ""
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

    const fetchCancelpoData = (poNo) => {
        getSinglePoCancelPoData(998, storeID, poNo)?.then((res) => {
            if (res?.status === 1) {
                const data = res?.data?.poDetails;
                const drpData = res?.data?.cancelByCmb?.map((dt) => ({
                    label: dt?.empl_name,
                    value: dt?.str_emp_no
                }))
                setCancelByDrpData(drpData || []);
                dispatcher({
                    type: "SET_FIELDS", payload: {
                        poType: data?.sststr_indenttype_name,
                        poDate: selectedData[0]?.poDate,
                        poNumber: data?.hstnum_po_no,
                        supplierName: data?.supp_name,
                        category: data?.sstnum_item_cat_name,
                        poRefNo: data?.prefix_po,
                        poDateFrmt: data?.hstdt_po_date
                        // remarks: data?.sststr_indenttype_name,
                        // cancelBy: data?.sststr_indenttype_name,
                    }
                });
            }
        })
    }

    useEffect(() => {
        if (selectedData?.length > 0) {
            fetchCancelpoData(selectedData[0]?.poNo);
        }
    }, [selectedData])

    const saveCancelDetails = () => {
        const val = {
            gnumHospitalCode: 998,
            hstnumStoreId: storeID,
            gnumSeatId: SEAT_ID,
            hstnumPoNo: formState?.poNumber,
            cancelById: formState?.cancelBy,
            cancelRemarks: formState?.remarks
        }

        modifySinglePoDwhPoCancelSave(val)?.then((data) => {
            if (data?.status === 1) {
                alert("Po cancelled successfully");
                handleClose();
                handleReset();
            } else {
                alert('failed');
            }
        })
    }

    const handleSavePo = () => {
        let isValid = true;

        if (!formState?.cancelBy || formState?.cancelBy === '') {
            setErrors(prev => ({ ...prev, "cancelByErr": "This field is required!" }));
            isValid = false;
        }
        if (!formState?.remarks?.trim() || formState?.remarks === '') {
            setErrors(prev => ({ ...prev, "remarksErr": "This field is required!" }));
            isValid = false;
        }

        if (isValid) {
            saveCancelDetails();
        }
    }


    return (
        <section className="rateContractAddJHK">
            <h3 className="rateContractAddJHK__heading">
                Cancel Purchase Order
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
                        PO Date :{" "}
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
                        Category :{" "}
                        <span className="fs-6 fw-normal">{formState?.category}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO Reference No. :{" "}
                        <span className="fs-6 fw-normal">{formState?.poRefNo}</span>{" "}
                    </label>
                </div>

            </div>


            <div className="employeeMaster__container">
                <h4 className="employeeMaster__container-heading">Cancel Details</h4>

                <div>
                    <label
                        htmlFor="level"
                        className="rateContractAddJHK__label required-label"
                    >
                        Cancel By
                    </label>
                    <ComboDropDown
                        options={cancelByDrpData}
                        onChange={handleChange}
                        name={"cancelBy"}
                        value={formState?.cancelBy}
                    />
                    {errors?.cancelByErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.cancelByErr}
                        </span>
                    }
                </div>

                <div>
                    <label htmlFor="remarks" className="employeeMaster__label">
                        Cancel Remarks :
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
                    {errors?.remarksErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.remarksErr}
                        </span>
                    }
                </div>
            </div>

            <div className="bankmaster__container-controls">
                <button className="bankmaster__container-controls-btn" onClick={handleSavePo}>Save</button>
                <button
                    className="bankmaster__container-controls-btn"
                    onClick={handleReset}
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
        </section>
    );
}

export default CancelSingleProgPoJH

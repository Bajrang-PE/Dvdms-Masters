import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { RadioButton } from '../../../../commons/FormElements';
import InputBox from '../../../../commons/InputBox';
import { fetchBankBranchList, fetchBankList } from '../../../../../features/jharkhand/JH_Apis';
import { addBranch, fetchDistrict, modifyBranch } from '../../../../../api/Jharkhand/master/BankBranchMasterAPI_JH';
import SelectBox from '../../../../commons/SelectBox';

const BankBranchMasterFormJH = ({ data, openPage, optionsParams }) => {
    const dispatch = useDispatch();


    const [districtList, setDistrictList] = useState([]);
    const [status, setStatus] = useState('1');

    const [values, setValues] = useState({
        branchName: "", branchShortName: "", ifscCode: "", bankAddress: "", selectedState: "", selectedDistrict: "",
    })
    const [errors, setErrors] = useState({
        branchNameErr: "", branchShortNameErr: "", ifscCodeErr: "", bankAddressErr: "", selectedStateErr: "", selectedDistrictErr: "",
    })

    const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

    useEffect(() => {
        if (data?.length > 0 && openPage === "Modify") {
            setValues({
                ...values,
                branchName: data[0]?.gstrBranchName,
                branchShortName: data[0]?.gstrBranchShortName,
                ifscCode: data[0]?.gstrIfscCode,
                bankAddress: data[0]?.gstrBranchAddress,
                selectedState: data[0]?.gnumStateCode,
                selectedDistrict: data[0]?.gnumDistId,
            })
            setStatus(data[0]?.gnumIsvalid || '1')
        }
    }, [data, openPage])

    useEffect(() => {
        async function getDistricts() {
            const response = await fetchDistrict(59);
            const drpdt = response?.length > 0 && response?.map((dt) => ({
                value: dt?.num_dist_id, label: dt?.str_dist_name
            }))
            setDistrictList(drpdt || []);
        }
        getDistricts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e?.target;
        const errName = name + "Err";
        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: '' });
        }

    }

    function handleClose() {
        dispatch(hidePopup());
    }

    function handleReset() {
        setValues({
            branchName: "", branchShortName: "", ifscCode: "", bankAddress: "", selectedState: "", selectedDistrict: "",
        })
        setStatus('1');
    }

    async function handleSave() {
        let isValid = true;
        if (!values?.branchName?.trim()) {
            setErrors(prev => ({ ...prev, "branchNameErr": "Branch name is required!" }));
            isValid = false;
        }
        if (!values?.ifscCode?.trim()) {
            setErrors(prev => ({ ...prev, "ifscCodeErr": "IFSC code is required!" }));
            isValid = false;
        }
        if (!values?.branchShortName?.trim()) {
            setErrors(prev => ({ ...prev, "branchShortNameErr": "Short name is required!" }));
            isValid = false;
        }
        if (!values?.bankAddress?.trim()) {
            setErrors(prev => ({ ...prev, "bankAddressErr": "Bank address is required!" }));
            isValid = false;
        }
        if (!values?.selectedDistrict) {
            setErrors(prev => ({ ...prev, "selectedDistrictErr": "Please select a district!" }));
            isValid = false;
        }

        if (specialCharacterCheck.test(values?.branchName) || specialCharacterCheck.test(values?.branchShortName)) {
            alert('Special Characters Are Not Allowed');
            isValid = false;
        }

        const branchDetails = {
            gnumBankId: optionsParams?.BankId,
            gnumHospitalCode: 998,
            gstrBranchName: values?.branchName,
            gstrBranchShortName: values?.branchShortName,
            gstrBranchAddress: values?.bankAddress,
            gstrIfscCode: values?.ifscCode,
            gnumDistId: values?.selectedDistrict,
            gnumIsvalid: status,
            gnumStateCode: values?.selectedState,
            gstrBankName: values?.selectedBankName,
        };

        if (isValid) {
            if (openPage === "Modify") {
                modifyBranch(branchDetails, data[0]?.gnumBankId || '', data[0]?.gnumBranchId || '').then((res) => {
                    if (res?.status === 1) {
                        alert('Branch updated Succesfully!');
                        dispatch(fetchBankBranchList({ status: status, id: optionsParams?.BankId }));
                        dispatch(hidePopup());
                    } else {
                        alert(res?.message);
                    }
                })
            } else {
                addBranch(optionsParams?.BankId, branchDetails).then((res) => {
                    if (res?.status === 1) {
                        alert('Branch Added Succesfully!');
                        dispatch(hidePopup());
                        dispatch(fetchBankBranchList({ status: status, id: optionsParams?.BankId }));
                    } else {
                        alert(res?.message);
                    }
                });

            }
        }
    }


    return (
        <>
            <h3 className="branchmaster__heading">Add Branch</h3>
            <p className="branchmaster__title">{data[0]?.gstrBankName ? data[0]?.gstrBankName : optionsParams?.Bank}</p>
            <div className="branchmaster__grid--container">
                <div className="branchmaster__grid--container-item">
                    <label htmlFor="BankName" className="branchmaster__label required-label">
                        Branch Name
                    </label>
                    <InputBox
                        id="BranchName"
                        name="branchName"
                        className=""
                        type="text"
                        placeholder="Enter Branch Name"
                        value={values?.branchName}
                        onChange={handleInputChange}
                        error={errors?.branchNameErr}
                    />
                   
                </div>
                <div className="branchmaster__grid--container-item">
                    <label htmlFor="IfscCode" className="branchmaster__label required-label">
                        IFSC Code
                    </label>
                    <InputBox
                        id="IfscCode"
                        name='ifscCode'
                        className=""
                        type="text"
                        placeholder="Enter IFSC Code"
                        value={values?.ifscCode}
                        onChange={handleInputChange}
                        error={errors?.ifscCodeErr}
                    />
                </div>
                <div className="branchmaster__grid--container-item">
                    <label htmlFor="BranchshortName" className="branchmaster__label required-label">
                        Branch Short Name
                    </label>
                    <InputBox
                        id="BranchshortName"
                        name='branchShortName'
                        className=""
                        type="text"
                        placeholder="Enter Bank Shortname"
                        value={values?.branchShortName}
                        onChange={handleInputChange}
                        error={errors?.branchShortNameErr}
                    />
                </div>
                <div className="branchmaster__grid--container-item">
                    <label htmlFor="Bankaddress" className="branchmaster__label required-label">
                        Bank Address
                    </label>
                    <InputBox
                        id="Bankaddress"
                        name="bankAddress"
                        className=""
                        type="text"
                        placeholder="Enter Bank Address"
                        value={values?.bankAddress}
                        onChange={handleInputChange}
                        error={errors?.bankAddressErr}
                    />
                </div>

                <div className="branchmaster__grid--container-item">
                    <label htmlFor="BankDistrict" className="branchmaster__label required-label">
                        District
                    </label>
                    <SelectBox
                        id="selectedDistrict"
                        name="selectedDistrict"
                        className=""
                        options={districtList}
                        onChange={handleInputChange}
                        value={values?.selectedDistrict}
                        placeholder='Select District'
                        error={errors?.selectedDistrictErr}
                    />
                </div>
                <div className="branchmaster__grid--container-item">
                    <label className="bankmaster__label">Status</label>
                    <RadioButton
                        label="Active"
                        name="status"
                        value="1"
                        checked={status === '1'}
                        onChange={(e) => { setStatus(e?.target?.value) }}
                    />
                    <RadioButton
                        label="Inactive"
                        name="status"
                        value="0"
                        checked={status === '0'}
                        onChange={(e) => { setStatus(e?.target?.value) }}
                    />
                </div>
            </div>

            <div className="branchmaster__container-controls">
                <button
                    className="bankmaster__container-controls-btn"
                    onClick={handleSave}
                >
                    Save
                </button>
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
        </>
    );
}

export default BankBranchMasterFormJH

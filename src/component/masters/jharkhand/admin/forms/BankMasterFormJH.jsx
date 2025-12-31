import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hidePopup } from "../../../../../features/commons/popupSlice";
import {
  addBank,
  modifyBank,
} from "../../../../../api/Jharkhand/master/BankMasterAPI_JH";
import { InputField, RadioButton } from "../../../../commons/FormElements";
import InputBox from "../../../../commons/InputBox";
import { fetchBankList } from "../../../../../features/jharkhand/JH_Apis";

const BankMasterFormJH = ({ data, openPage }) => {
  const dispatch = useDispatch();

  const [bankName, setBankName] = useState("");
  const [bankShortName, setBankShortName] = useState("");
  const [status, setStatus] = useState("1");
  const [bankNameErr, setBankNameErr] = useState("");
  const [bankShortNameErr, setBankShortNameErr] = useState("");

  const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

  useEffect(() => {
    if (data?.length > 0 && openPage === "Modify") {
      setBankName(data[0]?.gstrBankName || "");
      setBankShortName(data[0]?.gstrBankShortName || "");
      setStatus(data[0]?.gnumIsvalid || "1");
    }
  }, [data, openPage]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    if (name === "BankName") {
      setBankName(value);
    } else if (name === "BankShortName") {
      setBankShortName(value);
    } else if (name === "status") {
      setStatus(value);
    }
  };

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    setBankName("");
    setBankShortName("");
    setStatus("1");
    setBankNameErr("");
    setBankShortNameErr("");
  }

  async function handleSave() {
    let isValid = true;
    if (!bankName?.trim()) {
      setBankNameErr("Bank name is required!");
      isValid = false;
    }
    if (!bankShortName?.trim()) {
      setBankShortNameErr("Bank short name is required!");
      isValid = false;
    }

    if (
      specialCharacterCheck.test(bankName) ||
      specialCharacterCheck.test(bankShortName)
    ) {
      alert("Special Characters Are Not Allowed");
      isValid = false;
    }

    const bankDetails = {
      gstrBankName: bankName,
      gstrBankShortName: bankShortName,
      gnumHospitalCode: 998,
      gnumIsvalid: status,
    };

    if (isValid) {
      if (openPage === "Modify") {
        modifyBank(bankDetails, data[0]?.gnumBankId || "").then((res) => {
          if (res?.status === 1) {
            alert("Bank updated Succesfully!");
            dispatch(fetchBankList(status));
            dispatch(hidePopup());
          } else {
            alert(res?.message);
          }
        });
      } else {
        await addBank(bankDetails);
        alert("Bank Added Succesfully!");
        dispatch(hidePopup());
        dispatch(fetchBankList(status));
      }
    }
  }

  return (
    <>
      <h3 className="bankmaster__heading">
        {" "}
        {openPage === "Modify" ? "Modify Bank" : "Add Bank"}
      </h3>
      <div className="bankmaster__container">
        <label htmlFor="BankName" className="bankmaster__label">
          Bank Name
        </label>
        <InputField
          id="BankName"
          name="BankName"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Bank Name"
          value={bankName}
          onChange={handleInputChange}
          error={bankNameErr}
        />
         {bankNameErr && <span className="text-sm text-[#9b0000] mt-1 ms-1">{bankNameErr}</span>}
      </div>
      <div className="bankmaster__container">
        <label htmlFor="BankShortName" className="bankmaster__label">
          Bank Short Name
        </label>
        <InputField
          id="BankShortName"
          name="BankShortName"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Bank Short Name"
          value={bankShortName}
          onChange={handleInputChange}
          error={bankShortNameErr}
        />
      </div>
      <div className="bankmaster__container">
        <label className="bankmaster__label">Status</label>
        <RadioButton
          label="Active"
          name="status"
          value="1"
          checked={status == "1"}
          onChange={handleInputChange}
        />
        <RadioButton
          label="Inactive"
          name="status"
          value="0"
          checked={status == "0"}
          onChange={handleInputChange}
        />
      </div>
      <div className="bankmaster__container-controls">
        <button
          className="bankmaster__container-controls-btn"
          onClick={handleSave}
        >
          {openPage === "Modify" ? "Modify" : "Save"}
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
};

export default BankMasterFormJH;

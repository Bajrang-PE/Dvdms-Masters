import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import { modifyBank } from '../../../../../../api/bankMasterAPI';
import { InputField, RadioButton } from '../../../../../commons/FormElements';

const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

export default function ModifyBankForm({ data }) {
  //redux states
  const dispatch = useDispatch();

  const {
    gnumBankId: id,
    gstrBankName: name,
    gstrBankShortName: shortName,
  } = data.at(0);
  // Controlled state for inputs
  const [bankName, setBankName] = useState(name);
  const [bankShortName, setBankShortName] = useState(shortName);
  const [status, setStatus] = useState('1');

  const handleStatusChange = e => {
    setStatus(e.target.value);
  };

  const handleBankNameChange = e => {
    setBankName(e.target.value);
  };

  const handleBankShortNameChange = e => {
    setBankShortName(e.target.value);
  };

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    setBankName(name);
    setBankShortName(shortName);
    setStatus('1');
  }

  async function handleModify() {
    if (bankName === '' || bankShortName === '') {
      alert('Please Provide Valid Details');
      return;
    }

    if (
      specialCharacterCheck.test(bankName) ||
      specialCharacterCheck.test(bankShortName)
    ) {
      alert('Special Characters Are Not Allowed');
      return;
    }

    const bankDetails = {
      gstrBankName: bankName,
      gstrBankShortName: bankShortName,
      gnumHospitalCode: 998,
      gnumIsvalid: status,
    };

    const response = await modifyBank(JSON.stringify(bankDetails), id);
    console.log(response);
    dispatch(hidePopup());
    location.reload();
  }

  return (
    <>
      <h3 className="bankmaster__heading">Modify Bank</h3>
      <div className="bankmaster__container">
        <label htmlFor="BankName" className="bankmaster__label">
          Bank Name
        </label>
        <InputField
          id="BankName"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Bank Name"
          value={bankName}
          onChange={handleBankNameChange}
        />
      </div>
      <div className="bankmaster__container">
        <label htmlFor="BankShortName" className="bankmaster__label">
          Bank Short Name
        </label>
        <InputField
          id="BankShortName"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Bank Short Name"
          value={bankShortName}
          onChange={handleBankShortNameChange}
        />
      </div>
      <div className="bankmaster__container">
        <label className="bankmaster__label">Status</label>
        <RadioButton
          label="Active"
          name="status"
          value="1"
          checked={status === '1'}
          onChange={handleStatusChange}
        />
        <RadioButton
          label="Inactive"
          name="status"
          value="0"
          checked={status === '0'}
          onChange={handleStatusChange}
        />
      </div>
      <div className="bankmaster__container-controls">
        <button
          className="bankmaster__container-controls-btn"
          onClick={handleModify}
        >
          Modify
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

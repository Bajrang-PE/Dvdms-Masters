import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import { InputField, RadioButton } from '../../../../../commons/FormElements';
import { addDiagnosis } from '../../../../../../api/diagnosisMasterAPI';

const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

export default function AddDiagnosisForm() {
  const dispatch = useDispatch();

  // Controlled state for inputs
  const [diagnosisName, setDiagnosisName] = useState('');
  const [icdCode, setIcdCode] = useState('');
  const [status, setStatus] = useState('1'); // 1 = Req, 0 = Not Req

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    setDiagnosisName('');
    setIcdCode('');
    setStatus('1');
  }

  async function handleSave() {
    if (diagnosisName === '' || icdCode === '') {
      alert('Please Provide Valid Details');
      return;
    }

    if (
      specialCharacterCheck.test(diagnosisName) ||
      specialCharacterCheck.test(icdCode)
    ) {
      alert('Special Characters Are Not Allowed');
      return;
    }

    const diagnosisDetails = {
      gnumHospitalCode: 998,
      gstrDiagnosisName: diagnosisName,
      gstrIcdCode: icdCode,
      gnumIsvalid: status,
      gnumSeatid: 11002,
    };

    try {
      await addDiagnosis(JSON.stringify(diagnosisDetails));
      alert('Diagnosis Details Added Succesfully!');
      location.reload();
    } catch (err) {
      alert('Something went wrong');
      console.error(err);
    } finally {
      dispatch(hidePopup());
    }
  }

  return (
    <>
      <h3 className="bankmaster__heading">Add Diagnosis</h3>
      <div className="bankmaster__container">
        <label htmlFor="DiagnosisName" className="bankmaster__label">
          Diagnosis Name
        </label>
        <InputField
          id="DiagnosisName"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Diagnosis Name"
          value={diagnosisName}
          onChange={e => setDiagnosisName(e.target.value)}
        />
      </div>
      <div className="bankmaster__container">
        <label htmlFor="DiagnosisCode" className="bankmaster__label">
          ICD Code
        </label>
        <InputField
          id="DiagnosisCode"
          className="bankmaster__input"
          type="text"
          placeholder="Enter ICD Code"
          value={icdCode}
          onChange={e => setIcdCode(e.target.value)}
        />
      </div>
      <div className="bankmaster__container">
        <label className="bankmaster__label">Status</label>
        <RadioButton
          label="Active"
          name="status"
          value="1"
          checked={status === '1'}
          onChange={e => setStatus(e.target.value)}
        />
        <RadioButton
          label="Inactive"
          name="status"
          value="0"
          checked={status === '0'}
          onChange={e => setStatus(e.target.value)}
        />
      </div>
      <div className="bankmaster__container-controls">
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

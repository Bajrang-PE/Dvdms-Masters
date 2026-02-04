import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import {
  DatePickerComponent,
  InputField,
  RadioButton,
} from '../../../../../commons/FormElements';
import { addDesignation } from '../../../../../../api/designationMasterAPI';

const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

export default function AddDesignationForm() {
  const dispatch = useDispatch();

  // Controlled state for inputs
  const [designation, setDesignation] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('1'); // 1 = Req, 0 = Not Req

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    setDesignation('');
    setRemarks('');
    setEffectiveFrom(null);
    setStatus('1');
  }

  async function handleSave() {
    if (!effectiveFrom || designation === '' || remarks === '') {
      alert('Please Provide Valid Details');
      return;
    }

    if (
      specialCharacterCheck.test(designation) ||
      specialCharacterCheck.test(remarks)
    ) {
      alert('Special Characters Are Not Allowed');
      return;
    }

    const designationDetails = {
      gnumHospitalCode: 998,
      strDesigName: designation,
      gdtEffectiveFrm: effectiveFrom,
      gstrRemarks: remarks,
      gnumIsvalid: status,
      gnumSeatid: 11002,
    };

    try {
      await addDesignation(JSON.stringify(designationDetails));
      alert('Designation Details Added Succesfully!');
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
      <h3 className="bankmaster__heading">Add Designation</h3>
      <div className="bankmaster__container">
        <label htmlFor="DesignationMode" className="bankmaster__label">
          Designation Name
        </label>
        <InputField
          id="DesignationMode"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Designation Name"
          value={designation}
          onChange={e => setDesignation(e.target.value)}
        />
      </div>
      <div className="bankmaster__container">
        <DatePickerComponent
          selectedDate={effectiveFrom}
          setSelectedDate={setEffectiveFrom}
          labelText={'Effective From'}
          labelFor={'EffectiveFrom'}
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
      <div className="bankmaster__container">
        <label htmlFor="DesignationRemarks" className="bankmaster__label">
          Remarks
        </label>
        <InputField
          id="DesignationRemarks"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Remarks"
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
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

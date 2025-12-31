import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import {
  DatePickerComponent,
  InputField,
  RadioButton,
} from '../../../../../commons/FormElements';
import { addComponent } from '../../../../../../api/componentMaster';

const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

export default function AddComponentForm() {
  const dispatch = useDispatch();

  // Controlled state for inputs
  const [componentName, setComponentName] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('1');

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    setComponentName('');
    setRemarks('');
    setEffectiveFrom(null);
    setStatus('1');
  }

  async function handleSave() {
    if (!effectiveFrom || componentName === '' || remarks === '') {
      alert('Please Provide Valid Details');
      return;
    }

    if (
      specialCharacterCheck.test(componentName) ||
      specialCharacterCheck.test(remarks)
    ) {
      alert('Special Characters Are Not Allowed');
      return;
    }

    const paymentDetails = {
      gnumHospitalCode: 998,
      hstnumComponentName: componentName,
      gdtEffectiveFrm: effectiveFrom,
      gstrRemarks: remarks,
      gnumIsvalid: status,
      gnumSeatid: 11002,
    };

    try {
      await addComponent(JSON.stringify(paymentDetails));
      alert('Component Details Added Succesfully!');
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
      <h3 className="bankmaster__heading">Add Component</h3>
      <div className="bankmaster__container">
        <label htmlFor="ComponentName" className="bankmaster__label">
          Component Name
        </label>
        <InputField
          id="ComponentName"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Component Name"
          value={componentName}
          onChange={e => setComponentName(e.target.value)}
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
        <label htmlFor="ComponentRemarks" className="bankmaster__label">
          Remarks
        </label>
        <InputField
          id="ComponentRemarks"
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

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import {
  DatePickerComponent,
  InputField,
  RadioButton,
} from '../../../../../commons/FormElements';
import { addDelivery } from '../../../../../../api/deliveryModeMasterAPI';

const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

export default function AddDeliveryForm() {
  const dispatch = useDispatch();

  // Controlled state for inputs
  const [deliveryMode, setDeliveryMode] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('1'); // 1 = Req, 0 = Not Req

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    setDeliveryMode('');
    setRemarks('');
    setEffectiveFrom(null);
    setStatus('1');
  }

  async function handleSave() {
    if (!effectiveFrom || deliveryMode === '' || remarks === '') {
      alert('Please Provide Valid Details');
      return;
    }

    if (
      specialCharacterCheck.test(deliveryMode) ||
      specialCharacterCheck.test(remarks)
    ) {
      alert('Special Characters Are Not Allowed');
      return;
    }

    const deliveryDetails = {
      gnumHospitalCode: 998,
      hststrDeliverymodeName: deliveryMode,
      gdtEffectiveFrm: effectiveFrom,
      gstrRemarks: remarks,
      gnumIsvalid: status,
      gnumSeatid: 11002,
    };

    try {
      await addDelivery(JSON.stringify(deliveryDetails));
      alert('Delivery Details Added Succesfully!');
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
      <h3 className="bankmaster__heading">Add Delivery Mode</h3>
      <div className="bankmaster__container">
        <label htmlFor="DeliveryMode" className="bankmaster__label">
          Delivery Mode Name
        </label>
        <InputField
          id="DeliveryMode"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Payment Mode Name"
          value={deliveryMode}
          onChange={e => setDeliveryMode(e.target.value)}
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
        <label htmlFor="DeliveryModeRemarks" className="bankmaster__label">
          Remarks
        </label>
        <InputField
          id="DeliveryModeRemarks"
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

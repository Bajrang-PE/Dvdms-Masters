import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import {
  DatePickerComponent,
  InputField,
  RadioButton,
} from '../../../../../commons/FormElements';
import { addPayment } from '../../../../../../api/paymentModeMasterAPI';

const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

export default function AddPaymentForm() {
  const dispatch = useDispatch();

  // Controlled state for inputs
  const [paymentMode, setPaymentMode] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('1'); // 1 = Req, 0 = Not Req

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    setPaymentMode('');
    setRemarks('');
    setEffectiveFrom(null);
    setStatus('1');
  }

  async function handleSave() {
    if (!effectiveFrom || paymentMode === '' || remarks === '') {
      alert('Please Provide Valid Details');
      return;
    }

    if (
      specialCharacterCheck.test(paymentMode) ||
      specialCharacterCheck.test(remarks)
    ) {
      alert('Special Characters Are Not Allowed');
      return;
    }

    const paymentDetails = {
      gnumHospitalCode: 998,
      hststrPaymentmodeName: paymentMode,
      gdtEffectiveFrm: effectiveFrom,
      gstrRemarks: remarks,
      hstnumInstFlag: status,
      gnumSeatid: 11002,
    };

    try {
      await addPayment(JSON.stringify(paymentDetails));
      alert('Payment Details Added Succesfully!');
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
      <h3 className="bankmaster__heading">Add Payment Mode</h3>
      <div className="bankmaster__container">
        <label htmlFor="PaymentMode" className="bankmaster__label">
          Payment Mode Name
        </label>
        <InputField
          id="PaymentMode"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Payment Mode Name"
          value={paymentMode}
          onChange={e => setPaymentMode(e.target.value)}
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
        <label className="bankmaster__label">Instrument Details</label>
        <RadioButton
          label="Required"
          name="status"
          value="1"
          checked={status === '1'}
          onChange={e => setStatus(e.target.value)}
        />
        <RadioButton
          label="Not Required"
          name="status"
          value="0"
          checked={status === '0'}
          onChange={e => setStatus(e.target.value)}
        />
      </div>
      <div className="bankmaster__container">
        <label htmlFor="PaymentRemarks" className="bankmaster__label">
          Remarks
        </label>
        <InputField
          id="PaymentRemarks"
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

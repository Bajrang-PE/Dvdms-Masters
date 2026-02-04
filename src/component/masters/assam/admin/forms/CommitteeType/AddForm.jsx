import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import {
  DatePickerComponent,
  InputField,
  RadioButton,
} from '../../../../../commons/FormElements';
import { addCommittee } from '../../../../../../api/committeeTypeAPI';

const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

export default function AddCommittee() {
  const dispatch = useDispatch();

  // Controlled state for inputs
  const [committeeName, setCommitteeName] = useState('');
  const [committeePurpose, setCommitteePurpose] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('1');

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    setCommitteeName('');
    setCommitteePurpose('');
    setRemarks('');
    setEffectiveFrom(null);
    setStatus('1');
  }

  async function handleSave() {
    if (
      !effectiveFrom ||
      committeeName === '' ||
      remarks === '' ||
      committeePurpose == ''
    ) {
      alert('Please Provide Valid Details');
      return;
    }

    if (
      specialCharacterCheck.test(committeeName) ||
      specialCharacterCheck.test(committeePurpose) ||
      specialCharacterCheck.test(remarks)
    ) {
      alert('Special Characters Are Not Allowed');
      return;
    }

    const committeeDetails = {
      gnumHospitalCode: 998,
      hstnumCommitteeTypeName: committeeName,
      hststrCommitteePurpose: committeePurpose,
      gdtEffectiveFrm: effectiveFrom,
      gstrRemarks: remarks,
      gnumIsvalid: status,
      gnumSeatid: 11002,
    };

    try {
      await addCommittee(JSON.stringify(committeeDetails));
      alert('Committee Details Added Succesfully!');
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
      <h3 className="bankmaster__heading">Add Committee</h3>
      <div className="bankmaster__container">
        <label htmlFor="CommitteeName" className="bankmaster__label">
          Committee Name
        </label>
        <InputField
          id="CommitteeName"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Committee Name"
          value={committeeName}
          onChange={e => setCommitteeName(e.target.value)}
        />
      </div>
      <div className="bankmaster__container">
        <label htmlFor="CommitteePurpose" className="bankmaster__label">
          Committee Purpose
        </label>
        <InputField
          id="CommitteePurpose"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Committee Purpose"
          value={committeePurpose}
          onChange={e => setCommitteePurpose(e.target.value)}
        />
      </div>
      <div className="bankmaster__container">
        <label htmlFor="CommitteeRemarks" className="bankmaster__label">
          Remarks
        </label>
        <InputField
          id="CommitteeRemarks"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Remarks"
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
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

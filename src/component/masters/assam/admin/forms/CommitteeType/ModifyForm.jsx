import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import {
  DatePickerComponent,
  InputField,
  RadioButton,
} from '../../../../../commons/FormElements';
import { modifyCommittee } from '../../../../../../api/committeeTypeAPI';

const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

export default function ModifyCommittee({ data }) {
  const dispatch = useDispatch();

  const {
    hstnumCommitteeTypeId,
    hstnumCommitteeTypeName,
    hststrCommitteePurpose,
    gdtEffectiveFrm,
    gstrRemarks,
    gnumIsvalid,
  } = data.at(0);

  // Controlled state for inputs
  const [committeeName, setCommitteeName] = useState(hstnumCommitteeTypeName);
  const [committeePurpose, setCommitteePurpose] = useState(
    hststrCommitteePurpose
  );
  const [effectiveFrom, setEffectiveFrom] = useState(gdtEffectiveFrm);
  const [remarks, setRemarks] = useState(gstrRemarks);
  const [status, setStatus] = useState(String(gnumIsvalid));

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

  async function handleModify() {
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
      hstnumCommitteeTypeId,
      gnumHospitalCode: 998,
      hstnumCommitteeTypeName: committeeName,
      hststrCommitteePurpose: committeePurpose,
      gdtEffectiveFrm: effectiveFrom,
      gstrRemarks: remarks,
      gnumIsvalid: status,
      gnumSeatid: 11002,
    };

    try {
      await modifyCommittee(JSON.stringify(committeeDetails));
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
      <h3 className="bankmaster__heading">Modify Committee</h3>
      <div className="bankmaster__container">
        <label htmlFor="CommitteeName" className="bankmaster__label">
          Committee Name
        </label>
        <InputField
          id="CommitteeName"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Payment Mode Name"
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
          placeholder="Enter Payment Mode Name"
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
          onClick={handleModify}
        >
          Update
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

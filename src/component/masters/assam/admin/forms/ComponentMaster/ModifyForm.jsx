import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import {
  DatePickerComponent,
  InputField,
  RadioButton,
} from '../../../../../commons/FormElements';
import { modifyComponentMode } from '../../../../../../api/componentMaster';

const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

export default function ModifyComponentForm({ data }) {
  const dispatch = useDispatch();

  console.log(data.at(0));

  const {
    hstnumComponentId,
    gstrRemarks,
    gdtEffectiveFrm,
    hstnumComponentName,
    gnumIsvalid,
  } = data.at(0);

  // Controlled state for inputs
  const [componentMode, setComponentMode] = useState(hstnumComponentName);
  const [effectiveFrom, setEffectiveFrom] = useState(gdtEffectiveFrm);
  const [remarks, setRemarks] = useState(gstrRemarks);
  const [status, setStatus] = useState(String(gnumIsvalid)); // 1 = Req, 0 = Not Req

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    setComponentMode('');
    setRemarks('');
    setEffectiveFrom(null);
    setStatus('1');
  }

  async function handleModify() {
    if (!effectiveFrom || componentMode === '' || remarks === '') {
      alert('Please Provide Valid Details');
      return;
    }

    if (
      specialCharacterCheck.test(componentMode) ||
      specialCharacterCheck.test(remarks)
    ) {
      alert('Special Characters Are Not Allowed');
      return;
    }

    const componentDetails = {
      hstnumComponentId,
      gnumHospitalCode: 998,
      hstnumComponentName: componentMode,
      gdtEffectiveFrm: new Date(effectiveFrom),
      gstrRemarks: remarks,
      hstnumInstFlag: status,
      gnumSeatid: 11002,
    };

    console.log('Sending Data : ', componentDetails);

    try {
      await modifyComponentMode(JSON.stringify(componentDetails));
      alert('Component Details Updated Succesfully!');
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
      <h3 className="bankmaster__heading">Modify Component Mode</h3>
      <div className="bankmaster__container">
        <label htmlFor="ComponentMode" className="bankmaster__label">
          Component Mode Name
        </label>
        <InputField
          id="ComponentMode"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Payment Mode Name"
          value={componentMode}
          onChange={e => setComponentMode(e.target.value)}
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

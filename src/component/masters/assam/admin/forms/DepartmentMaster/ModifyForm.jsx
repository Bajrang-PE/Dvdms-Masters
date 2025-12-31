import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import { InputField, RadioButton } from '../../../../../commons/FormElements';
import { modifyDepartment } from '../../../../../../api/deparmentMasterAPI';

const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

export default function ModifyDepartmentForm({ data }) {
  const dispatch = useDispatch();

  const { gnumDepartmentId, gstrDepartmentName, gnumIsvalid } = data.at(0);

  // Controlled state for inputs
  const [departmentName, setDepartmentName] = useState(gstrDepartmentName);
  const [status, setStatus] = useState(String(gnumIsvalid)); // 1 = Req, 0 = Not Req

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    setDepartmentName(gstrDepartmentName);
    setStatus(String(gnumIsvalid));
  }

  async function handleSave() {
    if (departmentName === '') {
      alert('Please Provide Valid Details');
      return;
    }

    if (specialCharacterCheck.test(departmentName)) {
      alert('Special Characters Are Not Allowed');
      return;
    }

    const departmentDetails = {
      gnumDepartmentId,
      gnumHospitalCode: 998,
      gstrDepartmentName: departmentName,
      gnumIsvalid: status,
      gnumSeatid: 11002,
    };

    try {
      await modifyDepartment(JSON.stringify(departmentDetails));
      alert('Department Updated Added Succesfully!');
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
      <h3 className="bankmaster__heading">Modify Department</h3>
      <div className="bankmaster__container">
        <label htmlFor="DepartmentName" className="bankmaster__label">
          Department Name
        </label>
        <InputField
          id="DepartmentName"
          className="bankmaster__input"
          type="text"
          placeholder="Enter Depatment Name"
          value={departmentName}
          onChange={e => setDepartmentName(e.target.value)}
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

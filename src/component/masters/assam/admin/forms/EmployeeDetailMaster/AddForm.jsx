import { useEffect, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import {
  ComboDropDown,
  DatePickerComponent,
  InputField,
  RadioButton,
} from '../../../../../commons/FormElements';
import { addDiagnosis } from '../../../../../../api/diagnosisMasterAPI';
import {
  fetchDesignations,
  fetchStates,
} from '../../../../../../api/employeeMasterAPI';

const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Binary', value: 'binary' },
  { label: 'Prefer Not Say', value: 'prefer not say' },
];

// Controlled state for inputs
const initialState = {
  gender: '',
  firstName: '',
  middleName: '',
  lastName: '',
  fatherName: '',
  spouseName: '',
  birthYear: '',
  designation: '',
  joiningDate: '',
  permanentAddress: '',
  localAddress: '',
  officeNumber: '',
  mobileNumber: '',
  fax: '',
  emailID: '',
  serviceDocNo: '',
  serviceDocDate: '',
  remarks: '',
  state: '',
};

function addFormReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      console.log('Setting this : ', action.field);
      return { ...state, [action.field]: action.value };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}
export default function AddEmployeeForm() {
  const dispatch = useDispatch();

  const [formState, dispatcher] = useReducer(addFormReducer, initialState);

  //combo states
  const [designations, setDesignations] = useState([]);
  const [states, setStates] = useState([]);

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    dispatcher({ type: 'RESET_FORM' });
  }

  const handleChange = e => {
    const { name, value } = e.target;
    dispatcher({ type: 'SET_FIELD', field: name, value });
  };

  //effects
  useEffect(() => {
    async function getDesignations() {
      const response = await fetchDesignations(998, 1);
      let designationDropDown = [];
      response.data.forEach(obj => {
        const { strDesigName: label, numDesigId: value } = obj;
        designationDropDown.push({ label, value });
      });

      setDesignations(designationDropDown);
    }

    async function getStates() {
      const response = await fetchStates(1);
      let statesDropDown = [];
      response.data.forEach(obj => {
        const { gstrStateName: label, gnumStateCode: value } = obj;
        statesDropDown.push({ label, value });
      });

      setStates(statesDropDown);
    }

    getDesignations();
    getStates();
  }, []);

  //   async function handleSave() {
  //     if (diagnosisName === '' || icdCode === '') {
  //       alert('Please Provide Valid Details');
  //       return;
  //     }

  //     if (
  //       specialCharacterCheck.test(diagnosisName) ||
  //       specialCharacterCheck.test(icdCode)
  //     ) {
  //       alert('Special Characters Are Not Allowed');
  //       return;
  //     }

  //     const diagnosisDetails = {
  //       gnumHospitalCode: 998,
  //       gstrDiagnosisName: diagnosisName,
  //       gstrIcdCode: icdCode,
  //       gnumIsvalid: status,
  //       gnumSeatid: 11002,
  //     };

  //     try {
  //       await addDiagnosis(JSON.stringify(diagnosisDetails));
  //       alert('Diagnosis Details Added Succesfully!');
  //       location.reload();
  //     } catch (err) {
  //       alert('Something went wrong');
  //       console.error(err);
  //     } finally {
  //       dispatch(hidePopup());
  //     }
  //   }

  return (
    <>
      <h3 className="employeeMaster__heading">Add Employee</h3>
      <div className="employeeMaster__container">
        <h4 className="employeeMaster__container-heading">Personal Details</h4>
        <div>
          <label htmlFor="gender" className="employeeMaster__label">
            Gender
          </label>
          <ComboDropDown
            options={genders}
            onChange={handleChange}
            name={'gender'}
            value={formState.gender}
          />
        </div>
        <div>
          <label htmlFor="firstName" className="employeeMaster__label">
            Employee First Name
          </label>
          <InputField
            id="firstName"
            className="employeeMaster__input"
            type="text"
            name={'firstName'}
            placeholder="Enter First Name"
            value={formState.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="middleName" className="employeeMaster__label">
            Employee Middle Name
          </label>
          <InputField
            id="middleName"
            className="employeeMaster__input"
            type="text"
            name={'middleName'}
            placeholder="Enter Middle Name"
            value={formState.middleName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="employeeMaster__label">
            Employee Last Name
          </label>
          <InputField
            id="lastName"
            className="employeeMaster__input"
            type="text"
            name={'lastName'}
            placeholder="Enter Last Name"
            value={formState.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="fatherName" className="employeeMaster__label">
            Father's Name
          </label>
          <InputField
            id="fatherName"
            className="employeeMaster__input"
            type="text"
            name={'fatherName'}
            placeholder="Enter Father Name"
            value={formState.fatherName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="spouseName" className="employeeMaster__label">
            Spouse Name
          </label>
          <InputField
            id="spouseName"
            className="employeeMaster__input"
            type="text"
            name={'spouseName'}
            placeholder="Enter Spouse Name"
            value={formState.spouseName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="motherName" className="employeeMaster__label">
            Mother's Name
          </label>
          <InputField
            id="motherName"
            className="employeeMaster__input"
            type="text"
            name={'motherName'}
            placeholder="Enter Middle Name"
            value={formState.motherName}
            onChange={handleChange}
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.birthYear}
            setSelectedDate={handleChange}
            labelText={'Birth Year'}
            labelFor={'birthYear'}
            allowMin={true}
            name={'birthYear'}
          />
        </div>
        <div>
          <label htmlFor="designation" className="employeeMaster__label">
            Designation
          </label>
          <ComboDropDown
            options={designations}
            onChange={handleChange}
            name={'designation'}
            value={formState.designation}
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.joiningDate}
            setSelectedDate={handleChange}
            labelText={'Joining Date'}
            labelFor={'joiningDate'}
            name={'joiningDate'}
            allowMin={true}
          />
        </div>
      </div>
      <div className="employeeMaster__container">
        <h4 className="employeeMaster__container-heading">Address Details</h4>
        <div>
          <label htmlFor="permanentAddress" className="employeeMaster__label">
            Permanent Address
          </label>
          <InputField
            id="permanentAddress"
            className="employeeMaster__input"
            type="text"
            name={'permanentAddress'}
            placeholder="Enter Permanent Address"
            value={formState.permanentAddress}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="stateName" className="employeeMaster__label">
            State
          </label>
          <ComboDropDown
            options={states}
            onChange={handleChange}
            name={'states'}
            value={formState.state}
          />
        </div>
        <div>
          <label htmlFor="districtName" className="employeeMaster__label">
            District
          </label>
          <InputField
            id="districtName"
            className="employeeMaster__input"
            type="text"
            name={'middleName'}
            placeholder="Enter Middle Name"
            value={formState.middleName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="localAddress" className="employeeMaster__label">
            Local Address
          </label>
          <InputField
            id="localAddress"
            className="employeeMaster__input"
            type="text"
            name={'localAddress'}
            placeholder="Enter Local Address"
            value={formState.localAddress}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="officeNumber" className="employeeMaster__label">
            Office Tel Number
          </label>
          <InputField
            id="officeNumber"
            className="employeeMaster__input"
            type="text"
            name={'officeNumber'}
            placeholder="xxxxxxxxxxxxx"
            value={formState.officeNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="mobileNumber" className="employeeMaster__label">
            Mobile Number
          </label>
          <InputField
            id="mobileNumber"
            className="employeeMaster__input"
            type="text"
            name={'mobileNumber'}
            placeholder="Enter Mobile"
            value={formState.mobileNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="fax" className="employeeMaster__label">
            Fax
          </label>
          <InputField
            id="fax"
            className="employeeMaster__input"
            type="text"
            name={'fax'}
            placeholder="Fax number"
            value={formState.fax}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="emailID" className="employeeMaster__label">
            Email ID
          </label>
          <InputField
            id="emailID"
            className="employeeMaster__input"
            type="text"
            name={'emailID'}
            placeholder="Enter maild ID"
            value={formState.emailID}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="employeeMaster__container">
        <h4 className="employeeMaster__container-heading">Other Details</h4>
        <div>
          <label htmlFor="serviceDocNo" className="employeeMaster__label">
            Service Document Number
          </label>
          <InputField
            id="serviceDocNo"
            className="employeeMaster__input"
            type="text"
            name={'serviceDocNo'}
            placeholder="Enter Service Document Number"
            value={formState.serviceDocNo}
            onChange={handleChange}
          />
        </div>

        <div>
          <DatePickerComponent
            selectedDate={formState.serviceDocDate}
            setSelectedDate={handleChange}
            labelText={'Service Document Date'}
            labelFor={'serviceDocDate'}
            name={'serviceDocDate'}
          />
        </div>

        <div>
          <label htmlFor="remarks" className="employeeMaster__label">
            Remarks
          </label>
          <InputField
            id="remarks"
            className="employeeMaster__input"
            type="text"
            name={'middleName'}
            placeholder="Enter Remarks"
            value={formState.remarks}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="bankmaster__container-controls">
        <button className="bankmaster__container-controls-btn">Save</button>
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

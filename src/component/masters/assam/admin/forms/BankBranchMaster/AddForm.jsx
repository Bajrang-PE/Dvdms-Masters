import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import {
  ComboDropDown,
  InputField,
  RadioButton,
} from '../../../../../commons/FormElements';
import {
  addBranch,
  fetchDistrict,
  fetchStates,
} from '../../../../../../api/bankBranchMasterAPI';

const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

export default function AddBranchForm() {
  //redux states
  const dispatch = useDispatch();
  const { selectedBankID, selectedBankName } = useSelector(
    state => state.bankBranchMaster
  );

  // Controlled state for inputs
  const [branchName, setBrachName] = useState('');
  const [branchShortName, setBranchShortName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankAddress, setBankAddress] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [status, setStatus] = useState('1');

  //fetch states
  useEffect(() => {
    async function fetchStatesData() {
      const response = await fetchStates();
      let states = [];

      response?.data.forEach(state => {
        const { gnum_statecode: stateID, gstr_statename: stateName } = state;
        const stateObject = { label: stateName, value: stateID };
        states.push(stateObject);
      });

      setStateList(states);
    }

    fetchStatesData();
  }, []);

  //fetch Districts
  useEffect(() => {
    async function getDistricts() {
      if (!selectedState || selectedState === '') return;
      const response = await fetchDistrict(selectedState);

      let districts = [];

      response?.data.forEach(district => {
        const { num_dist_id: districtID, str_dist_name: districtName } =
          district;
        const districtObject = { label: districtName, value: districtID };
        districts.push(districtObject);
      });

      setDistrictList(districts);
    }

    getDistricts();
  }, [selectedState]);

  if (!selectedBankID || selectedBankID === '') {
    alert('Please select a bank first');
    dispatch(hidePopup());
    return null;
  }

  function handleClose() {
    dispatch(hidePopup());
  }

  const handleStatusChange = e => {
    setStatus(e.target.value);
  };

  function handleReset() {
    setBrachName('');
    setBranchShortName('');
    setIfscCode('');
    setBankAddress('');
    setSelectedState('');
    setSelectedDistrict('');
    setStatus('1');
  }

  async function handleSave() {
    if (
      branchName === '' ||
      branchShortName === '' ||
      ifscCode === '' ||
      bankAddress === ''
    ) {
      alert('Please Provide Valid Details');
      return;
    }

    if (
      specialCharacterCheck.test(branchName) ||
      specialCharacterCheck.test(branchShortName) ||
      specialCharacterCheck.test(ifscCode)
    ) {
      alert('Special Characters Are Not Allowed');
      return;
    }

    const branchDetails = {
      gnumBankId: selectedBankID,
      gnumHospitalCode: 998,
      gstrBranchName: branchName,
      gstrBranchShortName: branchShortName,
      gstrBranchAddress: bankAddress,
      gstrIfscCode: ifscCode,
      gnumDistId: selectedDistrict,
      gnumIsvalid: status,
      gnumStateCode: selectedState,
      gstrBankName: selectedBankName,
    };

    await addBranch(selectedBankID, JSON.stringify(branchDetails));
    alert('Branch Added Succesfully!');
    dispatch(hidePopup());
    location.reload();
  }

  return (
    <>
      <h3 className="branchmaster__heading">Add Branch</h3>
      <p className="branchmaster__title">{selectedBankName}</p>
      <div className="branchmaster__grid--container">
        <div className="branchmaster__grid--container-item">
          <label htmlFor="BankName" className="branchmaster__label">
            Branch Name
          </label>
          <InputField
            id="BranchName"
            className="branchmaster__input"
            type="text"
            placeholder="Enter Branch Name"
            value={branchName}
            onChange={e => setBrachName(e.target.value)}
          />
        </div>
        <div className="branchmaster__grid--container-item">
          <label htmlFor="IfscCode" className="branchmaster__label">
            IFSC Code
          </label>
          <InputField
            id="IfscCode"
            className="branchmaster__input"
            type="text"
            placeholder="Enter IFSC Code"
            value={ifscCode}
            onChange={e => setIfscCode(e.target.value)}
          />
        </div>
        <div className="branchmaster__grid--container-item">
          <label htmlFor="BranchshortName" className="branchmaster__label">
            Branch Short Name
          </label>
          <InputField
            id="BranchshortName"
            className="branchmaster__input"
            type="text"
            placeholder="Enter Bank Shortname"
            value={branchShortName}
            onChange={e => setBranchShortName(e.target.value)}
          />
        </div>
        <div className="branchmaster__grid--container-item">
          <label htmlFor="Bankaddress" className="branchmaster__label">
            Bank Address
          </label>
          <InputField
            id="Bankaddress"
            className="branchmaster__input"
            type="text"
            placeholder="Enter Bank Address"
            value={bankAddress}
            onChange={e => setBankAddress(e.target.value)}
          />
        </div>
        <div className="branchmaster__grid--container-item">
          <label htmlFor="BankState" className="branchmaster__label">
            State
          </label>
          <ComboDropDown
            options={stateList}
            onChange={e => setSelectedState(e.target.value)}
            value={selectedState}
            label={null}
          />
        </div>

        <div className="branchmaster__grid--container-item">
          <label htmlFor="BankDistrict" className="branchmaster__label">
            District
          </label>
          <ComboDropDown
            options={districtList}
            onChange={e => setSelectedDistrict(e.target.value)}
            value={selectedDistrict}
            label={null}
          />
        </div>
      </div>
      <div className="branchmaster__container">
        <label className="bankmaster__label">Status</label>
        <RadioButton
          label="Active"
          name="status"
          value="1"
          checked={status === '1'}
          onChange={handleStatusChange}
        />
        <RadioButton
          label="Inactive"
          name="status"
          value="0"
          checked={status === '0'}
          onChange={handleStatusChange}
        />
      </div>
      <div className="branchmaster__container-controls">
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

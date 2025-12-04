import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import {
  ComboDropDown,
  DatePickerComponent,
  InputField,
} from '../../../../commons/FormElements';
import {
  getBanks,
  getTenderNameForAddTender,
} from '../../../../../api/Jharkhand/api/rateContractAPI';

export default function RateContractTenderForm() {
  const { value: storeID, label: storeName } = useSelector(
    state => state.rateContractJHK.storeID
  );

  const { value: _, label: contractName } = useSelector(
    state => state.rateContractJHK.contractDetails
  );

  const suppliers = useSelector(state => state.rateContractJHK.supplierList);

  const [tenders, setTenders] = useState([]);
  const [banks, setBanks] = useState([]);

  // Controlled state for inputs
  const initialState = {
    supplierName: '',
    bankName: '',
    contractFrom: '',
    contractTo: '',
    branchName: '',
    quotationNumber: '',
    tenderDate: '',
    ifscCode: '',
    committeeMeetingDate: '',
    acceptanceDate: '',
    tender: '',
    tenderNo: '',
    bgValidityFrom: '',
    bgValidityTo: '',
    bgNo: '',
    bgAmt: '',
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

  const [formState, dispatcher] = useReducer(addFormReducer, initialState);

  const dispatch = useDispatch();

  const handleChange = e => {
    const { name, value } = e.target;
    dispatcher({ type: 'SET_FIELD', field: name, value });
  };

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    dispatcher({ type: 'RESET_FORM' });
  }

  useEffect(() => {
    async function getTenderNumbers() {
      try {
        let tenders = [];
        const data = await getTenderNameForAddTender(998, storeID);
        data.forEach(element => {
          const obj = {
            label: element.name,
            value: element.id,
            date: element.tenderdate,
          };
          tenders.push(obj);
        });
        setTenders(tenders);
      } catch (err) {
        console.log('Failed to fetch tenders.', err);
      }
    }

    async function getBankNames() {
      try {
        let tenders = [];
        const data = await getBanks(998);
        data.forEach(element => {
          const obj = {
            label: element.bankname,
            value: element.bankid,
          };
          tenders.push(obj);
        });
        setBanks(tenders);
      } catch (err) {
        console.log('Failed to fetch banks.', err);
      }
    }

    getTenderNumbers();
    getBankNames();
  }, [storeID]);

  return (
    <>
      <h3 className="employeeMaster__heading">Tender Add</h3>
      <div className="employeeMaster__container">
        <h4 className="employeeMaster__container-heading">RC Type Details</h4>
        <div>
          <label htmlFor="supplierName" className="employeeMaster__label">
            <b>Store Name</b> : {storeName}
          </label>
          <label htmlFor="contractType" className="employeeMaster__label">
            <b>Contract Type</b> : {contractName}
          </label>
        </div>
      </div>
      <div className="employeeMaster__container">
        <h4 className="employeeMaster__container-heading">Tender Details</h4>
        <div>
          <label htmlFor="tender" className="employeeMaster__label">
            Tender
          </label>
          <ComboDropDown
            options={tenders}
            onChange={handleChange}
            name={'tender'}
            value={formState.tender}
          />
        </div>
        <div>
          <label htmlFor="tenderNo" className="employeeMaster__label">
            Tender Number
          </label>
          <InputField
            id="tenderNo"
            className="employeeMaster__input"
            type="text"
            name={'tenderNo'}
            placeholder="Enter Tender Number"
            value={formState.tenderNo}
            onChange={handleChange}
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.tenderDate}
            setSelectedDate={handleChange}
            labelText={'Tender Date'}
            labelFor={'tenderDate'}
            name={'tenderDate'}
            allowMin={true}
          />
        </div>
        <div>
          <label htmlFor="supplierName" className="employeeMaster__label">
            Supplier Name
          </label>
          <ComboDropDown
            options={suppliers}
            onChange={handleChange}
            name={'supplierName'}
            value={formState.supplierName}
          />
        </div>
        <div>
          <label htmlFor="quotationNumber" className="employeeMaster__label">
            Quotation Number
          </label>
          <InputField
            id="quotationNumber"
            className="employeeMaster__input"
            type="text"
            name={'quotationNumber'}
            placeholder="Enter Quotation Number"
            value={formState.quotationNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.contractFrom}
            setSelectedDate={handleChange}
            labelText={'Contract From'}
            labelFor={'contractFrom'}
            name={'contractFrom'}
            allowMin={true}
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.contractTo}
            setSelectedDate={handleChange}
            labelText={'Contract To'}
            labelFor={'contractTo'}
            name={'contractTo'}
            allowMin={true}
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.acceptanceDate}
            setSelectedDate={handleChange}
            labelText={'Acceptance Date'}
            labelFor={'acceptanceDate'}
            name={'acceptanceDate'}
            allowMin={true}
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.committeeMeetingDate}
            setSelectedDate={handleChange}
            labelText={'Financial Committee Date'}
            labelFor={'committeeMeetingDate'}
            name={'committeeMeetingDate'}
            allowMin={true}
          />
        </div>
        <div>
          <label htmlFor="bankName" className="employeeMaster__label">
            Bank Name
          </label>
          <ComboDropDown
            options={banks}
            onChange={handleChange}
            name={'bankName'}
            value={formState.bankName}
          />
        </div>
        <div>
          <label htmlFor="branchName" className="employeeMaster__label">
            Branch Name
          </label>
          <InputField
            id="branchName"
            className="employeeMaster__input"
            type="text"
            name={'branchName'}
            placeholder="Enter Branch Number"
            value={formState.branchName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="ifscCode" className="employeeMaster__label">
            IFSC Code
          </label>
          <InputField
            id="ifscCode"
            className="employeeMaster__input"
            type="text"
            name={'ifscCode'}
            placeholder="Enter IFSC Code"
            value={formState.ifscCode}
            onChange={handleChange}
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.bgValidityFrom}
            setSelectedDate={handleChange}
            labelText={'BG Validity From'}
            labelFor={'bgValidityFrom'}
            name={'bgValidityFrom'}
            allowMin={true}
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.bgValidityTo}
            setSelectedDate={handleChange}
            labelText={'BG Validity To'}
            labelFor={'bgValidityTo'}
            name={'bgValidityTo'}
            allowMin={true}
          />
        </div>
        <div>
          <label htmlFor="bgNo" className="employeeMaster__label">
            BG Number
          </label>
          <InputField
            id="bgNo"
            className="employeeMaster__input"
            type="text"
            name={'bgNo'}
            placeholder="Enter BG Number"
            value={formState.bgNo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="bgAmt" className="employeeMaster__label">
            BG Amount
          </label>
          <InputField
            id="bgAmt"
            className="employeeMaster__input"
            type="text"
            name={'bgAmt'}
            placeholder="Enter BG Amount"
            value={formState.bgAmt}
            onChange={handleChange}
          />
        </div>
        <div>
          <button className="bankmaster__container-controls-btn">
            Upload File
          </button>
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

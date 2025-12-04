import { useEffect, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import {
  ComboDropDown,
  DatePickerComponent,
  InputField,
} from '../../../../commons/FormElements';
import { getExistingRC } from '../../../../../api/Jharkhand/api/rateContractAPI';
import DataTable from '../../../../commons/Datatable';

const existingRcTableCols = [
  { header: 'Supplier Name', field: 'suppName' },
  { header: 'Level', field: 'levelType' },
  { header: 'Rate/Unit', field: 'rate' },
  { header: 'RC Number', field: 'hstnumRcNo' },
  { header: 'Contract Validity', field: 'bgValidity' },
  { header: 'Tender Number', field: 'tenderNo' },
  { header: 'BG Details', field: 'bgAmt' },
];

export default function RateContractAddForm() {
  //   const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

  const drugList = useSelector(state => state.rateContractJHK.drugsList);
  const suppliers = useSelector(state => state.rateContractJHK.supplierList);

  const { value: storeID, label: storeName } = useSelector(
    state => state.rateContractJHK.storeID
  );
  const { value: contractID, label: contractName } = useSelector(
    state => state.rateContractJHK.contractDetails
  );

  const taxTypes = [
    { label: 'Vat', value: 'vat' },
    { label: 'CST', value: 'cst' },
  ];

  // Controlled state for inputs
  const initialState = {
    contractDate: '',
    supplierName: '',
    deliveryDays: '',
    contractFrom: '',
    contractTo: '',
    tenderNumber: '',
    quotationNumber: '',
    tenderDate: '',
    quotationDate: '',
    committeeMeetingDate: '',
    negotiationMeetingDate: '',
    taxType: '',
    taxPercent: '',
    selectedDrug: 0,
  };

  function addFormReducer(state, action) {
    switch (action.type) {
      case 'SET_FIELD':
        return { ...state, [action.field]: action.value };
      case 'RESET_FORM':
        return initialState;
      default:
        return state;
    }
  }

  const [formState, dispatcher] = useReducer(addFormReducer, initialState);

  const dispatch = useDispatch();

  const dataTableRef = useRef();
  const [existingRCs, setExistingRCs] = useState([]);

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
    async function fetchExistingRCs() {
      console.log(storeID, formState.selectedDrug, contractID);
      const response = await getExistingRC(
        998,
        storeID,
        formState.selectedDrug,
        contractID
      );
      setExistingRCs(response);
    }
    fetchExistingRCs();
  }, [storeID, formState.selectedDrug, contractID]);

  return (
    <section className="rateContractAddJHK">
      <h3 className="rateContractAddJHK__heading">
        Rate Contract Itemwise Details
      </h3>
      <div className="rateContractAddJHK__container">
        <h4 className="rateContractAddJHK__container-heading">
          RC Type Details
        </h4>
        <div>
          <label htmlFor="supplierName" className="rateContractAddJHK__label">
            <b>Store Name</b> : {storeName}
          </label>
          <label htmlFor="contractType" className="rateContractAddJHK__label">
            <b>Contract Type</b> : {contractName}
          </label>
          <div>
            <label htmlFor="taxType" className="rateContractAddJHK__label">
              <b>Drug Names</b>
            </label>
            <ComboDropDown
              options={drugList}
              onChange={handleChange}
              name={'selectedDrug'}
              value={formState.selectedDrug}
            />
          </div>
        </div>
      </div>
      <div style={{ marginBottom: '3rem' }}>
        <DataTable
          masterName={'Existing Rate Contract'}
          ref={dataTableRef}
          columns={existingRcTableCols}
          data={existingRCs}
        />
      </div>
      <div className="rateContractAddJHK__container">
        <h4 className="rateContractAddJHK__container-heading">
          Contract Details
        </h4>
        <div>
          <label htmlFor="taxType" className="rateContractAddJHK__label">
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
          <label htmlFor="deliveryDays" className="rateContractAddJHK__label">
            Delivery Days
          </label>
          <InputField
            id="deliveryDays"
            className="rateContractAddJHK__input"
            type="text"
            name={'deliveryDays'}
            placeholder="Enter Delivery Days"
            value={formState.deliveryDays}
            onChange={handleChange}
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.contractFrom}
            setSelectedDate={handleChange}
            labelText={'Contract From Date'}
            labelFor={'contractFrom'}
            name={'contractFrom'}
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.contractTo}
            setSelectedDate={handleChange}
            labelText={'Contract To Date'}
            labelFor={'contractTo'}
            name={'contractTo'}
          />
        </div>
        <div>
          <label htmlFor="tenderNumber" className="rateContractAddJHK__label">
            Tender Number
          </label>
          <InputField
            id="officeNumber"
            className="rateContractAddJHK__input"
            type="text"
            name={'tenderNumber'}
            placeholder="Enter Tender Number"
            value={formState.tenderNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="quotationNumber"
            className="rateContractAddJHK__label"
          >
            Quotation Number
          </label>
          <InputField
            id="quotationNumber"
            className="rateContractAddJHK__input"
            type="text"
            name={'quotationNumber'}
            placeholder="Enter Quotation Number"
            value={formState.quotationNumber}
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
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.quotationDate}
            setSelectedDate={handleChange}
            labelText={'Quotation Date'}
            labelFor={'quotationDate'}
            name={'quotationDate'}
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.committeeMeetingDate}
            setSelectedDate={handleChange}
            labelText={'Committee Meeting Date'}
            labelFor={'committeeMeetingDate'}
            name={'committeeMeetingDate'}
          />
        </div>
        <div>
          <DatePickerComponent
            selectedDate={formState.negotiationMeetingDate}
            setSelectedDate={handleChange}
            labelText={'Negotiation Meeting Date'}
            labelFor={'negotiationMeetingDate'}
            name={'negotiationMeetingDate'}
          />
        </div>
        <div>
          <label htmlFor="taxType" className="rateContractAddJHK__label">
            Tax Type
          </label>
          <ComboDropDown
            options={taxTypes}
            onChange={handleChange}
            name={'taxType'}
            value={formState.taxType}
          />
        </div>
        <div>
          <label htmlFor="taxPercent" className="rateContractAddJHK__label">
            Tax %
          </label>
          <InputField
            id="taxPercent"
            className="employeeMaster__input"
            type="text"
            name={'taxPercent'}
            placeholder="Enter Tax Amount"
            value={formState.taxPercent}
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
    </section>
  );
}

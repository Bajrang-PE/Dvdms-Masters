import { useEffect, useRef, useState } from 'react';
import {
  deletePaymentMode,
  fetchPaymentModes,
} from '../../../../../api/paymentModeMasterAPI';
import DataTable from '../../../../commons/Datatable';
import { ComboDropDown } from '../../../../commons/FormElements';
import MastersNavbar from '../../../../commons/Navbar';
import AddPaymentForm from '../forms/PaymentModeMaster/AddForm';
import ModifyPaymentForm from '../forms/PaymentModeMaster/ModifyForm';
import ViewPaymentDetails from '../forms/PaymentModeMaster/ViewForm';

const statusOptions = [
  {
    label: 'Active',
    value: 1,
  },
  {
    label: 'Inactive',
    value: 0,
  },
];

const columns = [
  { header: 'Payment Mode Name', field: 'hststrPaymentmodeName' },
  { header: 'Effective From', field: 'gdtEffectiveFrmText' },
  { header: 'Instrument Details', field: 'instFlagValue' },
];

export default function PaymentModeMasterList() {
  //local states
  const [isValid, setisValid] = useState(1);
  const [optionsParams, setOptionsParams] = useState({
    Status: isValid === 1 ? 'active' : 'inactive',
  });
  const [paymentModes, setPaymentModes] = useState([]);

  //refs
  const dataTableRef = useRef();

  //effects
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchPaymentModes(isValid);
        setPaymentModes(data?.data);
      } catch (err) {
        console.log('Failed to fetch payment modes.', err);
      }
    };

    loadItems();
  }, [isValid]);

  const handleChange = e => {
    setisValid(e.target.value);
    setOptionsParams(prev => {
      return { ...prev, Status: e.target.value === 1 ? 'active' : 'inactive' };
    });
  };

  async function handlePaymentmodeDelete(data) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this payment mode?'
    );

    if (confirmDelete) {
      try {
        const { hstnumPaymentmodeId } = data.at(0);
        await deletePaymentMode(hstnumPaymentmodeId);
        alert('Payment Mode deleted successfully.');
        location.reload();
      } catch (error) {
        alert('Failed to delete the bank. Please try again.');
        console.error(error);
      }
    }
  }

  return (
    <>
      <MastersNavbar
        label={'Payment Mode List'}
        optionsParams={optionsParams}
        dataTableRef={dataTableRef}
        AddForm={AddPaymentForm}
        ModifyForm={ModifyPaymentForm}
        ViewForm={ViewPaymentDetails}
        deleteFunction={handlePaymentmodeDelete}
      >
        <ComboDropDown
          options={statusOptions}
          onChange={handleChange}
          value={isValid}
          label={'Status'}
        />
      </MastersNavbar>
      <DataTable
        masterName={'Payment Mode Master'}
        ref={dataTableRef}
        columns={columns}
        data={paymentModes}
      />
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import DataTable from '../../../../commons/Datatable';
import { ComboDropDown } from '../../../../commons/FormElements';
import MastersNavbar from '../../../../commons/Navbar';
import {
  deleteDelivery,
  fetchDeliveries,
} from '../../../../../api/deliveryModeMasterAPI';
import AddDeliveryForm from '../forms/DeliveryModeMaster/AddForm';
import ModifyDeliveryForm from '../forms/DeliveryModeMaster/ModifyForm';
import ViewDeliveryMode from '../forms/DeliveryModeMaster/ViewForm';

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
  { header: 'Delivery Mode Name', field: 'hststrDeliverymodeName' },
  { header: 'Effective From', field: 'gdtEffectiveFrm' },
];

export default function DeliveryModeMasterList() {
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
        const data = await fetchDeliveries(isValid);
        setPaymentModes(data?.data);
      } catch (err) {
        console.log('Failed to fetch delivery modes.', err);
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

  async function handleDeliveryModeDelete(data) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this delivery mode?'
    );

    if (confirmDelete) {
      try {
        const { hstnumDeliverymodeId } = data.at(0);
        await deleteDelivery(hstnumDeliverymodeId);
        alert('Delivery Mode deleted successfully.');
        location.reload();
      } catch (error) {
        alert('Failed to delete the delivery. Please try again.');
        console.error(error);
      }
    }
  }

  return (
    <>
      <MastersNavbar
        label={'Delivery Mode List'}
        optionsParams={optionsParams}
        dataTableRef={dataTableRef}
        AddForm={AddDeliveryForm}
        ModifyForm={ModifyDeliveryForm}
        ViewForm={ViewDeliveryMode}
        deleteFunction={handleDeliveryModeDelete}
      >
        <ComboDropDown
          options={statusOptions}
          onChange={handleChange}
          value={isValid}
          label={'Status'}
        />
      </MastersNavbar>
      <DataTable
        masterName={'Delivery Mode Master'}
        ref={dataTableRef}
        columns={columns}
        data={paymentModes}
      />
    </>
  );
}

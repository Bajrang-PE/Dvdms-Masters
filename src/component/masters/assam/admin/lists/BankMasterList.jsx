import { useEffect, useRef, useState } from 'react';
import { ComboDropDown } from '../../../../commons/FormElements';
import MastersNavbar from '../../../../commons/Navbar';
import DataTable from '../../../../commons/Datatable';
import { deleteBank, fetchBankList } from '../../../../../api/bankMasterAPI';
import AddBankForm from '../forms/BankMaster/AddForm';
import ModifyBankForm from '../forms/BankMaster/ModifyForm';
import ViewBank from '../forms/BankMaster/ViewBank';

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
  { header: 'Bank Name', field: 'gstrBankName' },
  { header: 'Bank Short Name', field: 'gstrBankShortName' },
];

export default function BankMasterList() {
  //local states
  const [isValid, setisValid] = useState(1);
  const [optionsParams, setOptionsParams] = useState({
    Status: isValid === 1 ? 'active' : 'inactive',
  });
  const [bankList, setBankList] = useState([]);

  //refs
  const dataTableRef = useRef();

  //effects
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchBankList(isValid);
        console.log('data', data)
        setBankList(data?.data);
      } catch (err) {
        console.log('Failed to fetch data.', err);
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

  async function handleBankDelete(data) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this bank?'
    );

    if (confirmDelete) {
      try {
        const { gnumBankId } = data.at(0);
        const response = await deleteBank(gnumBankId);
        alert('Bank deleted successfully.');
        console.log('DELETE API RESPONSE : ', response);
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
        label={'Bank Branch'}
        optionsParams={optionsParams}
        dataTableRef={dataTableRef}
        AddForm={AddBankForm}
        ModifyForm={ModifyBankForm}
        ViewForm={ViewBank}
        deleteFunction={handleBankDelete}
      >
        <ComboDropDown
          options={statusOptions}
          onChange={handleChange}
          value={isValid}
          label={'Status'}
        />
      </MastersNavbar>
      <DataTable
        masterName={'Bank Master'}
        ref={dataTableRef}
        columns={columns}
        data={bankList}
      />
      ;
    </>
  );
}

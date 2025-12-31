import { useEffect, useRef, useState } from 'react';
import { ComboDropDown } from '../../../../commons/FormElements';
import MastersNavbar from '../../../../commons/Navbar';
import DataTable from '../../../../commons/Datatable';
import { fetchBankList } from '../../../../../api/bankMasterAPI';
import {
  deleteBankBranch,
  fetchBankBranchList,
} from '../../../../../api/bankBranchMasterAPI';
import AddBranchForm from '../forms/BankBranchMaster/AddForm';
import { useDispatch } from 'react-redux';
import { setBank } from '../../../../../features/BankBranchMaster/bankBranchMasterSlice';
import ModifyBranchForm from '../forms/BankBranchMaster/ModifyForm';
import ViewBranch from '../forms/BankBranchMaster/ViewForm';

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
  { header: 'Bank Branch Name', field: 'gstrBranchName' },
  { header: 'IFSC Code', field: 'gstrIfscCode' },
  { header: 'Bank Address', field: 'gstrBranchAddress' },
];

export default function BankBranchMasterList() {
  //redux states
  const dispatch = useDispatch();

  //local states
  const [isValid, setisValid] = useState(1);
  const [selectedBank, setSelectedBank] = useState(0);

  const [banksList, setBanksList] = useState([]);
  const [bankBranchData, setBankBranchData] = useState([]);

  const [optionsParams, setOptionsParams] = useState({
    Status: isValid === 1 ? 'active' : 'inactive',
    Bank: selectedBank === 0 ? 'All' : findBankId(selectedBank),
  });

  //refs
  const dataTableRef = useRef();

  //effects
  useEffect(() => {
    const loadBankNames = async () => {
      try {
        const data = await fetchBankList(isValid);
        const bankList = data?.data;
        let bankDetails = [{ label: 'All', value: 0 }];
        bankList.forEach(bank => {
          bankDetails.push({
            label: bank?.gstrBankName,
            value: bank?.gnumBankId,
          });
        });

        setBanksList(bankDetails);
      } catch (err) {
        console.log('Failed to fetch data.', err);
      }
    };

    const getBankBranchList = async () => {
      try {
        const data = await fetchBankBranchList(isValid, selectedBank);
        const bankList = data?.data;
        setBankBranchData(bankList);
      } catch (err) {
        console.log('Failed to fetch data.', err);
      }
    };

    loadBankNames();
    getBankBranchList();
  }, [isValid, selectedBank]);

  const handleStatusChange = e => {
    setisValid(e.target.value);
    setOptionsParams(prev => {
      return { ...prev, Status: e.target.value === 1 ? 'active' : 'inactive' };
    });
  };

  const handleBankChange = e => {
    //update redux state
    dispatch(setBank({ id: e.target.value, name: findBankId(e.target.value) }));

    setSelectedBank(e.target.value);
    setOptionsParams(prev => {
      return { ...prev, Bank: findBankId(e.target.value) };
    });
  };

  function findBankId(id) {
    const object = banksList.find(data => {
      return data?.value === id;
    });

    return object?.label;
  }

  async function handleBankBranchDelete(data) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this bank?'
    );

    if (confirmDelete) {
      try {
        const { gnumBankId, gnumBranchId } = data.at(0);
        const response = await deleteBankBranch(gnumBankId, gnumBranchId);
        if (response?.data?.status === 1) {
          alert('Branch deleted successfully.');
          location.reload();
        } else {
          alert('Branch deletion failed...' + response?.data?.message);
          location.reload();
        }
      } catch (error) {
        alert('Failed to delete the bank. Please try again.');
        console.error(error);
      }
    }
  }

  return (
    <>
      <MastersNavbar
        label={'Bank Branch List'}
        optionsParams={optionsParams}
        dataTableRef={dataTableRef}
        AddForm={AddBranchForm}
        ModifyForm={ModifyBranchForm}
        ViewForm={ViewBranch}
        deleteFunction={handleBankBranchDelete}
      >
        <ComboDropDown
          options={statusOptions}
          onChange={handleStatusChange}
          value={isValid}
          label={'Status'}
        />
        <ComboDropDown
          options={banksList}
          onChange={handleBankChange}
          value={selectedBank}
          label={'Bank Name'}
        />
      </MastersNavbar>
      <DataTable
        masterName={'Bank Master'}
        ref={dataTableRef}
        columns={columns}
        data={bankBranchData}
      />
    </>
  );
}

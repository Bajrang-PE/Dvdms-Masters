import React, { useEffect, useRef, useState } from 'react'
import NavbarMasterJH from '../../../../commons/NavbarMasterJH'
import SelectBox from '../../../../commons/SelectBox'
import DataTable from '../../../../commons/Datatable'
import { useDispatch, useSelector } from 'react-redux'
import BankBranchMasterFormJH from '../forms/BankBranchMasterFormJH'
import { MasterViewModal } from '../../MasterViewModal'
import { deleteBankBranch } from '../../../../../api/Jharkhand/master/BankBranchMasterAPI_JH'
import { fetchBankNameDrpDt, fetchBankBranchList } from '../../../../../features/jharkhand/JH_Apis'

const BankBranchMasterJH = () => {

  const dispatch = useDispatch();
  const { bankNameDrpDt, bankBranchMstDt } = useSelector(state => state.jhMst);

  //local states
  const [isValid, setisValid] = useState(1);
  const [selectedBank, setSelectedBank] = useState(0);

  const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
  ];

  const columns = [
    { header: 'Bank Name', field: 'gstrBankName' },
    { header: 'Bank Branch Name', field: 'gstrBranchName' },
    { header: 'IFSC Code', field: 'gstrIfscCode' },
    { header: 'Bank Address', field: 'gstrBranchAddress' },
  ];
  const viewCol = [
    { label: 'Bank Name', key: 'gstrBankName' },
    { label: 'Bank Branch Name', key: 'gstrBranchName' },
    { label: 'IFSC Code', key: 'gstrIfscCode' },
    { label: 'Bank Address', key: 'gstrBranchAddress' },
  ];

  function findBankId(id) {
    const object = bankNameDrpDt.find(data => {
      return data?.value == id;
    });

    return object?.label;
  }

  const [optionsParams, setOptionsParams] = useState({
    Status: isValid === 1 ? 'active' : 'inactive',
    Bank: selectedBank === 0 ? 'All' : findBankId(selectedBank),
    BankId: selectedBank || 0,
  });

  //refs
  const dataTableRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e?.target;
    if (name === 'status') {
      setisValid(value);
      setOptionsParams(prev => {
        return { ...prev, Status: value === 1 ? 'active' : 'inactive' };
      });
    } else if (name === 'BankName') {
      setSelectedBank(value);
      setOptionsParams(prev => {
        return { ...prev, Bank: findBankId(value), BankId: value };
      });
    }
  };

  useEffect(() => {
    dispatch(fetchBankNameDrpDt(1))
  }, [])


  useEffect(() => {
    const loadItems = async () => {
      try {
        dispatch(fetchBankBranchList({ status: isValid, id: selectedBank }));
      } catch (err) {
        console.log('Failed to fetch data.', err);
      }
    };

    loadItems();
  }, [isValid, selectedBank]);


  async function handleBankBranchDelete(data) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this bank?'
    );

    if (confirmDelete) {
      try {
        const { gnumBankId, gnumBranchId } = data.at(0);
        const response = await deleteBankBranch(gnumBankId, gnumBranchId);
        if (response?.status === 1) {
          alert('Branch deleted successfully.');
          dispatch(fetchBankBranchList({ status: isValid, id: selectedBank }));
        } else {
          alert('Branch deletion failed...' + response?.message);
        }
      } catch (error) {
        alert('Failed to delete the bank. Please try again.');
        console.error(error);
      }
    }
  }

  const handleAddClick = async () => {
    let isValid = false;

    if (selectedBank && selectedBank !== '' && selectedBank != 0) {
      isValid = true;
    } else {
      alert('please select bank');
      isValid = false;
    }

    return isValid;

  }


  return (
    <>
      <NavbarMasterJH
        label={'Bank Branch List'}
        optionsParams={optionsParams}
        dataTableRef={dataTableRef}
        AddForm={BankBranchMasterFormJH}
        ModifyForm={BankBranchMasterFormJH}
        ViewForm={MasterViewModal}
        deleteFunction={handleBankBranchDelete}
        columns={viewCol}
        onAdd={handleAddClick}
      >
        <div>
          <label className="Wrapper__label">{'Status '}:</label> <br />
          <SelectBox
            options={statusOptions}
            onChange={handleChange}
            value={isValid}
            name={'status'}
          />
        </div>
        <div>
          <label className="Wrapper__label">{'Bank Name '}:</label> <br />
          <SelectBox
            options={[{ label: 'All', value: 0 }, ...bankNameDrpDt]}
            onChange={handleChange}
            value={selectedBank}
            name={'BankName'}
          />
        </div>
      </NavbarMasterJH>
      <DataTable
        masterName={'Bank Branch Master'}
        ref={dataTableRef}
        columns={columns}
        data={bankBranchMstDt}
      />
    </>
  )
}

export default BankBranchMasterJH

import React, { useEffect, useRef, useState } from 'react'
import DataTable from '../../../../commons/Datatable';
import { ComboDropDown } from '../../../../commons/FormElements';
import NavbarMasterJH from '../../../../commons/NavbarMasterJH';
import { deleteBank } from '../../../../../api/Jharkhand/master/BankMasterAPI_JH';
import BankMasterFormJH from '../forms/BankMasterFormJH';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBankList } from '../../../../../features/jharkhand/JH_Apis';
import SelectBox from '../../../../commons/SelectBox';
import { MasterViewModal } from '../../MasterViewModal';

const BankMasterJH = () => {

  const [isValid, setisValid] = useState(1);
  const [optionsParams, setOptionsParams] = useState({
    Status: isValid === 1 ? 'active' : 'inactive',
  });
  const dataTableRef = useRef();

  const dispatch = useDispatch();
  const { bankMstDt } = useSelector(state => state.jhMst);

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
  const viewCol = [
    { label: 'Bank Name', key: 'gstrBankName' },
    { label: 'Bank Short Name', key: 'gstrBankShortName' },
  ];


  useEffect(() => {
    const loadItems = async () => {
      try {
        dispatch(fetchBankList(isValid));
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
        dispatch(fetchBankList(isValid || 1));
        alert('Bank deleted successfully.');
        console.log('DELETE API RESPONSE : ', response);
      } catch (error) {
        alert('Failed to delete the bank. Please try again.');
        console.error(error);
      }
    }
  }


  return (
    <>
      <NavbarMasterJH
        label={'Bank Master >>'}
        optionsParams={optionsParams}
        dataTableRef={dataTableRef}
        AddForm={BankMasterFormJH}
        ModifyForm={BankMasterFormJH}
        ViewForm={MasterViewModal}
        deleteFunction={handleBankDelete}
        columns={viewCol}
      >
        <div>
          <label className="Wrapper__label">{'Status '}:</label> <br />
          <SelectBox
            options={statusOptions}
            onChange={handleChange}
            value={isValid}
            name={'Status'}
          />
        </div>
      </NavbarMasterJH>
      <DataTable
        masterName={'Bank Master'}
        ref={dataTableRef}
        columns={columns}
        data={bankMstDt}
      />
    </>
  )
}

export default BankMasterJH;

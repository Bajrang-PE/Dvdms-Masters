import { useEffect, useRef, useState } from 'react';
import DataTable from '../../../../commons/Datatable';
import { ComboDropDown } from '../../../../commons/FormElements';
import MastersNavbar from '../../../../commons/Navbar';
import {
  deleteCommittee,
  fetchCommittees,
} from '../../../../../api/committeeTypeAPI';
import AddCommittee from '../forms/CommitteeType/AddForm';
import ModifyCommittee from '../forms/CommitteeType/ModifyForm';
import ViewCommitteeDetails from '../forms/CommitteeType/ViewForm';

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
  { header: 'Committee Type Name', field: 'hstnumCommitteeTypeName' },
  { header: 'Committee Purpose', field: 'hststrCommitteePurpose' },
  { header: 'Effective From', field: 'gdtEffectiveFrm' },
];

export default function CommitteeTypeList() {
  //local states
  const [isValid, setisValid] = useState(1);
  const [optionsParams, setOptionsParams] = useState({
    Status: isValid === 1 ? 'active' : 'inactive',
  });
  const [committees, setCommittees] = useState([]);

  //refs
  const dataTableRef = useRef();

  //effects
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchCommittees(isValid);
        setCommittees(data?.data);
      } catch (err) {
        console.log('Failed to fetch committee types.', err);
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

  async function handleCommitteeDelete(data) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this Committee?'
    );

    if (confirmDelete) {
      try {
        const { hstnumCommitteeTypeId } = data.at(0);
        await deleteCommittee(hstnumCommitteeTypeId);
        alert('Committee deleted successfully.');
        location.reload();
      } catch (error) {
        alert('Failed to delete the Committee. Please try again.');
        console.error(error);
      }
    }
  }

  return (
    <>
      <MastersNavbar
        label={'Committee Type List'}
        optionsParams={optionsParams}
        dataTableRef={dataTableRef}
        AddForm={AddCommittee}
        ModifyForm={ModifyCommittee}
        ViewForm={ViewCommitteeDetails}
        deleteFunction={handleCommitteeDelete}
      >
        <ComboDropDown
          options={statusOptions}
          onChange={handleChange}
          value={isValid}
          label={'Status'}
        />
      </MastersNavbar>
      <DataTable
        masterName={'Committee Type Master'}
        ref={dataTableRef}
        columns={columns}
        data={committees}
      />
    </>
  );
}

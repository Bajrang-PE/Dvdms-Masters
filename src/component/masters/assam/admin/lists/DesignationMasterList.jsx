import { useEffect, useRef, useState } from 'react';
import DataTable from '../../../../commons/Datatable';
import { ComboDropDown } from '../../../../commons/FormElements';
import MastersNavbar from '../../../../commons/Navbar';
import {
  deleteDesignation,
  fetchDesignations,
} from '../../../../../api/designationMasterAPI';
import AddDesignationForm from '../forms/DesignationMaster/AddForm';
import ModifyDesignationForm from '../forms/DesignationMaster/ModifyForm';
import ViewDesignation from '../forms/DesignationMaster/ViewForm';

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
  { header: 'Designation Name', field: 'strDesigName' },
  { header: 'Effective From', field: 'gdtEffectiveFrm' },
];

export default function DesignationMasterList() {
  //local states
  const [isValid, setisValid] = useState(1);
  const [optionsParams, setOptionsParams] = useState({
    Status: isValid === 1 ? 'active' : 'inactive',
  });
  const [designation, setDesignation] = useState([]);

  //refs
  const dataTableRef = useRef();

  //effects
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchDesignations(isValid);
        setDesignation(data?.data);
      } catch (err) {
        console.log('Failed to fetch designation.', err);
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

  async function handleDesignationDelete(data) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this delivery mode?'
    );

    if (confirmDelete) {
      try {
        const { numDesigId } = data.at(0);
        await deleteDesignation(numDesigId);
        alert('Designation deleted successfully.');
        location.reload();
      } catch (error) {
        alert('Failed to delete the Designation. Please try again later.');
        console.error(error);
      }
    }
  }

  return (
    <>
      <MastersNavbar
        label={'Designation List'}
        optionsParams={optionsParams}
        dataTableRef={dataTableRef}
        AddForm={AddDesignationForm}
        ModifyForm={ModifyDesignationForm}
        ViewForm={ViewDesignation}
        deleteFunction={handleDesignationDelete}
      >
        <ComboDropDown
          options={statusOptions}
          onChange={handleChange}
          value={isValid}
          label={'Status'}
        />
      </MastersNavbar>
      <DataTable
        masterName={'Designation Master'}
        ref={dataTableRef}
        columns={columns}
        data={designation}
      />
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import DataTable from '../../../../commons/Datatable';
import { ComboDropDown } from '../../../../commons/FormElements';
import MastersNavbar from '../../../../commons/Navbar';
import {
  deleteDepartment,
  fetchDepartments,
} from '../../../../../api/deparmentMasterAPI';
import AddDepartmentForm from '../forms/DepartmentMaster/AddForm';
import ModifyDepartmentForm from '../forms/DepartmentMaster/ModifyForm';
import ViewDepartment from '../forms/DepartmentMaster/ViewForm';

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

const columns = [{ header: 'Department Name', field: 'gstrDepartmentName' }];

export default function DepartmentMasterList() {
  //local states
  const [isValid, setisValid] = useState(1);
  const [optionsParams, setOptionsParams] = useState({
    Status: isValid === 1 ? 'active' : 'inactive',
  });
  const [departments, setDepartments] = useState([]);

  //refs
  const dataTableRef = useRef();

  //effects
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchDepartments(isValid);
        setDepartments(data?.data);
      } catch (err) {
        console.log('Failed to fetch departments.', err);
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

  async function handleDepartmentDelete(data) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this department?'
    );

    if (confirmDelete) {
      try {
        const { gnumDepartmentId } = data.at(0);
        await deleteDepartment(gnumDepartmentId);
        alert('Department deleted successfully.');
        location.reload();
      } catch (error) {
        alert('Failed to delete the department. Please try again.');
        console.error(error);
      }
    }
  }

  return (
    <>
      <MastersNavbar
        label={'Departments List'}
        optionsParams={optionsParams}
        dataTableRef={dataTableRef}
        AddForm={AddDepartmentForm}
        ModifyForm={ModifyDepartmentForm}
        ViewForm={ViewDepartment}
        deleteFunction={handleDepartmentDelete}
      >
        <ComboDropDown
          options={statusOptions}
          onChange={handleChange}
          value={isValid}
          label={'Status'}
        />
      </MastersNavbar>
      <DataTable
        masterName={'Departments Master'}
        ref={dataTableRef}
        columns={columns}
        data={departments}
      />
    </>
  );
}

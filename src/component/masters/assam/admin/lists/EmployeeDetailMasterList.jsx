import { useEffect, useRef, useState } from 'react';
import DataTable from '../../../../commons/Datatable';
import { ComboDropDown } from '../../../../commons/FormElements';
import MastersNavbar from '../../../../commons/Navbar';
import {
  deleteEmployee,
  fetchEmployees,
} from '../../../../../api/employeeMasterAPI';
import ViewEmployees from '../forms/EmployeeDetailMaster/ViewForm';
import AddEmployeeForm from '../forms/EmployeeDetailMaster/AddForm';

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
  { header: 'Employee Code', field: 'strEmpCode' },
  { header: 'Employee Name', field: 'strFirstName' },
  { header: 'Designation', field: 'numDesigId' },
  { header: 'Father Name', field: 'strFatherName' },
];

export default function EmployeeMasterList() {
  //local states
  const [isValid, setisValid] = useState(1);
  const [optionsParams, setOptionsParams] = useState({
    Status: isValid === 1 ? 'active' : 'inactive',
  });
  const [employees, setEmployees] = useState([]);

  //refs
  const dataTableRef = useRef();

  //effects
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchEmployees(isValid);
        setEmployees(data?.data);
      } catch (err) {
        console.log('Failed to fetch employees.', err);
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

  async function handleEmployeeDelete(data) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this employee?'
    );

    if (confirmDelete) {
      try {
        const { strEmpNo } = data.at(0);
        await deleteEmployee(strEmpNo);
        alert('Employee deleted successfully.');
        location.reload();
      } catch (error) {
        alert('Failed to delete the employee. Please try again.');
        console.error(error);
      }
    }
  }

  return (
    <>
      <MastersNavbar
        label={'Employees List'}
        optionsParams={optionsParams}
        dataTableRef={dataTableRef}
        AddForm={AddEmployeeForm}
        // ModifyForm={ModifyPaymentForm}
        ViewForm={ViewEmployees}
        deleteFunction={handleEmployeeDelete}
        isLargeDataset={true}
      >
        <ComboDropDown
          options={statusOptions}
          onChange={handleChange}
          value={isValid}
          label={'Status'}
        />
      </MastersNavbar>
      <DataTable
        masterName={'Employees Master'}
        ref={dataTableRef}
        columns={columns}
        data={employees}
      />
    </>
  );
}

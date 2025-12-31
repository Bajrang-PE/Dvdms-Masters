import { useEffect, useRef, useState } from 'react';
import DataTable from '../../../../commons/Datatable';
import { ComboDropDown } from '../../../../commons/FormElements';
import MastersNavbar from '../../../../commons/Navbar';
import { fetchDepartmentEmployees } from '../../../../../api/departmentEmployeeAPI';

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
  { header: 'Health Facility Name', field: 'hststrStoreName' },
  { header: 'Department Name', field: 'gstrDepartmentName' },
  { header: 'Employee Name', field: 'strEmpName' },
];

export default function DepartmentEmployeeMasterList() {
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
        const data = await fetchDepartmentEmployees(998);
        setEmployees(data?.data);
      } catch (err) {
        console.log('Failed to fetch department employees.', err);
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

  //   async function handleEmployeeDelete(data) {
  //     const confirmDelete = window.confirm(
  //       'Are you sure you want to delete this employee?'
  //     );

  //     if (confirmDelete) {
  //       try {
  //         const { strEmpNo } = data.at(0);
  //         await deleteEmployee(strEmpNo);
  //         alert('Employee deleted successfully.');
  //         location.reload();
  //       } catch (error) {
  //         alert('Failed to delete the employee. Please try again.');
  //         console.error(error);
  //       }
  //     }
  //   }

  return (
    <>
      <MastersNavbar
        label={'Department Employee Mapping List'}
        optionsParams={optionsParams}
        dataTableRef={dataTableRef}
        // ModifyForm={ModifyPaymentForm}
        // AddForm={AddEmployeeForm}
        // ViewForm={ViewEmployees}
        // deleteFunction={handleEmployeeDelete}
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
        masterName={'Department Employee Master'}
        ref={dataTableRef}
        columns={columns}
        data={employees}
      />
    </>
  );
}

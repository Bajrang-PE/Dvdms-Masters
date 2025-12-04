import { useEffect, useRef, useState } from 'react';
import DataTable from '../../../../commons/Datatable';
import { ComboDropDown } from '../../../../commons/FormElements';
import MastersNavbar from '../../../../commons/Navbar';
import {
  deleteDiagnosis,
  fetchDiagnosis,
  viewDiagnosis,
} from '../../../../../api/diagnosisMasterAPI';
import AddDiagnosisForm from '../forms/DiagnosisMaster/AddForm';
import ModifyDiagnosisForm from '../forms/DiagnosisMaster/ModifyForm';
import ViewDiagnosis from '../forms/DiagnosisMaster/ViewForm';

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
  { header: 'Diagnosis Name', field: 'gstrDiagnosisName' },
  { header: 'ICD Code', field: 'gstrIcdCode' },
];

export default function DiagnosisMasterList() {
  //local states
  const [isValid, setisValid] = useState(1);
  const [optionsParams, setOptionsParams] = useState({
    Status: isValid === 1 ? 'active' : 'inactive',
  });
  const [diagnosis, setDiagnosis] = useState([]);

  //refs
  const dataTableRef = useRef();

  //effects
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchDiagnosis(isValid);
        setDiagnosis(data?.data);
      } catch (err) {
        console.log('Failed to fetch diagnosis.', err);
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

  async function handleDiagnosisDelete(data) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this delivery mode?'
    );

    if (confirmDelete) {
      try {
        const { gnumDiagnosisId } = data.at(0);
        await deleteDiagnosis(gnumDiagnosisId);
        alert('Diagnosis deleted successfully.');
        location.reload();
      } catch (error) {
        alert('Failed to delete the Diagnosis. Please try again later.');
        console.error(error);
      }
    }
  }

  return (
    <>
      <MastersNavbar
        label={'Diagnosis List'}
        optionsParams={optionsParams}
        dataTableRef={dataTableRef}
        AddForm={AddDiagnosisForm}
        ModifyForm={ModifyDiagnosisForm}
        ViewForm={ViewDiagnosis}
        deleteFunction={handleDiagnosisDelete}
      >
        <ComboDropDown
          options={statusOptions}
          onChange={handleChange}
          value={isValid}
          label={'Status'}
        />
      </MastersNavbar>
      <DataTable
        masterName={'Diagnosis Master'}
        ref={dataTableRef}
        columns={columns}
        data={diagnosis}
      />
    </>
  );
}

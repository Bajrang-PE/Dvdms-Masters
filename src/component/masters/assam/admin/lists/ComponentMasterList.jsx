import { useEffect, useRef, useState } from 'react';
import DataTable from '../../../../commons/Datatable';
import { ComboDropDown } from '../../../../commons/FormElements';
import MastersNavbar from '../../../../commons/Navbar';
import {
  deleteComponentMode,
  fetchComponents,
} from '../../../../../api/componentMaster';
import AddComponentForm from '../forms/ComponentMaster/AddForm';
import ModifyComponentForm from '../forms/ComponentMaster/ModifyForm';
import ViewComponentDetails from '../forms/ComponentMaster/ViewForm';

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
  { header: 'Component Name', field: 'hstnumComponentName' },
  { header: 'Effective From', field: 'gdtEffectiveFrm' },
];

export default function ComponentMasterList() {
  //local states
  const [isValid, setisValid] = useState(1);
  const [optionsParams, setOptionsParams] = useState({
    Status: isValid === 1 ? 'active' : 'inactive',
  });
  const [components, setComponents] = useState([]);

  //refs
  const dataTableRef = useRef();

  //effects
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchComponents(isValid);
        console.log('Components List : ', data?.data);
        setComponents(data?.data);
      } catch (err) {
        console.log('Failed to fetch component modes.', err);
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

  async function handleComponentDelete(data) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this component mode?'
    );

    if (confirmDelete) {
      try {
        const { hstnumComponentId } = data.at(0);
        await deleteComponentMode(hstnumComponentId);
        alert('Payment Mode deleted successfully.');
        location.reload();
      } catch (error) {
        alert('Failed to delete the component. Please try again.');
        console.error(error);
      }
    }
  }

  return (
    <>
      <MastersNavbar
        label={'Component Mode List'}
        optionsParams={optionsParams}
        dataTableRef={dataTableRef}
        AddForm={AddComponentForm}
        ModifyForm={ModifyComponentForm}
        ViewForm={ViewComponentDetails}
        deleteFunction={handleComponentDelete}
      >
        <ComboDropDown
          options={statusOptions}
          onChange={handleChange}
          value={isValid}
          label={'Status'}
        />
      </MastersNavbar>
      <DataTable
        masterName={'Component Mode Master'}
        ref={dataTableRef}
        columns={columns}
        data={components}
      />
    </>
  );
}

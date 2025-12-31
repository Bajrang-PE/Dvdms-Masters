import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import MiniTable from '../../../../../commons/Minitable';
import { viewEmployee } from '../../../../../../api/employeeMasterAPI';

export default function ViewEmployees({ data }) {
  const { strEmpNo: id, gnumIsvalid } = data.at(0);
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);

  //redux states
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(hidePopup());
  }

  const fetchDetails = useCallback(async () => {
    const response = await viewEmployee(id, gnumIsvalid);
    const columns = [
      { key: 'strEmpCode', label: 'Employee Code' },
      { key: 'strFirstName', label: 'Employee Name' },
      { key: 'numDesigId', label: 'Designation' },
      { key: 'strFatherName', label: 'Father Name' },
    ];
    const data = [response.data];

    setCols(columns);
    setRows(data);
  }, [id, gnumIsvalid, setCols, setRows]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return (
    <>
      <MiniTable columns={cols} data={rows} />
      <div className="bankmaster__container-controls">
        <button
          className="bankmaster__container-controls-btn"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </>
  );
}

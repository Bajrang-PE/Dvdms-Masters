import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import MiniTable from '../../../../../commons/Minitable';
import { viewDiagnosis } from '../../../../../../api/diagnosisMasterAPI';

export default function ViewDiagnosis({ data }) {
  const { gnumDiagnosisId: id, gnumIsvalid } = data.at(0);
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);

  //redux states
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(hidePopup());
  }

  const fetchDetails = useCallback(async () => {
    const response = await viewDiagnosis(id, gnumIsvalid);
    const columns = [
      { key: 'gstrDiagnosisName', label: 'Diagnosis Name' },
      { key: 'gstrIcdCode', label: 'ICD Code' },
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

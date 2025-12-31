import { useCallback, useEffect, useState } from 'react';
import { viewBank } from '../../../../../../api/bankMasterAPI';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import MiniTable from '../../../../../commons/Minitable';

export default function ViewBank({ data }) {
  const { gnumBankId: id } = data.at(0);
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);

  //redux states
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(hidePopup());
  }

  const fetchDetails = useCallback(async () => {
    const response = await viewBank(id);
    const columns = [
      { key: 'gstrBankName', label: 'Bank Name' },
      { key: 'gstrBankShortName', label: 'Bank Short Name' },
    ];
    const data = [response.data];

    setCols(columns);
    setRows(data);
  }, [id, setCols, setRows]);

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

import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import MiniTable from '../../../../../commons/Minitable';
import { viewPaymentMode } from '../../../../../../api/paymentModeMasterAPI';

export default function ViewPaymentDetails({ data }) {
  const { hstnumPaymentmodeId: id } = data.at(0);
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);

  //redux states
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(hidePopup());
  }

  const fetchDetails = useCallback(async () => {
    const response = await viewPaymentMode(id);
    const columns = [
      { key: 'hststrPaymentmodeName', label: 'Payment Mode Name' },
      { key: 'gdtEffectiveFrm', label: 'Effective Form' },
      { key: 'hstnumInstFlag', label: 'Instrument Details' },
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

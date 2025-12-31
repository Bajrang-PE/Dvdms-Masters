import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import MiniTable from '../../../../../commons/Minitable';
import { viewDeliveryMode } from '../../../../../../api/deliveryModeMasterAPI';

export default function ViewDeliveryMode({ data }) {
  const { hstnumDeliverymodeId: id, gnumIsvalid } = data.at(0);
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);

  //redux states
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(hidePopup());
  }

  const fetchDetails = useCallback(async () => {
    const response = await viewDeliveryMode(id, gnumIsvalid);
    const columns = [
      { key: 'hststrDeliverymodeName', label: 'Delivery Mode Name' },
      { key: 'gdtEffectiveFrm', label: 'Effective Form' },
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

import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import { viewComponentMode } from '../../../../../../api/componentMaster';
import MiniTable from '../../../../../commons/Minitable';

export default function ViewComponentDetails({ data }) {
  const { hstnumComponentId: id, gnumIsvalid } = data.at(0);
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);

  //redux states
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(hidePopup());
  }

  const fetchDetails = useCallback(async () => {
    const response = await viewComponentMode(id, gnumIsvalid);
    const columns = [
      { key: 'hstnumComponentName', label: 'Component Name' },
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

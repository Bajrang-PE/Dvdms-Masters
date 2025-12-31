import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import MiniTable from '../../../../../commons/Minitable';
import { viewCommittee } from '../../../../../../api/committeeTypeAPI';

export default function ViewCommitteeDetails({ data }) {
  const { hstnumCommitteeTypeId: id, gnumIsvalid } = data.at(0);
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);

  //redux states
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(hidePopup());
  }

  const fetchDetails = useCallback(async () => {
    const response = await viewCommittee(id, gnumIsvalid);
    console.log('Viewing Committee : ', response);
    const columns = [
      { key: 'hstnumCommitteeTypeName', label: 'Committee Name' },
      { key: 'hststrCommitteePurpose', label: 'Committee Purpose' },
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

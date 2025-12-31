import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../../features/commons/popupSlice';
import MiniTable from '../../../../../commons/Minitable';
import { viewBranch } from '../../../../../../api/bankBranchMasterAPI';

export default function ViewBranch({ data }) {
  const { gnumBranchId: branchID, gnumBankId: selectedBankID } = data.at(0);
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);

  //redux states
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(hidePopup());
  }

  const fetchDetails = useCallback(async () => {
    const response = await viewBranch(selectedBankID, branchID);
    console.log('Response', response);
    const columns = [
      { key: 'gstrBankName', label: 'Bank Name' },
      { key: 'gstrBranchName', label: 'Branch Name' },
      { key: 'gstrIfscCode', label: 'IFSC' },
      { key: 'gstrBranchAddress', label: 'Bank Address' },
    ];
    const data = [response.data];

    setCols(columns);
    setRows(data);
  }, [setCols, setRows, branchID, selectedBankID]);

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

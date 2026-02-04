import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../features/commons/popupSlice';
import MiniTable from '../../commons/Minitable';

export const MasterViewModal = (props) => {
    const { data, columns, openPage } = props;

    //redux states
    const dispatch = useDispatch();

    function handleClose() {
        dispatch(hidePopup());
    }

    return (
        <>
            <MiniTable columns={columns} data={data} />
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

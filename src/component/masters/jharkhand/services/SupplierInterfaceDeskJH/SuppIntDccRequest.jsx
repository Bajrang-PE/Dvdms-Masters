import React, { useEffect, useState } from 'react'
import ReactDataTable from '../../../../commons/ReactDataTable'
import { useDispatch, useSelector } from 'react-redux';
import InputBox from '../../../../commons/InputBox';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { getSuppIntDeskDccReqBatchDetails, getSuppIntDeskDeliveryDetails } from '../../../../../api/Jharkhand/services/SupplierInterfaceDeskAPI_JH';

const SuppIntDccRequest = (props) => {
    const { selectedData, actionType } = props;

    const { value: supplierID, label: supplierName } = useSelector(
        (state) => state.jhMst.supplierID
    );

    const SEAT_ID = 14462;
    const dispatch = useDispatch();
    const [poDetailsList, setPoDetailsList] = useState([]);
    const [poDetails, setPoDetails] = useState([]);
    const [values, setValues] = useState({ suppName: "", poType: "", poGenPer: "", poDate: "", PoNumber: "", storeId: "", itemName: "", poOrderQty: "", remarks: "" });

    useEffect(() => {
        if (selectedData?.length > 0) {
            setValues({
                ...values,
                suppName: supplierName,
                poType: selectedData[0]?.sstnum_potype_id,
                poDate: selectedData[0]?.po_date,
                poGenPer: selectedData[0]?.sstnum_potype_id,
                PoNumber: selectedData[0]?.hstnum_po_no,
                storeId: selectedData[0]?.hstnum_store_id,
                poOrderQty: selectedData[0]?.order_quantty,
            })
        }
        getDccReqDetails(supplierID, selectedData[0]?.hstnum_po_no, selectedData[0]?.hstnum_store_id);
    }, [selectedData])

    const getDccReqDetails = (supp, poNum, poStId) => {
        getSuppIntDeskDccReqBatchDetails(998, supp, poNum, poStId)?.then((res) => {
            if (res?.status === 1) {
                console.log('res', res)
                setPoDetails(res?.data?.poDetails);
                setPoDetailsList(res?.data?.batchList);
            }else{
                setPoDetailsList([]);
                setPoDetails({});
            }
        })
    }

    const poDetailsCols = [
        {
            name: <input
                type="checkbox"
                disabled={true}
                className="form-check-input log-select text-start"
            />,
            cell: (row, index) =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="checkbox"
                        // checked={selectedRowId?.index === index}
                        // onChange={(e) => { handleRowSelect(row, index) }}
                        />
                    </span>
                </div>,
            width: "5%"
        },
        {
            name: (<span>Authority Name</span>),
            selector: row => row[0],
            sortable: true,
            wrap: true,
            // width: "20%"
        },
        {
            name: (<span>Batch Name</span>),
            selector: row => row[9],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>MFG Date</span>),
            selector: row => row[1]?.split('#')[0],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Expiry Date</span>),
            selector: row => row[1]?.split('#')[1],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Shelf Life</span>),
            selector: row => row[1]?.split('#')[4],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>In-House Test Report</span>),
            selector: row => row[1]?.split('#')[0] - row[1]?.split('#')[1],
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Quantity</span>),
            cell: (row, index) =>
                <div style={{ position: 'absolute', top: 3, left: 0 }}>
                    <InputBox
                        id="orderQuantiy"
                        className=""
                        type="text"
                        name={"orderQuantiy"}
                        placeholder=""
                    // value={orderQuantity[index] || ""}
                    // disabled={selectedRowId?.index !== index}
                    // onChange={(e) => { handleQuantityChange(index, e?.target?.value); }}
                    // onBlur={handleTotalQuantity}
                    />

                </div>,
            sortable: false,
        },
    ]

    function handleClose() {
        dispatch(hidePopup());
    }

    return (
        <>
            <h3 className="employeeMaster__heading">Dcc Request</h3>
            <div className="rateContractAddJHK__container mb-2">
                <h4 className="rateContractAddJHK__container-heading">
                    Supplier Details
                </h4>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Supplier Name :{" "}
                        <span className="fs-6 fw-normal">{supplierName}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO Type	 :{" "}
                        <span className="fs-6 fw-normal">{poDetails?.po_type}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO Generation Period :{" "}
                        <span className="fs-6 fw-normal">{poDetails?.fin_year}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Purchase Order Date :{" "}
                        <span className="fs-6 fw-normal">{values?.poDate}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Item Name :{" "}
                        <span className="fs-6 fw-normal">{poDetails?.get_item_dtl}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO Order Quantity :{" "}
                        <span className="fs-6 fw-normal">
                            {values?.poOrderQty}
                        </span>{" "}
                    </label>
                </div>
            </div>
            <div className="">
                <ReactDataTable
                    title={''}
                    column={poDetailsCols}
                    data={poDetailsList}
                    isSearchReq={false}
                    isPagination={false}
                />
            </div>

            <div className='py-2 px-10'>
                <label htmlFor="remarks" className="employeeMaster__label">
                    Remarks :
                </label>
                <textarea
                    id="remarks"
                    className="rateContractAddJHK__input"
                    type="text"
                    name={"remarks"}
                    placeholder="Enter here..."
                // value={values?.remarks}
                // onChange={(e) => { dispatcher({ type: "SET_VALUE", name: "remarks", value: e?.target?.value }); }}
                />
            </div>

            <div className="bankmaster__container-controls">
                <button
                    className="bankmaster__container-controls-btn"
                // onClick={handleChange}
                >
                    Save
                </button>
                <button
                    className="bankmaster__container-controls-btn"
                // onClick={handleChange}
                >
                    Reset
                </button>
                <button
                    className="bankmaster__container-controls-btn"
                    onClick={handleClose}
                >
                    Close
                </button>
            </div>
        </>
    )
}

export default SuppIntDccRequest

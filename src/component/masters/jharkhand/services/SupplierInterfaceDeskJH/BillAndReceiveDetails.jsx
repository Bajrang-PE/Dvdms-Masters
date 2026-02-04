import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSuppIntDeskBillDetails, getSuppIntDeskDeliveryDetails, getSuppIntDeskReceiveDetails } from '../../../../../api/Jharkhand/services/SupplierInterfaceDeskAPI_JH';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import ReactDataTable from '../../../../commons/ReactDataTable';

const BillAndReceiveDetails = (props) => {

    const { selectedData, actionType } = props;

    const { value: supplierID, label: supplierName } = useSelector(
        (state) => state.jhMst.supplierID
    );

    const SEAT_ID = 14462;
    const dispatch = useDispatch();
    const [poDetailsList, setPoDetailsList] = useState([]);
    const [poDetails, setPoDetails] = useState([]);
    const [values, setValues] = useState({ suppName: "", poType: "", poGenPer: "", poDate: "", PoNumber: "", storeId: "", itemName: "", poOrderQty: "", remarks: "", poDelQty: "" });
    const [selectedRow, setSelectedRow] = useState("");

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
                poOrderQty: selectedData[0]?.tot_order_qty,
                poDelQty: selectedData[0]?.dispatched_qty,
            })
        }
        if (actionType === "billDtl") {
            getBillDetails(selectedData[0]?.hstnum_po_no, selectedData[0]?.hstnum_store_id);
        } else {
            getReceiveDetails(selectedData[0]?.hstnum_po_no, selectedData[0]?.hstnum_store_id);
        }
    }, [selectedData])

    const getReceiveDetails = (poNum, poStId) => {
        getSuppIntDeskReceiveDetails(998, poStId, poNum)?.then((res) => {
            if (res?.status === 1) {
                setPoDetails(res?.data?.poDetails);
                setPoDetailsList(res?.data?.prevDeliveryDtls)
            }
        })
    }

    const getBillDetails = (poNum, poStId) => {
        getSuppIntDeskBillDetails(998, poStId, poNum)?.then((res) => {
            if (res?.status === 1) {
                setPoDetails(res?.data?.poDetails);
                setPoDetailsList(res?.data?.prevDeliveryDtls)
            }
        })
    }


    const billDtlsCols = [
        {
            name: (<span>Schedule No.</span>),
            selector: row => row?.hstnumScheduleNo,
            sortable: true,
            wrap: true,
            center: true
            // width: "20%"
        },
        {
            name: (<span>Consignee Store Name</span>),
            selector: row => row?.consigneeName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Delivery No</span>),
            selector: row => row?.deliveryNo,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Delivery Date</span>),
            selector: row => "row",
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Transporter Name</span>),
            selector: row => row?.hststrTransporterName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Lorry Number</span>),
            selector: row => row?.hststrLrno,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Status</span>),
            selector: row => row?.challanStatus,
            sortable: true,
            wrap: true,
        },
    ]

    const suppReceiveCols = [
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
                            type="radio"
                            checked={selectedRow?.pkey === row?.pkey}
                            onChange={(e) => { setSelectedRow(row) }}
                        />
                    </span>
                </div>,
            width: "5%"
        },
        {
            name: (<span>Schedule No.</span>),
            selector: row => row?.hstnumScheduleNo,
            sortable: true,
            wrap: true,
            center: true
            // width: "20%"
        },
        {
            name: (<span>Consignee Store Name</span>),
            selector: row => row?.consigneeName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Delivery No</span>),
            selector: row => row?.deliveryNo,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Delivery Date</span>),
            selector: row => "row",
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Transporter Name</span>),
            selector: row => row?.hststrTransporterName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Lorry Number</span>),
            selector: row => row?.hststrLrno,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Status</span>),
            selector: row => row?.challanStatus,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Store Received Date</span>),
            selector: row => "row",
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Rec. Dtl.</span>),
            selector: row => row?.hststrBillFileName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span>Action</span>),
            cell: (row, index) =>
                <button
                    style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={() => alert('bbb')}
                >
                    view
                </button>,
            sortable: true,
            wrap: true,
        },
    ]

    // console.log('poDetailsList', poDetailsList)

    function handleClose() {
        dispatch(hidePopup());
    }

    return (
        <>
            <h3 className="employeeMaster__heading"> {actionType === "recDtl" ? 'Receive Details' : 'Bill Details'}</h3>
            <div className="rateContractAddJHK__container mb-3 pb-3">
                <h4 className="rateContractAddJHK__container-heading">
                    {actionType === "recDtl" ? 'Supplier Receive Details' : 'Supplier Bill Details'}
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
                        PO No :{" "}
                        <span className="fs-6 fw-normal">{`${poDetails?.sststr_po_prefix}(${poDetails?.hstnum_po_no})`}</span>{" "}
                    </label>
                </div>
                {actionType === "billDtl" && <>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Drug Name :{" "}
                            <span className="fs-6 fw-normal">{poDetails?.get_item_dtl}</span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            Total PO QTY :{" "}
                            <span className="fs-6 fw-normal">
                                {values?.poOrderQty}
                            </span>{" "}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="" className="rateContractAddJHK__label mb-0">
                            PO Delivered QTY :{" "}
                            <span className="fs-6 fw-normal">
                                {values?.poDelQty}
                            </span>{" "}
                        </label>
                    </div>
                </>}
            </div>
            <div className="mb-4">
                <ReactDataTable
                    title={''}
                    column={actionType === "recDtl" ? suppReceiveCols : billDtlsCols}
                    data={poDetailsList}
                    isSearchReq={false}
                    isPagination={false}
                />
            </div>
            {actionType === "billDtl" &&
                <div className="employeeMaster__container">
                    <h4 className="employeeMaster__container-heading">Bill Upload</h4>

                    {!poDetails?.hststr_bill_upload_file_name ?
                        <div className='pt-3'>
                            <label htmlFor="file" className="employeeMaster__label required-label">
                                Upload Bill :
                            </label>
                            <input
                                className="rateContractAddJHK__fileUpload"
                                type="file"
                                placeholder='Choose file...'
                            // onChange={onFileChange}
                            />
                        </div>
                        :
                        <div className='pt-3 d-flex'>
                            <label htmlFor="file" className="employeeMaster__label required-label mx-2">
                                Download Bill :
                            </label>
                            <span
                                style={{ color: 'blue', cursor: 'pointer' }}
                                onClick={() => alert('bbb')}
                            >
                                {poDetails?.hststr_bill_upload_file_name}
                            </span>
                        </div>
                    }

                </div>
            }


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

export default BillAndReceiveDetails

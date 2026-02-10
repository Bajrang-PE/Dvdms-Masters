import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addSuppIntDeskBillDetails, getSuppIntDeskBillDetails, getSuppIntDeskDeliveryDetails, getSuppIntDeskReceiveDetails, getSuppIntDeskVeiwDeldetail } from '../../../../../api/Jharkhand/services/SupplierInterfaceDeskAPI_JH';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import ReactDataTable from '../../../../commons/ReactDataTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import { parseDate } from '../../../../commons/utilFunctions';

const BillAndReceiveDetails = (props) => {

    const { selectedData, actionType } = props;

    const { value: supplierID, label: supplierName } = useSelector(
        (state) => state.jhMst.supplierID
    );

    const SEAT_ID = 14462;
    const dispatch = useDispatch();
    const [poDetailsList, setPoDetailsList] = useState([]);
    const [poDetails, setPoDetails] = useState([]);
    const [values, setValues] = useState({ suppName: "", poType: "", poGenPer: "", poDate: "", PoNumber: "", storeId: "", itemName: "", poOrderQty: "", remarks: "", poDelQty: "", billFile: "" });
    const [selectedRow, setSelectedRow] = useState("");
    const [viewModal, setViewModal] = useState(false);
    const [viewDetails, setViewDetails] = useState([]);

    const onFileChange = (e) => {
        const { name, files } = e?.target;
        setValues({ ...values, [name]: files[0] });
    };

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
            selector: row => parseDate(row?.gdtEntryDate),
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
            selector: row => parseDate(row?.gdtEntryDate),
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
            selector: row => parseDate(row?.hstdtChallanDate),
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
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white py-0 d-flex gap-1" >
                        <button className="btn btn-success btn-sm px-1 py-0 rounded rounded-5 fs-13" title={"View Record"} onClick={() => { viewRecord(row) }}>
                            <FontAwesomeIcon icon={faEye} size="xs" />
                        </button>
                    </span>
                </div>,
            sortable: true,
            wrap: true,
        },
    ]

    // console.log('poDetailsList', poDetailsList)

    function handleClose() {
        dispatch(hidePopup());
    }

    const onCloseModal = () => {
        setViewModal(false);
        setViewDetails([]);
    }

    const saveBillDetails = () => {

        const val = {
            gnumHospitalCode: 998,
            // hstnumDeliveryNo: "",
            hstnumPoNo: selectedData[0]?.hstnum_po_no,
            // hstnumScheduleNo: "",
            // hstnumStoreId: selectedData[0]?.hstnum_store_id

        }
        console.log('val', val)
        const formData = new FormData();

        formData.append("supplierDeliveryDTO ", JSON.stringify(val));

        if (values?.billFile) {
            formData.append("file", values?.billFile, values?.billFile?.name);
        }

        addSuppIntDeskBillDetails(formData)?.then((data) => {
            if (data?.status === 1) {
                alert('Added Successfully');
                // dispatch(hidePopup());
            } else {
                alert(data?.message);
            }
            console.log('data', data)
        })
    }

    const viewRecord = (row) => {
        console.log('row', row)
        getSuppIntDeskVeiwDeldetail(998, row?.hstnumPoNo, row?.hstnumScheduleNo, row?.hstnumStoreId, row?.hstnumDeliveryNo)?.then((res) => {
            if (res?.status === 1) {
                setViewDetails(res?.data)
                setViewModal(true);
            } else {
                setViewDetails([])
                setViewModal(false);
            }
        })
    }

    console.log('poDetails', poDetails)

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
                                name='billFile'
                                placeholder='Choose file...'
                                onChange={onFileChange}
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
                {actionType === "recDtl" &&
                    <button
                        className="bankmaster__container-controls-btn"
                        onClick={null}
                    >
                        Save
                    </button>
                }
                {(actionType === "billDtl" && !poDetails?.hststr_bill_upload_file_name) &&
                    <button
                        className="bankmaster__container-controls-btn"
                        onClick={saveBillDetails}
                    >
                        Save
                    </button>
                }
                <button
                    className="bankmaster__container-controls-btn"
                    onClick={handleClose}
                >
                    Close
                </button>
            </div>

            {viewModal &&
                <Modal show={true} onHide={onCloseModal} size={'xl'} dialogClassName="dialog-min" style={{ zIndex: "1201" }}>
                    <Modal.Header closeButton className='py-1 px-2 cms-login'>

                        <b><h6 className='m-1 p-0'>
                            {`Drug Details`}</h6></b>

                    </Modal.Header>
                    <Modal.Body className='px-2 py-1'>
                        <table className="table text-center mb-0 table-bordered" style={{ borderColor: "#23646e" }}>
                            <thead className="text-white">
                                <tr className='m-0' style={{ fontSize: "13px", verticalAlign: "middle" }}>
                                    <th className='p-2'>{'Drug Name'}</th>
                                    <th className='p-2'>{'Batch No.'}</th>
                                    <th className='p-2'>{'Manufacturer Name'}</th>
                                    <th className='p-2'>{'Mfg. Date'}</th>
                                    <th className='p-2'>{'Expiry Date'}</th>
                                    <th className='p-2'>{'Supply Qty.'}</th>
                                    <th className='p-2'>{'Programme Name'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {viewDetails?.length > 0 && viewDetails?.map((dt, index) => (
                                    <tr className='' style={{ fontSize: "12px" }} key={index}>
                                        <td className='p-2'>{dt?.item_name}</td>
                                        <td className='p-2 '>{dt?.hststr_batch_no}</td>
                                        <td className='p-2'>{dt?.get_supp_dtl}</td>
                                        <td className='p-2'>{dt?.manuf_date}</td>
                                        <td className='p-2'>{dt?.exp_date}</td>
                                        <td className='p-2'>{dt?.supp_qty}</td>
                                        <td className='p-2 fw-bolder text-info-emphasis text-center'>
                                            {dt?.prg_name}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <hr className='my-2' />
                        <div className='text-center'>
                            <button className='btn cms-login-btn m-1 btn-sm' onClick={onCloseModal}>
                                <i className="fa fa-broom me-1"></i> Close
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>

            }
        </>
    )
}

export default BillAndReceiveDetails

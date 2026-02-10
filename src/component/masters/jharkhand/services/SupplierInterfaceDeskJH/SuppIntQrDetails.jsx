import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSuppIntDeskDeliveryDetails, getSuppIntDeskQRBatchDetails } from '../../../../../api/Jharkhand/services/SupplierInterfaceDeskAPI_JH';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import ReactDataTable from '../../../../commons/ReactDataTable';
import BottomButtons from '../../../../commons/BottomButtons';

const SuppIntQrDetails = (props) => {
    const { selectedData, actionType } = props;

    const { value: supplierID, label: supplierName } = useSelector(
        (state) => state.jhMst.supplierID
    );

    const SEAT_ID = 14462;
    const dispatch = useDispatch();
    const [poDetails, setPoDetails] = useState([]);
    const [values, setValues] = useState({ suppName: "", poType: "", poGenPer: "", poDate: "", PoNumber: "", storeId: "", itemName: "", poOrderQty: "", remarks: "" });
    const [qrExistingData, setQrExistingData] = useState([]);

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
        getQRBatchDetails(supplierID, selectedData[0]?.hstnum_po_no, selectedData[0]?.hstnum_store_id);
    }, [selectedData])


    const getQRBatchDetails = (supp, poNum, poStId) => {
        getSuppIntDeskQRBatchDetails(998, supp, poNum, poStId)?.then((res) => {
            if (res?.status === 1) {
                setPoDetails(res?.data?.poDetails);
                setQrExistingData(res?.data?.batchList)
            } else {
                setPoDetails({});
                setQrExistingData([]);
            }
        })
    }

    function handleClose() {
        dispatch(hidePopup());
    }

    const columns = [
        {
            name: (<span className='text-center'>Schedule No.</span>),
            selector: row => row?.hstnumScheduleNo,
            sortable: true,
            wrap: true,
            width: "9%"
        },
        {
            name: (<span className='text-center'>Consignee Store Name</span>),
            selector: row => row?.consigneeName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Delivery No</span>),
            selector: row => row?.deliveryNo,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Supplier Invoice No.</span>),
            selector: row => row?.hststrSuppReceiptNo,
            sortable: true,
            wrap: true,
            cell: (row, index) =>
                <span
                    style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={() => alert('bbb')}
                >
                    {row?.hststrSuppReceiptNo}
                </span>
        },
        {
            name: (<span className='text-center'>Supplier Invoice Date</span>),
            selector: row => row?.hstdtSuppReceiptDate,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Transporter Name</span>),
            selector: row => row?.hststrTransporterName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Lorry Number</span>),
            selector: row => row?.hststrLrno,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Status</span>),
            selector: row => row?.challanStatus,
            sortable: true,
            wrap: true,
        },

    ]

    const qrBatchescolumns = [
        {
            name: (<span className='text-center'>Batch No.</span>),
            selector: row => row?.hstnumScheduleNo,
            sortable: true,
            wrap: true,
            // width: "9%"
        },
        {
            name: (<span className='text-center'>Mfg. Date</span>),
            selector: row => row?.consigneeName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Exp. Date</span>),
            selector: row => row?.deliveryNo,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Supplied Qty.</span>),
            selector: row => row?.hstdtSuppReceiptDate,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>QR Code</span>),
            selector: row => row?.hststrTransporterName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Status</span>),
            selector: row => row?.challanStatus,
            sortable: true,
            wrap: true,
        },

    ]

    const existingQrcolumns = [
        {
            name: (<span className='text-center'>Sr No.</span>),
            selector: row => row?.hstnumScheduleNo,
            sortable: true,
            wrap: true,
            width: "9%"
        },
        {
            name: (<span className='text-center'>Batch No.</span>),
            selector: row => row?.consigneeName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Carton No.</span>),
            selector: row => row?.deliveryNo,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>Carton Qty.</span>),
            selector: row => row?.hstdtSuppReceiptDate,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>MFD.</span>),
            selector: row => row?.hststrTransporterName,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>EXP Date</span>),
            selector: row => row?.challanStatus,
            sortable: true,
            wrap: true,
        },
        {
            name: (<span className='text-center'>QR Code</span>),
            selector: row => row?.challanStatus,
            sortable: true,
            wrap: true,
        },

    ]

    console.log('values', values);
    console.log('poDetails', poDetails);

    return (
        <>
            <h3 className="employeeMaster__heading">QR Details</h3>
            <div className="rateContractAddJHK__container mb-2 pb-2">
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
                        PO No. :{" "}
                        <span className="fs-6 fw-normal">{`${poDetails?.sststr_po_prefix}(${poDetails?.hstnum_po_no})`}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Supplier Bank Deatils :{" "}
                        <span className="fs-6 fw-normal">
                            {values?.suppBankDtls}
                        </span>{" "}
                    </label>
                </div>
            </div>

            <div className="">
                <ReactDataTable
                    title={''}
                    column={columns}
                    data={qrExistingData}
                    isSearchReq={false}
                    isPagination={false}
                />
            </div>

            <div className="flex items-center mb-2 mt-6">
                <div className="w-10 border-1 border-[#097080]"></div>
                <span className="mx-3 font-bold text-[#097080]">
                    QR Batches Details
                </span>
                <div className="flex-grow border-1 border-[#097080]"></div>
            </div>

            <div className="">
                <ReactDataTable
                    title={'qrBatchescolumns'}
                    column={qrBatchescolumns}
                    data={[]}
                    isSearchReq={false}
                    isPagination={false}
                />
            </div>

            <div className="flex items-center mb-2 mt-6">
                <div className="w-10 border-1 border-[#097080]"></div>
                <span className="mx-3 font-bold text-[#097080]">

                    Existing QR
                </span>
                <div className="flex-grow border-1 border-[#097080]"></div>
            </div>

            <div className="">
                <ReactDataTable
                    title={'existingQrcolumns'}
                    column={existingQrcolumns}
                    data={[]}
                    isSearchReq={false}
                    isPagination={false}
                />
            </div>

            <BottomButtons isSave={true} isReset={true} isClose={true} onSave={null} onReset={null} onClose={handleClose} />
        </>
    )
}

export default SuppIntQrDetails

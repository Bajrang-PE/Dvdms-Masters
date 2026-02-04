import React, { useEffect, useRef, useState } from 'react'
import ServiceNavbar from '../../../commons/ServiceNavbar';
import { ComboDropDown } from '../../../commons/FormElements';
import DataTable from '../../../commons/Datatable';
import { useDispatch } from 'react-redux';
import { setSupplier } from '../../../../features/jharkhand/JH_Slice';
import { showPopup } from '../../../../features/commons/popupSlice';
import { getSuppIntDeskBankDetails, getSuppIntDeskListData, getSuppIntDeskSuppliersCmb } from '../../../../api/Jharkhand/services/SupplierInterfaceDeskAPI_JH';
import { MasterViewModal } from '../MasterViewModal';
import DeliveryDetails from './SupplierInterfaceDeskJH/DeliveryDetails';
import SuppIntDccRequest from './SupplierInterfaceDeskJH/SuppIntDccRequest';
import BillAndReceiveDetails from './SupplierInterfaceDeskJH/BillAndReceiveDetails';
import SuppIntBatchDetails from './SupplierInterfaceDeskJH/SuppIntBatchDetails';
import SuppIntQrDetails from './SupplierInterfaceDeskJH/SuppIntQrDetails';


const SupplierInterfaceDeskJH = () => {

    const statusList = [
        { label: "All", value: "0" },
        { label: "Delivery Pending", value: "2" },
        { label: "Receive Pending", value: "6" },
        { label: "Payment Pending", value: "3" },
        { label: "Rejected", value: "4" },
        { label: "Closed", value: "5" },
        { label: "Auto Cancel", value: "7" },
        { label: "Forcefully Closed", value: "9" }
    ];

    const SEAT_ID = 14462;
    const dataTableRef = useRef();
    const dispatch = useDispatch();
    const [suppName, setSuppName] = useState('');
    const [activeStatus, setActiveStatus] = useState('0');
    const [suppliersDrpList, setSuppliersDrpList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [selectedRowRc, setSelectedRowRc] = useState(null);
    const [userSelection, setUserSelection] = useState("");
    const [bankListData, setBankListData] = useState([]);

    const componentsList = [
        { mappingKey: "batchDetails", componentName: (props) => (<SuppIntBatchDetails selectedData={selectedRowRc} actionType={'bankDetail'} />) },
        { mappingKey: "bankDetail", componentName: (props) => (<MasterViewModal data={bankListData} columns={bankColumns} openPage={'bankDetail'} />) },
        { mappingKey: "delivery", componentName: (props) => (<DeliveryDetails selectedData={selectedRowRc} actionType={'delivery'} />) },
        { mappingKey: "View", componentName: (props) => (<MasterViewModal data={bankListData} columns={bankColumns} openPage={'bankDetail'} />) },
        { mappingKey: "dccReq", componentName: (props) => (<SuppIntDccRequest selectedData={selectedRowRc} actionType={'dccReq'} />) },
        { mappingKey: "recDtl", componentName: (props) => (<BillAndReceiveDetails selectedData={selectedRowRc} actionType={'recDtl'} />) },
        { mappingKey: "billDtl", componentName: (props) => (<BillAndReceiveDetails selectedData={selectedRowRc} actionType={'billDtl'} />) },
        { mappingKey: "qrDtl", componentName: (props) => (<SuppIntQrDetails selectedData={selectedRowRc} actionType={'qrDtl'} />) },
    ];

    const buttonDataset = [

        { label: "Batch Details", onClick: (() => { handleActionComp('batchDetails') }), icon: " " },
        { label: "Bank Detail", onClick: (() => { handleActionComp('bankDetail') }), icon: " " },

        ...(selectedRowRc?.length > 0 ?
            [
                { label: "Dcc Request", onClick: (() => { handleActionComp('dccReq') }), icon: " " },
                { label: "Receive Details", onClick: (() => { handleActionComp('recDtl') }), icon: " " },
                { label: "Bill Details", onClick: (() => { handleActionComp('billDtl') }), icon: " " },
                { label: "QR Details", onClick: (() => { handleActionComp('qrDtl') }), icon: " " },
                { label: "Delivery", onClick: (() => { handleActionComp('delivery') }), icon: " " },
                { label: "View", onClick: (() => { handleActionComp('View') }), icon: " " },
                { label: "Print", onClick: (() => { handleActionComp('Print') }), icon: " " },
            ]
            : []
        ),
    ];

    function handleActionComp(key) {
        setUserSelection(key);
        dispatch(showPopup());
    }

    const handleRowSelect = (row) => {
        setSelectedRowRc(row);
    }

    const getSupplierNameDrpData = () => {
        getSuppIntDeskSuppliersCmb(998, SEAT_ID)?.then((res) => {
            if (res?.status === 1) {
                const dtt = res?.data?.map((dt) => ({
                    value: dt?.hstnum_supplier_id,
                    label: dt?.supplier_name
                }))
                setSuppliersDrpList(dtt);
                setSuppName(dtt?.at(0)?.value);
                dispatch(setSupplier(dtt?.at(0)));
            } else {
                setSuppliersDrpList([]);
            }
        })
    }

    const getListData = (spnm, status) => {
        getSuppIntDeskListData(998, spnm, status)?.then((res) => {
            if (res?.status === 1) {
                setTableData(res?.data);
            } else {
                setTableData([]);
            }
        })
    }

    const getBankDetails = (suppId) => {
        getSuppIntDeskBankDetails(998, suppId)?.then((res) => {
            if (res?.status === 1) {
                setBankListData([res?.data]);
            } else {
                setBankListData([]);
            }
        })
    }


    useEffect(() => {
        getSupplierNameDrpData();
    }, [])

    useEffect(() => {
        if (suppName && activeStatus) {
            getListData(suppName, activeStatus);
            getBankDetails(suppName);
        }
    }, [suppName, activeStatus])

    const columns = [
        { header: "PO No.", field: "hstnum_po_no" },
        { header: "Authority Name", field: "store_name" },
        { header: "PO Approval Date", field: "po_date" },

        ...((activeStatus !== "3" && activeStatus !== "5" && activeStatus !== "9") ? [
            { header: "Drug Name", field: "item_name" },
            { header: "ordered Qty.(A)", field: "order_quantty" },
            { header: "(Dispatch-Brkg.) Qty.(B)", field: "dispatched_qty" },
            { header: "( Receive-Brkg-Supplier Return.) Qty.(C)", field: "received_qty" },
            { header: "Balance Qty.(A-C)", field: "bal_qty" },

        ] : []),

        ...((activeStatus === "3" || activeStatus === "5" || activeStatus === "9") ? [
            { header: "Po Value", field: "hstnum_po_net_amount" },
            { header: "Penalty Amt", field: "hstnum_penelty_amt" },
            { header: "Recovery Amt", field: "hstnum_recovery_amt" },
            { header: "Paid Amount", field: "supplyFlag" },
        ] : [])
    ];

    const bankColumns = [
        { label: 'Bank Name :', key: 'bank_name' },
        { label: 'Bank Branch Name :', key: 'branch_id' },
        { label: 'Bank IFSC Code :', key: 'ifsc_code' },
        { label: 'Account Number :', key: 'account_no' },
        { label: 'Bank Address :', key: 'bank_address' },
    ]

    return (
        <>
            <ServiceNavbar
                buttons={buttonDataset}
                heading={"Supplier Interface Desk"}
                userSelection={userSelection}
                componentsList={componentsList}
                isLargeDataset={true}
                filtersVisibleOnLoad={false}
            >
                <div className="rateContract__filterSection">
                    <div className="rateContract__filterSection--filters">
                        <div className="rateContract__container mb-4">
                            <ComboDropDown
                                options={suppliersDrpList}
                                onChange={(e) => {
                                    setSuppName(e.target.value);
                                    dispatch(
                                        setSupplier(suppliersDrpList?.find((dt) => dt?.value == e.target.value))
                                    );
                                }}
                                value={suppName}
                                label={"Supplier Name"}
                                addOnClass="rateContract__container--dropdown"
                            />
                            <ComboDropDown
                                options={statusList}
                                onChange={(e) => setActiveStatus(e.target.value)}
                                value={activeStatus}
                                label={"Status"}
                                addOnClass="rateContract__container--dropdown"
                            />
                        </div>
                    </div>
                </div>
            </ServiceNavbar>

            <div>
                <DataTable
                    masterName={"Supplier Interface Desk"}
                    ref={dataTableRef}
                    columns={columns}
                    data={tableData}
                    handleRowSelect={handleRowSelect}
                />
            </div>
        </>
    );
}

export default SupplierInterfaceDeskJH

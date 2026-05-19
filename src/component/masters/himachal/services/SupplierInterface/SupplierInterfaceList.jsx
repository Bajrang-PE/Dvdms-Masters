import React, { useEffect, useRef, useState } from 'react'
import ServiceNavbar from '../../../../commons/ServiceNavbar';
import { ComboDropDown } from '../../../../commons/FormElements';
import DataTable from '../../../../commons/Datatable';
import { useDispatch } from 'react-redux';
import { setContractDetails, setStore } from '../../../../../features/himachal/Himachal_Slice';

import PieChart from '../../../../commons/PieChart';
import { getHpRcStatusCmb, getHpRcSuppliersCmb, getHpSupplierListData } from '../../../../../api/Himachal/services/suppInterfaceAPI_HP';
import { chartColorArr } from '../../../common/StaticData';
import { parseDate } from '../../../../commons/utilFunctions';

import { ToastAlert } from '../../../../../utils/Toast';
import SupplierBatchDetails from './SupplierBatchDetails';
import { showPopup } from '../../../../../features/commons/popupSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faTruck,
    faBoxOpen,
    faFileInvoice,
    faEye,
    faUpload
} from "@fortawesome/free-solid-svg-icons";
import SupplierDeliveryDetails from './SupplierDeliveryDetails';
import SupplierReceiveDetails from './SupplierReceiveDetails';
import SupplierBillDetails from './SupplierBillDetails';
import SupplierViewDetails from './SupplierViewDetails';
import SupplierFDRUpload from './SupplierFDRUpload';
import SupplierVreifyBankDetail from './SupplierVreifyBankDetail';

const SupplierInterfaceList = () => {
    const SEAT_ID = 14409;

    const dataTableRef = useRef();
    const dispatch = useDispatch();

    const [suppliersDrpDt, setSuppliersDrpDt] = useState([]);
    const [statusDrpDt, setStatusDrpDt] = useState([]);

    const [selectedSupplier, setSelectedSupplier] = useState('0');
    const [activeStatus, setActiveStatus] = useState("ALL");

    const [pieChartData, setPieChartData] = useState([]);
    const [selectedRowRc, setSelectedRowRc] = useState(null);
    const [userSelection, setUserSelection] = useState("");
    const [SupplierListData, setSupplierListData] = useState([]);

    const actionBtn = (type, icon, color, row) => (
        <div
            onClick={() => handleActionComp(type, row)}
            title={type}
            style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "all 0.2s ease"
            }}
        >
            <FontAwesomeIcon
                icon={icon}
                color={color}
                style={{
                    fontSize: "16px",
                    transform: "scale(1.2)"
                }}
            />
        </div>
    );

    const columns = [
        { header: "PO NO", field: "numPoNo" },
        { header: "Authority Name", field: "strStoreName" },
        { header: "PO Approval Date", field: "dtApprDate" },
        { header: "Drug Name", field: "strItemName" },
        { header: "Ordered Qty.(A)", field: "numOrderQty" },
        { header: "Disp. Qty(B)", field: "numDispatchedQty" },
        { header: "(Rej.+Short.)Qty.(C)", field: "numRejectedQty" },
        { header: "Order Amount", field: "numPoNetAmount" },
        { header: "Bal.Qty.(A-(B-C))", field: "strBalanceQty" },

        // {
        //     header: "Bal.Qty.(A-(B-C))", field: "challanPending",
        //     isJSX: true,
        //     ele: (row) => (
        //         <div style={{
        //             display: "flex",
        //             gap: "4px",
        //             flexWrap: "wrap"
        //         }}>
        //             {row?.numOrderQty || 0 - (row?.numDispatchedQty || 0 - row?.numRejectedQty || 0)}
        //         </div>
        //     )
        // },
        { header: "No.of Days.", field: "numNoOfDays" },

        {
            header: "Penalty (46-60 days)", field: "status",
            isJSX: true,
            ele: (row) => {
                const days = row.numNoOfDays || 0;
                const amount = row.numPoNetAmount || 0;

                if (days >= 46 && days <= 60) {
                    const weeks = Math.ceil((days - 45) / 7);
                    return amount * 0.05 * weeks;
                }
                return 0;
            }
     
        },

        {
            header: "Penalty (>60 days)", field: "penaltyAmountAfter60DaysStatus",
                 isJSX: true,
            ele: (row) => {
                const days = row.numNoOfDays || 0;
                const amount = row.numPoNetAmount || 0;

                if (days > 60) {
                     return amount * 0.10; // example logic
                 }
                return 0;
            }
          
        },


        {
    header: "Action",
    isJSX: true,
    ele: (row) => {
        const isSelected = selectedRowRc && selectedRowRc.id === row.id;

        // Agar row selected nahi hai toh simple text dikhao
        if (!isSelected) {
            return <span style={{ color: '#ccc', fontSize: '12px' }}>Select row to act</span>;
        }

        // Status based filtering logic
        // Yahan 'activeStatus' wo state hai jo aapne ComboDropDown mein set ki hai
        const showAcceptance = activeStatus === "ALL";
        const showDelivery = activeStatus === "ALL" || activeStatus === "DELIVERY_PENDING"; // Maan lijiye value ye hai
        const showReceive = activeStatus === "ALL" || activeStatus === "RECEIVE_PENDING";
        const showBill = activeStatus === "ALL" || activeStatus === "RECEIVE_PENDING";
        const showView = true; // Hamesha dikhega (All, Closed, Auto Cancel etc.)
        const showFDR = true;  // Hamesha dikhega

        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                    justifyItems: "center",
                    minHeight: "32px"
                }}
            >
                {showAcceptance && actionBtn("ACCEPTANCE", faCheck, "#22c55e", row)}
                {showDelivery && actionBtn("DELIVERYDETAIL", faTruck, "#f59e0b", row)}
                {showReceive && actionBtn("RECEIVEDETAIL", faBoxOpen, "#0ea5e9", row)}
                {showBill && actionBtn("BILLDETAIL", faFileInvoice, "#3b82f6", row)}
                {showView && actionBtn("VIEW_DETAIL", faEye, "#6366f1", row)}
                {showFDR && actionBtn("FDRUPLOAD", faUpload, "#ef4444", row)}
            </div>
        );
    }
}
    ];



    const componentsList = [
        { mappingKey: "Tender", componentName: () => <RateContractTenderHP suppliers={suppliersDrpDt} /> },
        { mappingKey: "add", componentName: () => <SupplierBatchDetails suppliers={suppliersDrpDt} selectedSupplier={suppliersDrpDt?.find(dt => dt?.value == selectedSupplier)} /> },
        { mappingKey: "modify", componentName: () => <RcModifyViewFormHP selectedData={selectedRowRc} actionMode={'modify'} /> },
        { mappingKey: "view", componentName: () => <RcModifyViewFormHP selectedData={selectedRowRc} actionMode={'view'} /> },
     //   { mappingKey: "BATCH_DETAILS", componentName: () => <SupplierBatchDetails rowData={selectedRowRc} /> },
        { mappingKey: "BATCH_DETAILS", componentName: () => (<SupplierBatchDetails rowData={selectedRowRc} suppliers={suppliersDrpDt} selectedSupplier={suppliersDrpDt?.find(dt => dt?.value == selectedSupplier)} />) },

        { mappingKey: "ACCEPTANCE", componentName: () => <SupplierAcceptance rowData={selectedRowRc} /> },
        //{ mappingKey: "DELIVERYDETAIL", componentName: () => <SupplierDeliveryDetails rowData={selectedRowRc} /> },
        { mappingKey: "DELIVERYDETAIL", componentName: () => (<SupplierDeliveryDetails rowData={selectedRowRc} suppliers={suppliersDrpDt} selectedSupplier={suppliersDrpDt?.find(dt => dt?.value == selectedSupplier)} />) },
     //   { mappingKey: "RECEIVEDETAIL", componentName: () => <SupplierReceiveDetails rowData={selectedRowRc} /> },
        { mappingKey: "RECEIVEDETAIL", componentName: () => (<SupplierReceiveDetails rowData={selectedRowRc} suppliers={suppliersDrpDt} selectedSupplier={suppliersDrpDt?.find(dt => dt?.value == selectedSupplier)} />) },

      //  { mappingKey: "BILLDETAIL", componentName: () => <SupplierBillDetails rowData={selectedRowRc} /> },
        { mappingKey: "BILLDETAIL", componentName: () => (<SupplierBillDetails rowData={selectedRowRc} suppliers={suppliersDrpDt} selectedSupplier={suppliersDrpDt?.find(dt => dt?.value == selectedSupplier)} />) },

     //   { mappingKey: "VIEW_DETAIL", componentName: () => <SupplierViewDetails rowData={selectedRowRc} /> },
        { mappingKey: "VIEW_DETAIL", componentName: () => (<SupplierViewDetails rowData={selectedRowRc} suppliers={suppliersDrpDt} selectedSupplier={suppliersDrpDt?.find(dt => dt?.value == selectedSupplier)} />) },

        { mappingKey: "FDRUPLOAD", componentName: () => <SupplierFDRUpload rowData={selectedRowRc} /> },
      //  { mappingKey: "FDRUPLOAD", componentName: () => (<SupplierViewDetails rowData={selectedRowRc} suppliers={suppliersDrpDt} selectedSupplier={suppliersDrpDt?.find(dt => dt?.value == selectedSupplier)} />) },

        { mappingKey: "VERIFY_BANK_DETAIL",componentName: () => (<SupplierVreifyBankDetail rowData={selectedRowRc} selectedSupplier={suppliersDrpDt?.find(dt => dt?.value == selectedSupplier)} /> )}, 
    
    ];

    const buttonDataset = [
        { label: "Batch Details", onClick: (() => { handleActionComp('add') }) },
        { label: "Report", onClick: (() => { handleActionComp('Tender') }) },
     //   { label: "Verify Bank Detail", onClick: (() => { handleActionComp('view') }) },
        { label: "Verify Bank Detail", onClick: (() => { handleActionComp('VERIFY_BANK_DETAIL') }) },
   
    ];




  function handleActionComp(key, row = null) {
    const finalRow = row || selectedRowRc;

    if (!finalRow && key !== "add" && key !== "Tender" && key !== "view" && key !== "VERIFY_BANK_DETAIL") {
        ToastAlert("Please select a row first", "warning");
        return;
    }

    setSelectedRowRc(finalRow || null);
    setUserSelection(key);
    dispatch(showPopup());
}



    const handleRowSelect = (row) => {
        console.log("Selected Row Data:", row);

        if (row && row.length > 0) {
            setSelectedRowRc(row[0]); // 
        } else {
            setSelectedRowRc(null); // 
        }
    };




    const getSupplierListDataHandler = (supplierId, status) => {
        getHpSupplierListData(998, supplierId, status)
            .then((res) => {
                if (res?.status === 1 && Array.isArray(res?.data)) {
                    const formattedData = res.data.map((item, index) => ({
                        ...item,
                        id: item?.pono || index + 1,
                        approvalDate: item?.approvalDate ? String(item.approvalDate).split(" ")[0] : "",
                        poDate: item?.poDate || "",
                        pono: item?.pono || "",
                        storeId: item?.storeId || item?.storeid || item?.authorityId || "",
                        storeName: item?.storeName || "",
                        supplierId: item?.supplierId || item?.supplierid || "",
                        supplierName: item?.supplierName || "",
                        itemName: item?.itemName || "",
                        orderQty: item?.orderQty || 0,
                        dispatchedQty: item?.dispatchedQty || 0,
                        rejectedQty: item?.rejectedQty || 0,
                        balanceQty: item?.strBalanceQty || 0,
                        challanPending: item?.challanPending || 0,
                        penaltyAmountPerDayStatus: item?.penaltyAmountPerDayStatus || item?.status || "",
                        penaltyAmountAfter60DaysStatus: item?.penaltyAmountAfter60DaysStatus || item?.status || ""
                    }));
              

                    setSupplierListData(formattedData);
                } else {
                    setSupplierListData([]);
                }

                console.log("Supplier List Response => ", res);
            })
            .catch((err) => {
                console.log("Supplier List Error => ", err);
                setSupplierListData([]);
            });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            getSupplierListDataHandler(selectedSupplier, activeStatus);
        }, 200);

        return () => clearTimeout(timeout);
    }, [selectedSupplier, activeStatus]);

    useEffect(() => {
        const loadSuppliersDrpData = async () => {
            try {

                const data = await getHpRcSuppliersCmb(998, '', 1);

                if (data?.status === 1) {

                    const suppList = data?.data?.filter(dt => dt?.value !== "0")?.map(supp => ({
                        label: supp?.display,
                        value: supp?.value,
                    }))
                  

                    setSuppliersDrpDt(suppList);
                    setSelectedSupplier(suppList[0]?.value);
                } else {
                    setSuppliersDrpDt([]);
                }
            } catch (err) {
                console.log("Failed to fetch suppliers.", err);
            }
        };

        const loadStatusDrpData = async () => {
            try {
                let stores = [];
                const data = await getHpRcStatusCmb();

                if (data?.status === 1) {
                    data?.data.forEach((element) => {
                        const obj = {
                            label: element.display,
                            value: element.value,
                        };
                        stores.push(obj);
                    });

                    const hasAll = stores.some(item => item.value === "ALL");
                    if (!hasAll) {
                        stores.unshift({
                            label: "All",
                            value: "ALL"
                        });
                    }

                    setStatusDrpDt(stores);
                } else {
                    setStatusDrpDt([]);
                }
            } catch (err) {
                console.log("Failed to fetch status.", err);
            }
        };

        loadSuppliersDrpData();
        loadStatusDrpData();
    }, []);

    useEffect(() => {
        // getGraphDataForRc();
    }, [selectedSupplier]);


    console.log("bbbbbbbbbbbbb",suppliersDrpDt?.filter(dt=>dt?.value == 9901000 || dt?.value == 9910000))

    return (
        <>
            <ServiceNavbar
                buttons={buttonDataset}
                heading={"Supplier Interface Desk"}
                userSelection={userSelection}
                componentsList={componentsList}
                isLargeDataset={true}
                filtersVisibleOnLoad={true}
            >
                <div className="rateContract__filterSection">
                    <div className="rateContract__filterSection--filters">
                        <div className="rateContract__container mb-4">
                            <ComboDropDown
                                options={suppliersDrpDt}
                                onChange={(e) => setSelectedSupplier(e.target.value)}
                                value={selectedSupplier}
                                label={"Supplier Name"}
                                addOnClass="rateContract__container--dropdown"
                            />

                            <ComboDropDown
                                options={statusDrpDt}
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
                    data={SupplierListData}
                    handleRowSelect={handleRowSelect}
                />
            </div>
        </>
    );
};

export default SupplierInterfaceList;








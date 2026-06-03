import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { showPopup } from '../../../../../features/commons/popupSlice';
import ServiceNavbar from '../../../../commons/ServiceNavbar';
import { ComboDropDown } from '../../../../commons/FormElements';
import PieChart from '../../../../commons/PieChart';
import DataTable from '../../../../commons/Datatable';
import SinglePoVerifyJH from './SinglePoVerifyJH';
import { getPoApprovalGraphData, getPoApprovalListData, getPoStatusComboData, getPoStoreNameComboData } from '../../../../../api/Jharkhand/services/SingleProgPoApproval_JH';
import SinglePoRejectJH from './SinglePoRejectJH';
import { chartColorArr } from '../../../common/StaticData';

const columns = [
    { header: "PO Prefix", field: "strPoPrefix" },
    { header: "PO No.", field: "strPoNO" },
    { header: "PO Date", field: "strPoDate" },
    { header: "PO Value(Rs.)", field: "numPoNetAmount" },
    { header: "Supplier Name", field: "strSupplierName" },
    { header: "Drug Name", field: "strItemName" },
    { header: "Store Name", field: "strStoreName" }
];

const SinglePoApprovalListJH = () => {

    const dispatch = useDispatch();
    const dataTableRef = useRef();
    const SEAT_ID = 14462;

    const [storeNameDrpDt, setStoreNameDrpDt] = useState([]);
    const [poStatusDrpDt, setPoStatusDrpDt] = useState([]);

    const [storeName, setStoreName] = useState("");
    const [poStatus, setPoStatus] = useState("");
    const [userSelection, setUserSelection] = useState("");
    const [selectedRowRc, setSelectedRowRc] = useState(null);
    const [poListData, setPoListData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [selectedStore, setSelectedStore] = useState({});

    const componentsList = [
        { mappingKey: "verify", componentName: () => <SinglePoVerifyJH store={selectedStore} selectedData={selectedRowRc} actionType={'verify'} onReject={onRejectAction} /> },
        { mappingKey: "reject", componentName: () => <SinglePoRejectJH store={selectedStore} selectedData={selectedRowRc} actionType={'reject'} /> },
        { mappingKey: "View", componentName: (props) => (<SinglePoVerifyJH store={selectedStore} selectedData={selectedRowRc} actionType={"View"} />) },
    ];

    console.log('selectedRowRc', selectedRowRc)

    const buttonDataset = [
        ...(selectedRowRc?.length > 0 ? [
            ...(poStatus === "TO_BE_APPROVED" ? [
                { label: "Verify", onClick: (() => { handleActionComp('verify') }), icon: " " },
            ] : []),

            ...(poStatus === "TO_BE_DIGITALLY_SIGN" ? [
                { label: "Digital Sign", onClick: (() => { handleActionComp('digisign') }), icon: " " },
            ] : []),

            ...(poStatus === "IN_PROCESS" ? [
                { label: "Po Amend", onClick: (() => { handleActionComp('poamend') }), icon: " " },
                { label: "Extend", onClick: (() => { handleActionComp('extend') }), icon: " " },
            ] : []),

            { label: "View", onClick: (() => { handleActionComp('View') }), icon: " " },
            { label: "Print", onClick: (() => { handleActionComp('print') }), icon: " " },
        ] : []),
    ];

    function handleActionComp(key) {
        setUserSelection(key);
        dispatch(showPopup());
    }
    function onRejectAction(key) {
        setUserSelection(key);
    }

    const handleRowSelect = (row) => {
        setSelectedRowRc(row);
    }

    useEffect(() => {

        const loadStoreNameDrpData = async () => {
            try {
                let stores = [];
                const data = await getPoStoreNameComboData(998, SEAT_ID);
                if (data?.status === 1) {
                    data?.data.forEach((element) => {

                        const obj = {
                            label: element.display,
                            value: element.value,
                        };
                        stores.push(obj);
                    });
                    setStoreNameDrpDt(stores);
                    setStoreName(stores.at(1).value);
                    setSelectedStore(stores.at(1));
                } else {
                    setStoreNameDrpDt([]);
                    setStoreName('');
                    setSelectedStore({})
                }

            } catch (err) {
                console.log("Failed to fetch drugs.", err);
            }
        };

        const loadStatusDrpData = async () => {
            try {
                let status = [];
                const data = await getPoStatusComboData();
                if (data?.status === 1) {
                    data?.data.forEach((element) => {
                        const obj = {
                            label: element.display,
                            value: element.value,
                        };
                        status.push(obj);
                    });
                    setPoStatusDrpDt(status);
                    setPoStatus(status?.at(0)?.value);
                } else {
                    setPoStatusDrpDt([]);
                    setPoStatus('');
                }

            } catch (err) {
                console.log("Failed to fetch drugs.", err);
            }
        };

        loadStoreNameDrpData();
        loadStatusDrpData();
    }, [dispatch]);


    const getGraphDataForRc = () => {
        getPoApprovalGraphData(998, storeName?.split("^")[0])?.then((data) => {
            if (data?.status === 1) {
                let statusData = [];

                data?.data.forEach((item, index) => {
                    const { count, label, status } = item;
                    statusData.push({
                        name: label,
                        y: Number(count),
                        status: status,
                        datapointColor: chartColorArr[index],
                    });
                });
                setPieChartData(statusData);
                setPoListData([]);
                setPoStatus('');
            } else {
                setPieChartData([]);
            }
        })
    }

    useEffect(() => {
        if (storeName) {
            getGraphDataForRc();
        }
    }, [storeName]);

    const getPoListData = (storeId, status) => {
        getPoApprovalListData(998, storeId?.split("^")[0], status)?.then((res) => {
            if (res?.status === 1) {
                setPoListData(res?.data);
            } else {
                setPoListData([]);
            }
            console.log('res', res)
        })
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!poStatus || !storeName) return;
            getPoListData(storeName, poStatus);
        }, 200);
        return () => clearTimeout(timeout);
    }, [poStatus]);



    return (
        <>
            <ServiceNavbar
                buttons={buttonDataset}
                heading={"Single Program Purchase Order Approval"}
                userSelection={userSelection}
                componentsList={componentsList}
                isLargeDataset={true}
                filtersVisibleOnLoad={true}
            >
                <div className="homeWrapper__filterSection">
                    <div className="homeWrapper__filterSection--filters">
                        <div className="homeWrapper__container mb-4">
                            <ComboDropDown
                                options={storeNameDrpDt}
                                onChange={(e) => {
                                    setStoreName(e.target.value);
                                    setSelectedStore(storeNameDrpDt?.find((dt) => dt?.value == e.target.value))
                                }}
                                value={storeName}
                                label={"Store Name"}
                                addOnClass="homeWrapper__container--dropdown"
                                name={'storeName'}
                            />
                            <ComboDropDown
                                options={poStatusDrpDt}
                                onChange={(e) => setPoStatus(e.target.value)}
                                value={poStatus}
                                label={"PO Status"}
                                addOnClass="homeWrapper__container--dropdown"
                                name={'poStatus'}
                            />
                        </div>

                        {pieChartData.length > 0 && (
                            <div className="rateContract__status mb-4">
                                {pieChartData?.map((data, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="rateContract__status--container"
                                            style={{ backgroundImage: data.datapointColor }}
                                            onClick={() => {
                                                setPoStatus(data.status?.toString());
                                            }}
                                        >
                                            <h2
                                                className="rateContract__heading text-center"
                                                style={{ userSelect: "none" }}
                                            >
                                                {data.name}
                                            </h2>
                                            <h4
                                                className="rateContract__heading--count"
                                                style={{ userSelect: "none" }}
                                            >
                                                {data.y}
                                            </h4>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {pieChartData.length > 0 && (
                        <div className="rateContract__filterSection--chart">
                            <PieChart data={pieChartData?.filter(dt => dt?.name !== "All" || dt?.status !== "0")} setStatus={setPoStatus} />
                        </div>
                    )}
                </div>
            </ServiceNavbar>
            {poStatus &&
                <div>
                    <DataTable
                        masterName={"Rate Contract"}
                        ref={dataTableRef}
                        columns={columns}
                        data={poListData}
                        handleRowSelect={handleRowSelect}
                    />
                </div>
            }
        </>
    )
}

export default SinglePoApprovalListJH

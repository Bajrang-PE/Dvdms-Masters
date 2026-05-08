import React, { useEffect, useRef, useState } from 'react'
import ServiceNavbar from '../../../../commons/ServiceNavbar';
import { ComboDropDown } from '../../../../commons/FormElements';
import DataTable from '../../../../commons/Datatable';
import { useDispatch } from 'react-redux';
import { showPopup } from '../../../../../features/commons/popupSlice';
import { getCommonHpStoreNameCmb } from '../../../../../api/Himachal/commonAPI_HP';
import { getHpPoApprKpiDataCountsDetails, getHpPoApprStatusCmbDetails, getHpPoGenListData } from '../../../../../api/Himachal/services/poGenerationAPI_HP';
import { chartColorArr } from '../../../common/StaticData';
import PieChart from '../../../../commons/PieChart';
import PoApprovalVerifyHP from './PoApprovalVerifyHP';
import PoModifyViewFormHP from '../poGeneration/PoModifyViewFormHP';


const columns = [
    { header: "PO Prefix", field: "poPrefix" },
    { header: "PO No.", field: "poNo" },
    { header: "PO Date", field: "poDate" },
    { header: "PO Value", field: "poNetAmount" },
    { header: "Supplier Name", field: "supplierName" },
    { header: "Drug Name", field: "itemName" },
    { header: "Rate Contract Name", field: "rateContractName" }
];

const PoApprovalListHP = () => {

    const dispatch = useDispatch();
    const dataTableRef = useRef();
    const SEAT_ID = 14409;

    const [storeNameDrpDt, setStoreNameDrpDt] = useState([]);
    const [poStatusDrpDt, setPoStatusDrpDt] = useState([]);

    const [storeName, setStoreName] = useState("");
    const [poStatus, setPoStatus] = useState("");
    const [userSelection, setUserSelection] = useState("");
    const [selectedRowRc, setSelectedRowRc] = useState(null);
    const [rcListData, setRcListData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [selectedStore, setSelectedStore] = useState({});

    const componentsList = [
        { mappingKey: "verify", componentName: () => <PoApprovalVerifyHP store={selectedStore} selectedData={selectedRowRc} actionType={'verify'} getGraphDataForRc={getGraphDataForRc} /> },
        { mappingKey: "view", componentName: () => <PoModifyViewFormHP store={selectedStore} selectedData={selectedRowRc} actionType={'View'} /> }
    ];

    const buttonDataset = [
        { label: "Verify", onClick: (() => { handleActionComp('verify') }) },
        ...(selectedRowRc?.length > 0 ? [
            { label: "View", onClick: (() => { handleActionComp('view') }) },
            { label: "Print", onClick: (() => { handleActionComp('print') }) },
        ] : []),

    ];

    function handleActionComp(key) {
        setUserSelection(key);
        dispatch(showPopup());
    }

    const handleRowSelect = (row) => {
        setSelectedRowRc(row);
    }

    useEffect(() => {

        const loadStoreNameDrpData = async () => {
            try {
                let stores = [];
                const data = await getCommonHpStoreNameCmb(998, SEAT_ID);
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
                const data = await getHpPoApprStatusCmbDetails();
                if (data?.status === 1) {
                    data?.data.forEach((element) => {
                        const obj = {
                            label: element.display,
                            value: element.value,
                        };
                        status.push(obj);
                    });
                    setPoStatusDrpDt(status);
                } else {
                    setPoStatusDrpDt([]);
                }

            } catch (err) {
                console.log("Failed to fetch drugs.", err);
            }
        };

        loadStoreNameDrpData();
        loadStatusDrpData();
    }, [dispatch]);


    const getGraphDataForRc = () => {
        getHpPoApprKpiDataCountsDetails(998, storeName)?.then((data) => {
            if (data?.status === 1) {
                let statusData = [];

                data?.data.forEach((item, index) => {
                    const { numStatusCount, strStatusLabel, numStatus } = item;
                    statusData.push({
                        name: strStatusLabel,
                        y: Number(numStatusCount),
                        status: numStatus,
                        datapointColor: chartColorArr[index],
                    });
                });
                setPieChartData(statusData);
                setRcListData([]);
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

    const getPoGenListData = (storeId, status) => {
        getHpPoGenListData(998, storeId, '', status)?.then((res) => {
            if (res?.status === 1) {
                setRcListData(res?.data?.content);
            } else {
                setRcListData([]);
            }
            console.log('res', res)
        })
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!poStatus) return;
            getPoGenListData(storeName, poStatus);
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
                        data={rcListData}
                        handleRowSelect={handleRowSelect}
                    />
                </div>
            }
        </>
    )
}

export default PoApprovalListHP

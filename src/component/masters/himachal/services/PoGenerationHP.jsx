import React, { useEffect, useRef, useState } from 'react'
import ServiceNavbar from '../../../commons/ServiceNavbar';
import { ComboDropDown } from '../../../commons/FormElements';
import DataTable from '../../../commons/Datatable';
import { useDispatch } from 'react-redux';
import { showPopup } from '../../../../features/commons/popupSlice';
import { getCommonHpFinYearCmb, getCommonHpStoreNameCmb } from '../../../../api/Himachal/commonAPI_HP';
import { getHpPoGenGraphDataCounts, getHpPoGenListData, getHpPoGenStatusCmb } from '../../../../api/Himachal/services/poGenerationAPI_HP';
import { chartColorArr } from '../../common/StaticData';
import PieChart from '../../../commons/PieChart';
import PoGenerationFormHP from './poGeneration/PoGenerationFormHP';

const columns = [
    { header: "PO Prefix", field: "poPrefix" },
    { header: "PO No.", field: "poNo" },
    { header: "PO Date", field: "poDate" },
    { header: "PO Value", field: "poNetAmount" },
    { header: "Supplier Name", field: "supplierName" },
    { header: "Drug Name", field: "itemName" },
    { header: "Rate Contract Name", field: "rateContractName" },
    { header: "Supply Status", field: "strSupplyStatus" },

    { header: "Total Ordered Qty.", field: "poOrdQty" },
    { header: "Programme Name", field: "programmeName" },

    { header: "PO Approval Remarks", field: "strPoRemarks" },
];

const PoGenerationHP = () => {

    const dispatch = useDispatch();
    const dataTableRef = useRef();
    const SEAT_ID = 14409;

    const [storeNameDrpDt, setStoreNameDrpDt] = useState([]);
    const [finYearDrpDt, setFinYearDrpDt] = useState([]);
    const [poStatusDrpDt, setPoStatusDrpDt] = useState([]);

    const [storeName, setStoreName] = useState("");
    const [finYear, setFinYear] = useState("");
    const [poStatus, setPoStatus] = useState("");
    const [userSelection, setUserSelection] = useState("");
    const [selectedRowRc, setSelectedRowRc] = useState(null);
    const [rcListData, setRcListData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [selectedStore, setSelectedStore] = useState({});

    const componentsList = [
        { mappingKey: "generate", componentName: () => <PoGenerationFormHP store={selectedStore} selectedData={selectedRowRc} actionMode={'generate'} /> },
        { mappingKey: "modify", componentName: () => <RcModifyViewFormHP selectedData={selectedRowRc} actionMode={'modify'} /> },
        { mappingKey: "view", componentName: () => <RcModifyViewFormHP selectedData={selectedRowRc} actionMode={'view'} /> },
        { mappingKey: "cancel", componentName: () => <RateContractTenderHP suppliers={suppliersDrpDt} /> },
    ];

    const buttonDataset = [
        { label: "Generate", onClick: (() => { handleActionComp('generate') }) },
        ...(selectedRowRc?.length > 0 ? [
            { label: "View", onClick: (() => { handleActionComp('view') }) },
        ] : []),

        ...((selectedRowRc?.length > 0 && selectedRowRc[0]?.gnumIsvalid == 9) ? [
            { label: "Modify", onClick: (() => { handleActionComp('modify') }) },
        ] : []),

        ...((selectedRowRc?.length > 0 && selectedRowRc[0]?.gnumIsvalid === 1) ? [
            { label: "Cencel", onClick: (() => { handleCancelRc('cancel') }) },
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

        const loadFinYearDrpDt = async () => {
            try {
                let yearList = [];
                const data = await getCommonHpFinYearCmb(998, 10);
                if (data?.status === 1) {
                    data?.data.forEach((element) => {

                        const obj = {
                            label: element?.display,
                            value: element?.value,
                        };
                        yearList.push(obj);
                    });
                    setFinYearDrpDt(yearList);
                    setFinYear(yearList.at(0).value);
                } else {
                    setFinYearDrpDt([]);
                    setFinYear("");
                }
            } catch (err) {
                console.log("Failed to fetch drugs.", err);
            }
        };

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
                const data = await getHpPoGenStatusCmb();
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

        loadFinYearDrpDt();
        loadStoreNameDrpData();
        loadStatusDrpData();
    }, [dispatch]);


    const getGraphDataForRc = () => {
        getHpPoGenGraphDataCounts(998, storeName, finYear)?.then((data) => {
            console.log('data', data)
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
            } else {
                setPieChartData([]);
            }
        })
    }

    useEffect(() => {
        if (storeName && finYear) {
            getGraphDataForRc();
        }
    }, [storeName, finYear]);

    const getPoGenListData = (storeId, financialYear, status) => {
        getHpPoGenListData(998, storeId, financialYear, status)?.then((res) => {
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
            getPoGenListData(storeName, finYear, poStatus);
        }, 200);
        return () => clearTimeout(timeout);
    }, [poStatus]);

    return (
        <>
            <ServiceNavbar
                buttons={buttonDataset}
                heading={"Single Drug PO Generation Desk"}
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
                                options={finYearDrpDt}
                                onChange={(e) => setFinYear(e.target.value)}
                                value={finYear}
                                label={"Financial Year"}
                                addOnClass="homeWrapper__container--dropdown"
                                name={'finYear'}
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

export default PoGenerationHP

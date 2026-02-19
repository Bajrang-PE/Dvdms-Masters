import React, { useEffect, useRef, useState } from 'react'
import ServiceNavbar from '../../../commons/ServiceNavbar';
import { ComboDropDown } from '../../../commons/FormElements';
import DataTable from '../../../commons/Datatable';
import { useDispatch } from 'react-redux';
import { setContractDetails, setStore } from '../../../../features/himachal/Himachal_Slice';
import RateContractTenderHP from './rateContract/RateContractTenderHP';
import RateContractAddHP from './rateContract/RateContractAddHP';
import { showPopup } from '../../../../features/commons/popupSlice';
import PieChart from '../../../commons/PieChart';
import { getHpRcContractTypesCmb, getHpRcDrugNamesCmb, getHpRcGraphDataCounts, getHpRcListData, getHpRcStatusCmb, getHpRcStoreNameCmb, getHpRcSuppliersCmb } from '../../../../api/Himachal/services/rateContractAPI_HP';
import { chartColorArr, chartColors } from '../../common/StaticData';

const columns = [
    { header: "Supplier Name", field: "strSupplierName" },
    { header: "Drug Name", field: "strItemName", width: "20%" },
    { header: "Rate/Unit", field: "ratePerUnit" },
    { header: "Tax%", field: "strTax" },
    { header: "Contract From", field: "hstdtContractFrmdate" },
    { header: "Contract To", field: "hstdtContractTodate" },
    { header: "RC No.", field: "hstnumRcNo" },
    { header: "Tender No.", field: "tenderId" },
];

const RateContractHP = () => {

    const dispatch = useDispatch();
    const dataTableRef = useRef();
    const SEAT_ID = 14409;
    const [storeNameDrpDt, setStoreNameDrpDt] = useState([]);
    const [contractTypesDrpDt, setContractTypesDrpDt] = useState([]);
    const [suppliersDrpDt, setSuppliersDrpDt] = useState([]);
    const [drugNameDrpDt, setDrugNameDrpDt] = useState([]);
    const [statusDrpDt, setStatusDrpDt] = useState([]);

    const [storeName, setStoreName] = useState("");
    const [selectedContractType, setSelectedContractType] = useState("0");
    const [selectedSupplier, setSelectedSupplier] = useState('0');
    const [selectedDrug, setSelectedDrug] = useState('0');
    const [activeStatus, setActiveStatus] = useState("");

    const [pieChartData, setPieChartData] = useState([]);
    const [selectedRowRc, setSelectedRowRc] = useState(null);
    const [userSelection, setUserSelection] = useState("");
    const [rcListData, setRcListData] = useState([]);

    const componentsList = [
        { mappingKey: "Tender", componentName: () => <RateContractTenderHP suppliers={suppliersDrpDt} /> },
        { mappingKey: "add", componentName: () => <RateContractAddHP drugList={drugNameDrpDt} /> },
        { mappingKey: "modify", componentName: () => <Rc drugList={drugNameDrpDt} /> },
        { mappingKey: "view", componentName: () => <RateContractAddHP drugList={drugNameDrpDt} /> },
    ];

    const buttonDataset = [
        { label: "Add", onClick: (() => { handleActionComp('add') }) },
        { label: "Tender Details", onClick: (() => { handleActionComp('Tender') }) },
        { label: "Modify", onClick: (() => { handleActionComp('modify') }) },
        { label: "View", onClick: (() => { handleActionComp('view') }) },
    ];

    function handleActionComp(key) {
        setUserSelection(key);
        dispatch(showPopup());
    }

    const handleRowSelect = (row) => {
        setSelectedRowRc(row);
    }

    const getRcListData = (selectedSupplier, selectedDrug, selectedContractType, activeStatus) => {
        getHpRcListData(998, selectedSupplier, selectedDrug, selectedContractType, activeStatus)?.then((res) => {
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
            if (!activeStatus) return;
            getRcListData(selectedSupplier, selectedDrug, selectedContractType, activeStatus);
        }, 200);
        return () => clearTimeout(timeout);
    }, [activeStatus]);

    useEffect(() => {

        const loadContractsDrpData = async () => {
            try {
                const data = await getHpRcContractTypesCmb(998, 1);

                if (data?.status === 1) {
                    let contractOptions = [];
                    data?.data.forEach((element) => {
                        const obj = {
                            label: element.display,
                            value: element.value,
                        };
                        contractOptions.push(obj);
                    });
                    setContractTypesDrpDt(contractOptions);
                    setSelectedContractType(contractOptions.at(1).value);
                    dispatch(setContractDetails(contractOptions.at(1)));
                } else {
                    setContractTypesDrpDt([]);
                    setSelectedContractType('');
                    dispatch(setContractDetails(''));
                }

            } catch (err) {
                console.log("Failed to fetch data.", err);
            }
        };

        const loadSuppliersDrpData = async () => {
            try {
                let supplierList = [];
                const data = await getHpRcSuppliersCmb(998, '', 1);
                if (data?.status === 1) {
                    data?.data?.forEach((element) => {
                        const obj = {
                            label: element?.display,
                            value: element?.value,
                        };
                        supplierList.push(obj);
                    });
                    setSuppliersDrpDt(supplierList);
                } else {
                    setSuppliersDrpDt([]);
                }

            } catch (err) {
                console.log("Failed to fetch data.", err);
            }
        };

        const loadDrugNameDrpDt = async () => {
            try {
                let drugList = [];
                const data = await getHpRcDrugNamesCmb(998);
                if (data?.status === 1) {
                    data?.data.forEach((element) => {

                        const obj = {
                            label: element?.display,
                            value: element?.value,
                        };
                        drugList.push(obj);
                    });
                    setDrugNameDrpDt(drugList);
                } else {
                    setDrugNameDrpDt([]);
                }
            } catch (err) {
                console.log("Failed to fetch drugs.", err);
            }
        };

        const loadStoreNameDrpData = async () => {
            try {
                let stores = [];
                const data = await getHpRcStoreNameCmb(998, SEAT_ID);
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
                    dispatch(setStore(stores.at(1)));
                } else {
                    setStoreNameDrpDt([]);
                    setStoreName('');
                    dispatch(setStore());
                }

            } catch (err) {
                console.log("Failed to fetch drugs.", err);
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
                    setStatusDrpDt(stores);
                } else {
                    setStatusDrpDt([]);
                }

            } catch (err) {
                console.log("Failed to fetch drugs.", err);
            }
        };

        loadContractsDrpData();
        loadSuppliersDrpData();
        loadDrugNameDrpDt();
        loadStoreNameDrpData();
        loadStatusDrpData();
    }, [dispatch]);

    const getGraphDataForRc = () => {
        getHpRcGraphDataCounts(998, selectedSupplier, selectedDrug, selectedContractType)?.then((data) => {
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
        getGraphDataForRc();
    }, [selectedSupplier, selectedContractType, selectedDrug]);

    console.log('pieChartData', pieChartData)
    console.log('activeStatus', activeStatus)

    return (
        <>
            <ServiceNavbar
                buttons={buttonDataset}
                heading={"Rate Contract"}
                userSelection={userSelection}
                componentsList={componentsList}
                isLargeDataset={true}
                filtersVisibleOnLoad={true}
            >
                <div className="rateContract__filterSection">
                    <div className="rateContract__filterSection--filters">
                        <div className="rateContract__container mb-4">
                            <ComboDropDown
                                options={storeNameDrpDt}
                                onChange={(e) => {
                                    setStoreName(e.target.value);
                                    dispatch(
                                        setStore(storeNameDrpDt?.find((dt) => dt?.value == e.target.value))
                                    );
                                }}
                                value={storeName}
                                label={"Store Name"}
                                addOnClass="rateContract__container--dropdown"
                            />
                            <ComboDropDown
                                options={contractTypesDrpDt}
                                onChange={(e) => {
                                    setSelectedContractType(e.target.value);
                                    dispatch(
                                        setContractDetails(
                                            contractTypesDrpDt?.find((dt) => dt?.value == e.target.value)
                                        )
                                    );
                                }}
                                value={selectedContractType}
                                label={"Contract Type"}
                                addOnClass="rateContract__container--dropdown"
                            />
                            <ComboDropDown
                                options={suppliersDrpDt}
                                onChange={(e) => setSelectedSupplier(e.target.value)}
                                value={selectedSupplier}
                                label={"Supplier Name"}
                                addOnClass="rateContract__container--dropdown"
                            />

                            <ComboDropDown
                                options={drugNameDrpDt}
                                onChange={(e) => setSelectedDrug(e.target.value)}
                                value={selectedDrug}
                                label={"Drug Name"}
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

                        {pieChartData.length > 0 && (
                            <div className="rateContract__status mb-4">
                                {pieChartData.map((data, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="rateContract__status--container"
                                            style={{ backgroundImage: data.datapointColor }}
                                            onClick={() => {
                                                setActiveStatus(data.status?.toString());
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
                            <PieChart data={pieChartData?.filter(dt => dt?.name !== "All" || dt?.status !== "0")} setStatus={setActiveStatus} />
                        </div>
                    )}
                </div>
            </ServiceNavbar>
            {activeStatus &&
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

export default RateContractHP

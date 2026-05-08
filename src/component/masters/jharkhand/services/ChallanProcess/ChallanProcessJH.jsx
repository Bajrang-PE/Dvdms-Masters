import React, { useEffect, useState } from 'react'
import ServiceNavbar from '../../../../commons/ServiceNavbar';
import { ComboDropDown } from '../../../../commons/FormElements';
import DataTable from '../../../../commons/Datatable';
import { fetchCPListData, fetchDrugNameDrpDt, fetchPoNumberDrpDt, fetchStoreNameDrpDt, fetchSuppliersDrpDt } from '../../../../../api/Jharkhand/services/ChallanProcessAPI_JH';
import ReceiveChallanProcess from './ReceiveChallanProcess';
import { showPopup } from '../../../../../features/commons/popupSlice';
import { useDispatch } from 'react-redux';
import VerifyChallanProcess from './VerifyChallanProcess';
import CancelAndViewChallanJH from './CancelAndViewChallanJH';

const ChallanProcessJh = () => {

    const SEAT_ID = 14462;
    const dispatch = useDispatch();
    const [storeNameDrpDt, setStoreNameDrpDt] = useState([]);
    const [drugNameDrpDt, setDrugNameDrpDt] = useState([]);
    const [poNoDrpDt, setPoNoDrpDt] = useState([]);
    const [suppliersDrpDt, setSuppliersDrpDt] = useState([]);

    const poStatusDrpDt = [{ value: "1", label: "Active" }, { value: "2", label: "Closed" }];
    const challanStatusDrpDt = [
        { value: "0", label: "All" },
        { value: "1", label: "Receive Pending" }, //0
        { value: "2", label: "Verify Pending" },//9
        { value: "3", label: "Freeze Pending" },//2
        { value: "4", label: "Closed" },//1
    ];

    const [selectedRowRc, setSelectedRowRc] = useState(null);
    const [userSelection, setUserSelection] = useState("");
    const [challanListData, setChallanListData] = useState([]);
    const [values, setValues] = useState({
        storeName: "", poStatus: "1", drugName: "0", poNo: "0", suppName: "0", challanStatus: "0"
    })

    const columns = [
        { header: "PO No.", field: "strPoNo" },
        { header: "PO Date", field: "strPoDate", },
        { header: "Dispatch Date", field: "strDeliveryDate" },
        { header: "Invoice No.", field: "strDeliveryNo" },
        { header: "Received Date", field: "strReceiveDate" },
        { header: "Drug Name", field: "strItemBrandName" },
        { header: "Dispatch/Rec Qty.", field: "strReceivedQuantityView" },
        { header: "Ack. Qty.", field: "strAcceptedQty" },
        { header: "Status", field: "strChallanStatus" },
    ];

    const handleChange = (e) => {
        const { name, value } = e?.target;
        if (name === "poStatus") {
            setValues({ ...values, [name]: value, drugName: "0", poNo: "0", suppName: "0", challanStatus: "0" });
        } else if (name === "drugName") {
            setValues({ ...values, [name]: value, poNo: "0", suppName: "0", challanStatus: "0" });
        } else if (name === "poNo") {
            setValues({ ...values, [name]: value, suppName: "0", challanStatus: "0" });
        } else {
            setValues({ ...values, [name]: value });
        }
    }

    const handleRowSelect = (row) => {
        setSelectedRowRc(row);
    }

    const componentsList = [
        { mappingKey: "receive", componentName: () => <ReceiveChallanProcess selectedData={selectedRowRc} actionMode={'receive'} /> },
        { mappingKey: "verify", componentName: () => <VerifyChallanProcess selectedData={selectedRowRc} actionMode={'verify'} /> },
        { mappingKey: "freeze", componentName: () => <CancelAndViewChallanJH selectedData={selectedRowRc} actionMode={'freeze'} /> },
        { mappingKey: "view", componentName: () => <CancelAndViewChallanJH selectedData={selectedRowRc} actionMode={'view'} /> },
        { mappingKey: "cancel", componentName: () => <CancelAndViewChallanJH selectedData={selectedRowRc} actionMode={'cancel'} challanStatus={selectedRowRc[0]?.hstnumChallanStatus}/> },
    ];

    const buttonDataset = [
        ...((selectedRowRc?.length > 0 && selectedRowRc[0]?.hstnumChallanStatus === 0) ? [
            { label: "Receive", onClick: (() => { handleActionComp('receive') }), icon: " " },
        ] : []),

        ...((selectedRowRc?.length > 0 && selectedRowRc[0]?.hstnumChallanStatus === 9) ? [
            { label: "Verify", onClick: (() => { handleActionComp('verify') }) },
        ] : []),

        ...((selectedRowRc?.length > 0 && selectedRowRc[0]?.hstnumChallanStatus === 2) ? [
            { label: "Freeze", onClick: (() => { handleActionComp('freeze') }) },
        ] : []),

        ...((selectedRowRc?.length > 0 && selectedRowRc[0]?.hstnumChallanStatus !== 1) ? [
            { label: "Cancel", onClick: (() => { handleActionComp('cancel') }) },
        ] : []),

        ...(selectedRowRc?.length > 0 ? [
            { label: "View", onClick: (() => { handleActionComp('view') }) },
        ] : []),
    ];

    function handleActionComp(key) {
        setUserSelection(key);
        dispatch(showPopup());
    }

    const loadStoreNameDrpDt = () => {
        fetchStoreNameDrpDt(998, SEAT_ID)?.then((res) => {
            if (res?.status === 1) {
                const data = res?.data?.map(dt => ({
                    value: dt?.value,
                    label: dt?.display
                })) || [];
                setStoreNameDrpDt(data);
            } else {
                setStoreNameDrpDt([]);
            }
        })
    }

    const loadDrugNameDrpDt = (storeId, poStatus) => {
        fetchDrugNameDrpDt(998, storeId, poStatus)?.then((res) => {
            if (res?.status === 1) {
                const data = res?.data?.map(dt => ({
                    value: dt?.value,
                    label: dt?.display
                })) || [];
                setDrugNameDrpDt(data);
            } else {
                setDrugNameDrpDt([]);
            }
        })
    }

    const loadSupplierNameDrpDt = (storeId, poNo) => {
        fetchSuppliersDrpDt(998, storeId, poNo)?.then((res) => {
            if (res?.status === 1) {
                const data = res?.data?.map(dt => ({
                    value: dt?.value,
                    label: dt?.display
                })) || [];
                setSuppliersDrpDt(data);
            } else {
                setSuppliersDrpDt([]);
            }
        })
    }

    const loadPoNoDrpDt = (storeId, poStatus, itemId) => {
        fetchPoNumberDrpDt(998, storeId, poStatus, itemId)?.then((res) => {
            if (res?.status === 1) {
                const data = res?.data?.map(dt => ({
                    value: dt?.value,
                    label: dt?.display
                })) || [];
                setPoNoDrpDt(data);
            } else {
                setPoNoDrpDt([]);
            }
        })
    }

    useEffect(() => {
        loadStoreNameDrpDt();
    }, [])

    useEffect(() => {
        if (values?.storeName && values?.poStatus) {
            loadDrugNameDrpDt(values?.storeName, values?.poStatus);
        }
    }, [values?.storeName, values?.poStatus])

    useEffect(() => {
        if (values?.storeName && values?.poNo) {
            loadSupplierNameDrpDt(values?.storeName, values?.poNo?.split('^')[0]);
        }
    }, [values?.storeName, values?.poNo])

    useEffect(() => {
        if (values?.storeName && values?.poStatus && values?.drugName) {
            loadPoNoDrpDt(values?.storeName, values?.poStatus, values?.drugName);
        }
    }, [values?.storeName, values?.poStatus, values?.drugName])

    const getCpListData = (storeId, poStatus, itemId, challanStatus, PoNo) => {
        fetchCPListData(998, storeId, PoNo?.split('^')[1] || "0", poStatus, itemId, challanStatus, PoNo?.split('^')[0])?.then((res) => {
            console.log('res', res)
            if (res?.status === 1) {
                setChallanListData(res?.data);
            } else {
                setChallanListData([]);
            }
        })
    }

    useEffect(() => {
        const { storeName, poStatus, drugName, poNo, challanStatus } = values;
        if (storeName && poStatus && drugName && poNo && challanStatus) {
            getCpListData(storeName, poStatus, drugName, challanStatus, poNo);
        }
    }, [values?.storeName, values?.poStatus, values?.drugName, values?.poNo, values?.challanStatus]);

    console.log('values', values)

    return (
        <>
            <ServiceNavbar
                buttons={buttonDataset}
                heading={"Challan Process"}
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
                                onChange={handleChange}
                                value={values?.storeName}
                                label={"Store Name :"}
                                addOnClass="rateContract__container--dropdown"
                                name={'storeName'}
                            />
                            <ComboDropDown
                                options={poStatusDrpDt}
                                onChange={handleChange}
                                value={values?.poStatus}
                                label={"PO Status :"}
                                addOnClass="rateContract__container--dropdown"
                                name={'poStatus'}
                            />

                            <ComboDropDown
                                options={drugNameDrpDt}
                                onChange={handleChange}
                                value={values?.drugName}
                                label={"Drug Name :"}
                                addOnClass="rateContract__container--dropdown"
                                name={'drugName'}
                            />

                            <ComboDropDown
                                options={poNoDrpDt}
                                onChange={handleChange}
                                value={values?.poNo}
                                label={"PO No. :"}
                                addOnClass="rateContract__container--dropdown"
                                name={'poNo'}
                            />

                            <ComboDropDown
                                options={suppliersDrpDt}
                                onChange={handleChange}
                                value={values?.suppName}
                                label={"Supplier Name :"}
                                addOnClass="rateContract__container--dropdown"
                                name={'suppName'}
                            />

                            <ComboDropDown
                                options={challanStatusDrpDt}
                                onChange={handleChange}
                                value={values?.challanStatus}
                                label={"Challan Status :"}
                                addOnClass="rateContract__container--dropdown"
                                name={'challanStatus'}
                            />
                        </div>

                        {/* {pieChartData.length > 0 && (
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
                        )} */}
                    </div>

                    {/* {pieChartData.length > 0 && (
                        <div className="rateContract__filterSection--chart">
                            <PieChart data={pieChartData?.filter(dt => dt?.name !== "All" || dt?.status !== "0")} setStatus={setActiveStatus} />
                        </div>
                    )} */}
                </div>
            </ServiceNavbar>
            <div className='px-2'>
                <DataTable
                    masterName={"Rate Contract"}
                    ref={null}
                    columns={columns}
                    data={challanListData}
                    handleRowSelect={handleRowSelect}
                />
            </div>
        </>
    )
}

export default ChallanProcessJh

import React, { useEffect, useState } from 'react'
import ServiceNavbar from '../../../../commons/ServiceNavbar';
import { ComboDropDown } from '../../../../commons/FormElements';
import DataTable from '../../../../commons/Datatable';
import { fetchCPListData } from '../../../../../api/Jharkhand/services/ChallanProcessAPI_JH';



const ChallanProcessJh = () => {

    const SEAT_ID = 14409;
    const [storeNameDrpDt, setStoreNameDrpDt] = useState([]);
    const [drugNameDrpDt, setDrugNameDrpDt] = useState([]);
    const [poNoDrpDt, setPoNoDrpDt] = useState([]);
    const [suppliersDrpDt, setSuppliersDrpDt] = useState([]);

    const poStatusDrpDt = [{ value: "1", label: "Active" }, { value: "2", label: "Closed" }];
    const challanStatusDrpDt = [
        { value: "0", label: "All" },
        { value: "1", label: "Receive Pending" },
        { value: "2", label: "Verify Pending" },
        { value: "3", label: "Freeze Pending" },
        { value: "4", label: "Closed" },
    ];

    const [selectedRowRc, setSelectedRowRc] = useState(null);
    const [userSelection, setUserSelection] = useState("");
    const [challanListData, setChallanListData] = useState([]);
    const [values, setValues] = useState({
        storeName: "", poStatus: "1", drugName: "", poNo: "", suppName: "", challanStatus: "0"
    })

    const columns = [
        { header: "PO No.", field: "strSupplierName" },
        { header: "PO Date", field: "strItemName", },
        { header: "Dispatch Date", field: "ratePerUnit" },
        { header: "Invoice No.", field: "strTax" },
        { header: "Received Date", field: "hstdtContractFrmdate" },
        { header: "Drug Name", field: "hstdtContractTodate" },
        { header: "Dispatch/Rec Qty.", field: "hstnumRcId", isJSX: true },
        { header: "Ack. Qty.", field: "tenderId" },
        { header: "Status", field: "status" },
    ];

    const handleChange = (e) => {
        const { name, value } = e?.target;
        if (name) {
            setValues({ ...values, [name]: value });
        }
    }

    const handleRowSelect = (row) => {
        setSelectedRowRc(row);
    }

    const componentsList = [
        { mappingKey: "Tender", componentName: () => <RateContractTenderHP suppliers={suppliersDrpDt} /> },
        { mappingKey: "add", componentName: () => <RateContractAddHP drugList={drugNameDrpDt} suppliers={suppliersDrpDt} /> },
        { mappingKey: "modify", componentName: () => <RcModifyViewFormHP selectedData={selectedRowRc} actionMode={'modify'} /> },
        { mappingKey: "view", componentName: () => <RcModifyViewFormHP selectedData={selectedRowRc} actionMode={'view'} /> },
    ];

    const buttonDataset = [
        { label: "Receive", onClick: (() => { handleActionComp('receive') }), icon: " " },
        { label: "Verify", onClick: (() => { handleActionComp('verify') }) },
        ...(selectedRowRc?.length > 0 ? [
            { label: "Freeze", onClick: (() => { handleActionComp('freeze') }) },
        ] : []),

        ...((selectedRowRc?.length > 0 && selectedRowRc[0]?.gnumIsvalid == 9) ? [
            { label: "Cancel", onClick: (() => { handleActionComp('cancel') }) },
        ] : []),

        ...((selectedRowRc?.length > 0 && selectedRowRc[0]?.gnumIsvalid === 1) ? [
            { label: "View", onClick: (() => { handleCancelRc('view') }) },
        ] : []),
    ];

    const getCpListData = (storeId, poStoreId, poStatus, itemId, challanStatus, PoNo) => {
        fetchCPListData(998, storeId, poStoreId, poStatus, itemId, challanStatus, PoNo)?.then((res) => {
            console.log('res', res)
            if (res?.status === 1) {
                setChallanListData(res?.data?.content);
            } else {
                setChallanListData([]);
            }
        })
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!activeStatus) return;
            const { storeName, poStatus, drugName, poNo, suppName, challanStatus } = values;
            getCpListData(storeName, suppName, poStatus, drugName, challanStatus, poNo);
        }, 200);
        return () => clearTimeout(timeout);
    }, [values]);

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

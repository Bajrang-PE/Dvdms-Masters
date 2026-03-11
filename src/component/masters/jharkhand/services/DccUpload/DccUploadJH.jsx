import React, { useState } from 'react'
import { ComboDropDown, InputField, RadioButton } from '../../../../commons/FormElements'
import ReactDataTable from '../../../../commons/ReactDataTable';
import { ToastAlert } from '../../../../../utils/Toast';
import { addDccUploadDetails, fetchDccInitDetails, fetchPendingDccDetails, fetchViewDccDetails } from '../../../../../api/Jharkhand/services/DccUploadAPI_JH';

const DccUploadJH = () => {

    const [isPendingDcc, setIsPendingDcc] = useState(false);
    const [poNumber, setPoNumber] = useState('');
    const [dccStatus, setDccStatus] = useState('');
    const [pendingDccData, setPendingDccData] = useState([]);
    const [batchDataList, setBatchDataList] = useState([]);
    const [selectedRowData, setSelectedRowData] = useState([]);
    const [values, setValues] = useState({
        suppName: "", drugName: "", poApprovalDate: ""
    })

    const onSelectedRowChangeInput = (value, rowId) => {
        setSelectedRowData(prev => {
            const prevData = Array.isArray(prev) ? prev : [];

            const existingIndex = prevData?.findIndex(
                dt => dt.hstnumDccRequestId === rowId
            );

            if (existingIndex !== -1) {
                return prevData?.map(item =>
                    item.hstnumDccRequestId === rowId
                        ? {
                            ...item,
                            strRemark: value
                        }
                        : item
                );
            }

            return [...prevData];
        });
    }

    const onSelectedRowChangeStatus = (row, value, rowId) => {
        setSelectedRowData(prev => {
            const prevData = Array.isArray(prev) ? prev : [];

            const existingIndex = prevData.findIndex(
                dt => dt.hstnumDccRequestId === rowId
            );

            if (existingIndex !== -1) {
                return prevData.map(item =>
                    item.hstnumDccRequestId === rowId
                        ? {
                            ...item,
                            hstnumApprovalStatus: value
                        }
                        : item
                );
            }

            const newRow = {
                strBatchNo: row?.strBatchNo || "",
                hstnumSupplierId: row?.hstnumSupplierId || null,
                hstnumDccRequestQty: row?.hstnumDccRequestQty || 0,
                hstnumDccRequestId: rowId,
                hstnumApprovalStatus: value,
                strRemark: "",
                strDccUploadFileName: ""
            };

            return [...prevData, newRow];
        });
    };

    const onSelectedRowChangeFile = (value, rowId) => {
        console.log('value', value)
        setSelectedRowData(prev => {
            const prevData = Array.isArray(prev) ? prev : [];

            const existingIndex = prevData.findIndex(
                dt => dt.hstnumDccRequestId === rowId
            );

            if (existingIndex !== -1) {
                return prevData.map(item =>
                    item.hstnumDccRequestId === rowId
                        ? {
                            ...item,
                            strDccUploadFileName: value
                        }
                        : item
                );
            }

            return [...prevData];
        });
    }

    const dccStatusList = [
        { value: "0", label: "Pending DCC" },
        { value: "1", label: "Approved DCC" },
        { value: "2", label: "Rejected DCC" },
    ];

    const getPoDetailsOnGo = (e) => {
        e?.preventDefault();
        if (poNumber && poNumber?.trim() && poNumber !== '') {
            fetchDccInitDetails(poNumber)?.then((res) => {
                console.log('res', res)
                if (res?.status === 1) {
                    if (res?.data?.length > 0) {
                        setValues({
                            suppName: res?.data[0]?.strSupplierName,
                            drugName: res?.data[0]?.strItemName,
                            poApprovalDate: 'NA'
                        })
                        setBatchDataList(res?.data);
                    } else {
                        ToastAlert(res?.message, 'error');
                        setBatchDataList([]);
                    }
                } else {
                    setBatchDataList([]);
                    ToastAlert(res?.message, 'error');
                }
            })
        } else {
            ToastAlert("Please enter PO number", "error")
        }
    }

    const getPendingDccDt = (e) => {
        setIsPendingDcc(e?.target?.checked);
        if (e?.target?.checked) {
            fetchPendingDccDetails(998)?.then((res) => {
                if (res?.status === 1) {
                    setPendingDccData(res?.data);
                } else {
                    setPendingDccData([]);
                    ToastAlert(res?.message, 'error');
                }
            })
        } else {
            setPendingDccData([]);
        }
    }

    const getViewDccDetails = (dccStatus) => {
        fetchViewDccDetails(998, dccStatus)?.then((res) => {
            if (res?.status === 1) {
                setPendingDccData(res?.data);
            } else {
                setPendingDccData([]);
                ToastAlert(res?.message, 'error');
            }
        })
    }

    const pendingDccTableCols = [
        {
            name: "PO No.",
            selector: row => row.hstnumPoNo,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: "Supplier",
            selector: row => row.strSupplierName,
            width: "20%",
            wrap: true,
            sortable: true
        },
        {
            name: "Batch No",
            selector: row => row.strBatchNo,
            wrap: true,
            sortable: true
        },
        {
            name: "Item Name",
            selector: row => row.strItemName,
            width: "20%",
            wrap: true,
            sortable: true
        },
        {
            name: "Manufacturing Date",
            selector: row => row.strManufactureDate,
            center: "true",
            wrap: true,
            sortable: true,
        },
        {
            name: (<span>Expiry Date</span>),
            selector: row => row.strExpiryDate,
            center: "true",
            wrap: true,
            sortable: true
        },
        ...(dccStatus ? [
            {
                name: (<span>DCC Status</span>),
                selector: row => row.hstnumDccStatus,
                center: "true",
                wrap: true,
                sortable: true
            },
        ] : [])
    ];

    const batchDetailsTableCols = [
        {
            name: "Batch",
            selector: row => row.strBatchNo,
            width: "7%",
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Manf. Date</span>),
            selector: row => row.strManufactureDate,
            width: "9%",
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Exp. Date</span>),
            selector: row => row.strExpiryDate,
            width: "9%",
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>DCC Request Qty.</span>),
            selector: row => row.hstnumDccSupplyQtyLimit,
            width: "8%",
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Remaining Shelf Life</span>),
            selector: row => row.shelfLifePercent,
            width: "7%",
            center: "true",
            wrap: true,
            sortable: true,
        },
        {
            name: (<span className='text-center'>In-House Test Download</span>),
            selector: row => row.strInhouseTestFile,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>NABL Download</span>),
            selector: row => row.strNablFile,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Short Shelf Life Approval File</span>),
            selector: row => row.strShortShelfFileName,
            center: "true",
            wrap: true,
            sortable: true
        },
        {
            name: (<span className='text-center'>Status</span>),
            selector: row => 'bg',
            width: "10%",
            center: "true",
            wrap: true,
            cell: (row, index) => (
                <div style={{ textAlign: "left" }}>
                    <RadioButton
                        label="Approve"
                        name={`status-${row?.dccRequestId}`}
                        value="1"
                        checked={selectedRowData?.find(dt => dt?.hstnumDccRequestId == row?.dccRequestId)?.hstnumApprovalStatus === "1"}
                        onChange={(e) => onSelectedRowChangeStatus(row, e?.target?.value, row?.dccRequestId)}
                    />
                    <RadioButton
                        label="Reject"
                        name={`status-${row?.dccRequestId}`}
                        value="2"
                        checked={selectedRowData?.find(dt => dt?.hstnumDccRequestId == row?.dccRequestId)?.hstnumApprovalStatus === "2"}
                        onChange={(e) => onSelectedRowChangeStatus(row, e?.target?.value, row?.dccRequestId)}
                    />
                </div>

            ),
        },
        {
            name: (<span className='text-center'>DCC Upload</span>),
            selector: row => 'bg',
            width: "15%",
            center: "true",
            wrap: true,
            cell: (row, index) => (
                <div>
                    {(selectedRowData?.find(dt => dt?.hstnumDccRequestId == row?.dccRequestId)?.hstnumApprovalStatus === "1" || !selectedRowData?.some(dt => dt?.hstnumDccRequestId == row?.dccRequestId)) ?
                        <input
                            className="form-control form-control-sm"
                            type="file"
                            role='button'
                            name={`file-${row?.dccRequestId}`}
                            id={`file-${row?.dccRequestId}`}
                            onChange={(e) => onSelectedRowChangeFile(e?.target?.files[0], row?.dccRequestId)}
                            disabled={selectedRowData?.length === 0 || !selectedRowData?.some(dt => dt?.hstnumDccRequestId == row?.dccRequestId)}
                        ></input>
                        :
                        <InputField
                            className="Wrapper__inputs"
                            type="text"
                            name={`remark-${row?.dccRequestId}`}
                            id={`remark-${row?.dccRequestId}`}
                            placeholder="Remarks"
                            onChange={(e) => onSelectedRowChangeInput(e?.target?.value, row?.dccRequestId)}
                        />
                    }

                </div>
            )
        },
    ];

    const saveDccUploadDetails = () => {

        if (selectedRowData?.length === 0) {
            ToastAlert('Please select record to approve or reject!', 'error');
            return;
        }

        for (let i = 0; i < selectedRowData.length; i++) {
            const row = selectedRowData[i];
            const rowNo = i + 1;

            if (row?.hstnumApprovalStatus === "1" && !row?.strDccUploadFileName) {
                ToastAlert(`Row ${rowNo}: Please upload a file`, 'error');
                return;
            }

            if (row?.hstnumApprovalStatus === "2" && !row?.strRemark) {
                ToastAlert(`Row ${rowNo}: Please Enter Rejection reason`, 'error');
                return;
            }
        }

        const batchDt = selectedRowData?.map((res) => ({
            "strBatchNo": res?.strBatchNo,
            "hstnumSupplierId": res?.hstnumSupplierId,
            "hstnumDccRequestQty": res?.hstnumDccRequestQty,
            "hstnumDccRequestId": res?.hstnumDccRequestId,
            "hstnumApprovalStatus": parseInt(res?.hstnumApprovalStatus),
            "strRemark": res?.strRemark,
            "strDccUploadFileName": res?.strDccUploadFileName?.name
        }))
        const val = {
            "gnumHospitalCode": 998,
            "hstnumPoNo": parseInt(poNumber),
            "hstnumItemBrandId": batchDataList[0]?.hstnumItemBrandId,
            "batchDetails": batchDt
        }

        addDccUploadDetails(val)?.then((res) => {
            if (res?.status === 1) {
                ToastAlert(res?.message, 'success');
                getPoDetailsOnGo();
            } else {
                ToastAlert(res?.message, 'error');
            }
        })
    }

    const handleBack = () => {
        setIsPendingDcc(false);
        setPoNumber('');
        setDccStatus('');
        setPendingDccData([]);
        setBatchDataList([]);
        setSelectedRowData([]);
        setValues({ suppName: "", drugName: "", poApprovalDate: "" });
    }


    return (
        <>
            <div className="masters__navbar p-2">
                <div className="masters__navbar--control-panel">
                    <p className="masters__navbar--text">{'DCC Upload'}</p>
                    <div>
                        <label className="rateContractAddJHK__label mb-0 text-primary">
                            <input
                                id="isPendingDcc"
                                className="me-2 rounded"
                                type="checkbox"
                                name="isPendingDcc"
                                checked={!!isPendingDcc}
                                onChange={(e) => { getPendingDccDt(e); setDccStatus(''); }}
                            />
                            Pending DCC
                        </label>
                    </div>
                </div>
                {!isPendingDcc &&
                    <div className="service__navbar--filters">
                        <div className="rateContract__filterSection">
                            <div className="rateContract__filterSection--filters w-100">
                                <div className="rateContract__container mb-1">
                                    <form onSubmit={getPoDetailsOnGo}>
                                        <div className='d-flex p-2' style={{ gap: "1rem" }}>
                                            <label htmlFor="poNumber" className="Wrapper__label required-label align-content-center">
                                                PO No. :
                                            </label>
                                            <InputField
                                                id="poNumber"
                                                className="Wrapper__inputs"
                                                type="text"
                                                name={"poNumber"}
                                                placeholder="Enter Po Number"
                                                value={poNumber}
                                                onChange={(e) => { setPoNumber(e?.target?.value) }}
                                            />

                                            <div className='align-content-center'>
                                                <button type='submit' className="btn btn-success btn-sm rounded rounded-3 h-75 fw-bold" title={"Go"} >
                                                    Go
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {batchDataList?.length > 0 && <>
                            <div className="flex items-center mb-2 mt-1">
                                <div className="w-10 border-1 border-[#097080]"></div>
                                <span className="mx-3 font-bold text-[#097080]">
                                    PO Details
                                </span>
                                <div className="flex-grow border-1 border-[#097080]"></div>
                            </div>
                            <div className='row'>
                                <div className='col-4'>
                                    <label htmlFor="" className="Wrapper__label mb-0">
                                        Supplier Name :{" "}
                                        <span className="fs-6 fw-normal">{values?.suppName}</span>{" "}
                                    </label>
                                </div>
                                <div className='col-4'>
                                    <label htmlFor="" className="Wrapper__label mb-0">
                                        Drug Name :{" "}
                                        <span className="fs-6 fw-normal">{values?.drugName}</span>{" "}
                                    </label>
                                </div>
                                <div className='col-4'>
                                    <label htmlFor="" className="Wrapper__label mb-0">
                                        PO Approval Date :{" "}
                                        <span className="fs-6 fw-normal">{values?.poApprovalDate}</span>{" "}
                                    </label>
                                </div>
                                <div className="flex items-center mb-2 mt-3">
                                    <div className="w-10 border-1 border-[#097080]"></div>
                                    <span className="mx-3 font-bold text-[#097080]">
                                        Batch Details
                                    </span>
                                    <div className="flex-grow border-1 border-[#097080]"></div>
                                </div>

                                <div style={{ marginBottom: "2rem" }}>
                                    <ReactDataTable column={batchDetailsTableCols} data={batchDataList} isPagination={false} showSerialNumber={true} />
                                </div>
                            </div>
                        </>}
                    </div>
                }
            </div>

            {isPendingDcc &&
                <section className="unified-wrapper">
                    <div className='w-25'>
                        <label htmlFor="poNumber" className="Wrapper__label align-content-center">
                            DCC Status :
                        </label>

                        <ComboDropDown
                            options={dccStatusList}
                            onChange={(e) => {
                                setDccStatus(e?.target?.value);
                                getViewDccDetails(e?.target?.value);
                            }}
                            name={"dccStatus"}
                            value={dccStatus}
                        />
                    </div>

                    <div className="flex items-center mb-2 mt-3">
                        <div className="w-10 border-1 border-[#097080]"></div>
                        <span className="mx-3 font-bold text-[#097080]">
                            Dcc Details
                        </span>
                        <div className="flex-grow border-1 border-[#097080]"></div>
                    </div>

                    <div style={{ marginBottom: "2rem" }}>
                        <ReactDataTable column={pendingDccTableCols} data={pendingDccData} showSerialNumber={true} />
                    </div>
                </section>
            }
            <div className="bankmaster__container-controls">

                <button className="bankmaster__container-controls-btn" onClick={saveDccUploadDetails}>Save</button>

                <button
                    className="bankmaster__container-controls-btn"
                    onClick={handleBack}
                >
                    Back
                </button>
            </div>
        </>
    )
}

export default DccUploadJH

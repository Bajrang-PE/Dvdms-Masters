import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ReactDataTable from '../../../../commons/ReactDataTable';
import { useDispatch, useSelector } from 'react-redux';
import InputBox from '../../../../commons/InputBox';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { addSuppIntDeskDccReqDetail, getSuppIntDeskDccReqBatchDetails } from '../../../../../api/Jharkhand/services/SupplierInterfaceDeskAPI_JH';
import BottomButtons from '../../../../commons/BottomButtons';
import { ToastAlert } from '../../../../../utils/Toast';


const QuantityCell = React.memo(
    ({ row, index, isSelected, value, onChange, handleSupplyQtyBlur }) => {
        const defaultQty =
            row?.supp_qty === "" ||
                row?.supp_qty === "NA" ||
                row?.supp_qty == 0
                ? 0
                : row?.supp_qty;

        console.log("index", value)

        return (
            <InputBox
                type="text"
                defaultValue={isSelected ? value === "NA" ? 0 : value ?? defaultQty : defaultQty}
                disabled={!isSelected}
                // onChange={(e) => onChange(index, e.target.value)}
                onBlur={(e) => handleSupplyQtyBlur(index, e.target.value)}

            />
        );
    }
);

const DccBatchTable = React.memo(({
    data, selectedData, setPoDccQtyFlag, setSelectedRowData
}) => {

    const [selectedRows, setSelectedRows] = useState([]);

    const handleQuantityChange = useCallback((targetIndex, value) => {
        setSelectedRows(prev =>
            prev.map(item =>
                item.index === targetIndex
                    ? { ...item, supp_qty: value }
                    : item
            )
        );
    }, []);

    console.log('selectedRows', selectedRows)
    const handleRowSelect = (index, row, e) => {
        setSelectedRows(prev => {
            const exists = prev.find(item => item.index == index);

            if (exists) {
                return prev.filter(item => item.index !== index);
            }

            return [...prev, { ...row, index }];
        });
    };


    const handleSupplyQtyBlur = (index, value,) => {
        const totalPoQty = Number(selectedData[0]?.order_quantty || 0);
        const currentDccQty = Number(selectedData[0]?.totalpodccqty || 0);
        let isValid = true;

        const updatedList = selectedRows.map(item =>
            item.index === index
                ? { ...item, supp_qty: Number(value) || 0 }
                : item
        );

        const totalSuppliedQty = updatedList.reduce(
            (sum, item) => sum + Number(item.supp_qty || 0),
            0
        );

        const availableQty = totalPoQty - currentDccQty;

        // DCC validation
        if (totalSuppliedQty > availableQty) {
            ToastAlert(
                `Total Quantity Can't be Greater than Current DCC [ ${availableQty} ] Quantity!!!`, 'error'
            );
            isValid = false;
            setSelectedRows(prev =>
                prev.map(item =>
                    item.index === index
                        ? { ...item, supp_qty: 0 }
                        : item
                )
            );
            const arr = selectedRows?.map(item => item.index === index ? { ...item, supp_qty: isValid ? value : 0 } : item);
            setSelectedRowData(arr);
            return;
        }

        // PO validation
        if (totalSuppliedQty > totalPoQty) {
            ToastAlert(
                `Total Quantity Can't be Greater than PO Order [ ${totalPoQty} ] Quantity!!!`, 'error'
            );
            isValid = false;
            setSelectedRows(prev =>
                prev.map(item =>
                    item.index === index
                        ? { ...item, supp_qty: 0 }
                        : item
                )
            );
            const arr = selectedRows?.map(item => item.index === index ? { ...item, supp_qty: 0 } : item);
            setSelectedRowData(arr);
            return;
        }

        console.log('object')
        setSelectedRows(prev =>
            prev.map(item =>
                item.index === index
                    ? { ...item, supp_qty: isValid ? value : 0 }
                    : item
            )
        );
        const arr = selectedRows?.map(item => item.index === index ? { ...item, supp_qty: value } : item);
        setSelectedRowData(arr);

        // Flag update
        setPoDccQtyFlag(
            totalSuppliedQty === totalPoQty ? 1 : 0
        );
    };


    const columns = useMemo(() => [
        {
            name: <input type="checkbox" disabled className="form-check-input" />,
            width: "5%",
            cell: (row, index) => (
                <input
                    type="checkbox"
                    checked={selectedRows.some(dt => dt?.index === index)}
                    onChange={(e) => handleRowSelect(index, row, e)}
                />
            )
        },
        {
            name: "Authority Name",
            selector: row => row?.store_name,
            sortable: true,
            wrap: true
        },
        {
            name: "Batch Name",
            selector: row => row?.hststr_batch_no,
            sortable: true,
            wrap: true
        },
        {
            name: "MFG Date",
            selector: row => row?.manuf_date,
            sortable: true,
            wrap: true
        },
        {
            name: "Expiry Date",
            selector: row => row?.expiry_date,
            sortable: true,
            wrap: true
        },
        {
            name: "Shelf Life",
            selector: row => row?.shelf_life,
            sortable: true,
            wrap: true
        },
        {
            name: "In-House Test Report",
            selector: row => row?.file_name,
            width: "20%",
            cell: (row) => (
                <span
                    style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={() => alert('pending')}
                >
                    {row?.file_name}
                </span>
            )
        },
        {
            name: "Quantity",
            sortable: false,
            cell: (row, index) => (
                <QuantityCell
                    row={row}
                    index={index}
                    isSelected={selectedRows.some(dt => dt?.index === index)}
                    value={selectedRows?.find(dt => dt?.index === index)?.supp_qty}
                    onChange={handleQuantityChange}
                    handleSupplyQtyBlur={handleSupplyQtyBlur}
                />
            )
        }
    ], [selectedRows]);

    return (
        <ReactDataTable
            title=""
            column={columns}
            data={data}
            isSearchReq={false}
            isPagination={false}
        />
    );
});


const RemarksBox = React.memo(({ value, onChange }) => (
    <div className="pt-4 px-8">
        <label className="employeeMaster__label">Remarks :</label>
        <textarea
            className="rateContractAddJHK__input"
            placeholder="Enter here..."
            defaultValue={value}
            onBlur={onChange}
        />
    </div>
));


const SuppIntDccRequest = ({ selectedData }) => {

    const dispatch = useDispatch();
    const { value: supplierID, label: supplierName } = useSelector(
        state => state.jhMst.supplierID
    );

    const [poDetailsList, setPoDetailsList] = useState([]);
    const [poDetails, setPoDetails] = useState({});
    const [remarks, setRemarks] = useState("");
    const [poDccQtyFlag, setPoDccQtyFlag] = useState(0);

    const [selectedRowData, setSelectedRowData] = useState([]);

    useEffect(() => {
        if (!selectedData?.length) return;

        const row = selectedData[0];

        getSuppIntDeskDccReqBatchDetails(
            998,
            supplierID,
            row?.hstnum_po_no,
            row?.hstnum_store_id,
            row?.hstnum_itembrand_id
        ).then(res => {
            if (res?.status === 1) {
                setPoDetails(res?.data?.poDetails || {});
                setPoDetailsList(res?.data?.batchList || []);
            } else {
                setPoDetails({});
                setPoDetailsList([]);
            }
        });

    }, [selectedData, supplierID]);

    const handleRemarksChange = useCallback((e) => {
        setRemarks(e.target.value);
    }, []);

    const handleClose = () => dispatch(hidePopup());

    const handleSaveDccRequest = () => {
        const val = {
            gnumHospitalCode: 998,
            hstnumPoNo: selectedData[0]?.hstnum_po_no,
            poDccQtyFlag: poDccQtyFlag,
            dccSiDTO: selectedRowData?.map((dt) => ({
                batchNo: dt?.hststr_batch_no,
                supplierId: dt?.hstnum_supplier_id,
                itemBrandId: dt?.hstnum_itembrand_id,
                poNo: dt?.hstnum_po_no || selectedData[0]?.hstnum_po_no,
                supplyOrderQty: parseInt(dt?.supp_qty),
                manufDate: new Date(dt?.manuf_date),
                expiryDate: new Date(dt?.expiry_date),
                shelfLife: dt?.shelf_life,
                fileName: dt?.file_name
            }))
        }

        addSuppIntDeskDccReqDetail(val)?.then((res) => {
            console.log('res', res)
        })
    }

    console.log('selectedData', selectedData)
    console.log('selectedRowData', selectedRowData)

    return (
        <>
            <h3 className="employeeMaster__heading">Dcc Request</h3>

            <div className="rateContractAddJHK__container mb-2">
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
                        <span className="fs-6 fw-normal">{selectedData[0]?.po_date}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Item Name :{" "}
                        <span className="fs-6 fw-normal">{poDetails?.get_item_dtl}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        PO Order Quantity :{" "}
                        <span className="fs-6 fw-normal">
                            {selectedData[0]?.order_quantty}
                        </span>{" "}
                    </label>
                </div>
            </div>
            <div style={{ border: "1px solid #cc9966" }}>
                <DccBatchTable
                    data={poDetailsList}
                    selectedData={selectedData}
                    setPoDccQtyFlag={setPoDccQtyFlag}
                    setSelectedRowData={setSelectedRowData}
                // selectedRows={selectedRows}
                // onRowSelect={handleRowSelect}
                // onQuantityChange={handleQuantityChange}
                // handleSupplyQtyBlur={handleSupplyQtyBlur}
                />
            </div>

            <RemarksBox value={remarks} onChange={handleRemarksChange} />

            <BottomButtons
                isSave
                isReset
                isClose
                onClose={handleClose}
                onSave={handleSaveDccRequest}
            />
        </>
    );
};

export default SuppIntDccRequest;

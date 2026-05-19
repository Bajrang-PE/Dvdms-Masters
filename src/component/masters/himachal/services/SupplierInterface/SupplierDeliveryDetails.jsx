
import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { ComboDropDown, DatePickerComponent, InputField } from '../../../../commons/FormElements';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faPlus, faEye, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';

import { ToastAlert } from '../../../../../utils/Toast';
import BottomButtons from '../../../../commons/BottomButtons';
import MasterPopUpModal from '../../../../commons/MasterPopUpModal';
import {
  supplierviewdeliverydetails,
  getHpSupplierDeliveryDetails,
  getHpSupplierDeliveryDetailsdata,
  getsupplierdrugnames,
  getsupplieritemdetails,
  getsupplierscheduleno,
  savesupplierdeliverysave,
  supplierdeletedeliverydetails
} from '../../../../../api/Himachal/services/suppInterfaceAPI_HP';
import ReactDataTable from '../../../../commons/ReactDataTable';

const bgdetailsTableCols = [
  { header: "EMD Amount (₹)", field: "hstnumBgAmt" },
  { header: "EMD From Date", field: "hstdtBgFrmDate" },
  { header: "EMD To Date", field: "hstdtBgToDate" },
  { header: "EMD No.", field: "hstnumBgNo" },
  { header: "Refund Amount", field: "hstnumRefundAmount" },
];

const SupplierDeliveryDetails = (props) => {
  const { suppliers, selectedSupplier, rowData } = props;

  const { value: storeID } = useSelector((state) => state.himachalMst.storeID);
  const { value: contractID, label: contractName } = useSelector(
    (state) => state.himachalMst.contractDetails
  );

  const batchSizeOptions = Array.from({ length: 50 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));

  const initialState = {
    supplierName: "",
    tenderNo: "",
    isDccMandatory: true,
    contractFrom: "",
    contractTo: "",
    rcFinalDate: "",
    quotationNo: "",
    acceptanceDate: "",
    financeCommitteDate: "",
    bankName: "",
    branchName: "",
    bankIfscCode: "",
    bankID: "",

    contractedQty: "",
    shelfLife: "",
    noOfBatches: "",
    level: "",
    allocationQty: "",
    taxType: "",
    cgst: "",
    sgst: "",
    rate: "",
    unit: "",
    deliveryDay: "",
    discount: "",
    remarks: "",
    tenderDate: "",

    batchNo: "",
    scheduleNo: "",
    deliveryMode: "",
    challanInvoiceNo: "",
    expiryDate: "",
    mfgDate: "",
  };

  function addFormReducer(state, action) {
    switch (action.type) {
      case "SET_FIELD":
        return { ...state, [action.field]: action.value };
      case "SET_FIELDS":
        return { ...state, ...action.payload };
      case "RESET_FORM":
        return initialState;
      default:
        return state;
    }
  }

  const [errors, seterrors] = useState({
    drugNameErr: "",
    supplierNameErr: "",
    tenderNoErr: "",
    shelfLifeErr: "",
    noOfBatchesErr: "",
    whetherImportedErr: "",
    levelErr: "",
    taxTypeErr: "",
    cgstErr: "",
    sgstErr: "",
    rateUnitErr: "",
    deliveryDayErr: "",
    batchNoErr: "",
    scheduleNoErr: "",
    deliveryModeErr: "",
    challanInvoiceNoErr: "",
    remarksErr: "",
  });

  const [formState, dispatcher] = useReducer(addFormReducer, initialState);
  const dispatch = useDispatch();
  const [existingRCs, setExistingRCs] = useState([]);
  const [drugNameDrpDt, setDrugNameDrpDt] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [whetherImported, setWhetherImported] = useState("No");
  const [drugName, setDrugName] = useState('');
  const [fileName, setFileName] = useState('');

  const [warehouseList, setWarehouseList] = useState([]);
  const [unitDrpData, setUnitDrpData] = useState([]);
  const [addedRows, setAddedRows] = useState([]); // Cart items store karne ke liye
  const [itemDetails, setItemDetails] = useState({ balance_qty: 0 });
  const [prevBatchDetailsDrpData, setPrevBatchDetailsDrpData] = useState([]);
  const [rows, setRows] = useState([]); // handleAddRow ke liye iski bhi zaroorat hai
  const [scheduleList, setScheduleList] = useState([]);
  const [deliveryViewDetails, setDeliveryViewDetails] = useState([]);
  const [deliveryViewModal, setDeliveryViewModal] = useState(false);
  const [isViewBalQtyModal, setIsViewBalQtyModal] = useState(false);

  const [viewDetails, setViewDetails] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [apiData, setApiData] = useState({});
  const poDetails = apiData?.poDetails || {};
  const [modalContent, setModalContent] = useState([]);
  // const [deliveryModeList, setDeliveryModeList] = useState([
  //   { label: "Bus", value: "Bus" },
  //   { label: "Train", value: "Train" },
  //   { label: "Courier", value: "Courier" },
  //   { label: "Transport", value: "Transport" },
  // ]);
  const [deliveryModeList, setDeliveryModeList] = useState([
    { label: "Bus", value: 1 },
    { label: "Train", value: 2 },
    { label: "Courier", value: 3 },
    { label: "Transport", value: 4 },
  ]);
  console.log('rows', rows)

  const [poHeaderData, setPoHeaderData] = useState({
    supplierName: "",
    poType: "",
    poGenerationPeriod: "",
    purchaseOrderDate: "",
    poNo: "",
    supplierBankDetails: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errName = name + "Err";
    dispatcher({ type: "SET_FIELD", field: name, value });

    if (name === 'rate' || name === 'unit') {
      seterrors({ ...errors, rateUnitErr: "" });
    } else {
      seterrors({ ...errors, [errName]: "" });
    }
  };

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    dispatcher({ type: "RESET_FORM" });
  }










  useEffect(() => {

  }, []);



  const fetchsupplierdrugValue = async (selectedSchNo) => {
    try {
      const poNo = rowData?.numPoNo || rowData?.pono || rowData?.poNo;
      const poStoreId = rowData?.numStoreId || rowData?.storeId;
      const delStoreId = formState?.consigneeName;
      const hospCode = 998;

      const onlySchNo = String(selectedSchNo || "").split("^")[0];

      if (poNo && poStoreId && delStoreId && onlySchNo) {
        const data = await getsupplierdrugnames(
          hospCode,
          poStoreId,
          delStoreId,
          onlySchNo,
          poNo
        );

        if (data?.status === 1) {
          const drugList = data.data.map((element) => ({
            label: element?.display,
            value: element?.value,
          }));
          setDrugNameDrpDt(drugList);
        } else {
          setDrugNameDrpDt([]);
        }
      } else {
        console.warn("Missing parameters for drug names API");
      }
    } catch (err) {
      console.error("Failed to fetch drugs.", err);
      setDrugNameDrpDt([]);
    }
  };


  const handleRemoveRow = (index, key) => {
    if (key === "cart") {
      if (addedRows.length > 0) {
        const updatedRows = addedRows
          .filter((_, i) => i !== index)
          .map((r, i) => ({ ...r, columnNo: i + 1 }));
        setAddedRows(updatedRows);
      } else {
        ToastAlert("No rows available", 'error');
      }
    } else {
      if (rows.length > 0) {
        const updatedRows = rows
          .filter((_, i) => i !== index)
          .map((r, i) => ({ ...r, columnNo: i + 1 }));
        setRows(updatedRows);
      } else {
        ToastAlert("No rows available", 'error');
      }
    }

  };

  const fetchbatchdeliveryData = async (selectedItemId) => {
    try {
      const poNo = rowData?.numPoNo || rowData?.pono || rowData?.poNo;
      const poStoreId = rowData?.numStoreId || rowData?.storeId;
      const hospCode = rowData?.hospCode || 998;
      const schNo = formState?.scheduleNo?.split('^')[0];
      const delStoreId = formState?.consigneeName;
      const supplierId = rowData?.numSupplierId || rowData?.supplierId;

      // --- CLEANING LOGIC START ---
      // Agar selectedItemId mein ^ hai, toh use split karke pehla part lo
      const cleanItemId = selectedItemId?.includes('^') ? selectedItemId.split('^')[0] : selectedItemId;

      // itemBrandId ke liye bhi same split logic
      const rawBrandId = rowData?.numItemBrandId || rowData?.itemBrandId || selectedItemId;
      const cleanBrandId = rawBrandId?.includes('^') ? rawBrandId.split('^')[0] : rawBrandId;
      // --- CLEANING LOGIC END ---

      if (cleanItemId && poNo && schNo && supplierId) {
        const data = await getsupplieritemdetails(
          hospCode,
          poStoreId,
          cleanBrandId,   // Clean value
          delStoreId,
          schNo,
          poNo,
          cleanItemId,    // Clean value
          supplierId
        );

        // if (data?.status === 1 && data?.data) {
        //   // DVDMS API response structure handle karein
        //   const resData = Array.isArray(data.data) ? data.data[0] : data.data;
        //   setItemDetails(resData);

        //   // Batch list update karein (Ensure field names match API)
        //   setPrevBatchDetailsDrpData(resData?.batchCombo || resData?.batchList || []);
        //   setUnitDrpData(resData?.unitCombo || []);
        // } else {
        //   setPrevBatchDetailsDrpData([]);
        //   setUnitDrpData([]);
        // }

        if (data?.status === 1 && data?.data) {
          const resData = Array.isArray(data.data) ? data.data[0] : data.data;

          const itemDtl = resData?.itemDtl || resData;

          setItemDetails(itemDtl);
          setPrevBatchDetailsDrpData(resData?.batchCombo || resData?.batchList || []);
          setUnitDrpData(resData?.unitCombo || []);
        } else {
          setItemDetails({ balance_qty: 0 });
          setPrevBatchDetailsDrpData([]);
          setUnitDrpData([]);
        }



      }
    } catch (err) {
      console.error("Failed to fetch batch details.", err);
      setPrevBatchDetailsDrpData([]);
    }
  };
  const fetchsupplierschedulenoData = async (selectedDelStoreId) => {
    try {
      // RowData se values nikalna
      const poNo = rowData?.numPoNo || rowData?.pono || rowData?.poNo;
      const poStoreId = rowData?.numStoreId || rowData?.storeId;

      if (poNo && poStoreId && selectedDelStoreId) {
        const data = await getsupplierscheduleno(poNo, poStoreId, selectedDelStoreId, 998);

        if (data?.status === 1 && Array.isArray(data?.data)) {
          let scheduleListFormatted = data.data.map((element) => ({
            label: element?.display || element?.schNo, // API key ke according check karein
            value: element?.value || element?.schNo,
          }));

          // Schedule List ko update karein (Taaki Schedule dropdown fill ho jaye)
          setScheduleList(scheduleListFormatted);
        } else {
          setScheduleList([]);
        }
      }
    } catch (err) {
      console.log("Failed to fetch schedules.", err);
      setScheduleList([]);
    }
  };


  const loadSupplierDeliveryDetails = async () => {
    try {
      const poNo = rowData?.numPoNo || rowData?.pono || rowData?.poNo;
      const storeId = rowData?.numStoreId || rowData?.storeId;
      const supplierId = rowData?.numSupplierId || rowData?.supplierId;

      if (!poNo || !storeId) {
        console.log("Missing poNo/storeId => ", { poNo, storeId, rowData });
        return;
      }

      const res = await getHpSupplierDeliveryDetails(poNo, storeId, 998);
      console.log("Delivery API Response => ", res);

      const resData = await getHpSupplierDeliveryDetailsdata(poNo, storeId, 998);
      console.log("Supplier Delivery Details Data API Response => ", resData);

      if (res?.status === 1 && res?.data) {
        const poDetails = res?.data?.poDetails || {};
        const prevDeliveryDtls = Array.isArray(res?.data?.prevDeliveryDtls)
          ? res?.data?.prevDeliveryDtls
          : [];
          

        const firstDelivery = prevDeliveryDtls?.[0] || {};

        setExistingRCs(prevDeliveryDtls);

        setWarehouseList([
          {
            label: firstDelivery?.consigneeName || poDetails?.storeDetails || rowData?.strStoreName || "Please Select",
            value: String(firstDelivery?.storeId || storeId || ""),
          },
        ]);

        setScheduleList(
          prevDeliveryDtls.length > 0
            ? prevDeliveryDtls.map((item, index) => ({
              label: String(item?.schNo || index + 1),
              value: String(item?.schNo || index + 1),
            }))
            : [{ label: "1", value: "1" }]
        );

        if (firstDelivery?.transporterName) {
          setDeliveryModeList((prev) => {
            const exists = prev.some(
              (item) =>
                String(item.value).toLowerCase() ===
                String(firstDelivery.transporterName).toLowerCase()
            );
            if (exists) return prev;
            return [
              ...prev,
              {
                label: firstDelivery.transporterName,
                value: firstDelivery.transporterName,
              },
            ];
          });
        }

        dispatcher({
          type: "SET_FIELDS",
          payload: {
            supplierName: supplierId ? String(supplierId) : poDetails?.supplierId ? String(poDetails?.supplierId) : "",
            tenderNo: String(firstDelivery?.storeId || storeId || ""),
            scheduleNo: firstDelivery?.schNo ? String(firstDelivery?.schNo) : "1",
            batchNo: "",
            challanInvoiceNo: firstDelivery?.challanNo ? String(firstDelivery?.challanNo) : "",
            expiryDate: firstDelivery?.challanDate || "",
            mfgDate: "",
            deliveryMode: firstDelivery?.transporterName || "",
            remarks: firstDelivery?.delNo || "",
            contractFrom: poDetails?.financialYear || "",
            acceptanceDate: poDetails?.approvalDate || poDetails?.dtApprDate || rowData?.dtApprDate || "",
            quotationNo: poDetails?.poNo ? String(poDetails?.poNo) : String(poNo || ""),
            bankName: poDetails?.supplierName || selectedSupplier?.label || "",
          },
        });

        setPoHeaderData({
          supplierName: poDetails?.supplierName || selectedSupplier?.label || "",
          poType: poDetails?.poType || rowData?.poType || "",
          poGenerationPeriod: poDetails?.financialYear || rowData?.financialYear || "",
          purchaseOrderDate: poDetails?.approvalDate || poDetails?.dtApprDate || rowData?.dtApprDate || "",
          poNo: poDetails?.poNo ? String(poDetails?.poNo) : String(poNo || ""),
          supplierBankDetails: poDetails?.supplierBankDetails || poDetails?.bankDetails || "",
        });
      } else {
        setExistingRCs([]);
        setWarehouseList([]);
        setScheduleList([]);
      }
    } catch (error) {
      console.error("Failed to fetch supplier delivery details:", error);
      setExistingRCs([]);
      setWarehouseList([]);
      setScheduleList([]);
    }
  };



  useEffect(() => {
    const poNo = rowData?.numPoNo || rowData?.pono || rowData?.poNo;
    const storeId = rowData?.numStoreId || rowData?.storeId;

    if (poNo && storeId) {
      loadSupplierDeliveryDetails();
    }
  }, [rowData]);
  const handleAddRow = () => {
    const newRow = {
      batchNo: "",
      menuFacName: "",
      mfgDate: "",
      expDate: "",
      unit: itemDetails?.unit_id || "",
      unitName: itemDetails?.unit_name || "",
      nhmQty: "",
      totalQty: 0,
      balanceQty: itemDetails?.balance_qty || 0,
      prgId: itemDetails?.hstnum_programme_id || "",
      programmeName: itemDetails?.programme_name || ""
    };

    setRows([...rows, newRow]);
  };

  const handleViewDeliveryDetails = (row) => {
    const formattedData = [{
      // JSON se "itemDetails" uthaya hai
      itemName: apiData?.poDetails?.itemDetails || "-",
      batchNo: "-", // JSON mein batch details nahi hain, isliye "-" rakha hai
      // JSON se "supplierName"
      manufName: apiData?.poDetails?.supplierName || "-",
      mfgDate: "-",
      expDate: "-",
      // JSON ke prevDelDtl array se "challanNo" ya "totalSuppliedQty"
      supplyQty: poDetails?.totalOrderQty || poHeaderData?.totalOrderQty || "0",
      consigneeName: row?.consigneeName || "Location"
    }];

    setModalContent(formattedData);
    setViewModal(true);
  };

  const drugDetailCols = [
    {
      label: "Drug Name",
      key: "itemName",
      // Visibility improve karne ke liye header style
      headerStyle: { backgroundColor: '#097080', color: 'white', fontWeight: 'bold' }
    },
    {
      label: "Batch No.",
      key: "batchNo",
      headerStyle: { backgroundColor: '#097080', color: 'white', fontWeight: 'bold' }
    },
    {
      label: "Manufacturer Name",
      key: "manufName",
      headerStyle: { backgroundColor: '#097080', color: 'white', fontWeight: 'bold' }
    },
    {
      label: "Mfg. Date",
      key: "mfgDate",
      headerStyle: { backgroundColor: '#097080', color: 'white', fontWeight: 'bold' }
    },
    {
      label: "Expiry Date",
      key: "expDate",
      headerStyle: { backgroundColor: '#097080', color: 'white', fontWeight: 'bold' }
    },
    {
      label: "Supply Qty.",
      key: "supplyQty",
      headerStyle: { backgroundColor: '#097080', color: 'white', fontWeight: 'bold' }
    }
  ];


  //   const handleViewDeliveryDetails = async (row) => {
  //   try {
  //     const poNo = rowData?.numPoNo || rowData?.pono || rowData?.poNo;
  //     const poStoreId = rowData?.numStoreId || rowData?.storeId;
  //     const delStoreId = row?.storeId;
  //     const schNo = row?.schNo;

  //     if (!poNo || !poStoreId || !delStoreId || !schNo) {
  //       ToastAlert("Required details not found", "warning");
  //       return;
  //     }

  //     const res = await supplierviewdeliverydetails({
  //       hospCode: 998,
  //       poStoreId,
  //       delStoreId,
  //       schNo,
  //       poNo,
  //     });

  //     console.log("View Delivery Details Response => ", res);

  //     if (res?.status === 1) {
  //       const poDetails = res?.data?.poDetails || {};
  //       const deliveryData = Array.isArray(res?.data?.prevDeliveryDtls)
  //         ? res.data.prevDeliveryDtls[0] || {}
  //         : row || {};

  //       const formattedData = [
  //         { field: "PO No.", value: poDetails?.poNo || poNo || "-" },
  //         { field: "PO Type", value: poDetails?.poType || "-" },
  //         { field: "Supplier Name", value: poDetails?.supplierName || "-" },
  //         { field: "Drug Name", value: poDetails?.itemDetails || "-" },
  //         { field: "Programme Name", value: poDetails?.programmeName || "-" },
  //         { field: "Total Order Qty", value: poDetails?.totalOrderQty || "-" },

  //         { field: "Schedule No.", value: deliveryData?.schNo || "-" },
  //         { field: "Consignee Store Name", value: deliveryData?.consigneeName || "-" },
  //         { field: "Delivery No.", value: deliveryData?.delNo || "-" },
  //         { field: "Supplier Invoice No.", value: deliveryData?.suppReceiptNo || "-" },
  //         { field: "Supplier Invoice Date", value: deliveryData?.suppReceiptDate || "-" },
  //         { field: "Challan No.", value: deliveryData?.challanNo || "-" },
  //         { field: "Challan Date", value: deliveryData?.challanDate || "-" },
  //         { field: "Delivery Mode / Transporter", value: deliveryData?.transporterName || "-" },
  //         { field: "LR No.", value: deliveryData?.lrNo || "-" },
  //         { field: "Delivery Entry Date", value: deliveryData?.delEntryDate || "-" },
  //         { field: "Status", value: deliveryData?.status || "-" },
  //       ];

  //       setDeliveryViewDetails(formattedData);
  //       setDeliveryViewModal(true);
  //     } else {
  //       setDeliveryViewDetails([]);
  //       ToastAlert(res?.msg || "View detail not found", "error");
  //     }
  //   } catch (error) {
  //     console.error("View delivery details error:", error);
  //     ToastAlert("Failed to fetch delivery view details", "error");
  //   }
  // };

  const deliveryViewColumn = [
    { label: "Field", key: "field" },
    { label: "Value", key: "value" },
  ];


  const handleDeleteClick = async (row) => {
    try {
      if (String(row?.accRejFlag) === "1") {
        ToastAlert("Deletion of Record Not Allowed", "warning");
        return;
      }

      if (!window.confirm("Are you sure you want to delete this record?")) {
        return;
      }

      const payload = {
        hospCode: 998,
        poNo: rowData?.numPoNo || rowData?.poNo,
        poStoreId: rowData?.numStoreId || rowData?.storeId,
        delStoreId: row?.storeId,
        schNo: row?.schNo,
      };

      console.log("Delete Payload => ", payload);

      const res = await supplierdeletedeliverydetails(payload);

      if (res?.data?.status === 1 || res?.status === 1) {
        ToastAlert("Deleted Successfully", "success");

        // refresh table
        loadSupplierDeliveryDetails();
      } else {
        ToastAlert(res?.data?.msg || "Delete Failed", "error");
      }

    } catch (error) {
      console.error("Delete error:", error);
      ToastAlert("Something went wrong", "error");
    }
  };

  const closeDeliveryViewModal = () => {
    setDeliveryViewModal(false);
    setDeliveryViewDetails([]);
  };

  const convertToApiDate = (dateStr) => {
    if (!dateStr) return null;

    const months = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04",
      May: "05", Jun: "06", Jul: "07", Aug: "08",
      Sep: "09", Oct: "10", Nov: "11", Dec: "12",
    };

    const parts = String(dateStr).split("-");

    if (parts.length === 3 && months[parts[1]]) {
      return `${parts[2]}-${months[parts[1]]}-${parts[0].padStart(2, "0")}`;
    }

    return dateStr;
  };

  const handleDateChange = (value, fieldName) => {
    const formattedDate = value
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");

    dispatcher({
      type: "SET_FIELD",
      field: fieldName,
      value: formattedDate,
    });
  };


  // 2. SAVE
  const savesupplierdeliverysaveLocal = async () => {
    if (addedRows.length === 0) {
      ToastAlert("Please add at least one drug detail to the table!", "error");
      return;
    }
    if (!formState?.expiryDate) {
      ToastAlert("Please select Challan/Invoice Date", "error");
      return;
    }
    if (addedRows.some(row => !row?.mfgDate || !row?.expDate)) {
      ToastAlert("Mfg Date and Expiry Date are required", "error");
      return;
    }

    if (!formState?.mfgDate) {
      ToastAlert("Please select Expected Delivery Date", "error");
      return;
    }
    const cleanItemId = drugName?.includes("^") ? drugName.split("^")[0] : drugName;
    const cleanScheduleNo = formState?.scheduleNo?.includes("^")
      ? formState.scheduleNo.split("^")[0]
      : formState?.scheduleNo;

    const poNo = rowData?.numPoNo || rowData?.pono || rowData?.poNo || "";
    const poStoreId = rowData?.numStoreId || rowData?.storeId || "";
    const supplierId = rowData?.numSupplierId || rowData?.supplierId || selectedSupplier?.value || "";

    const payload = {
      gnumHospitalCode: 998,
      hstnumPoNo: Number(poNo),
      strPOStoreId: String(poStoreId),
      strScheduleNo: String(cleanScheduleNo || ""),
      strDeliveryStoreId: String(formState?.consigneeName || ""),

      strSupplierReceiptNo: String(formState?.challanInvoiceNo || ""),
      //  hstdtSuppReceiptDate: String(formState?.expiryDate || ""),
      // hstdtSuppReceiptDate: convertToApiDate(formState?.expiryDate),

      // hstnumDeliveryModeId: String(formState?.deliveryMode || ""),
      hstnumDeliveryModeId: Number(formState?.deliveryMode || 1),
      strDeliveryRemark: String(formState?.remarks || ""),
      hstnumExpectedDeliveryDays: Number(formState?.batchNo || 0),


      strSuppReceiptDate: formState?.expiryDate,
      // hstdtChallanDate: formState?.expiryDate,
      // hstdtExpectedDeliveryDate: formState?.mfgDate,


      gstrRemarks: String(formState?.remarks || ""),
      gnumSeatId: 1,

      // strHiddenValue: addedRows.map((row) => {
      //   return [
      //     0,
      //     cleanItemId || "",
      //     0,
      //     0,
      //     row?.batchNo || "",
      //     row?.mfgDate || "",
      //     row?.expDate || "",
      //     row?.unit || "",
      //     0,
      //     0,
      //     row?.deliveredQty || row?.nhmQty || 0,
      //     row?.balanceQty || 0,
      //     fileName || ""
      //   ].join("^");
      // }),
      strHiddenValue: addedRows.map((row) => {
        return [
          0,
          cleanItemId || "0",
          0,
          0,
          row?.batchNo || "NA",
          row?.mfgDate || new Date().toISOString().split("T")[0],
          row?.expDate || new Date().toISOString().split("T")[0],
          row?.unit || "0",
          0,
          0,
          Number(row?.deliveredQty || row?.nhmQty || 0),
          Number(row?.balanceQty || 0),
          fileName || "NA"
        ].join("^");
      }),

      strPrgDtl: addedRows.map((row) => {
        return `${row?.prgId || itemDetails?.hstnum_programme_id || ""}@${row?.programmeName || itemDetails?.programme_name || ""}`;
      })
    };

    console.log("Delivery Save Payload => ", payload);

    try {
      const res = await savesupplierdeliverysave(payload);

      if (res?.status === 1 || res?.status === "1") {
        ToastAlert("Saved Successfully", "success");
        handleReset();
        setRows([]);
        setAddedRows([]);
      } else {
        ToastAlert(res?.msg || "Save Failed", "error");
      }
    } catch (err) {
      console.error("Save Error => ", err);
      ToastAlert("Something went wrong while saving", "error");
    }
  };
  //   const savesupplierdeliverysaveLocal = async () => {
  // if (rows.length === 0) {
  //       ToastAlert("Please add at least one drug detail to the table!", "error");
  //       return;
  //     }
  //  // const cleanBrandId = brandIdStr?.includes('^') ? brandIdStr.split('^')[0] : brandIdStr;
  //     const cleanItemId = drugName?.includes('^') ? drugName.split('^')[0] : drugName;
  //     const payload = {
  //    "gnumHospitalCode": 998,
  //   "hstnumPoNo": 2001,
  //   "strPOStoreId": "10",
  //   "strScheduleNo": "5",
  //   "strDeliveryStoreId": "20",
  //   "strSupplierReceiptNo": "SUPP-REC-001",
  //   "hstdtSuppReceiptDate": "2026-05-13",
  //   "hstnumDeliveryModeId": 1,
  //   "strDeliveryRemark": "Transport via truck",
  //   "hstnumExpectedDeliveryDays": 7,
  //   "gstrRemarks": "Delivery remarks",
  //   "gnumSeatId": 501,
  //   "strHiddenValue": [
  //     "0^101^0^0^BATCH001^2026-01-01^2028-01-01^1^0^0^500^100^file1.pdf",
  //     "0^102^0^0^BATCH002^2026-02-01^2028-02-01^1^0^0^300^50^file2.pdf"
  //   ],
  //   "strPrgDtl": [
  //     "1001@A#1002@B",
  //     "1003@C"
  //   ]
  // };

  //     try {

  //       const res = await savesupplierdeliverysave(payload);

  //       if (res?.status === 1 || res?.status === "1") {
  //         ToastAlert("Saved Successfully", "success");
  //         handleReset();
  //       } else {
  //         ToastAlert(res?.msg || "Save Failed", "error");
  //       }
  //     } catch (err) {
  //       ToastAlert("Something went wrong while saving", "error");
  //     }
  //   };



  const handleSave = () => {
    let isValid = true;

    if (!drugName?.toString()?.trim()) {
      seterrors((prev => ({
        ...prev,
        drugNameErr: "Drug Name is Required!"
      })));
      isValid = false;
    }

    if (isValid) {
      savesupplierdeliverysaveLocal();
    }
  };

  // const drugColumns = [
  //      {
  //     name: "SNo.",
  //     selector: (row) => row.drugName,
  //     sortable: true,
  //   },
  //   {
  //     name: "Drug Name",
  //     selector: (row) => row.drugName,
  //     sortable: true,
  //   },
  //   {
  //     name: "Manufacturer Name",
  //     selector: (row) => row.batchNo,
  //     sortable: true,
  //   },
  //   {
  //     name: "Batch No.",
  //     selector: (row) => row.mfgDate,
  //     sortable: true,
  //   },
  //   {
  //     name: "Expiry Date",
  //     selector: (row) => row.expDate,
  //     sortable: true,
  //   },
  //   {
  //     name: "Mfg. Date",
  //     selector: (row) => row.NPCDCS,
  //     sortable: true,
  //   },
  //    {
  //     name: "Balance Qty. (No.)",
  //     selector: (row) => row.NPCDCS,
  //     sortable: true,
  //   },
  //    {
  //     name: "Delivered Qty. (No.)",
  //     selector: (row) => row.NPCDCS,
  //     sortable: true,
  //   },
  //   {
  //     name: "Action",
  //     cell: (row, index) => (
  //       <button
  //         className="btn btn-outline-danger btn-sm"
  //         onClick={() => {
  //           const updated = addedRows.filter((_, i) => i !== index);
  //           setAddedRows(updated);
  //         }}
  //       >
  //         <FontAwesomeIcon icon={faTrash} />
  //       </button>
  //     ),
  //   },
  // ];
  const drugColumns = [
    {
      name: "SNo.",
      selector: (row) => row?.sno,
      sortable: true,
    },
    {
      name: "Drug Name",
      selector: (row) => row?.drugName,
      sortable: true,
    },
    {
      name: "Manufacturer Name",
      selector: (row) => row?.menuFacName,
      sortable: true,
    },
    {
      name: "Batch No.",
      selector: (row) => row?.batchNo,
      sortable: true,
    },
    {
      name: "Expiry Date",
      selector: (row) => row?.expDate,
      sortable: true,
    },
    {
      name: "Mfg. Date",
      selector: (row) => row?.mfgDate,
      sortable: true,
    },
    {
      name: "Balance Qty. (No.)",
      selector: (row) => row?.balanceQty,
      sortable: true,
    },
    {
      name: "Delivered Qty. (No.)",
      selector: (row) => row?.deliveredQty,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row, index) => (
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => {
            const updated = addedRows.filter((_, i) => i !== index);
            setAddedRows(updated);
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      ),
    },
  ];


  // const handleInputChange = (index, field, value) => {
  //   const updatedRows = [...rows];

  //   if (field === 'batchNo') {
  //     // Dropdown data se selected batch dhoondhein
  //     const selectedBatch = prevBatchDetailsDrpData.find(b => (b.batchNo || b.hststr_batch_no) === value);

  //     if (selectedBatch) {
  //       updatedRows[index] = {
  //         ...updatedRows[index],
  //         batchNo: value,
  //         menuFacName: selectedBatch.supplierName || selectedBatch.manufacturerName,
  //         mfgDate: selectedBatch.manufDate || selectedBatch.mfgDate,
  //         expDate: selectedBatch.expiryDate || selectedBatch.expDate,
  //         // Unit split logic agar value ^ ke sath hai
  //         unit: selectedBatch.unit_id ? selectedBatch.unit_id : updatedRows[index].unit
  //       };
  //     }
  //   } else if (field === 'unit') {
  //     // Unit dropdown select hone par cap value split karein display ke liye
  //     updatedRows[index][field] = value;
  //   } else {
  //     updatedRows[index][field] = value;
  //   }

  //   setRows(updatedRows);
  // };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    if (field === "batchNo") {
      const selectedBatch = prevBatchDetailsDrpData.find(
        b => String(b?.batchNo || b?.hststr_batch_no) === String(value)
      );

      if (selectedBatch) {
        updatedRows[index] = {
          ...updatedRows[index],
          batchNo: value,
          menuFacName: selectedBatch?.supplierName || selectedBatch?.manufacturerName || "",
          mfgDate: selectedBatch?.manufDate || selectedBatch?.mfgDate || "",
          expDate: selectedBatch?.expiryDate || selectedBatch?.expDate || "",
          mfgId: selectedBatch?.mfgId || "",
          balanceQty: itemDetails?.balance_qty || 0,
          unitName: itemDetails?.unit_name || updatedRows[index]?.unitName || "",
        };
      }
    } else if (field === "nhmQty") {
      const qty = Number(value || 0);
      const balanceQty = Number(itemDetails?.balance_qty || 0);

      if (qty > balanceQty) {
        //  ToastAlert(`NHM Free Medicine Qty balance qty ${balanceQty} se jyada nahi ho sakti`, "error");
        ToastAlert(`NHM Free Medicine Qty cannot be greater than balance qty ${balanceQty}`, "error");
        return;
      }

      updatedRows[index] = {
        ...updatedRows[index],
        nhmQty: value,
        totalQty: qty,
        balanceQty: balanceQty,
      };
    } else {
      updatedRows[index] = {
        ...updatedRows[index],
        [field]: value,
      };
    }

    setRows(updatedRows);
  };

  const addToCart = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalFilledQty = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNo = i + 1;

      if (!row?.batchNo) {
        ToastAlert(`Row ${rowNo}: Please select Batch No`, "error");
        return;
      }

      if (!row?.mfgDate) {
        ToastAlert(`Row ${rowNo}: Manufacturing Date should not empty`, "error");
        return;
      }

      if (!row?.expDate) {
        ToastAlert(`Row ${rowNo}: Expiry Date should not empty`, "error");
        return;
      }

      const expDate = new Date(row.expDate);
      expDate.setHours(0, 0, 0, 0);

      if (expDate <= today) {
        ToastAlert(`Row ${rowNo}: Expiry date must be greater than current date`, "error");
        return;
      }

      if (!row?.unit) {
        ToastAlert(`Row ${rowNo}: Please select Unit`, "error");
        return;
      }

      if (!row?.nhmQty || Number(row?.nhmQty) <= 0) {
        ToastAlert(`Row ${rowNo}: NHM Free Medicine quantity should not empty`, "error");
        return;
      }

      totalFilledQty += Number(row?.nhmQty || 0);
    }

    const balanceQty = Number(itemDetails?.balance_qty || 0);

    if (totalFilledQty > balanceQty) {
      ToastAlert(`Total quantity ${balanceQty} se jyada nahi ho sakti`, "error");
      return;
    }

    setAddedRows(rows.map((r, i) => ({
      ...r,
      sno: i + 1,
      drugName: drugNameDrpDt?.find(d => String(d.value) === String(drugName))?.label || "",
      deliveredQty: r?.nhmQty,
    })));

    if (totalFilledQty === balanceQty) {
      setRows([]);
    }
  };

  // const addToCart = () => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   for (let i = 0; i < rows.length; i++) {
  //     const row = rows[i];
  //     const rowNo = i + 1;

  //     if (!row?.batchNo) {
  //       ToastAlert(`Row ${rowNo}: Please select Batch No`, 'error');
  //       return;
  //     }

  //     if (!row?.mfgDate) {
  //       ToastAlert(`Row ${rowNo}: Manufacturing Date should not empty`, 'error');
  //       return;
  //     }

  //     if (!row?.expDate) {
  //       ToastAlert(`Row ${rowNo}:  Expiry Date should not empty`, 'error');
  //       return;
  //     }

  //     const expDate = new Date(row.expDate);
  //     expDate.setHours(0, 0, 0, 0);

  //     if (expDate <= today) {
  //       ToastAlert(`Row ${rowNo}: Expiry date must be greater than current date`, 'error');
  //       return;
  //     }

  //     if (!row?.unit) {
  //       ToastAlert(`Row ${rowNo}: Please select Unit`, 'error');
  //       return;
  //     }

  //     if (!row?.NPCDCS) {
  //       ToastAlert(`Row ${rowNo}: total quantity should not empty`, 'error');
  //       return;
  //     }
  //   }

  //   setAddedRows(rows);
  // };
  const mstModalColumn = [
    { label: "Location", key: "consigneeName" },
    { label: "General", key: "programmeName" },
    { label: "Tot. Qty", key: "totalOrderQty" },
  ];

  const onCloseModal = () => {
    setViewModal(false);
    setViewDetails([]);
  };

  const existingsupplierDeliveryTableCols = [
    {
      name: (<span>Schedule No.</span>),
      selector: row => row?.schNo,
      sortable: true,
      wrap: true,
      // width: "20%"
    },
    {
      name: (<span>Consignee Store Name</span>),
      selector: row => row?.consigneeName,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Delivery No.</span>),
      selector: row => row?.delNo,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Supplier Invoice No.</span>),
      selector: row => row?.suppReceiptNo,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Supplier Invoice Date</span>),
      selector: row => row?.suppReceiptDate,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Delivery Detail</span>),
      selector: row => row?.transporterName,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Status</span>),
      selector: row => row?.status,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Action</span>),
      cell: (row) => {

        const accRejFlag = String(row?.accRejFlag || "0");

        return (
          <div className="d-flex gap-2 justify-content-center align-items-center w-100">

            {/* DELETE */}
            {accRejFlag === "1" ? (
              <button
                className="btn btn-secondary btn-sm px-2 py-1 rounded rounded-5"
                disabled
                title="Deletion of Record Not Allowed"
                style={{ cursor: "not-allowed", opacity: 0.6 }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            ) : (
              <button
                className="btn btn-danger btn-sm px-2 py-1 rounded rounded-5"
                title="Delete Record"
                onClick={() => handleDeleteClick(row)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}

            {/* VIEW */}
            <button
              className="btn btn-info btn-sm px-2 py-1 rounded rounded-5 text-white"
              title="View Record"
              onClick={() => handleViewDeliveryDetails(row)}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>

          </div>
        );
      },
    }

  ]



  return (
    <section className="unified-wrapper">
      <h3 className="unified-wrapper__heading">
        Supplier Delivery Details
      </h3>

      <div className="unified-wrapper__container">
        <h4 className="unified-wrapper__container-heading">
          Supplier Delivery Details
        </h4>

        <div className="row">
          <div className="col-md-6">
            <label htmlFor="supplierName" className="Wrapper__label mb-0">
              <b>Supplier Name</b> : {poHeaderData?.supplierName || selectedSupplier?.label || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label htmlFor="supplierName" className="Wrapper__label mb-0">
              <b>PO Type</b> : {poHeaderData?.poType || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label htmlFor="supplierName" className="Wrapper__label mb-0">
              <b>PO Generation Period</b> : {poHeaderData?.poGenerationPeriod || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label htmlFor="supplierName" className="Wrapper__label mb-0">
              <b>Purchase Order Date</b> : {poHeaderData?.purchaseOrderDate || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label htmlFor="supplierName" className="Wrapper__label mb-0">
              <b>PO No</b> : {poHeaderData?.poNo || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label htmlFor="supplierName" className="Wrapper__label mb-0">
              <b>Supplier Bank Details:</b> : {poHeaderData?.supplierBankDetails || "-"}
            </label>
          </div>
        </div>
      </div>

      <h5 className="bg-[#097080] text-white p-1 rounded">
        Supplier Delivery Details
      </h5>



      <div style={{ marginBottom: "3rem" }}>
        <ReactDataTable
          column={existingsupplierDeliveryTableCols}
          data={existingRCs}
          isSearchReq={false}
          isPagination={false}
          showSerialNumber={true}
        />
      </div>



      <div className="unified-wrapper__container">
        <h4 className="unified-wrapper__container-heading">
          Supplier Delivery Details
        </h4>




        <div>
          <ComboDropDown
            options={warehouseList}
            onChange={(e) => {
              handleChange(e); // State update karne ke liye
              fetchsupplierschedulenoData(e.target.value); // Direct API hit selected ID ke saath
            }}
            name={"consigneeName"}
            value={formState?.consigneeName}
            label={"Consignee Warehouse::"}
            isRequired
          />
          {errors?.consigneeNameErr && (
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.consigneeNameErr}
            </span>
          )}
        </div>



        <ComboDropDown
          options={scheduleList}
          onChange={(e) => {
            const onlySchNo = String(e.target.value || "").split("^")[0];

            dispatcher({
              type: "SET_FIELD",
              field: "scheduleNo",
              value: e?.target?.value,
            });

            seterrors({ ...errors, scheduleNoErr: "" });

            fetchsupplierdrugValue(onlySchNo);
          }}
          name={"scheduleNo"}
          value={formState?.scheduleNo}
          label={"Schadule no:"}
          isRequired
        />



        <div>
          {/* <InputField
            id="batchNo"
            className="Wrapper__inputs"
            type="text"
            name="batchNo"
            placeholder="Enter Expected Delivery Days:"
            value={formState?.batchNo}
            onChange={handleChange}
            label={"Expected Delivery Days::"}
            isRequired
          /> */}

          <InputField
            id="batchNo"
            className="Wrapper__inputs"
            type="number"
            name="batchNo"
            placeholder="Enter Expected Delivery Days:"
            value={formState?.batchNo}
            onChange={handleChange}
            label={"Expected Delivery Days::"}
            isRequired
          />
          {errors?.batchNoErr && (
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.batchNoErr}
            </span>
          )}
        </div>

        <div>
          <DatePickerComponent
            selectedDate={formState.mfgDate}
            setSelectedDate={(e) => handleDateChange(e, "mfgDate")}
            labelText={"Expected Delivery Date:"}
            labelFor={"mfgDate"}
            name={"mfgDate"}
            allowMin={true}
            isRequired
          />
        </div>

        <div>
          <InputField
            id="challanInvoiceNo"
            className="Wrapper__inputs"
            type="text"
            name="challanInvoiceNo"
            placeholder="Enter Challan/Invoice No.:"
            value={formState?.challanInvoiceNo}
            onChange={handleChange}
            label={"Challan/Invoice No.:"}
            isRequired
          />
          {errors?.challanInvoiceNoErr && (
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.challanInvoiceNoErr}
            </span>
          )}
        </div>

        <div>
          <DatePickerComponent
            selectedDate={formState.expiryDate}
            setSelectedDate={(e) => handleDateChange(e, "expiryDate")}
            labelText={"Challan/Invoice Date"}
            labelFor={"expiryDate"}
            name={"expiryDate"}
            allowMin={true}
            isRequired
          />
        </div>

        <div>
          <ComboDropDown
            options={deliveryModeList}
            onChange={handleChange}
            name={"deliveryMode"}
            value={formState?.deliveryMode}
            label={"*Delivery Mode:"}
            isRequired
          />
          {errors?.deliveryModeErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.deliveryModeErr}
            </span>
          }
        </div>

        <div>
          <label htmlFor="remarks" className="Wrapper__label">
            Delivery Detail :
          </label>
          <textarea
            id="remarks"
            className="Wrapper__inputs"
            type="text"
            name={"remarks"}
            placeholder="Enter here..."
            value={formState?.remarks}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="unified-wrapper__container">
        <h4 className="unified-wrapper__container-heading">
          Delivery Drug Details
        </h4>

        <div>
          <ComboDropDown
            options={drugNameDrpDt}
            name={"drugName"}
            value={drugName}
            label={"Drug Name :"}
            onChange={(e) => {
              const selectedValue = e?.target?.value;
              setDrugName(selectedValue); // State update
              seterrors({ ...errors, drugNameErr: "" }); // Error clear

              if (selectedValue) {
                fetchbatchdeliveryData(selectedValue); // API hit
              }
            }}
          />
          {errors?.drugNameErr && (
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.drugNameErr}
            </span>
          )}
        </div>

        {/* --- Ye section tabhi show hoga jab drugName select hoga --- */}

      </div>

      {drugName && (
        <>
          <div className="table-responsive mt-1" style={{ maxHeight: "65vh" }}>
            <table className="table text-center mb-0 table-bordered" style={{ borderColor: "#23646e" }}>
              <thead className="text-white">
                <tr className='m-0' style={{ fontSize: "12px", verticalAlign: "middle", backgroundColor: "#23646e" }}>
                  <th className='p-1'>{'Batch No.'}</th>
                  <th className='p-1'>{'Manufacture Name'}</th>
                  <th className='p-1'>{'Mfg. Date[dd-Mon-yyyy]'}</th>
                  <th className='p-1'>{'Expiry Date'}</th>
                  <th className='p-1'>{'Unit'}</th>

                  <th className='p-1'>{'NHM Free Medicine'}</th>
                  <th className='p-1'>{'Total Qty. (Unit) '}</th>
                  <th className='p-1'>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleAddRow}
                      style={{ padding: "0 4px" }}
                    >
                      <FontAwesomeIcon icon={faAdd} size='sm' />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className='' style={{ fontSize: "11px" }}>
                  <td className='p-1 text-end' colSpan={5}>Balance Qty. (InUnit)</td>
                  <td className='p-1 fw-bolder text-center'>
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 fw-bold"
                      onClick={() => setIsViewBalQtyModal(true)}
                    >
                      {itemDetails?.balance_qty || 0}
                    </button>
                  </td>
                  {/* <td className='p-1 fw-bolder text-info-emphasis text-center cursor-pointer'
                    onClick={() => { setIsViewBalQtyModal(true) }}
                  >{itemDetails?.balance_qty}</td> */}
                  {/* <td className='p-1'>{itemDetails?.balance_qty}</td> */}
                  <td className='p-1'>
                    {itemDetails?.balance_qty || 0}
                  </td>
                  <td></td> {/* Empty TD for alignment */}
                </tr>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td className='p-1'>
                      <select
                        name="batchNo"
                        className="form-select form-select-sm"
                        value={row?.batchNo}
                        onChange={(e) => handleInputChange(index, 'batchNo', e.target.value)}
                      >
                        <option value="">Select</option>
                        {prevBatchDetailsDrpData?.map((drg, idx) => (
                          <option value={drg?.batchNo || drg?.hststr_batch_no} key={idx}>
                            {drg?.batchNo || drg?.hststr_batch_no}
                          </option>
                        ))}
                      </select>

                    </td>
                    <td className='p-1'><input className="form-control form-control-sm" type="text" name='menuFacName' value={row?.menuFacName} readOnly /></td>
                    <td className='p-1'><input className="form-control form-control-sm" type="text" name='mfgDate' value={row?.mfgDate} readOnly /></td>
                    <td className='p-1'><input className="form-control form-control-sm" type="text" name='expDate' value={row?.expDate} readOnly /></td>
                    <td className='p-1'>
                      <select name='unit' value={row?.unit} className="form-select form-select-sm" onChange={(e) => handleInputChange(index, 'unit', e.target.value)}>
                        <option value="">Select</option>
                        {unitDrpData?.map((unit, idx) => (<option key={idx} value={unit?.unit_id}>{unit?.unit_name}</option>))}
                      </select>
                    </td>

                    {/* <td className='p-1'><input className="form-control form-control-sm" type="text" name='balance_qty' value={row?.balance_qty} onChange={(e) => handleInputChange(index, 'balance_qty', e.target.value)} /></td>
                    <td className='p-1'>{row?.balance_qty ? row?.balance_qty : 0}</td> */}
                    <td className='p-1'>
                      <input
                        className="form-control form-control-sm"
                        type="number"
                        name="nhmQty"
                        value={row?.nhmQty || ""}
                        max={itemDetails?.balance_qty || 0}
                        onChange={(e) => handleInputChange(index, "nhmQty", e.target.value)}
                      />
                    </td>

                    {/* <td className='p-1'>
                      {itemDetails?.balance_qty ? itemDetails?.balance_qty : 0}
                    </td> */}
                    <td className='p-1'>
                      {row?.nhmQty ? row?.nhmQty : 0}
                    </td>
                    <td className='p-1'>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => handleRemoveRow(index)} style={{ padding: "0 4px" }}>
                        <FontAwesomeIcon icon={faMinus} size='sm' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='text-end pt-2'>
              {rows?.length > 0 &&
                <button className="btn btn-secondary btn-sm" onClick={addToCart}>
                  <FontAwesomeIcon icon={faPlus} className="mr-1 fw-bold text-warning" size='lg' />
                  Add To Cart
                </button>}
            </div>
          </div>

          {/* Added Drug Details Section */}
          <div className="flex items-center mb-2 mt-6">
            <div className="w-10 border-1 border-[#097080]"></div>
            <span className="mx-3 font-bold text-[#097080]">Added Drug Details</span>
            <div className="flex-grow border-1 border-[#097080]"></div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <ReactDataTable title={'drugDetails'} column={drugColumns} data={addedRows} isSearchReq={false} isPagination={false} />
          </div>
        </>
      )}


      {viewModal &&
        <MasterPopUpModal
          title={'EMD Details'}
          onCloseModal={onCloseModal}
          column={mstModalColumn}
          data={viewDetails}
        />
      }



      {
        viewModal && (
          <MasterPopUpModal
            // Title block ko dark rakha hai visibility ke liye
            title={
              <div className="text-white bg-[#097080] p-2 rounded-t w-full">
                Drug Details For [ {modalContent[0]?.consigneeName} ]
              </div>
            }
            onCloseModal={() => setViewModal(false)}
            data={modalContent}
            column={drugDetailCols}
            customHeader={
              <div className="p-3 border-b bg-gray-50">
                <span className="text-blue-800 font-extrabold underline text-lg">
                  Programme Name :: {apiData?.poDetails?.programmeName || 'BASP'}
                </span>
              </div>
            }
          />
        )}





      <BottomButtons
        isSave={true}
        isReset={true}
        isClose={true}
        onSave={() => handleSave('0')}
        onReset={handleReset}
        onClose={handleClose}
        onDraft={() => handleSave('1')}
        isDraft={true}
      />



    </section>




  );
};

export default SupplierDeliveryDetails;
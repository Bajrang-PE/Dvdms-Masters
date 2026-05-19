

import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { ComboDropDown } from '../../../../commons/FormElements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faPlus, faEye, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import {

  getHpRcDrugCmbWithBrand,

  
  getHpRcSuppLevelCombo,

  
  getHpRcUnitCombo,
  saveHpRcFileUpload
} from '../../../../../api/Himachal/services/rateContractAPI_HP';
import { ToastAlert } from '../../../../../utils/Toast';
import BottomButtons from '../../../../commons/BottomButtons';
import MasterPopUpModal from '../../../../commons/MasterPopUpModal';
import ReactDataTable from '../../../../commons/ReactDataTable';
import { getHpViewDetails } from '../../../../../api/Himachal/services/suppInterfaceAPI_HP';

const SupplierViewDetails = (props) => {
  console.log("SupplierViewDetails COMPONENT OPENED");

  const { selectedSupplier, rowData } = props;

  const { value: storeID } = useSelector((state) => state.himachalMst.storeID);
  const { value: contractID } = useSelector((state) => state.himachalMst.contractDetails);

  const initialState = {
    supplierName: "",
    tenderNo: "",
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

  const [formState, dispatcher] = useReducer(addFormReducer, initialState);
  const dispatch = useDispatch();
  const dataTableRef = useRef();

  const [errors, seterrors] = useState({ drugNameErr: "" });
  const [existingRCs, setExistingRCs] = useState([]);
  const [bgList, setBgList] = useState([]);
  const [levelType, setLevelType] = useState([]);
  const [unitDrpDt, setUnitDrpDt] = useState([]);
  const [drugNameDrpDt, setDrugNameDrpDt] = useState([]);
  const [drugName, setDrugName] = useState('');
  const [drugBrandList, setDrugBrandList] = useState([]);
  const [tenderNoList, setTenderNoList] = useState([]);
  const [fileName, setFileName] = useState('');
  const [viewDetails, setViewDetails] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [taxTypes, setTaxTypes] = useState([]);
  const [apiData, setApiData] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [whetherImported, setWhetherImported] = useState("No");
  // Ye state add karein
const [modalContent, setModalContent] = useState([]);

const [balanceModal, setBalanceModal] = useState(false);
const [balanceData, setBalanceData] = useState(null);

  const poDetails = apiData?.poDetails || {};

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    dispatcher({ type: "RESET_FORM" });
  }

  useEffect(() => {
    if (!rowData) return;

    const poNo = rowData?.numPoNo || "" ;
    const poStoreId = rowData?.numStoreId || 0;
    const delStoreId = rowData?.numStoreId  || 0;
    const poType = rowData?.numPoTypeId  || 28;

    const params = {
      hospCode: 998,
      poStoreId: poStoreId,
      delStoreId: delStoreId,
      poNo: poNo,
      poTypeId: poType,
      itemCat: 10100054
    };

    console.log("VIEW PARAMS =====>", params);

    getHpViewDetails(params)
      .then((res) => {
        console.log("VIEW RESPONSE =====>", res);

        if (res?.status === 1) {
          const data = res?.data || {};
          setApiData(data);

          if (data?.drugList?.length > 0) {
            const drugOptions = data.drugList.map((item) => ({
              value: item?.value,
              label: item?.display,
            }));

            setDrugNameDrpDt(drugOptions);
            setDrugName(drugOptions[0]?.value || "");
          } else {
            setDrugNameDrpDt([]);
            setDrugName("");
          }

          if (data?.prevDelDtl?.length > 0) {
         //   setSelectedRow(data.prevDelDtl[0]);
         console.log("Data loaded, waiting for user to click radio button");
          } else {
            setSelectedRow(null);
          }
        } else {
          setApiData({});
          setDrugNameDrpDt([]);
          setDrugName("");
          setSelectedRow(null);
        }
      })
      .catch((err) => {
        console.error("VIEW API ERROR =====>", err);
      });

  }, [rowData]);



  useEffect(() => {
    if (formState?.supplierName && formState?.tenderNo) {
      getContractDetailsOnSuppliers(formState?.supplierName, formState?.tenderNo);
    }
  }, [formState?.tenderNo]);








  const getDrugWithBrandIdDrpDt = () => {
    getHpRcDrugCmbWithBrand(998, 'ACTIVE')?.then((res) => {
      if (res?.status === 1) {
        setDrugBrandList(res?.data
          ?.filter(dt => dt?.value !== '0')
          ?.map((dt) => ({
            value: dt?.value,
            label: dt?.display,
          })) || []);
      } else {
        setDrugBrandList([]);
      }
    });
  };

  useEffect(() => {
 
    getDrugWithBrandIdDrpDt();

  }, []);



  useEffect(() => {
    if (formState?.supplierName) {
      getContractDetailsWithTender();
    }
  }, [formState?.supplierName]);

  const handleSave = (draft) => {
    let isValid = true;

    if (!drugName?.toString()?.trim()) {
      seterrors((prev) => ({ ...prev, drugNameErr: "Drug Name is Required!" }));
      isValid = false;
    }

    if (isValid) {
      saveContractdetails(draft);
    }
  };

  const saveContractdetails = (isdraft) => {
    const y = new Date().getFullYear();

    const val = {
      gnumHospitalCode: 998,
      hstnumContractTypeId: contractID,
      hstnumSupplierId: parseInt(formState?.supplierName),
      hstnumStoreId: storeID,
      hstnumItemBrandId: parseInt(drugName),
      gnumSeatid: 10001,
      hstnumItemId: parseInt(drugName?.split('^')[1] || 0),
      hststrTenderNo: formState?.tenderNo?.toString(),
      hstnumContractQty: parseInt(formState?.contractedQty),
      hstnumShelfLife: parseInt(formState?.shelfLife),
      hstnumBatchSize: parseInt(formState?.noOfBatches),
      hstnumImportedFlag: whetherImported === "Yes" ? 1 : 0,
      sstnumLevelTypeId: parseInt(formState?.level),
      hstnumAllocationOrderQty: parseInt(formState?.allocationQty),
      hstnumTaxType: parseInt(formState?.taxType),
      hstnumRateUnitid: parseInt(formState?.unit?.split('^')[0]),
      hstnumRate: parseInt(formState?.rate),
      hstnumDeliveryDays: parseInt(formState?.deliveryDay),
      hstnumCgst: parseInt(formState?.cgst),
      hstnumSgst: parseInt(formState?.sgst),
      hstnumDiscount: parseInt(formState?.discount),
      gstrRemarks: formState?.remarks,
      hstdtContractFrmdate: new Date(formState?.contractFrom),
      hstdtContractTodate: new Date(formState?.contractTo),
      hstnumRcNo: "",
      hstdtFinancialStartDate: `${y - 1}-04-01T00:00:00`,
      hstdtFinancialEndDate: `${y}-03-31T00:00:00`,
      hstdtTenderDate: new Date(formState?.tenderDate),
      sstnumItemCatNo: 10,
      hststrFileName: fileName,
      strDraftFlag: isdraft
    };

    
  };

  const onCloseModal = () => {
    setViewModal(false);
    setViewDetails([]);
  };

const existingBillTableCols = [
  {
    name: "#",
    cell: (row) => (
      <input
        type="radio"
        name="locationSelect"
        checked={selectedRow?.pkKey === row?.pkKey}
        onChange={() => setSelectedRow(row)}
      />
    ),
    width: "60px",
  },
  {
    name: "Location",
    // Selector ko cell/render se replace kiya hai hyperlink banane ke liye
    cell: (row) => (
      <span 
        style={{ 
          color: "#1d4ed8", 
          textDecoration: "underline", 
          fontWeight: "bold", 
          cursor: "pointer" 
        }}
        onClick={() => {
          setBalanceData(row); // User data set karne ke liye
          setBalanceModal(true); // Modal open karne ke liye
        }}
      >
        {row?.consigneeName || "N/A"}
      </span>
    ),
    sortable: true,
    wrap: true,
  },
  {
    name: "NHM Free Medicine",
    selector: row => poDetails?.programmeName || "N/A",
    sortable: true,
    wrap: true,
  },
  {
    name: "Tot. Qty",
    selector: row => poDetails?.totalOrderQty || 0,
    sortable: true,
  },
];



  // const existingBillTableCols = [
  //   {
  //     name: "#",
  //     cell: (row) => (
  //       <input
  //         type="radio"
  //         name="locationSelect"
  //         checked={selectedRow?.pkKey === row?.pkKey}
  //         onChange={() => setSelectedRow(row)}
  //       />
  //     ),
  //     width: "60px",
  //   },
  //   {
  //     name: "Location",
  //     selector: row => row?.consigneeName || "N/A",
  //     sortable: true,
  //     wrap: true,
  //   },
  //   {
  //     name: "NHM Free Medicine",
  //     selector: () => poDetails?.programmeName || "N/A",
  //     sortable: true,
  //     wrap: true,
  //   },
  //   {
  //     name: "Tot. Qty",
  //     selector: () => poDetails?.totalOrderQty || 0,
  //     sortable: true,
  //   },
  // ];


 const existingDeliveryTableCols = [
     
    {
      name: (<span>Schedule No.</span>),
      selector: row => row?.schNo,
      sortable: true,
      wrap: true,
      // width: "20%"
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
      selector: row => row?.consigneeName,
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
       // supplyQty: poDetails?.totalOrderQty || apiData?.poDetails?.totalOrderQty|| "0",
        supplyQty: poDetails?.totalOrderQty || res?.data?.poDetails?.totalOrderQty || "0",
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


  const mstModalColumn = [
    { label: "Location", key: "consigneeName" },
    { label: "General", key: "programmeName" },
    { label: "Tot. Qty", key: "totalOrderQty" },
  ];


  console.log("rowData =====>", rowData);

  return (
    <section className="unified-wrapper">
      <h3 className="unified-wrapper__heading">
        Supplier Acceptance View
      </h3>

      <div className="unified-wrapper__container">
        <h4 className="unified-wrapper__container-heading">
          Supplier Acceptance View
        </h4>

        <div className="row">
          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Supplier Name</b> : {poDetails?.supplierName || selectedSupplier?.label || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>PO Type</b> : {poDetails?.poType || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>PO Generation Period</b> : {poDetails?.financialYear || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Purchase Order Date</b> : {poDetails?.approvalDate || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>PO No.</b> : {poDetails?.poNo || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <ComboDropDown
              options={drugNameDrpDt}
              onChange={(e) => {
                setDrugName(e?.target?.value);
                seterrors({ ...errors, drugNameErr: "" });
              }}
              name={"drugName"}
              value={drugName}
              label={"Drug Name :"}
            />
            {errors?.drugNameErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.drugNameErr}
              </span>
            }
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Default Pack Size</b> : {poDetails?.itemDetails || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Manufacturer</b> : {poDetails?.supplierName || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Make</b> : {poDetails?.itemCategoryName || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Rate/Unit</b> : {poDetails?.poNetAmount || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Tax(%)</b> : {poDetails?.taxAmount ?? "0"}
            </label>
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Total Rate(One Unit)</b> : {poDetails?.poNetAmount || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Download Purchase Order</b> : {poDetails?.fileName || "-"}
            </label>
          </div>
        </div>
      </div>

      <h5 className="bg-[#097080] text-white p-1 rounded">
        Supplier Acceptance View
      </h5>

      <div style={{ marginBottom: "3rem" }}>
        <ReactDataTable
          column={existingBillTableCols}
          data={apiData?.prevDelDtl || []}
          isSearchReq={false}
          isPagination={false}
          showSerialNumber={true}
        />
      </div>


      {/* Radio button click hone par  */}
{selectedRow && (
    <>
        <h5 className="bg-[#097080] text-white p-1 rounded">
            Delivery Detail(s):
        </h5>

        <div style={{ marginBottom: "3rem" }}>
            <ReactDataTable
                column={existingDeliveryTableCols}
                data={apiData?.prevDelDtl || []}
                isSearchReq={false}
                isPagination={false}
                showSerialNumber={true}
            />
        </div>
    </>
)}



      <div className="unified-wrapper__container">
        <h4 className="unified-wrapper__container-heading">
          Purchase Detail(s):
        </h4>

        <div className="row">
          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>PO Reference</b> : {poDetails?.poPrefix || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Total PO Cost (INR)</b> : {poDetails?.poNetAmount || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Remarks</b> : {poDetails?.poRemarks || "-"}
            </label>
          </div>

            <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Purchage Commit Date</b> : {poDetails?.purchaseCommitteeDate || "-"}
            </label>
          </div>
        </div>
      </div>

      <div className="unified-wrapper__container">
        <h4 className="unified-wrapper__container-heading">
          Component Details
        </h4>

        <div className="row">
          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Supplier Conditions</b> : {poDetails?.purchaseSourceDetails || "-"}
            </label>
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Terms And Conditions</b> : {poDetails?.poRemarks || "-"}
            </label>
          </div>

            <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Test</b> : {poDetails?.poRemarks || "-"}
            </label>
          </div>

            <div className="col-md-6">
            <label className="Wrapper__label mb-0">
              <b>Receipt</b> : {poDetails?.poRemarks || "-"}
            </label>
          </div>
        </div>
      </div>

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





{
balanceModal && (
  <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-50">
    <div className="bg-white border-2 border-green-900 w-[500px] shadow-2xl">
      {/* Dynamic Header */}
      <div className="bg-[#097080] text-white p-2 flex justify-between items-center font-bold">
        <span>{balanceData?.consigneeName || "Location"} - Drug Bal. Qty. Detail(s)</span>
        <button onClick={() => setBalanceModal(false)} className="bg-red-600 px-2 rounded text-white">X</button>
      </div>

      {/* Calculation Body using JSON values */}
      <div className="p-4 text-sm font-bold space-y-1">
        <div className="flex justify-between">
          <span>Ordered Qty. [A] =</span> 
          <span>{apiData?.data?.poDetails?.totalOrderQty || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Stop Qty. [B] =</span> 
          <span>0</span>
        </div>
        <div className="flex justify-between">
          <span>Supply Qty. till Date [C] =</span> 
          <span>{apiData?.data?.poDetails?.totalSuppliedQty || 0}</span>
        </div>
        <div className="flex justify-between"><span>Rejected Qty. till Date [D] =</span> <span>0</span></div>
        <div className="flex justify-between"><span>Shortage Qty. till Date [E] =</span> <span>0</span></div>
        <div className="flex justify-between"><span>Rejected Qty. After Verify [F] =</span> <span>0</span></div>
        <div className="flex justify-between"><span>Supplier Return Qty. [G] =</span> <span>0</span></div>
        <div className="flex justify-between border-b-2 border-black pb-1">
          <span>Replacement Order Qty. till Date [H] =</span> <span>0</span>
        </div>

        {/* Dynamic Formula Display */}
        {(() => {
          const a = apiData?.data?.poDetails?.totalOrderQty || 0;
          const c = apiData?.data?.poDetails?.totalSuppliedQty || 0;
          const balance = a - c; // (A-B)-(C-D-E-H) assuming others are 0
          
          return (
            <div className="bg-white pt-2 text-[12px] leading-relaxed">
              Balanced Qty. [(A-B)-(C-D-E-H)] = ({a}-0)-({c}-0-0-0) = 
              <span className="text-blue-800 ml-1 text-lg font-black">{balance}</span>
            </div>
          );
        })()}
      </div>
      
      <div className="bg-[#097080] h-2 w-full"></div>
    </div>
  </div>
)}


      <BottomButtons
        isSave={false}
        isReset={false}
        isClose={true}
        onSave={() => handleSave('0')}
        onReset={handleReset}
        onClose={handleClose}
        onDraft={() => handleSave('1')}
        isDraft={false}
      />
    </section>
  );
};

export default SupplierViewDetails;

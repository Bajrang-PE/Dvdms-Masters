

// export default SupplierBillDetails
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { DatePickerComponent, InputField } from '../../../../commons/FormElements';
import DataTable from '../../../../commons/Datatable';
import { addHpRcDetails, getHpRcListData, saveHpRcFileUpload } from '../../../../../api/Himachal/services/rateContractAPI_HP';
import { ToastAlert } from '../../../../../utils/Toast';
import BottomButtons from '../../../../commons/BottomButtons';
import MasterPopUpModal from '../../../../commons/MasterPopUpModal';
import ReactDataTable from '../../../../commons/ReactDataTable';
import { supplierbilldetails, supplierbillsave } from '../../../../../api/Himachal/services/suppInterfaceAPI_HP';

// const supplierbilldetails = (props) => {
//   const { selectedSupplier } = props;
const SupplierBillDetails = (props) => {
  const { selectedSupplier, rowData } = props;

  const dispatch = useDispatch();
  const dataTableRef = useRef();

  const { value: storeID } = useSelector((state) => state.himachalMst.storeID);
  const { value: contractID } = useSelector((state) => state.himachalMst.contractDetails);

  // States
  const [existingRCs, setExistingRCs] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleClose = () => dispatch(hidePopup());
  
  const handleReset = () => {
    setSelectedRow(null);
    setSelectedFile(null);
    setFileName('');
  };

 

 


const existingBillTableCols = [
  {
    name: "#",
    cell: (row) => (
      <input
        type="radio"
        name="rowSelect"
        checked={selectedRow?.numScheduleNo === row?.numScheduleNo}
        onChange={() => setSelectedRow(row)}
      />
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: "60px",
  },
  {
    name: <span>Schedule No.</span>,
    selector: row => row?.numScheduleNo,
    sortable: true,
    wrap: true,
  },
  {
    name: <span>Consignee Store Name</span>,
    selector: row => row?.strStoreName,
    sortable: true,
    wrap: true,
  },
  {
    name: <span>Delivery No.</span>,
    selector: row => row?.strDeliveryNo,
    sortable: true,
    wrap: true,
  },
  {
    name: <span>Delivery Date.</span>,
    selector: row => row?.dtDeliveryDate,
    sortable: true,
    wrap: true,
  },
  {
    name: <span>Delivery Detail</span>,
    selector: row => row?.strDeliveryDetail,
    sortable: true,
    wrap: true,
  },
  {
    name: <span>Status</span>,
    selector: row => row?.strStatus,
    sortable: true,
    wrap: true,
  },
  {
    name: <span>Bill Upload Date</span>,
    selector: row => row?.dtBillUploadDate,
    sortable: true,
    wrap: true,
  },
 
  { 
      header: "Uploaded File", 
      field: "strFileName",
      isJSX: true,
      ele: (row) => <span className="text-blue-600 underline cursor-pointer">{row.strFileName}</span>
    },
];


useEffect(() => {
  const loadBillDetails = async () => {
    try {
      const params = {
        gnumHospitalCode: 998,
        poStoreId: rowData?.numStoreId || rowData?.storeId || rowData?.poStoreId,
        hstnumPoNo: rowData?.numPoNo || rowData?.poNo
      };

      console.log("BILL DETAILS PARAMS ===>", params);

      const res = await supplierbilldetails(params);

      console.log("BILL DETAILS RESPONSE ===>", res);

      if (res?.status === 1) {
        const list = res?.data?.prevDeliveryDtls || [];

        const formattedList = list.map((item) => ({
          ...item,
          numScheduleNo: item?.schNo,
          strStoreName: item?.consigneeName,
          strDeliveryNo: item?.delNo,
          dtDeliveryDate: item?.delEntryDate || "--",
          strDeliveryDetail: item?.suppReceiptNo || "--",
          strStatus: item?.status || "--",
          dtBillUploadDate: item?.billDate || "--",
          strFileName: item?.billFileName || "--",
          numStoreId: item?.storeId,
          pkKey: item?.pkKey,
          action: item?.action,
          accRejFlag: item?.accRejFlag,
          challanNo: item?.challanNo,
          challanDate: item?.challanDate,
          suppReceiptDate: item?.suppReceiptDate,
          transporterName: item?.transporterName,
          lrNo: item?.lrNo
        }));

        setExistingRCs(formattedList);
      } else {
        setExistingRCs([]);
      }
    } catch (error) {
      console.error("Bill Details Error:", error);
      setExistingRCs([]);
      ToastAlert("Bill details fetch failed", "error");
    }
  };

  if (rowData?.numPoNo || rowData?.poNo) {
    loadBillDetails();
  }
}, [rowData]);

const handleSave = async (isDraft) => {
  if (!selectedRow) {
    ToastAlert("Please select a schedule first", "warning");
    return;
  }

  try {
    const payload = {
      strHospitalCode: "998",
      strSupplierId: String(selectedSupplier?.value || rowData?.numSupplierId || rowData?.supplierId || ""),
      strPoNo: String(rowData?.numPoNo || rowData?.poNo || ""),
      strPOStoreId: String(rowData?.numStoreId || rowData?.storeId || rowData?.poStoreId || ""),
      strScheduleNo: String(selectedRow?.numScheduleNo || ""),
      strDeliveryStoreId: String(selectedRow?.numStoreId || ""),
      strDeliveryNo: String(selectedRow?.strDeliveryNo || ""),
      hstnumScheduleNo: Number(selectedRow?.numScheduleNo || 0),
      consigneeName: selectedRow?.strStoreName || "",
      deliveryNo: selectedRow?.strDeliveryNo || "",
      hststrSuppReceiptNo: selectedRow?.strDeliveryDetail || "",
      hstdtSuppReceiptDate: selectedRow?.suppReceiptDate || null,
      hststrTransporterName: selectedRow?.transporterName || "",
      hststrLrno: selectedRow?.lrNo || "",
      hstnumStoreId: Number(selectedRow?.numStoreId || 0),
      pkey: selectedRow?.pkKey || "",
      hstdtChallanDate: selectedRow?.challanDate || null,
      hststrChallanNo: Number(selectedRow?.challanNo || 0),
      hststrBillFileName: fileName || selectedRow?.strFileName || "",
      hstdtBillDate: new Date().toISOString().split("T")[0],
      billUploadFileName: fileName || "",
      hstnumPoNo: Number(rowData?.numPoNo || rowData?.poNo || 0),
      hstnumPoStoreId: Number(rowData?.numStoreId || rowData?.storeId || rowData?.poStoreId || 0),
      action: Number(selectedRow?.action || 0),
      gnumHospitalCode: 998,
      hstnumSupplierId: Number(selectedSupplier?.value || rowData?.numSupplierId || rowData?.supplierId || 0),
      acceptanceFlag: Number(selectedRow?.accRejFlag || 1),
      gnumSeatId: 10001,
      strMode: isDraft === "1" ? "DRAFT" : "SAVE"
    };

    console.log("BILL SAVE PAYLOAD ===>", payload);

    const res = await supplierbillsave(payload);

    console.log("BILL SAVE RESPONSE ===>", res);

    ToastAlert(isDraft === "1" ? "Draft Saved Successfully" : "Bill Saved Successfully", "success");
    handleReset();
  } catch (error) {
    console.error("Bill Save Error:", error);
    ToastAlert("Bill save failed", "error");
  }
};

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      saveHpRcFileUpload(formData).then((res) => {
        if (res?.status === 1) {
          setFileName(res?.data?.fileName);
          ToastAlert("File uploaded successfully", 'success');
        }
      });
    }
  };

  // const handleSave = (isDraft) => {
  //   if (!selectedRow) {
  //     ToastAlert("Please select a schedule first", 'warn');
  //     return;
  //   }
  //   // Your existing save logic here
  //   ToastAlert(isDraft === '1' ? "Draft Saved" : "Data Saved", "success");
  // };

  return (
    <section className="unified-wrapper">
      <div className="bg-[#0b5c71] text-white text-center py-1 text-sm font-bold">
        Supplier Bill Details
      </div>

      {/* Header Info Section */}
      <div className="p-2 bg-blue-50 text-[12px] border-b">
        <div className="flex justify-between px-10">
          <div><b>Supplier Name:</b> {selectedSupplier?.label || "Abbott Healthcare Pvt Ltd (Through Sam)"}</div>
          <div><b>PO Type:</b> Local Po</div>
        </div>
        <div className="flex justify-between px-10 mt-1">
          <div><b>PO Generation Period:</b> 2019-2020</div>
          <div><b>Purchase Order Date:</b> 18-Jun-2019</div>
        </div>
        <div className="text-center mt-1"><b>PO No.:</b> PO/REF/AB/2017/318 ( 10211904126 )</div>
      </div>

   


      
       <div style={{ marginBottom: "3rem" }}>
        <ReactDataTable
          column={existingBillTableCols}
          data={existingRCs}
          isSearchReq={false}
          isPagination={false}
          showSerialNumber={true}
        />
      </div>

      {/* Bill Details Section - Appears on Radio Click */}
      {selectedRow && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-[1px] bg-[#0b5c71] flex-grow"></div>
            <span className="text-[#0b5c71] font-bold text-sm">Bill Details</span>
            <div className="h-[1px] bg-[#0b5c71] flex-grow"></div>
          </div>

          <div className="flex justify-center items-center gap-2">
            <label className="text-sm font-bold">
              <span className="text-red-600">*</span>Upload File (JPEG, JPG, PDF) :
            </label>
            <div className="flex border border-gray-400 items-center bg-white">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={handleFileUpload}
              />
              <button 
                onClick={() => document.getElementById('file-upload').click()}
                className="bg-gray-200 px-3 py-1 text-xs border-r border-gray-400 hover:bg-gray-300"
              >
                Browse...
              </button>
              <span className="px-4 text-xs text-gray-500">
                {fileName || "No file selected."}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend & Buttons */}
      <div className="mt-6 border-t-2 border-blue-900 pt-2 px-4">
        <p className="text-red-600 font-bold text-[11px]">* Mandatory Field(s)</p>
        <div className="flex items-center gap-1 mt-1">
          <div className="w-3 h-3 rounded-full bg-[#ffcccc] border border-orange-500"></div>
          <span className="text-[11px] font-bold italic">Bill Detail entered</span>
        </div>
      </div>

      <div className="pb-4">
        <BottomButtons 
          isSave={true} 
          isReset={true} 
          isClose={true} 
          isDraft={true}
          onSave={() => handleSave('0')} 
          onDraft={() => handleSave('1')}
          onReset={handleReset} 
          onClose={handleClose} 
        />
      </div>
    </section>
  );
}

export default SupplierBillDetails;
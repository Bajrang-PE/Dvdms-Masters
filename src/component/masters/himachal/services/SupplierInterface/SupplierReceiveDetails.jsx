

// export default SupplierReceiveDetails;
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { DatePickerComponent, InputField } from '../../../../commons/FormElements';
import DataTable from '../../../../commons/Datatable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { ToastAlert } from '../../../../../utils/Toast';
import BottomButtons from '../../../../commons/BottomButtons';
import { getHpViewDetails, savesupplierreceivesave, supplierreceivedetails } from '../../../../../api/Himachal/services/suppInterfaceAPI_HP';

import ReactDataTable from '../../../../commons/ReactDataTable';
const initialState = {
    
    expiryDate: "",
    mfgDate: "",
  };

const SupplierReceiveDetails = (props) => {
  const { selectedSupplier, rowData } = props; // rowData parent se aa raha hai
  const dispatch = useDispatch();

  // States
  const [existingRCs, setExistingRCs] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [receivedDate, setReceivedDate] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [receivedBy, setReceivedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [formState, dispatcher] = useReducer(addFormReducer, initialState);

  // Circle Button Click Handler (API Call)
  const handleViewClick = async (row) => {
    try {
      setLoading(true);
      // API Parameters as per requirement
      const params = {
        hospCode: 998, // Example static or from row
        poStoreId: rowData?.numStoreId || 0, 
        delStoreId: row?.numStoreId || 0,
        poNo: rowData?.numPoNo || 0,
        poTypeId: rowData?.numPoTypeId || 1,
        itemCat: rowData?.numItemCatId || 1
      };

      const res = await getHpViewDetails(params);
      if (res) {
        ToastAlert("Details Fetched Successfully", "success");
        // Logic to show details can be added here
        console.log("View Details:", res);
      }
    } catch (err) {
      ToastAlert("Failed to fetch details", "error");
    } finally {
      setLoading(false);
    }
  };

  

  const existingsupplierRecTableCols = [
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
    name: <span>Store Received Date</span>,
    selector: row => row?.dtStoreReceivedDate,
    sortable: true,
    wrap: true,
  },
  {
    name: <span>Rec. Dtl.</span>,
    selector: row => row?.strRecDtl,
    sortable: true,
    wrap: true,
  },
  {
    name: "Action",
    cell: (row) => (
      <div
        onClick={() => handleViewClick(row)}
        className="bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-[10px] font-bold cursor-pointer hover:bg-green-600"
      >
        V
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: "80px",
  },
];


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


  const handleDateChange = (value, fieldName) => {
  if (!value) return;

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  dispatcher({
    type: "SET_FIELD",
    field: fieldName,
    value: formattedDate,
  });
};
  const handleClose = () => dispatch(hidePopup());


  const handleReset = () => {
  setSelectedRow(null);
  setReceivedDate("");
  setReceivedBy("");
  setUploadFile(null);
};
  
 

const handleSave = async () => {
  if (!selectedRow) {
    ToastAlert("Please select schedule first", "warning");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      strHospitalCode: "998",
      strPoNo: String(rowData?.numPoNo || rowData?.poNo || ""),
      strScheduleNo: String(selectedRow?.numScheduleNo || ""),
      strDeliveryStoreId: String(selectedRow?.numStoreId || ""),
      hstdtRecDate: formState?.mfgDate || "",
      hststrRecBy: receivedBy,
      hststrBillFileName: uploadFile?.name || "",
      strSupplierId: String(selectedSupplier?.value || rowData?.numSupplierId || rowData?.supplierId || ""),
      pkey: selectedRow?.pkKey || "",
      action: 1,
      acceptanceFlag: 1,
      gnumSeatId: 10001
    };

    console.log("SAVE PAYLOAD ===>", payload);

    const res = await savesupplierreceivesave(payload);

    console.log("SAVE RESPONSE ===>", res);

    ToastAlert("Data Saved Successfully", "success");
    handleReset();
  } catch (error) {
    console.error("Receive Save Error:", error);
    ToastAlert("Save failed", "error");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const loadReceiveDetails = async () => {
    try {
      setLoading(true);

      const params = {
        gnumHospitalCode: 998,
        poStoreId: rowData?.numStoreId || rowData?.storeId || rowData?.poStoreId,
        hstnumPoNo: rowData?.numPoNo || rowData?.poNo
      };

      console.log("RECEIVE DETAILS PARAMS ===>", params);

      const res = await supplierreceivedetails(params);

      console.log("RECEIVE DETAILS RESPONSE ===>", res);

      if (res?.status === 1) {
        const list = res?.data?.prevDeliveryDtls || [];

        const formattedList = list.map((item) => ({
          ...item,
          numScheduleNo: item?.schNo,
          strStoreName: item?.consigneeName,
          strDeliveryNo: item?.delNo,
          dtDeliveryDate: item?.delEntryDate || "--",
          strDeliveryDetail: item?.suppReceiptNo,
          strStatus: item?.status,
          dtStoreReceivedDate: item?.suppReceiptDate,
          strRecDtl: item?.recBy || "--",
          numStoreId: item?.storeId,
          pkKey: item?.pkKey
        }));

        setExistingRCs(formattedList);
      } else {
        setExistingRCs([]);
      }
    } catch (error) {
      console.error("Receive Details Error:", error);
      setExistingRCs([]);
      ToastAlert("Receive details fetch failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (rowData?.numPoNo || rowData?.poNo) {
    loadReceiveDetails();
  }
}, [rowData]);

  return (
    <section className="unified-wrapper">
      <div className="bg-[#0b5c71] text-white text-center py-1 text-sm font-bold">
        Supplier Receive Details
      </div>

      <div className="p-2 bg-blue-50 text-[12px]">
        <div className="flex justify-between px-10">
          <div><b>Supplier Name:</b> {selectedSupplier?.label || "Abbott Healthcare Pvt Ltd (Through Sam)"}</div>
          <div><b>PO Type:</b> Local Po</div>
        </div>
        <div className="flex justify-between px-10 mt-1">
          <div><b>PO Generation Period:</b> 2022-2023</div>
          <div><b>Purchase Order Date:</b> 31-Jan-2023</div>
        </div>
        <div className="text-center mt-1"><b>PO No.:</b> {rowData?.numPoNo || "PO/REF/AB/2017/318 ( 10282300002 )"}</div>
      </div>

     


       <div style={{ marginBottom: "3rem" }}>
        <ReactDataTable
          column={existingsupplierRecTableCols}
          data={existingRCs}
          isSearchReq={false}
          isPagination={false}
          showSerialNumber={true}
        />
      </div>







      {selectedRow && (
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-[1px] bg-[#0b5c71] flex-grow"></div>
            <span className="text-[#0b5c71] font-bold text-sm">Delivery Receive Details</span>
            <div className="h-[1px] bg-[#0b5c71] flex-grow"></div>
          </div>


          <div className="grid grid-cols-2 gap-x-20 px-10 items-center">
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
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap text-sm"><span className="text-red-600 font-bold">*</span>Received By:</label>
              <input type="text" className="border border-gray-400 bg-[#f9ebd2] h-7 w-full px-2" value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 mt-4 col-span-1">
              <label className="whitespace-nowrap text-sm font-bold text-blue-900"><span className="text-red-600 font-bold">*</span>Upload File (JPEG, JPG, PDF) :</label>
              <div className="flex border border-gray-400 items-center">
                <button className="bg-gray-200 px-2 py-1 text-xs border-r border-gray-400">Browse...</button>
                <span className="px-2 text-xs text-gray-500">No file selected.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 border-t-2 border-blue-900 pt-2 px-4">
          <p className="text-red-600 font-bold text-[11px]">* Mandatory Field(s)</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-3 h-3 rounded-full bg-[#ffcccc] border border-orange-500"></div>
            <span className="text-[11px] font-bold italic">Received detail entered</span>
          </div>
      </div>

      <BottomButtons 
        isSave={true} 
        onSave={handleSave} 
        onReset={handleReset} 
        onClose={handleClose}
        customButtons={[{ label: 'Clear', color: 'orange', onClick: handleReset }]}
      />
    </section>
  );
}

export default SupplierReceiveDetails;
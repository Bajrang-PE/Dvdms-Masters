

// import React, { useEffect, useReducer, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { hidePopup } from '../../../../../features/commons/popupSlice';
// import { InputField } from '../../../../commons/FormElements';
// import { getHpRcDownloadFile, saveHpRcFileUpload } from '../../../../../api/Himachal/services/rateContractAPI_HP';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faClose } from '@fortawesome/free-solid-svg-icons';
// import { ToastAlert } from '../../../../../utils/Toast';
// import BottomButtons from '../../../../commons/BottomButtons';
// // Nayi API imports
// import { getsupplierfdrdetails, supplierfdrsave } from '../../../../../api/Himachal/services/suppInterfaceAPI_HP';

// const SupplierFDRUpload = (props) => {
//   const { selectedSupplier, rowData } = props; // rowData list page se aa raha hai

//   const { value: storeID } = useSelector(
//     (state) => state.himachalMst.storeID
//   );

//   const initialState = {
//     batchNo: "", // FDR No ke liye use ho raha hai aapke code mein
//   };

//   function addFormReducer(state, action) {
//     switch (action.type) {
//       case "SET_FIELD":
//         return { ...state, [action.field]: action.value };
//       case "SET_FIELDS":
//         return { ...state, ...action.payload };
//       default:
//         return state;
//     }
//   }

//   const [formState, dispatcher] = useReducer(addFormReducer, initialState);
//   const dispatch = useDispatch();

//   const [fdrDetails, setFdrDetails] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isFileUploaded, setIsFileUploaded] = useState(false);
//   const [fileName, setFileName] = useState('');

//   // 1. Data Fetch Karne ka kaam
//   // useEffect(() => {
//   //   if (rowData) {
//   //     const poNo = rowData?.poNo || rowData?.hstnumPoNo;
//   //     const poStoreId = rowData?.storeId || rowData?.hstnumPoStoreId;
      
//   //     getsupplierfdrdetails(998, poStoreId, poNo)
//   //       .then((res) => {
//   //         if (res?.status === 1) {
//   //           setFdrDetails(res?.data?.poDetails);
//   //         }
//   //       })
//   //       .catch(err => console.error("Error fetching details", err));
//   //   }
//   // }, [rowData]);

//   useEffect(() => {
//     // Console mein check karein ki rowData mein kya aa raha hai
//     console.log("Current rowData:", rowData);

//     if (rowData) {
//         // Agar rowData list page se aa raha hai, toh keys check karein (hstrPoNo ya poNo)
//         const poNo = rowData?.hstnumPoNo || rowData?.poNo || rowData?.hstrPoNo;
//         const poStoreId = rowData?.hstnumPoStoreId || rowData?.poStoreId || rowData?.storeId;
//         const hospCode = 998;

//         // Sirf tab API call karein jab dono values mil jayein
//         if (poNo && poStoreId) {
//             getsupplierfdrdetails(hospCode, poStoreId, poNo)
//                 .then((res) => {
//                     if (res?.status === 1) {
//                         setFdrDetails(res?.data?.poDetails);
//                     }
//                 })
//                 .catch(err => console.error("API Call Error:", err));
//         } else {
//             console.warn("Missing parameters: poNo or poStoreId is undefined");
//         }
//     }
// }, [rowData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     dispatcher({ type: "SET_FIELD", field: name, value });
//   };

//   function handleClose() {
//     dispatch(hidePopup());
//   }

//   // 2. Save karne ka kaam
//   const handleSave = () => {
//     if (!formState.batchNo) {
//       ToastAlert("Please enter FDR Number", 'error');
//       return;
//     }
//     if (!isFileUploaded) {
//       ToastAlert("Please upload FDR file", 'error');
//       return;
//     }

//     const payload = {
//       "gnumHospitalCode": 998,
//       "hstnumSupplierId": fdrDetails?.supplierId || rowData?.supplierId,
//       "hstnumPoNo": fdrDetails?.poNo || rowData?.poNo,
//       "hstnumPoStoreId": fdrDetails?.poStoreId || rowData?.storeId,
//       "hstnumFdrNo": parseInt(formState.batchNo),
//       "hststrFdrFile": fileName,
//       "gnumSeatId": 10001,
//       "gstrRemarks": "FDR Uploaded",
//       "strMode": "SAVE",
//       "strPoNo": (fdrDetails?.poNo || rowData?.poNo)?.toString(),
//       "strPOStoreId": (fdrDetails?.poStoreId || rowData?.storeId)?.toString(),
//     };

//     supplierfdrsave(payload).then((res) => {
//       if (res?.status === 1) {
//         ToastAlert('FDR Saved Successfully', 'success');
//         dispatch(hidePopup());
//       } else {
//         ToastAlert(res?.msg || "Save Failed", 'error');
//       }
//     });
//   }

//   const onFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleFileUpload = () => {
//     if (selectedFile) {
//       const formData = new FormData();
//       formData.append("file", selectedFile, selectedFile?.name);
//       saveHpRcFileUpload(formData)?.then((res) => {
//         if (res?.status === 1) {
//           setIsFileUploaded(true);
//           setFileName(res?.data?.fileName);
//           setSelectedFile(null);
//           ToastAlert("File uploaded", 'success')
//         } else {
//           ToastAlert(res?.msg, 'error');
//         }
//       })
//     } else {
//       ToastAlert("Please select a file", 'error');
//     }
//   }

//   return (
//     <section className="unified-wrapper">
//       <h3 className="unified-wrapper__heading">
//         Supplier Bill Details
//       </h3>
      
//       <div className="unified-wrapper__container">
//         <h4 className="unified-wrapper__container-heading">
//           Supplier Bill Details
//         </h4>

//         <div className="row">
//           {/* Aapka Purana Structure */}
//           <div className="col-md-6">
//             <label className="Wrapper__label mb-0">
//               <b>Supplier Name</b> : {fdrDetails?.supplierName || selectedSupplier?.label}
//             </label>
//           </div>

//           <div className="col-md-6">
//             <label className="Wrapper__label mb-0">
//               <b>PO Type</b> : {fdrDetails?.poType || "N/A"}
//             </label>
//           </div>

//           <div className="col-md-6">
//             <label className="Wrapper__label mb-0">
//               <b>PO Generation Period</b> : {fdrDetails?.financialYear || "N/A"}
//             </label>
//           </div>

//           <div className="col-md-6">
//             <label className="Wrapper__label mb-0">
//               <b>Purchase Order Date</b> : {fdrDetails?.approvalDate || "N/A"}
//             </label>
//           </div>

//           <div className="col-md-6">
//             <label className="Wrapper__label mb-0">
//               <b>PO No</b> : {fdrDetails?.poNo || rowData?.poNo}
//             </label>
//           </div>

//           <div className="col-md-6">
//             <label className="Wrapper__label mb-0">
//               <b>Net PO Amount</b> : ₹ {fdrDetails?.poNetAmount || "0.00"}
//             </label>
//           </div>

//           <div className="col-md-6">
//             <InputField
//               id="batchNo"
//               className="Wrapper__inputs"
//               type="text"
//               name="batchNo"
//               placeholder="Enter FDR Number"
//               value={formState?.batchNo}
//               onChange={handleChange}
//               label={"FDR NO:"}
//             />
//           </div>

//           <div className="col-md-6">
//             <label className="Wrapper__label d-block">
//               FDR Upload:
//             </label>
//             {isFileUploaded ? (
//               <>
//                 <span
//                   style={{ color: 'blue', cursor: 'pointer' }}
//                   onClick={() => getHpRcDownloadFile(fileName)}
//                 >
//                   {fileName}
//                 </span>
//                 <span className="text-danger ms-2" title="Remove File" onClick={() => { setIsFileUploaded(false); setFileName("") }} role="button"> 
//                   <FontAwesomeIcon icon={faClose} size="sm" />
//                 </span>
//               </>
//             ) : (
//               <div className="d-flex">
//                 <input
//                   className="Wrapper__inputs fileUpload w-50"
//                   type="file"
//                   onChange={onFileChange}
//                   role='button'
//                 />
//                 <button
//                   className="buttons__container-controls-btn ms-2"
//                   onClick={handleFileUpload}
//                 >
//                   Upload File
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <BottomButtons 
//         isSave={true} 
//         isReset={false} 
//         isClose={true} 
//         onSave={handleSave} 
//         onClose={handleClose} 
//       />
//     </section>
//   );
// }

// export default SupplierFDRUpload;


import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { InputField } from '../../../../commons/FormElements';
import { getHpRcDownloadFile, saveHpRcFileUpload } from '../../../../../api/Himachal/services/rateContractAPI_HP';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { ToastAlert } from '../../../../../utils/Toast';
import BottomButtons from '../../../../commons/BottomButtons';
import { getsupplierfdrdetails, supplierfdrsave } from '../../../../../api/Himachal/services/suppInterfaceAPI_HP';

const SupplierFDRUpload = (props) => {
  const { selectedSupplier, rowData } = props;

  const initialState = {
    batchNo: "", 
    remarks: "FDR Uploaded",
  };

  function formReducer(state, action) {
    switch (action.type) {
      case "SET_FIELD":
        return { ...state, [action.field]: action.value };
      default:
        return state;
    }
  }

  const [formState, dispatcher] = useReducer(formReducer, initialState);
  const dispatch = useDispatch();

  const [fdrDetails, setFdrDetails] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const poNo = rowData?.hstnumPoNo || rowData?.poNo || rowData?.numPoNo;
    const poStoreId = rowData?.hstnumPoStoreId || rowData?.poStoreId || rowData?.storeId || rowData?.numStoreId;
    
    if (poNo && poStoreId) {
      getsupplierfdrdetails(998, poStoreId, poNo).then((res) => {
        if (res?.status === 1) {
          setFdrDetails(res?.data?.poDetails);
        }
      });
    }
  }, [rowData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatcher({ type: "SET_FIELD", field: name, value });
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile?.name);
      saveHpRcFileUpload(formData).then((res) => {
        if (res?.status === 1) {
          setIsFileUploaded(true);
          setFileName(res?.data?.fileName);
          ToastAlert("File uploaded", 'success');
        }
      });
    }
  };

  const handleSave = (draftFlag) => {
    const payload = {
      "gnumHospitalCode": 998,
      "hstnumSupplierId": fdrDetails?.supplierId || rowData?.numSupplierId || rowData?.supplierId,
      "hstnumPoNo": fdrDetails?.poNo || rowData?.numPoNo || rowData?.poNo,
      "hstnumFdrNo": parseInt(formState.batchNo),
      "hststrFdrFile": fileName
    };

    supplierfdrsave(payload).then((res) => {
      if (res?.status === 1) {
        ToastAlert('Data Saved Successfully', 'success');
        dispatch(hidePopup());
      }
    });
  };

  return (
    <section className="unified-wrapper">
      <h3 className="unified-wrapper__heading">Supplier Bill Details</h3>
      <div className="unified-wrapper__container">
        <h4 className="unified-wrapper__container-heading">Supplier Bill Details</h4>

        <div className="row">
          <div className="col-md-6">
            <label className="Wrapper__label mb-0"><b>Supplier Name :</b> {fdrDetails?.supplierName || rowData?.strSupplierName || "N/A"}</label>
          </div>
          <div className="col-md-6">
            <label className="Wrapper__label mb-0"><b>PO Type :</b> {fdrDetails?.poType || "N/A"}</label>
          </div>
          <div className="col-md-6">
            <label className="Wrapper__label mb-0"><b>PO Generation Period :</b> {fdrDetails?.financialYear || "N/A"}</label>
          </div>
          <div className="col-md-6">
            <label className="Wrapper__label mb-0"><b>Purchase Order Date :</b> {fdrDetails?.approvalDate || "N/A"}</label>
          </div>
          <div className="col-md-6">
            <label className="Wrapper__label mb-0"><b>PO No :</b> {fdrDetails?.poNo || rowData?.numPoNo || rowData?.poNo}</label>
          </div>
          <div className="col-md-6">
            <label className="Wrapper__label mb-0"><b>Net PO Amount :</b> ₹ {fdrDetails?.poNetAmount || "0.00"}</label>
          </div>

          <div className="col-md-6">
            <InputField
              id="batchNo"
              className="Wrapper__inputs"
              type="text"
              name="batchNo"
              placeholder="Enter FDR Number"
              value={formState?.batchNo}
              onChange={handleChange}
              label={"FDR NO:"}
            />
          </div>

          <div className="col-md-6">
            <label className="Wrapper__label d-block">FDR Upload:</label>
            {isFileUploaded ? (
              <>
                <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => getHpRcDownloadFile(fileName)}>{fileName}</span>
                <span className="text-danger ms-2" onClick={() => { setIsFileUploaded(false); setFileName("") }} role="button">
                  <FontAwesomeIcon icon={faClose} size="sm" />
                </span>
              </>
            ) : (
              <div className="d-flex">
                <input className="Wrapper__inputs fileUpload w-50" type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <button className="buttons__container-controls-btn ms-2" onClick={handleFileUpload}>Upload File</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomButtons 
        isSave={true} 
        onSave={() => handleSave('0')} 
        isDraft={false} 
        onDraft={() => handleSave('1')} 
        isClose={true} 
        isReset={false}
        onClose={() => dispatch(hidePopup())} 
      />
    </section>
  );
}

export default SupplierFDRUpload;
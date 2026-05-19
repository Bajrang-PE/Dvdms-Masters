import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { ComboDropDown, DatePickerComponent, InputField, RadioButton } from '../../../../commons/FormElements';
import { getHpRcDownloadFile, saveHpRcFileUpload } from '../../../../../api/Himachal/services/rateContractAPI_HP';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastAlert } from '../../../../../utils/Toast';
import BottomButtons from '../../../../commons/BottomButtons';
import MasterPopUpModal from '../../../../commons/MasterPopUpModal';
import { deleteBatchDetails, getHpRcDrugNamesCmb, getHpsubBatchDrugListCmb, saveBatchDetaildetails as saveAPI, supplierupdatenablreportssave } from '../../../../../api/Himachal/services/suppInterfaceAPI_HP';
import ReactDataTable from '../../../../commons/ReactDataTable';

const SupplierBatchDetails = (props) => {
  const { suppliers, selectedSupplier } = props;

  const initialState = {
    //contract detail
    supplierName: "",
    expiryDate: "",
    mfgDate: "",
    batchNo: "",
    // add batchNo for mapping
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
    drugNameErr: "", batchNoErr: "",reportNoErr:"",expiryDateErr:"",mfgDateErr:"",reportDateErr:""
  })

  const [formState, dispatcher] = useReducer(addFormReducer, initialState);
  const dispatch = useDispatch();
  const dataTableRef = useRef();
  const [existingRCs, setExistingRCs] = useState([]);
  const [drugNameDrpDt, setDrugNameDrpDt] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [drugName, setDrugName] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [viewDetails, setViewDetails] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [nablFlag, setNablFlag] = useState(''); // Nayi state flag ke liye
  const [editDetails, setEditDetails] = useState(null); // Nayi state flag ke liye


  const handleChange = (e) => {
    const { name, value } = e.target;
    const errName = name + "Err";
    dispatcher({ type: "SET_FIELD", field: name, value });
    if (name === 'rate' || name === 'unit') {
      seterrors({ ...errors, 'rateUnitErr': "" });
    } else {
      seterrors({ ...errors, [errName]: "" });
    }
  };

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    dispatcher({ type: "RESET_FORM" });
    setDrugName("");
    setIsFileUploaded(false);
    setFileName("");
  }

  const loadDrugNameDrpDt = async () => {
    try {
      let drugList = [];
      const data = await getHpRcDrugNamesCmb(selectedSupplier?.value, 998);
      if (data?.status === 1) {
        data?.data.forEach((element) => {
          drugList.push({
            label: element?.display,
            value: element?.value,
          });
        });
        setDrugNameDrpDt(drugList);
      } else {
        setDrugNameDrpDt([]);
      }
    } catch (err) {
      console.log("Failed to fetch drugs.", err);
    }
  };

  const formatToApiDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Returns YYYY-MM-DD
  };

  useEffect(() => {
    loadDrugNameDrpDt();
  }, []);

  useEffect(() => {
    async function fetchExistingBatchs() {
      try {
        const brandId = drugName?.split('^')[0] || "";
        const supplierId = selectedSupplier?.value || "";

        // Ab yahan nablFlag bhi bhej rahe hain
        const response = await getHpsubBatchDrugListCmb(supplierId, 998, brandId, nablFlag);

        if (response?.status === 1) {
          const listData = Array.isArray(response?.data)
            ? response.data
            : response?.data?.content || [];
          setExistingRCs(listData);
        } else {
          setExistingRCs([]);
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
        setExistingRCs([]);
      }
    }

    // Dono values hone par hi call karein
    if (drugName && selectedSupplier?.value) {
      fetchExistingBatchs();
    }
  }, [drugName, selectedSupplier?.value, nablFlag]); // nablFlag yahan dependency mein aayega

  const handleSave = () => {
    let isValid = true;

    if (!drugName?.toString()?.trim()) {
      seterrors((prev => ({ ...prev, 'drugNameErr': "Drug Name is Required!" })));
      isValid = false;
    }

    if (isValid) {
      if (isEditMode) {
        updateNablReportDetails();
      } else {
        saveNewBatchDetails();
      }
    }
  }

  // 1. UPDATE NABL API
  const updateNablReportDetails = async () => {
    let isValid = true;
    if (!formState?.reportNo) {
      seterrors((prev => ({ ...prev, 'reportNoErr': "NABL/USFDA/CDL Report No is Required!" })));
      isValid = false;
    }

    if (!formState?.reportDate) {
      seterrors((prev => ({ ...prev, 'reportDateErr': "Report Date is Required!" })));
      isValid = false;
    }


    const brandIdStr = drugName?.split('^')[0] || "0";

    const payload = {
      
      "strBatchNo": editDetails?.batchNo,
      "gnumHospitalCode": 998,
      "hstnumItembrandId": parseInt(brandIdStr),
      "hstnumSupplierId": parseInt(selectedSupplier?.value),
      // "hstdtReportDate": formState.reportDate,
      "hstdtReportDate": formatToApiDate(formState.reportDate),
      "strReportNo": formState.reportNo,
      "strFileName": editDetails?.fileName,
    };
  if (isValid) {
    try {
      const res = await supplierupdatenablreportssave(payload);
      if (res?.status === 1) {
        ToastAlert("NABL Details Updated Successfully", "success");
        handleReset();
        setIsEditMode(false);
      } else {
        ToastAlert(res?.msg || "Update Failed", "error");
      }
    } catch (err) {
      ToastAlert("Error updating NABL details", "error");
    }
  }
  }

  // 2. SAVE NEW BATCH API
  const saveNewBatchDetails = async () => {
    let isValid = true;
    if (!formState?.batchNo) {
      seterrors((prev => ({ ...prev, 'batchNoErr': "Batch Num is Required!" })));
      isValid = false;
    }
   if (!formState?.mfgDate) {
      seterrors((prev => ({ ...prev, 'mfgDateErr': "Mfg Date is Required!" })));
      isValid = false;
    }

  if (!formState?.expiryDate) {
      seterrors((prev => ({ ...prev, 'expiryDateErr': "Expiry Date is Required!" })));
      isValid = false;
    }



    const brandIdStr = drugName?.split('^')[0] || "0";
    const payload = {
      "hospitalCode": 998,                               // Numeric
      "supplierId": parseInt(selectedSupplier?.value),   // Numeric
      "brandId": parseInt(brandIdStr),                   // Numeric
      "batchNo": formState.batchNo,
      "expiryDate": formState.expiryDate,
      "mfgDate": formState.mfgDate,
      "labReportNo": formState.labReportNo || "",
      "fileName": fileName,
      "reportDate": formState.reportDate || "",
      "mfgId": selectedSupplier?.value?.toString()       // Last Value
    };
    if (isValid) {
      try {
        const res = await saveAPI(payload);
        if (res?.status === 1) {
          ToastAlert("New Batch Saved Successfully", "success");
          handleReset();
        } else {
          ToastAlert(res?.msg || "Save Failed", "error");
        }
      } catch (err) {
        ToastAlert("Something went wrong while saving", "error");
      }
    }

  }



  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile?.name);
      saveHpRcFileUpload(formData)?.then((res) => {
        if (res?.status === 1) {
          setIsFileUploaded(true);
          setFileName(res?.data?.fileName);
          setSelectedFile(null);
          ToastAlert("File uploaded", 'success')
        } else {
          ToastAlert(res?.msg, 'error');
        }
      })
    } else {
      ToastAlert("Please select a file", 'error');
    }
  }

  const onCloseModal = () => {
    setViewModal(false);
    setViewDetails([]);
  }

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



  // Function to handle delete click
  const handleDeleteClick = (row) => {
    const isConfirmed = window.confirm("You Are Going To Delete Batch Details. Are You Sure?");

    if (isConfirmed) {
      processDelete(row);
    }
  };

  const processDelete = async (row) => {
    try {
      // API Request Body as per your provided JSON
      const brandId = drugName?.split('^')[0] || "";

      const deletePayload = {
        "strBatchNo": row?.batchNo,
        "gnumHospitalCode": 998,
        "hstnumItembrandId": parseInt(brandId),
        "hstnumSupplierId": parseInt(selectedSupplier?.value?.toString()),
      };

      const response = await deleteBatchDetails(deletePayload);
      console.log('response', response)
      if (response?.status === 1) {
        ToastAlert("Batch Deleted Successfully", "success");

        setDrugName(prev => prev + " "); // Temp hack to trigger useEffect
        setTimeout(() => setDrugName(prev => prev.trim()), 10);
      } else {
        ToastAlert(response?.msg || "Failed to delete batch", "error");
      }
    } catch (error) {
      ToastAlert("Error in deleting batch", "error");
    }
  };



  const rcDetailsColms = [
    {
      name: (<span>Batch No.</span>),
      selector: row => row?.batchNo,
      sortable: true,
      wrap: true,
      // width: "20%"
    },
    {
      name: (<span>Manufacturer Name</span>),
      selector: row => row?.manufacturerName,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Expiry Date</span>),
      selector: row => row?.expiryDate,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Mfg Date</span>),
      selector: row => row?.manufDate,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Whether NABL Required</span>),
      selector: row => row?.strWhetherNablRequired,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Report No.</span>),
      selector: row => row?.labReportNo,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Report Date</span>),
      selector: row => row?.reportDate,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>File Name</span>),
      selector: row => row?.fileName,
      sortable: true,
      wrap: true,
    },


    {
      name: (<span>Action</span>),
      cell: (row) => {

        const qcRejectedFlag = String(row?.qcRejectedFlag || "0");
        const receiveCount = String(row?.receiveCount || "0");
        const editStatus = String(row?.editStatus || "0");

        // Condition 1: if QC Rejected = to NO ACTION
        if (qcRejectedFlag !== "0") {
          return <div className="text-center w-100 fw-bold text-secondary">NO ACTION</div>;
        }

        return (
          <div style={{ position: 'absolute', top: 4, left: 0 }}>
            <span className="btn btn-sm text-white py-0 d-flex gap-1">

              {/* DELETE BUTTON LOGIC */}
              {receiveCount === "0" ? (
                <button
                  className="btn btn-danger btn-sm px-1 py-0 rounded rounded-5 fs-13"
                  title="Delete Record"
                  onClick={() => handleDeleteClick(row)}
                >
                  <FontAwesomeIcon icon={faTrash} size="sm" />
                </button>
              ) : (
                <button
                  className="btn btn-secondary btn-sm px-1 py-0 rounded rounded-5 fs-13"
                  style={{ cursor: 'not-allowed', opacity: 0.6 }}
                  title="Delete Record Not Allowed"
                  disabled
                >
                  <FontAwesomeIcon icon={faTrash} size="sm" />
                </button>
              )}

              {/* EDIT BUTTON LOGIC */}
              {(receiveCount === "0" || editStatus === "0") ? (
                <button
                  className="btn btn-warning btn-sm px-1 py-0 rounded rounded-5 fs-13"
                  title="Edit NABL Report"
                  onClick={() => {
                    setIsEditMode(true);
                    setEditDetails(row)
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} size="sm" />
                </button>
              ) : (
                <button
                  className="btn btn-secondary btn-sm px-1 py-0 rounded rounded-5 fs-13"
                  style={{ cursor: 'not-allowed', opacity: 0.6 }}
                  title="Modification of Record Not Allowed"
                  disabled
                >
                  <FontAwesomeIcon icon={faEdit} size="sm" />
                </button>
              )}

            </span>
          </div>
        );
      },
      sortable: false,
      wrap: true,
    },

  ]
  console.log('editDetails', editDetails)
  return (
    <section className="unified-wrapper">
      <h3 className="unified-wrapper__heading">Supplier Batch Details</h3>
      <div className="unified-wrapper__container">
        <h4 className="unified-wrapper__container-heading">Supplier Batch Details</h4>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="supplierName" className="Wrapper__label mb-0">
              <b>Supplier Name</b> : {selectedSupplier?.label}
            </label>
          </div>
          <div className="col-md-6">
            { }
            <ComboDropDown
              options={drugNameDrpDt}
              onChange={(e) => {
                const val = e?.target?.value;

                // 1. Drug Name set karein
                setDrugName(val);

                // 2. Edit mode ko band karein taaki "New Batch" div dikhne lage
                setIsEditMode(false);

                // 3. Purane fields clear karein (Sirf formState reset karein, drugName nahi)
                dispatcher({ type: "RESET_FORM" });
                setIsFileUploaded(false);
                setFileName("");

                // 4. Flag nikalne ka logic
                if (val && val.includes('^')) {
                  const parts = val.split('^');
                  setNablFlag(parts[1] || "0");
                } else {
                  setNablFlag("");
                }

                seterrors({ ...errors, drugNameErr: "" });
              }}
              name={"drugName"}
              value={drugName}
              label={"Drug Name :"}
            />
            {errors?.drugNameErr && <span className="text-sm text-[#9b0000] mt-1 ms-1">{errors?.drugNameErr}</span>}
          </div>
        </div>
      </div>

      {drugName && (
        <>
          <h5 className="bg-[#097080] text-white p-1 rounded">Previous Batch Details</h5>
          <div style={{ marginBottom: "3rem" }}>
            <ReactDataTable
              column={rcDetailsColms}
              data={existingRCs}
              isSearchReq={false}
              isPagination={false}
              showSerialNumber={true}
            />
          </div>
          {!isEditMode &&
            <div className="unified-wrapper__container">
              <h4 className="unified-wrapper__container-heading">New Batch Details</h4>
              <div>
                <InputField
                  id="batchNo"
                  className="Wrapper__inputs"
                  type="text"
                  name="batchNo"
                  placeholder="Enter Batch No."
                  value={formState?.batchNo}
                  onChange={handleChange}
                  label={"Batch No.:"}
                  isRequired
                  isError={errors.batchNoErr || ""}
                />
              </div>
              <div>
                <ComboDropDown
                  options={suppliers}
                  onChange={handleChange}
                  name={"manufacturerName"}
                  value={formState?.manufacturerName || selectedSupplier?.value}
                  label={"Manufacture Name :"}
                  isRequired
                />
               
              </div>
              <div>
                <DatePickerComponent
                  selectedDate={formState.mfgDate}
                  setSelectedDate={(e) => handleDateChange(e, "mfgDate")}
                  labelText={"Mfg Date"}
                  labelFor={"mfgDate"}
                  name={"mfgDate"}
                  allowMin={true}
                  isRequired
                />
                 {errors.mfgDateErr &&
                  <span className="text-sm text-[#9b0000] mt-1 ms-1">
                    {errors.mfgDateErr}
                  </span>
                }
              </div>
              <div>
                <DatePickerComponent
                  selectedDate={formState.expiryDate}
                  setSelectedDate={(e) => handleDateChange(e, "expiryDate")}
                  labelText={"Expiry Date"}
                  labelFor={"expiryDate"}
                  name={"expiryDate"}
                  allowMin={true}
                  isRequired
                />
               {errors.expiryDateErr &&
                  <span className="text-sm text-[#9b0000] mt-1 ms-1">
                    {errors.expiryDateErr}
                  </span>
                }

              </div>
              <div>
                <label htmlFor="file" className="Wrapper__label d-block">NABL/USFDA/CDL Report :</label>
                {isFileUploaded ? (
                  <>
                    <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => getHpRcDownloadFile(fileName)}>{fileName}</span>
                    <span className="text-danger ms-2" title="Remove File" onClick={() => { setIsFileUploaded(false); setFileName("") }} role="button"> <FontAwesomeIcon icon={faClose} size="sm" /></span>
                  </>
                ) : (
                  <>
                    <input className="Wrapper__inputs fileUpload w-50" type="file" onChange={onFileChange} role='button' />
                    <button className="buttons__container-controls-btn ms-2" onClick={handleFileUpload}>Upload File</button>
                  </>
                )}
              </div>
            </div>}

          {isEditMode &&
            <div className="unified-wrapper__container">
              <h4 className="unified-wrapper__container-heading">Edit NABL Report Details</h4>
              <div>
                <InputField
                  id="reportNo"
                  className="Wrapper__inputs"
                  type="text"
                  name="reportNo"
                  placeholder="NABL/USFDA/CDL Report No.:"
                  value={formState?.reportNo}
                  onChange={handleChange}
                  label={"NABL/USFDA/CDL Report No.:"}
                  isRequired
                />
                    {errors.reportNoErr &&
                  <span className="text-sm text-[#9b0000] mt-1 ms-1">
                    {errors.reportNoErr}
                  </span>
                }


              </div>

              <div>
                <DatePickerComponent
                  selectedDate={formState.reportDate}
                  setSelectedDate={(e) => handleDateChange(e, "reportDate")}
                  labelText={"Report Date"}
                  labelFor={"reportDate"}
                  name={"reportDate"}
                  allowMin={true}
                  isRequired
                />
                 {errors.reportDateErr &&
                  <span className="text-sm text-[#9b0000] mt-1 ms-1">
                    {errors.reportDateErr}
                  </span>
                }

              </div>

              <div>
                <label htmlFor="file" className="Wrapper__label d-block">NABL/USFDA/CDL Report :</label>
                {isFileUploaded ? (
                  <>
                    <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => getHpRcDownloadFile(fileName)}>{fileName}</span>
                    <span className="text-danger ms-2" title="Remove File" onClick={() => { setIsFileUploaded(false); setFileName("") }} role="button"> <FontAwesomeIcon icon={faClose} size="sm" /></span>
                  </>
                ) : (
                  <>
                    <input className="Wrapper__inputs fileUpload w-50" type="file" onChange={onFileChange} role='button' />
                    <button className="buttons__container-controls-btn ms-2" onClick={handleFileUpload}>Upload File</button>
                  </>
                )}
              </div>
            </div>
          }
          {viewModal && <MasterPopUpModal title={'EMD Details'} onCloseModal={onCloseModal} column={mstModalColumn} data={viewDetails} />}
        </>
      )}
      <BottomButtons isSave={true} isReset={true} isClose={true} onSave={handleSave} onReset={handleReset} onClose={handleClose} onDraft={null} isDraft={false} />
    </section>
  );
}

export default SupplierBatchDetails;
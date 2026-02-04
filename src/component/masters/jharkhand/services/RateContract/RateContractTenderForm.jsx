import { useEffect, useReducer, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hidePopup } from "../../../../../features/commons/popupSlice";
import {
  ComboDropDown,
  DatePickerComponent,
  InputField,
  RadioButton,
} from "../../../../commons/FormElements";
import {
  addNewBgDetails,
  addRefundBgDetails,
  addTenderdetails,
  deleteSupplierDetails,
  getBanks,
  getBgDetailList,
  getExistingSuppliers,
  getRefundBgDetailList,
  getTenderNameForAddTender,
  uploadFileTenderdetails,
} from "../../../../../api/Jharkhand/api/rateContractAPI";
import ReactDataTable from "../../../../commons/ReactDataTable";
import DataTable from "../../../../commons/Datatable";
import InputBox from "../../../../commons/InputBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faRemove, faTrash, faTrashAlt, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function RateContractTenderForm() {
  const { value: storeID, label: storeName } = useSelector(
    (state) => state.rateContractJHK.storeID
  );

  const { value: contractID, label: contractName } = useSelector(
    (state) => state.rateContractJHK.contractDetails
  );

  const suppliers = useSelector((state) => state.rateContractJHK.supplierList);

  const [tenders, setTenders] = useState([]);
  const [banks, setBanks] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingSuppliers, setExistingSuppliers] = useState([]);
  const [tenderNo, setTenderNo] = useState('');
  const [bgList, setBgList] = useState([]);
  const [refundBgList, setRefundBgList] = useState([]);
  const [isViewBgDetail, setIsViewBgDetail] = useState(false);
  const [isExtendBgDetail, setIsExtendBgDetail] = useState(false);
  const [newSuppId, setNewSuppId] = useState('');
  const [bgAction, setBgAction] = useState('1');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [refundValues, setRefundValues] = useState({});


  // Controlled state for inputs
  const initialState = {
    supplierName: "",
    bankName: "",
    contractFrom: "",
    contractTo: "",
    branchName: "",
    quotationNumber: "",
    tenderDate: new Date(),
    ifscCode: "",
    committeeMeetingDate: "",
    acceptanceDate: "",
    tender: "",
    tenderNo: "",
    bgValidityFrom: "",
    bgValidityTo: "",
    bgNo: "",
    bgAmt: "",
    bgSubmissionDate: "",
    bgDetails: ""

  };

  const [errors, setErrors] = useState({
    tenderErr: "",
    tenderNoErr: "",
    supplierNameErr: "",
    contractFromErr: "",
    contractToErr: "",
    acceptanceDateErr: "",
    committeeMeetingDateErr: "",
    bankNameErr: "",
    branchNameErr: "",
    bgValidityFromErr: "",
    bgValidityToErr: "",
    bgNoErr: "",
    bgAmtErr: "",

    bgActionErr: "",
    bgDetailsErr: "",
    bgSubmissionDateErr: "",
  })

  function addFormReducer(state, action) {
    switch (action.type) {
      case "SET_FIELD":
        console.log("Setting this : ", action.field);
        return { ...state, [action.field]: action.value };
      case "RESET_FORM":
        return initialState;
      default:
        return state;
    }
  }

  const [formState, dispatcher] = useReducer(addFormReducer, initialState);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errname = name + "Err";

    dispatcher({ type: "SET_FIELD", field: name, value });

    setErrors({ ...errors, [errname]: "" });
  };

  const handleDateChange = (value, fieldName) => {
    const errname = fieldName + "Err";
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
    setErrors({ ...errors, [errname]: "" });
  };

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    dispatcher({ type: "RESET_FORM" });
    setIsExtendBgDetail(false);
    setIsViewBgDetail(false);
    setBgAction('1');
    setExistingSuppliers([]);
    setTenderNo('');
    setBgList([]);
    setNewSuppId('');
    setRefundValues({});
    setSelectedRowId(null);
    setRefundBgList([]);
  }

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const getExistingSuppliersDt = (tno) => {
    getExistingSuppliers(998, tno)?.then((data) => {
      if (data?.status === 1) {
        setExistingSuppliers(data?.data);
        dispatcher({ type: "SET_FIELD", field: 'tenderDate', value: data?.data[0]?.hstdtTenderDate });
      } else {
        setExistingSuppliers([]);
      }
    })
  }

  const getRefundBgList = () => {
    getRefundBgDetailList(998, formState?.tender).then((data) => {
      console.log('data', data)
      if (data?.status === 1) {
        setRefundBgList(data?.data);
      } else {
        setRefundBgList([]);
      }
    })
  }

  useEffect(() => {
    if (formState?.tender) {
      getExistingSuppliersDt(formState?.tender)
      setErrors({ ...errors, "tenderNoErr": "" })
    } else {
      setExistingSuppliers([]);
      setErrors({ ...errors, "tenderNoErr": "" })
    }
  }, [formState?.tender])

  useEffect(() => {
    if (bgAction === "2" && isExtendBgDetail) {
      getRefundBgList();
    } else {
      setRefundBgList([]);
    }
  }, [bgAction])


  useEffect(() => {
    async function getTenderNumbers() {
      try {
        let tenders = [];
        const data = await getTenderNameForAddTender(998, storeID);
        data.data.forEach((element) => {
          const obj = {
            label: element.name,
            value: element.id,
            date: element.tenderdate,
            tenNo: element?.tenrefno
          };
          tenders.push(obj);
        });
        setTenders(tenders);
      } catch (err) {
        console.log("Failed to fetch tenders.", err);
      }
    }

    async function getBankNames() {
      try {
        let tenders = [];
        const data = await getBanks(998);
        data.data.forEach((element) => {
          const obj = {
            label: element.bankname,
            value: element.bankid,
          };
          tenders.push(obj);
        });
        setBanks(tenders);
      } catch (err) {
        console.log("Failed to fetch banks.", err);
      }
    }

    getTenderNumbers();
    getBankNames();
  }, [storeID]);

  const handleSaveTender = () => {
    let isValid = true;

    if (!tenderNo) {
      setErrors(prev => ({ ...prev, "tenderNoErr": "Tender number is required!" }));
      isValid = false;
    }

    if (!formState?.tender) {
      setErrors(prev => ({ ...prev, "tenderErr": "Tender is required!" }));
      isValid = false;
    }

    if (!formState?.supplierName && !isExtendBgDetail) {
      setErrors(prev => ({ ...prev, "supplierNameErr": "Supplier Name is required!" }));
      isValid = false;
    }

    if (!formState?.contractFrom && !isExtendBgDetail) {
      setErrors(prev => ({ ...prev, "contractFromErr": "Contract From date is required!" }));
      isValid = false;
    }
    if (!formState?.contractTo && !isExtendBgDetail) {
      setErrors(prev => ({ ...prev, "contractToErr": "Contract To date is required!" }));
      isValid = false;
    }
    if (!formState?.acceptanceDate && !isExtendBgDetail) {
      setErrors(prev => ({ ...prev, "acceptanceDateErr": "Acceptance Date is required!" }));
      isValid = false;
    }
    if (!formState?.committeeMeetingDate && !isExtendBgDetail) {
      setErrors(prev => ({ ...prev, "committeeMeetingDateErr": "Committee Date is required!" }));
      isValid = false;
    }
    if (!formState?.bankName && !isExtendBgDetail) {
      setErrors(prev => ({ ...prev, "bankNameErr": "Bank name is required!" }));
      isValid = false;
    }
    if (!formState?.branchName && !isExtendBgDetail) {
      setErrors(prev => ({ ...prev, "branchNameErr": "Branch name is required!" }));
      isValid = false;
    }
    if (!formState?.bgValidityFrom && bgAction === '1') {
      setErrors(prev => ({ ...prev, "bgValidityFromErr": "BG Validity From date is required!" }));
      isValid = false;
    }

    if (!formState?.bgValidityTo && bgAction === '1') {
      setErrors(prev => ({ ...prev, "bgValidityToErr": "BG Validity To date is required!" }));
      isValid = false;
    }

    if (!formState?.bgNo && bgAction === '1') {
      setErrors(prev => ({ ...prev, "bgNoErr": "BG Number is required!" }));
      isValid = false;
    }

    if (!formState?.bgAmt && bgAction === '1') {
      setErrors(prev => ({ ...prev, "bgAmtErr": "BG Amount is required!" }));
      isValid = false;
    }

    if (!bgAction && isExtendBgDetail) {
      setErrors(prev => ({ ...prev, "bgActionErr": "BG Action is required!" }));
      isValid = false;
    }
    if (!formState?.bgDetails?.trim() && isExtendBgDetail && bgAction === '1') {
      setErrors(prev => ({ ...prev, "bgDetailsErr": "BG Detail is required!" }));
      isValid = false;
    }
    if (!formState?.bgSubmissionDate && isExtendBgDetail && bgAction === '1') {
      setErrors(prev => ({ ...prev, "bgSubmissionDateErr": "BG submission date is required!" }));
      isValid = false;
    }

    if (isValid) {
      saveTenderDetails();
      // alert('bgbbgbg')
    }

  }

  const saveTenderDetails = () => {
    const val = {
      gnumHospitalCode: 998,
      hstnumContractTypeId: contractID,
      hststrTenderNo: formState?.tender?.toString(),
      hststrQuotationNo: formState?.quotationNumber,
      hstnumSupplierId: parseInt(formState?.supplierName),
      hstdtContractFrmdate: formState?.contractFrom,
      hstdtContractTodate: formState?.contractTo,
      gnumSeatid: 10001,
      gnumIsvalid: 1,
      hstdtTenderDate: formState?.tenderDate,
      hstdtPurCommMeetingDate: formState?.committeeMeetingDate,
      hstdtAcceptanceDate: formState?.acceptanceDate,
      hstnumBgNo: formState?.bgNo,
      hstnumBgAmt: parseInt(formState?.bgAmt),
      hstdtBgToDate: formState?.bgValidityTo,
      hstdtBgFromDate: formState?.bgValidityFrom,
      hststrIfscCode: formState?.ifscCode,
      hststrBranchName: formState?.branchName,
      strTenderDtls: tenderNo?.toString(),
      hstnumBankId: formState?.bankName?.toString(),
      hststrFileName: selectedFile?.name,
      hstnumStoreId: storeID,
    };

    const valNew = {
      hststrTenderNo: formState?.tender?.toString(),
      hstnumSupplierId: parseInt(newSuppId || 0),
      gnumHospitalCode: 998,
      gnumSeatid: 10001,
      bgSubmissionDate: formState?.tender,
      strNewBgDetails: formState?.bgDetails,
      hstnumBgNo: formState?.bgNo,
      hstnumBgAmt: parseInt(formState?.bgAmt),
      hstdtBgToDate: formState?.bgValidityTo,
      hstdtBgFromDate: formState?.bgValidityFrom,
    }

    const valRefund = {
      hststrTenderNo: formState?.tender?.toString(),
      hstnumSupplierId: parseInt(selectedRowId?.hstnum_supplier_id),
      gnumHospitalCode: 998,
      gnumSeatid: 10001,
      hstnumBgNo: selectedRowId?.bg_no || "",
      hstnumRefundAmount: parseInt(refundValues[selectedRowId?.index] || 0),  //refund amount
      hstnumBgSlNo: selectedRowId?.hstnum_bg_sl_no
    }

    if (isExtendBgDetail) {
      if (bgAction === '1') {
        addNewBgDetails(valNew)?.then((res) => {
          if (res?.status === 1) {
            alert('New details saved successfully');
            handleReset();
          } else {
            console.error(res?.message);
          }
        });
      } else {
        addRefundBgDetails(valRefund)?.then((res) => {
          if (res?.status === 1) {
            alert('Refund details saved successfully');
            handleReset();
          } else {
            console.error(res?.message);
          }
        });
      }

    } else {
      const formData = new FormData();
      formData.append("rateContractDto", JSON.stringify(val));
      if (selectedFile) {
        formData.append("file", selectedFile, selectedFile?.name);
      }
      addTenderdetails(formData)?.then((res) => {
        if (res?.status === 1) {
          alert('Tender details saved successfully');
          handleReset();
        } else {
          console.error(res?.message);
        }
      });
    }

  };

  const fetchBGListDt = (row) => {
    setIsViewBgDetail(true)
    getBgDetailList(998, row?.hstnumSupplierId, contractID, formState?.tender)?.then((res) => {
      if (res?.status === 1) {
        setBgList(res?.data);
      } else {
        setBgList([]);
      }
    });
  };

  const bgdetailsTableCols = [
    { header: "BG Amount (₹)", field: "bg_amt" },
    { header: "BG From Date", field: "bg_frm_date" },
    { header: "BG To Date", field: "bg_to_date" },
    { header: "BG No.", field: "hstnum_bg_no" },
    { header: "Refund Amount", field: "hstnum_refund_amount" },
  ];

  const deleteExistingSupplierDetail = (row) => {

    const { hstnumSupplierId, hststrTenderNo } = row;

    deleteSupplierDetails(998, hstnumSupplierId, hststrTenderNo, 14462)?.then((data) => {
      if (data?.status === 1) {
        alert('record deleted');
        getExistingSuppliersDt(formState?.tender);
      } else {
        console.error(data?.message)
      }
      console.log('data', data)
    })
  }

  const existingSuppTableCols = [
    {
      name: (<span>Supplier Name</span>),
      selector: row => row.supplierName,
      sortable: true,
      wrap: true,
      // width:"12%"
    },
    {
      name: (<span>Contract From</span>),
      selector: row => row?.hstdtContractFrmdate,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Contract To</span>),
      selector: row => row?.hstdtContractTodate,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Acceptance Date</span>),
      selector: row => row?.hstdtAcceptanceDate,
      sortable: true,
      wrap: true,
    },
    {
      // name: 'Financial Committee Date',
      name: (<span>Financial Committee Date</span>),
      selector: row => row?.hstdtFinancialCommDate,
      sortable: true,
      wrap: true,
      width: "15%"
    },
    {
      name: (<span>Bank Name</span>),
      selector: row => row?.tenderNo,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Branch</span>),
      selector: row => row?.hststrBranchName,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>IFSC Code</span>),
      selector: row => row?.hststrIfscCode,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Action',
      cell: row =>
        <div style={{ position: 'absolute', top: 4, left: 10 }}>
          <span className="btn btn-sm text-white py-0 d-flex gap-1" >
            <button className="btn btn-success btn-sm px-1 py-0 rounded rounded-5 fs-13" title={"View BG Detail"} onClick={() => fetchBGListDt(row)}>
              <FontAwesomeIcon icon={faEye} size="xs" />
            </button>
            <button className="btn btn-warning btn-sm px-1 py-0 rounded rounded-5 fs-13" title="Extend Last Date Of Submission" onClick={() => { setIsExtendBgDetail(true); setNewSuppId(row?.hstnumSupplierId) }}> <FontAwesomeIcon icon={faEdit} size="xs" /></button>

            <button
              className="btn btn-danger btn-sm px-1 py-0 rounded rounded-5 fs-13"
              title={`${row?.rcCount === 0 ? "Delete Details" : "Can't Delete Details"}`}
              disabled={row?.rcCount !== 0}
              onClick={() => { deleteExistingSupplierDetail(row) }}>
              <FontAwesomeIcon icon={faTrash} size="xs" />
            </button>

          </span>
        </div>,
      sortable: false,
    },
  ]

  const handleRowSelect = (row, index) => {
    const upRow = { ...row, "index": index }
    setSelectedRowId(upRow);
  };

  const handleRefundChange = (rowId, value) => {
    setRefundValues({ [rowId]: value, });
  };

  const refundBgDetailsCols = [
    {
      name: <input
        type="checkbox"
        // checked={selectAll}
        // onChange={(e) => handleSelectAll(e.target.checked, "gnumUserId")}
        disabled={true}
        className="form-check-input log-select"
      />,
      cell: (row, index) =>
        <div style={{ position: 'absolute', top: 4, left: 10 }}>
          <span className="btn btn-sm text-white px-1 py-0 mr-1" >
            <input
              type="checkbox"
              checked={selectedRowId?.index === index}
              onChange={(e) => { handleRowSelect(row, index) }}
            />
          </span>
        </div>,
      width: "6%"
    },
    {
      name: (<span>BG No.</span>),
      selector: row => row.bg_no,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>BG From Date</span>),
      selector: row => row?.bg_frm_date,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>BG To Date</span>),
      selector: row => row?.bg_to_date,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>BG Amt.(₹)</span>),
      selector: row => row?.bg_amt,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>BG Submission Date</span>),
      selector: row => row?.bg_subm_date,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>BG Details</span>),
      selector: row => row?.bg_dtls,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Refund Amt.',
      cell: (row, index) =>
        <div style={{ position: 'absolute', top: 3, left: 0 }}>
          <InputBox
            id="refundAmt"
            className=""
            type="text"
            name={"refundAmt"}
            placeholder="Enter..."
            value={refundValues[index] || ""}
            disabled={selectedRowId?.index !== index}
            onChange={(e) => { handleRefundChange(index, e?.target?.value); }}
          />
        </div>,
      sortable: false,
    },
  ]


  return (
    <>
      <h3 className="employeeMaster__heading">Tender Add</h3>
      <div className="employeeMaster__container">
        <h4 className="employeeMaster__container-heading">RC Type Details</h4>
        <div>
          <label htmlFor="supplierName" className="employeeMaster__label">
            <b>Store Name</b> : {storeName}
          </label>
          <label htmlFor="contractType" className="employeeMaster__label">
            <b>Contract Type</b> : {contractName}
          </label>
        </div>
      </div>
      <div className="employeeMaster__container">
        <h4 className="employeeMaster__container-heading">Tender Details</h4>
        <div>
          <label htmlFor="tender" className="employeeMaster__label required-label">
            Tender
          </label>
          <ComboDropDown
            options={[{ label: "New", value: 1 }, ...tenders]}
            onChange={(e) => {
              handleChange(e);
              setTenderNo(tenders?.find(dt => dt?.value == e?.target?.value)?.tenNo || '');
            }}
            name={"tender"}
            value={formState.tender}
          />
          {errors?.tenderErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.tenderErr}
            </span>
          }
        </div>

        <div>
          <label htmlFor="tenderNo" className="employeeMaster__label required-label">
            Tender Number
          </label>
          <InputField
            id="tenderNo"
            className="employeeMaster__input"
            type="text"
            name={"tenderNo"}
            placeholder="Enter Tender Number"
            value={tenderNo}
            onChange={(e) => { setTenderNo(e?.target?.value); }}
            disabled={formState.tender !== 1}
          />
          {errors?.tenderNoErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.tenderNoErr}
            </span>
          }
        </div>

        <div>
          <DatePickerComponent
            selectedDate={formState.tenderDate}
            setSelectedDate={(e) => handleDateChange(e, "tenderDate")}
            labelText={"Tender Date"}
            labelFor={"tenderDate"}
            name={"tenderDate"}
            allowMin={true}
            disabled={formState.tender !== 1}
          />
        </div>
      </div>

      {/* EXISTING SUPPLIERS LIST */}
      {formState.tender !== 1 &&
        <>
          <h4 className="bg-[#097080] text-white p-1 rounded">
            Supplier Details
          </h4>
          <div style={{ marginBottom: "2rem" }}>
            <ReactDataTable title={'bbb'} column={existingSuppTableCols} data={existingSuppliers} isSearchReq={false} isPagination={false} />
          </div>
        </>
      }

      {/* BG DETAILS LIST */}
      {isViewBgDetail &&
        <div className="">
          <div className="d-flex justify-content-between align-items-center bg-[#097080] px-2 rounded">
            <h4 className="text-white m-0 ">BG Details</h4>
            <span
              className="text-danger fw-bold cursor-pointer"
              style={{ fontSize: "20px" }}
              onClick={() => { setIsViewBgDetail(false); }}
            >
              X
            </span>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <DataTable
              masterName={"Existing Rate Contract"}
              ref={null}
              columns={bgdetailsTableCols}
              data={bgList}
              isPagination={false}
              isSearchReq={false}
              isReport={false}
            />
          </div>
        </div>
      }

      <div className={`employeeMaster__container ${(isExtendBgDetail && bgAction === '2') && 'd-block'}`}>
        <h4 className="employeeMaster__container-heading">{`${isExtendBgDetail ? 'New BG Details' : 'New Supplier Details'}`}</h4>
        {!isExtendBgDetail &&
          <>
            <div>
              <label htmlFor="supplierName" className="employeeMaster__label required-label">
                Supplier Name
              </label>
              <ComboDropDown
                options={suppliers}
                onChange={handleChange}
                name={"supplierName"}
                value={formState.supplierName}
              />
              {errors?.supplierNameErr &&
                <span className="text-sm text-[#9b0000] mt-1 ms-1">
                  {errors?.supplierNameErr}
                </span>
              }
            </div>


            <div>
              <label htmlFor="quotationNumber" className="employeeMaster__label">
                Quotation Number
              </label>
              <InputField
                id="quotationNumber"
                className="employeeMaster__input"
                type="text"
                name={"quotationNumber"}
                placeholder="Enter Quotation Number"
                value={formState.quotationNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <DatePickerComponent
                selectedDate={formState.contractFrom}
                setSelectedDate={(e) => handleDateChange(e, "contractFrom")}
                labelText={"Contract From"}
                labelFor={"contractFrom"}
                name={"contractFrom"}
                allowMin={true}
                isRequired
              />
              {errors?.contractFromErr &&
                <span className="text-sm text-[#9b0000] mt-1 ms-1">
                  {errors?.contractFromErr}
                </span>
              }
            </div>
            <div>
              <DatePickerComponent
                selectedDate={formState.contractTo}
                setSelectedDate={(e) => handleDateChange(e, "contractTo")}
                labelText={"Contract To"}
                labelFor={"contractTo"}
                name={"contractTo"}
                allowMin={true}
                isRequired
              />
              {errors?.contractToErr &&
                <span className="text-sm text-[#9b0000] mt-1 ms-1">
                  {errors?.contractToErr}
                </span>
              }
            </div>
            <div>
              <DatePickerComponent
                selectedDate={formState.acceptanceDate}
                setSelectedDate={(e) => handleDateChange(e, "acceptanceDate")}
                labelText={"Acceptance Date"}
                labelFor={"acceptanceDate"}
                name={"acceptanceDate"}
                allowMin={true}
                isRequired
              />
              {errors?.acceptanceDateErr &&
                <span className="text-sm text-[#9b0000] mt-1 ms-1">
                  {errors?.acceptanceDateErr}
                </span>
              }
            </div>
            <div>
              <DatePickerComponent
                selectedDate={formState.committeeMeetingDate}
                setSelectedDate={(e) => handleDateChange(e, "committeeMeetingDate")}
                labelText={"Financial Committee Date"}
                labelFor={"committeeMeetingDate"}
                name={"committeeMeetingDate"}
                allowMin={true}
                isRequired
              />
              {errors?.committeeMeetingDateErr &&
                <span className="text-sm text-[#9b0000] mt-1 ms-1">
                  {errors?.committeeMeetingDateErr}
                </span>
              }
            </div>
            <div>
              <label htmlFor="bankName" className="employeeMaster__label required-label">
                Bank Name
              </label>
              <ComboDropDown
                options={banks}
                onChange={handleChange}
                name={"bankName"}
                value={formState.bankName}
              />
              {errors?.bankNameErr &&
                <span className="text-sm text-[#9b0000] mt-1 ms-1">
                  {errors?.bankNameErr}
                </span>
              }
            </div>
            <div>
              <label htmlFor="branchName" className="employeeMaster__label required-label">
                Branch Name
              </label>
              <InputField
                id="branchName"
                className="employeeMaster__input"
                type="text"
                name={"branchName"}
                placeholder="Enter Branch Number"
                value={formState.branchName}
                onChange={handleChange}
              />
              {errors?.branchNameErr &&
                <span className="text-sm text-[#9b0000] mt-1 ms-1">
                  {errors?.branchNameErr}
                </span>
              }
            </div>
            <div>
              <label htmlFor="ifscCode" className="employeeMaster__label">
                IFSC Code
              </label>
              <InputField
                id="ifscCode"
                className="employeeMaster__input"
                type="text"
                name={"ifscCode"}
                placeholder="Enter IFSC Code"
                value={formState.ifscCode}
                onChange={handleChange}
              />
            </div>
          </>}

        {isExtendBgDetail &&
          <div className="bankmaster__container">
            <label className="bankmaster__label required-label">
              {" "}
              BG Action:
            </label>
            <RadioButton
              label="New"
              name="bgAction"
              value="1"
              checked={bgAction === "1"}
              onChange={(e) => setBgAction(e?.target?.value)}
            />
            <RadioButton
              label="Refund"
              name="bgAction"
              value="2"
              checked={bgAction === "2"}
              onChange={(e) => setBgAction(e?.target?.value)}
            />
          </div>
        }
        {bgAction === '1' &&
          <>
            <div>
              <DatePickerComponent
                selectedDate={formState.bgValidityFrom}
                setSelectedDate={(e) => handleDateChange(e, "bgValidityFrom")}
                labelText={"BG Validity From"}
                labelFor={"bgValidityFrom"}
                name={"bgValidityFrom"}
                allowMin={true}
                isRequired
              />
              {errors?.bgValidityFromErr &&
                <span className="text-sm text-[#9b0000] mt-1 ms-1">
                  {errors?.bgValidityFromErr}
                </span>
              }
            </div>
            <div>
              <DatePickerComponent
                selectedDate={formState.bgValidityTo}
                setSelectedDate={(e) => handleDateChange(e, "bgValidityTo")}
                labelText={"BG Validity To"}
                labelFor={"bgValidityTo"}
                name={"bgValidityTo"}
                allowMin={true}
                isRequired
              />
              {errors?.bgValidityToErr &&
                <span className="text-sm text-[#9b0000] mt-1 ms-1">
                  {errors?.bgValidityToErr}
                </span>
              }
            </div>
            <div>
              <label htmlFor="bgNo" className="employeeMaster__label required-label">
                BG Number
              </label>
              <InputField
                id="bgNo"
                className="employeeMaster__input"
                type="text"
                name={"bgNo"}
                placeholder="Enter BG Number"
                value={formState.bgNo}
                onChange={handleChange}
              />
              {errors?.bgNoErr &&
                <span className="text-sm text-[#9b0000] mt-1 ms-1">
                  {errors?.bgNoErr}
                </span>
              }
            </div>
            <div>
              <label htmlFor="bgAmt" className="employeeMaster__label required-label">
                BG Amount
              </label>
              <InputField
                id="bgAmt"
                className="employeeMaster__input"
                type="text"
                name={"bgAmt"}
                placeholder="Enter BG Amount"
                value={formState.bgAmt}
                onChange={handleChange}
              />
              {errors?.bgAmtErr &&
                <span className="text-sm text-[#9b0000] mt-1 ms-1">
                  {errors?.bgAmtErr}
                </span>
              }
            </div>
          </>
        }

        {(isExtendBgDetail && bgAction === '1') &&
          <div>
            <DatePickerComponent
              selectedDate={formState?.bgSubmissionDate}
              setSelectedDate={(e) => handleDateChange(e, "bgSubmissionDate")}
              labelText={"BG Submission Date"}
              labelFor={"bgSubmissionDate"}
              name={"bgSubmissionDate"}
              allowMin={true}
              isRequired
            />
            {errors?.bgSubmissionDateErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.bgSubmissionDateErr}
              </span>
            }
          </div>
        }

        {(isExtendBgDetail && bgAction === '1') &&
          <div>
            <label htmlFor="bgDetails" className="employeeMaster__label required-label">
              BG Details
            </label>

            <textarea
              id="bgDetails"
              className="employeeMaster__input"
              type="text"
              name={"bgDetails"}
              placeholder="Enter BG Amount"
              value={formState.bgDetails}
              onChange={handleChange}
            />
            {errors?.bgDetailsErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.bgDetailsErr}
              </span>
            }
          </div>
        }

        {!isExtendBgDetail &&
          <div>
            <label htmlFor="file" className="employeeMaster__label">
              Upload File (PDF) :
            </label>

            <input
              className="rateContractAddJHK__fileUpload"
              type="file"
              onChange={onFileChange}
            />
          </div>
        }

        {/* NEW REFUND BG DETAILS */}
        {(isExtendBgDetail && bgAction === '2') &&
          <div className="">
            <ReactDataTable
              title={''}
              column={refundBgDetailsCols}
              data={refundBgList}
              isSearchReq={false}
              isPagination={false}
            />
          </div>
        }
      </div>

      <div className="bankmaster__container-controls">
        <button
          className="bankmaster__container-controls-btn"
          onClick={handleSaveTender}
        >
          Save
        </button>
        <button
          className="bankmaster__container-controls-btn"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="bankmaster__container-controls-btn"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </>
  );
}

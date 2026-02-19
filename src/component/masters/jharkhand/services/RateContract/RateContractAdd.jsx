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
  addContractdetails,
  getBgDetailList,
  getContractDetails,
  getExistingRC,
  getLevelTypeCmb,
  getSuppliersWithContractCmb,
  getTenderNumber,
  getUnitCombo,
} from "../../../../../api/Jharkhand/api/rateContractAPI";
import DataTable from "../../../../commons/Datatable";
import SelectBox from "../../../../commons/SelectBox";

const existingRcTableCols = [
  { header: "Supplier Name", field: "suppName" },
  { header: "Level", field: "levelType" },
  { header: "Rate/Unit", field: "rate" },
  { header: "RC Number", field: "hstnumRcNo" },
  { header: "Contract Validity", field: "bgValidity" },
  { header: "Tender Number", field: "tenderNo" },
  { header: "BG Details", field: "bgAmt" },
];
const bgdetailsTableCols = [
  { header: "BG Amount (₹)", field: "bg_amt" },
  { header: "BG From Date", field: "bg_frm_date" },
  { header: "BG To Date", field: "bg_to_date" },
  { header: "BG No.", field: "hstnum_bg_no" },
  { header: "Refund Amount", field: "hstnum_refund_amount" },
];

export default function RateContractAddForm() {
  //   const specialCharacterCheck = /[^a-zA-Z0-9\s]/g;

  const drugList = useSelector((state) => state.rateContractJHK.drugsList);
  // const suppliers = useSelector(state => state.rateContractJHK.supplierList);

  const { value: storeID, label: storeName } = useSelector(
    (state) => state.rateContractJHK.storeID
  );

  const { value: contractID, label: contractName } = useSelector(
    (state) => state.rateContractJHK.contractDetails
  );

  const [whetherImported, setWhetherImported] = useState("No");
  const [drugName, setDrugName] = useState(0);
  const [itemID, setItemID] = useState(0);
  const [suppliers, setSuppliers] = useState([]);

  const taxTypes = [{ label: "GST", value: "3" }];
  const batchSizeOptions = Array.from({ length: 50 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));


  // Controlled state for inputs
  const initialState = {
    //contract detail
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

    //tender detail
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
    tenderDate: ""
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
    drugNameErr: "", supplierNameErr: "", tenderNoErr: "", shelfLifeErr: "", noOfBatchesErr: "", whetherImportedErr: "", levelErr: "", taxTypeErr: "", cgstErr: "", sgstErr: "", rateUnitErr: "", deliveryDayErr: "",
  })

  const [formState, dispatcher] = useReducer(addFormReducer, initialState);

  const dispatch = useDispatch();

  const dataTableRef = useRef();
  const [existingRCs, setExistingRCs] = useState([]);
  const [bgList, setBgList] = useState([]);
  const [levelType, setLevelType] = useState([]);
  const [unitDrpDt, setUnitDrpDt] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);


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
  }

  const getContractDetailsWithTender = () => {
    const { supplierName, tenderNo } = formState;
    getTenderNumber(998, supplierName).then((res) => {
      console.log("res", res);
      if (res?.status === 1) {
        const tendNo = res?.data[0]?.hstnum_tender_no;
        getContractDetails(998, supplierName, tendNo)?.then((data) => {
          console.log("data", data);
          if (data?.status === 1) {
            dispatcher({
              type: "SET_FIELDS",
              payload: {
                tenderNo: tendNo,
                contractFrom: data?.data[0]?.contract_frm_date,
                contractTo: data?.data[0]?.contratct_to_date,
                rcFinalDate: data?.data[0]?.tender_date,
                quotationNo: data?.data[0]?.quot_ref_no,
                acceptanceDate: data?.data[0]?.acceptance_date,
                financeCommitteDate: data?.data[0]?.fin_comm_date,
                bankName: data?.data[0]?.bank_name,
                branchName: data?.data[0]?.hststr_branch_name,
                bankIfscCode: data?.data[0]?.hststr_ifsc_code,
                bankID: data?.data[0]?.hstnum_bank_id,
                tenderDate: data?.data[0]?.tender_date,
              },
            });
          }
        });
      }
    });
  };

  const levelTypeDrpData = () => {
    getLevelTypeCmb(998)?.then((res) => {
      if (res?.status === 1) {
        const drpDt = res?.data?.map((dt) => ({
          value: dt?.id,
          label: dt?.level_type,
        }));
        setLevelType(drpDt);
      } else {
        setLevelType([]);
      }
    });
  };
  
  const unitDrpData = () => {
    getUnitCombo(998)?.then((res) => {
      if (res?.status === 1) {
        const drpDt = res?.data?.map((dt) => ({
          value: dt?.unit_id,
          label: dt?.unit_name,
        }));
        setUnitDrpDt(drpDt);
      } else {
        setUnitDrpDt([]);
      }
    });
  };

  useEffect(() => {
    levelTypeDrpData();
    unitDrpData();
  }, []);

  useEffect(() => {
    async function fetchExistingRCs() {
      const response = await getExistingRC(998, storeID, drugName, contractID);
      if (response?.status === 1) {
        setExistingRCs(response?.data);
      } else {
        setExistingRCs([]);
      }
    }
    fetchExistingRCs();
  }, [storeID, drugName, contractID]);

  const fetchBGListDt = () => {
    const { supplierName, tenderNo } = formState;

    getBgDetailList(998, supplierName, contractID, tenderNo)?.then((res) => {
      if (res?.status === 1) {
        setBgList(res?.data);
      } else {
        setBgList([]);
      }
    });
  };

  useEffect(() => {
    if (formState?.supplierName && formState?.tenderNo) {
      fetchBGListDt();
    }
  }, [formState?.supplierName, formState?.tenderNo]);

  useEffect(() => {
    if (formState?.supplierName) {
      getContractDetailsWithTender();
    } else {
      dispatcher({
        type: "SET_FIELDS",
        payload: {
          tenderNo: '',
          contractFrom: '',
          contractTo: '',
          rcFinalDate: '',
          quotationNo: '',
          acceptanceDate: '',
          financeCommitteDate: '',
          bankName: '',
          branchName: '',
          bankIfscCode: '',
        },
      });
    }
  }, [formState?.supplierName]);

  useEffect(() => {
    if (contractID) {
      getSuppliersWithContractCmb(998, contractID).then((res) => {
        if (res?.status === 1) {
          const drpDt = res?.data?.map((dt) => ({
            value: dt?.hstnum_supplier_id,
            label: dt?.supp_name,
          }));
          setSuppliers(drpDt);
        } else {
          setSuppliers([]);
        }
      });
    }
  }, [contractID]);

  const handleSave = () => {
    let isValid = true;

    if (!drugName?.trim()) {
      seterrors((prev => ({ ...prev, 'drugNameErr': "Drug Name is Required!" })));
      isValid = false;
    }
    if (!formState?.supplierName?.trim()) {
      seterrors((prev => ({ ...prev, 'supplierNameErr': "Supplier Name is Required!" })));
      isValid = false;
    }
    if (!formState?.tenderNo) {
      seterrors((prev => ({ ...prev, 'tenderNoErr': "Tendor number is Required!" })));
      isValid = false;
    }
    if (!formState?.shelfLife?.trim()) {
      seterrors((prev => ({ ...prev, 'shelfLifeErr': "Shelf life is Required!" })));
      isValid = false;
    }
    if (!formState?.noOfBatches) {
      seterrors((prev => ({ ...prev, 'noOfBatchesErr': "No. of batches is Required!" })));
      isValid = false;
    }
    if (!formState?.level) {
      seterrors((prev => ({ ...prev, 'levelErr': "Please select a level!" })));
      isValid = false;
    }
    if (!formState?.taxType?.trim()) {
      seterrors((prev => ({ ...prev, 'taxTypeErr': "Please select tax type!" })));
      isValid = false;
    }
    if (!formState?.cgst?.trim()) {
      seterrors((prev => ({ ...prev, 'cgstErr': "CGST is required!" })));
      isValid = false;
    }
    if (!formState?.sgst?.trim()) {
      seterrors((prev => ({ ...prev, 'sgstErr': "SGST is required!" })));
      isValid = false;
    }
    if (!formState?.rate?.trim() || !formState?.unit?.trim()) {
      seterrors((prev => ({ ...prev, 'rateUnitErr': "Rate and Unit are required!" })));
      isValid = false;
    }
    if (!formState?.deliveryDay?.trim()) {
      seterrors((prev => ({ ...prev, 'deliveryDayErr': "Delivery days is required!" })));
      isValid = false;
    }

    if (isValid) {
      saveContractdetails();
    }

  }

  const saveContractdetails = () => {

    const val = {
      "gnumHospitalCode": 998,
      "gnumCancelSeatid": "",
      "hstnumContractTypeId": contractID,
      "hstnumBankId": formState?.bankID,
      "hstnumBranchId": formState?.branchName,
      "hststrIfscCode": formState?.bankIfscCode,
      "hstnumBgAmt": parseInt(bgList[0]?.bg_amt || '0'),
      "hstnumBgNo": bgList[0]?.hstnum_bg_no || '',
      "strTenderDateDtls": formState?.tenderDate,
      "hstnumSupplierId": parseInt(formState?.supplierName),
      "hstnumStoreId": storeID,
      "hstnumItembrandId": parseInt(drugName),
      "gnumSeatid": 10001,
      "gnumIsvalid": 1,
      "hstnumItemId": parseInt(itemID || 0),

      "hststrTenderNo": formState?.tenderNo?.toString(),//s
      "hstnumContractQty": parseInt(formState?.contractedQty),
      "hstnumShelfLife": parseInt(formState?.shelfLife),
      "hstnumBatchSize": parseInt(formState?.noOfBatches),
      "hstnumImportedFlag": whetherImported === "Yes" ? 1 : 0,
      "sstnumLevelTypeId": parseInt(formState?.level),
      "hstnumAllocationOrderQty": parseInt(formState?.allocationQty),
      "hstnumTaxType": parseInt(formState?.taxType),
      "hstnumRateUnitId": parseInt(formState?.unit),
      "hstnumRate": parseInt(formState?.rate),
      "hstnumDeliveryDays": parseInt(formState?.deliveryDay),
      "hstnumCgst": parseInt(formState?.cgst),
      "hstnumSgst": parseInt(formState?.sgst),
      "hstnumDiscount": parseInt(formState?.discount),
      "gstrRemarks": formState?.remarks,
      "hstdtContractFrmdate": formState?.contractFrom,
      "hstdtContractTodate": formState?.contractTo,
      "hstnumDccRequireFlag": formState?.isDccMandatory ? 1 : 0
    }

    const formData = new FormData();

    formData.append("rateContractDto", JSON.stringify(val));

    if (selectedFile) {
      formData.append("file", selectedFile, selectedFile?.name);
    }

    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ': ', pair[1]);
    // }
    addContractdetails(formData)?.then((data) => {
      if (data?.status === 1) {
        alert('Rate Contract Added Successfully');
        handleReset();
        dispatch(hidePopup());
      } else {
        alert(data?.message);
      }
      console.log('data', data)
    })

  }

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  function handleFileUpload(selectedFile) {
    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile?.name);
    return formData;
  }


  return (
    <section className="rateContractAddJHK">
      <h3 className="rateContractAddJHK__heading">
        Rate Contract Itemwise Details
      </h3>
      <div className="rateContractAddJHK__container">
        <h4 className="rateContractAddJHK__container-heading">
          RC Type Details
        </h4>
        <div>
          <label htmlFor="supplierName" className="rateContractAddJHK__label">
            <b>Store Name</b> : {storeName}
          </label>
          <label htmlFor="contractType" className="rateContractAddJHK__label">
            <b>Contract Type</b> : {contractName}
          </label>
          <div>
            <label
              htmlFor="taxType"
              className="rateContractAddJHK__label required-label"
            >
              <b>Drug Names</b>
            </label>
            <ComboDropDown
              options={drugList}
              onChange={(e) => {
                setDrugName(e?.target?.value);
                setItemID(drugList?.find(dt => dt?.value == e?.target?.value)?.itemId || null)
              }}
              name={"drugName"}
              value={drugName}
            />
            {errors?.drugNameErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.drugNameErr}
              </span>
            }
          </div>
        </div>

      </div>
      <h4 className="bg-[#097080] text-white p-2 rounded">
        Existing Rate Contract
      </h4>
      <div style={{ marginBottom: "3rem" }}>
        <DataTable
          masterName={"Existing Rate Contract"}
          ref={dataTableRef}
          columns={existingRcTableCols}
          data={existingRCs}
        />
      </div>

      <div className="rateContractAddJHK__container">
        <h4 className="rateContractAddJHK__container-heading">
          Contract Details
        </h4>

        <div>
          <label
            htmlFor="taxType"
            className="rateContractAddJHK__label required-label"
          >
            Supplier Name:
          </label>
          <SelectBox
            id="supplierName"
            options={suppliers}
            onChange={handleChange}
            name={"supplierName"}
            value={formState?.supplierName}
            className="Wrapper__select p-4"
            error={errors?.supplierNameErr}
          />
        </div>

        <div>
          <label
            htmlFor="taxType"
            className="rateContractAddJHK__label required-label"
          >
            Tender No.:
          </label>
          <SelectBox
            id="tenderNo"
            options={[]}
            onChange={handleChange}
            name={"tenderNo"}
            value={formState?.tenderNo}
            placeholder={`${formState?.tenderNo ? formState?.tenderNo : 'select value'}`}
            className="Wrapper__select p-4"
            disabled={formState?.tenderNo}
            error={formState?.tenderNo ? "" : errors?.tenderNoErr}
          />
        </div>

        <div>
          <label className="rateContractAddJHK__label mb-0">
            Is Dcc mandatory :
            <input
              id="isDccMandatory"
              className="ms-2 rounded"
              type="checkbox"
              name="isDccMandatory"
              checked={!!formState?.isDccMandatory}
              onChange={handleChange}
              style={{ width: "15px", height: "15px" }}
            />
          </label>
        </div>

        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Contract From :{" "}
            <span className="fs-6 fw-normal">{formState?.contractFrom}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Contract To :{" "}
            <span className="fs-6 fw-normal">{formState?.contractTo}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            RC Finalization Date :{" "}
            <span className="fs-6 fw-normal">{formState?.rcFinalDate}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Quotation No. :{" "}
            <span className="fs-6 fw-normal">{formState?.quotationNo}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Acceptance Date :{" "}
            <span className="fs-6 fw-normal">{formState?.acceptanceDate}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Financial Committee Date :{" "}
            <span className="fs-6 fw-normal">
              {formState?.financeCommitteDate}
            </span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Bank Name :{" "}
            <span className="fs-6 fw-normal">{formState?.bankName}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Branch Name :{" "}
            <span className="fs-6 fw-normal">{formState?.branchName}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Bank IFSC Code :{" "}
            <span className="fs-6 fw-normal">{formState?.bankIfscCode}</span>{" "}
          </label>
        </div>
      </div>

      <div className="rateContractAddJHK__container">
        <h4 className="rateContractAddJHK__container-heading">
          Tender Details
        </h4>

        <div>
          <label htmlFor="contractedQty" className="employeeMaster__label">
            Contracted Qty.
          </label>
          <InputField
            id="contractedQty"
            className="rateContractAddJHK__input"
            type="text"
            name={"contractedQty"}
            placeholder="Enter Qty."
            value={formState?.contractedQty}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="shelfLife"
            className="employeeMaster__label required-label"
          >
            Shelf Life(%)
          </label>
          <InputField
            id="shelfLife"
            className="rateContractAddJHK__input"
            type="text"
            name={"shelfLife"}
            placeholder="Enter value"
            value={formState?.shelfLife}
            onChange={handleChange}
          />
          {errors?.shelfLifeErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.shelfLifeErr}
            </span>
          }
        </div>

        <div>
          <label
            htmlFor="taxType"
            className="rateContractAddJHK__label required-label"
          >
            No of Batches:
          </label>
          <ComboDropDown
            options={batchSizeOptions}
            onChange={handleChange}
            name={"noOfBatches"}
            value={formState?.noOfBatches}
          />
          {errors?.noOfBatchesErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.noOfBatchesErr}
            </span>
          }
        </div>

        <div className="bankmaster__container">
          <label className="bankmaster__label required-label">
            {" "}
            Whether Imported:
          </label>
          <RadioButton
            label="Yes"
            name="whetherImported"
            value="Yes"
            checked={whetherImported === "Yes"}
            onChange={(e) => setWhetherImported(e?.target?.value)}
          />
          <RadioButton
            label="No"
            name="whetherImported"
            value="No"
            checked={whetherImported === "No"}
            onChange={(e) => setWhetherImported(e?.target?.value)}
          />
        </div>

        <div>
          <label
            htmlFor="level"
            className="rateContractAddJHK__label required-label"
          >
            Level
          </label>
          <ComboDropDown
            options={levelType}
            onChange={handleChange}
            name={"level"}
            value={formState?.level}
          />
          {errors?.levelErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.levelErr}
            </span>
          }
        </div>

        <div>
          <label htmlFor="allocationQty" className="employeeMaster__label">
            Allocation of Ordered Qty.(%)
          </label>
          <InputField
            id="allocationQty"
            className="rateContractAddJHK__input"
            type="text"
            name={"allocationQty"}
            placeholder="Enter qty"
            value={formState?.allocationQty}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="taxType"
            className="rateContractAddJHK__label required-label"
          >
            Tax Type
          </label>
          <ComboDropDown
            options={taxTypes}
            onChange={handleChange}
            name={"taxType"}
            value={formState?.taxType}
          />
          {errors?.taxTypeErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.taxTypeErr}
            </span>
          }
        </div>

        <div>
          <label
            htmlFor="cgst"
            className="employeeMaster__label required-label"
          >
            CGST (%)
          </label>
          <InputField
            id="cgst"
            className="rateContractAddJHK__input"
            type="text"
            name={"cgst"}
            placeholder="Enter value"
            value={formState?.cgst}
            onChange={handleChange}
          />
          {errors?.cgstErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.cgstErr}
            </span>
          }
        </div>

        <div>
          <label
            htmlFor="sgst"
            className="employeeMaster__label required-label"
          >
            SGST (%)
          </label>
          <InputField
            id="sgst"
            className="rateContractAddJHK__input"
            type="text"
            name={"sgst"}
            placeholder="Enter value"
            value={formState?.sgst}
            onChange={handleChange}
          />
          {errors?.sgstErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.sgstErr}
            </span>
          }
        </div>
        <div>
          <label
            htmlFor="rate"
            className="employeeMaster__label required-label"
          >
            Rate/Unit(Inclusive Of tax)
          </label>
          <div className="row">
            <div className="col-4">
              <InputField
                id="rate"
                className="rateContractAddJHK__input"
                type="text"
                name={"rate"}
                placeholder="Enter value"
                value={formState?.rate}
                onChange={handleChange}
              />
            </div>
            <ComboDropDown
              options={unitDrpDt}
              onChange={handleChange}
              name={"unit"}
              value={formState?.unit}
              addOnClass="col-8"
            />
          </div>
          {errors?.rateUnitErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.rateUnitErr}
            </span>
          }
        </div>

        <div>
          <label
            htmlFor="deliveryDay"
            className="employeeMaster__label required-label"
          >
            Delivery Day(s)
          </label>
          <InputField
            id="deliveryDay"
            className="rateContractAddJHK__input"
            type="text"
            name={"deliveryDay"}
            placeholder="Enter days"
            value={formState?.deliveryDay}
            onChange={handleChange}
          />
          {errors?.deliveryDayErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.deliveryDayErr
              }
            </span>
          }
        </div>
        <div>
          <label htmlFor="discount" className="employeeMaster__label">
            Discount (%)
          </label>
          <InputField
            id="discount"
            className="rateContractAddJHK__input"
            type="text"
            name={"discount"}
            placeholder="Enter discount"
            value={formState?.discount}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="rateContractAddJHK__container">
        <h4 className="rateContractAddJHK__container-heading">
          Specification Upload
        </h4>

        <div>
          <label htmlFor="file" className="employeeMaster__label">
            Specification (pdf) :
          </label>
          <input
            className="rateContractAddJHK__fileUpload"
            type="file"
            placeholder='Choose file...'
            onChange={onFileChange}
          />
          {/* <button
            className="bankmaster__container-controls-btn"
            // onClick={handleFileUpload}
          >
            Upload File
          </button> */}
        </div>

        <div>
          <label htmlFor="remarks" className="employeeMaster__label">
            Remarks :
          </label>
          <textarea
            id="remarks"
            className="rateContractAddJHK__input"
            type="text"
            name={"remarks"}
            placeholder="Enter here..."
            value={formState?.remarks}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="">
        <h4 className="bg-[#097080] text-white p-2 rounded">BG Details</h4>

        <div style={{ marginBottom: "3rem" }}>
          <DataTable
            masterName={"Existing Rate Contract"}
            ref={null}
            columns={bgdetailsTableCols}
            data={bgList}
          />
        </div>
      </div>

      <div className="bankmaster__container-controls">
        <button className="bankmaster__container-controls-btn" onClick={handleSave}>Save</button>
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
    </section>
  );
}

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
  getBgDetailList,
  getContractDetails,
  getExistingRC,
  getLevelTypeCmb,
  getSuppliersWithContractCmb,
  getTenderNumber,
  getUnitCombo,
} from "../../../../../api/Jharkhand/api/rateContractAPI";
import DataTable from "../../../../commons/Datatable";

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
  { header: "BG Amount (₹)", field: "suppName" },
  { header: "BG From Date", field: "levelType" },
  { header: "BG To Date", field: "rate" },
  { header: "BG No.", field: "hstnumRcNo" },
  { header: "Refund Amount", field: "bgValidity" },
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
  const [drugName, setDrugName] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  const taxTypes = [{ label: "GST", value: "3" }];

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
  const [existingRCs, setExistingRCs] = useState([]);
  // const [bgList, setBgList] = useState([]);
  const [levelType, setLevelType] = useState([]);
  const [unitDrpDt, setUnitDrpDt] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatcher({ type: "SET_FIELD", field: name, value });
  };

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    dispatcher({ type: "RESET_FORM" });
  }

  const getContractDetailsWithTender = () => {
    const { supplierName } = formState;
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
                contractFrom: data[0]?.contract_frm_date,
                contractTo: data[0]?.contratct_to_date,
                rcFinalDate: data[0]?.contract_frm_date,
                quotationNo: data[0]?.contract_frm_date,
                acceptanceDate: data[0]?.contract_frm_date,
                financeCommitteDate: data[0]?.contract_frm_date,
                bankName: data[0]?.contract_frm_date,
                branchName: data[0]?.contract_frm_date,
                bankIfscCode: data[0]?.contract_frm_date,
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
      setExistingRCs(response);
    }
    fetchExistingRCs();
  }, [storeID, drugName, contractID]);

  const fetchBGListDt = () => {

    getBgDetailList(998, 1410025, 1410025, 20180126)?.then((res) => {
      console.log("res", res);
    });
  };

  useEffect(() => {
    if (formState?.supplierName) {
      fetchBGListDt();
      getContractDetailsWithTender();
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
              }}
              name={"drugName"}
              value={drugName}
            />
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
          <ComboDropDown
            options={suppliers}
            onChange={handleChange}
            name={"supplierName"}
            value={formState?.supplierName}
          />
        </div>

        <div>
          <label
            htmlFor="taxType"
            className="rateContractAddJHK__label required-label"
          >
            Tender No.:
          </label>
          <ComboDropDown
            options={[]}
            onChange={handleChange}
            name={"tenderNo"}
            value={formState?.tenderNo}
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
            <span className="fs-3 fw-normal">{formState?.contractFrom}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Contract To :{" "}
            <span className="fs-3 fw-normal">{formState?.contractTo}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            RC Finalization Date :{" "}
            <span className="fs-3 fw-normal">{formState?.rcFinalDate}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Quotation No. :{" "}
            <span className="fs-3 fw-normal">{formState?.quotationNo}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Acceptance Date :{" "}
            <span className="fs-3 fw-normal">{formState?.acceptanceDate}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Financial Committee Date :{" "}
            <span className="fs-3 fw-normal">
              {formState?.financeCommitteDate}
            </span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Bank Name :{" "}
            <span className="fs-3 fw-normal">{formState?.bankName}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Branch Name :{" "}
            <span className="fs-3 fw-normal">{formState?.branchName}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Bank IFSC Code :{" "}
            <span className="fs-3 fw-normal">{formState?.bankIfscCode}</span>{" "}
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
        </div>

        <div>
          <label
            htmlFor="taxType"
            className="rateContractAddJHK__label required-label"
          >
            No of Batches:
          </label>
          <ComboDropDown
            options={[]}
            onChange={handleChange}
            name={"noOfBatches"}
            value={formState?.noOfBatches}
          />
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
          <label htmlFor="ifscCode" className="employeeMaster__label">
            Specification (pdf) :
          </label>
          <input
            className="rateContractAddJHK__fileUpload"
            type="file"
            // placeholder='Choose file...'
            // onChange={onFileChange}
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
            ref={dataTableRef}
            columns={bgdetailsTableCols}
            data={existingRCs}
          />
        </div>
      </div>

      <div className="bankmaster__container-controls">
        <button className="bankmaster__container-controls-btn">Save</button>
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

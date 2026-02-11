import { useEffect, useReducer } from "react";
import {
  getBudgetClasses,
  getDrugNames,
  getLevelTypes,
  getManufacturers,
  getPackagingType,
  getStoreDetails,
  loadTenderList,
} from "../../../../../api/Assam/services/rateContractAPI";
import {
  ComboDropDown,
  DatePickerComponent,
  InputField,
  RadioButton,
} from "../../../../commons/FormElements";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

let { userId } = JSON.parse(
  !localStorage.getItem("data") ? 102234 : localStorage.getItem("data")
);

const taxTypes = [{ label: "GST", value: "gst" }];
const rcNumberRadio = [
  { label: "Auto Generate", value: 1 },
  { label: "Manual Entry", value: 0 },
];
const whetherImportedRadio = [
  { label: "Yes", value: 1 },
  { label: "No", value: 0 },
];
const whetherPBGRequiredRadio = [
  { label: "Yes", value: 1 },
  { label: "No", value: 0 },
];

export default function RateContractAddAssam() {
  //Redux states
  const selectedContract = useSelector(
    (state) => state.rateContractASM.selectedContract
  );
  const contractList = useSelector(
    (state) => state.rateContractASM.contractList
  );

  // Controlled state for inputs
  const initialState = {
    healthFacilities: [],
    drugsList: [],
    budgetCategories: [],
    manufList: [],
    levelsList: [],
    tenderList: [],
    packagingTypes: [],
    selectedDrug: 0,
    selectedBudgetclass: 10,
    selectedManuf: 0,
    selectedLevel: 1,
    selectedTender: "",
    contractFrom: "",
    contractTo: "",
    estQty: "",
    shelfLife: "",
    selectedTaxType: "gst",
    taxPercent: "",
    selectedPackagingType: "",
    rcPerNo: "",
    rcPerNoWithGST: "",
    deliveryDays: "60",
    rcPckgUnit: "",
    totalRate: "",
    rcNumberFlag: "1",
    whetherImpFlag: "0",
    whetherPBGFlag: "0",
    gstrRemarks: "",
    rcNumber: "",
  };

  const handleDateChange = (value, fieldName) => {
    const formattedDate = value
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-"); // dd-MMM-yyyy

    dispatcher({
      type: "SET_FIELD",
      field: fieldName,
      value: formattedDate,
    });
  };

  const handleChange = (e) => {
    console.log("setting up target ", e.target.value, e.target.name);
    const { name, value } = e.target;
    dispatcher({ type: "SET_FIELD", field: name, value });
  };

  const handleReset = () => {
    dispatcher({ type: "RESET_FORM" });
  };

  function addFormReducer(state, action) {
    switch (action.type) {
      case "SET_FIELD":
        return { ...state, [action.field]: action.value };
      case "RESET_FORM":
        return initialState;
      default:
        return state;
    }
  }

  const [formState, dispatcher] = useReducer(addFormReducer, initialState);

  //router states
  const navigate = useNavigate();

  async function loadTenders() {
    try {
      const data = await loadTenderList(998, 1, formState.selectedBudgetclass);
      let tenderData = [];

      data.forEach((item) => {
        const { hstnum_tender_no, hststr_tender_ref_no } = item;
        tenderData.push({
          label: hststr_tender_ref_no,
          value: hstnum_tender_no,
        });
      });

      dispatcher({
        type: "SET_FIELD",
        field: "tenderList",
        value: tenderData,
      });
    } catch (err) {
      console.log("Failed to fetch pie chart data.", err);
    }
  }

  async function getStores() {
    const response = await getStoreDetails(998);
    let healthFacilitiesData = [];

    response.forEach((element) => {
      const { hstnum_store_id: value, hststr_store_name: label } = element;
      healthFacilitiesData.push({ label, value });
    });

    dispatcher({
      type: "SET_FIELD",
      field: "healthFacilities",
      value: healthFacilitiesData,
    });
  }

  const loadManufacturers = async () => {
    try {
      const data = await getManufacturers(userId);
      let manufacturerOptions = [];
      data.forEach((element) => {
        const obj = {
          label: element.hststr_supplier_name,
          value: element.hstnum_supplier_id,
        };
        manufacturerOptions.push(obj);
      });
      dispatcher({
        type: "SET_FIELD",
        field: "manufList",
        value: manufacturerOptions,
      });
    } catch (err) {
      console.log("Failed to fetch manufacturers.", err);
    }
  };

  const loadBudgetClasses = async () => {
    try {
      let budgetClassOptions = [];
      const data = await getBudgetClasses(998);
      data.forEach((element) => {
        const obj = {
          label: element.sststr_budget_class_name,
          value: element.sstnum_budget_class_id,
        };
        budgetClassOptions.push(obj);
      });
      dispatcher({
        type: "SET_FIELD",
        field: "budgetCategories",
        value: budgetClassOptions,
      });
    } catch (err) {
      console.log("Failed to fetch data.", err);
    }
  };

  const loadDrugs = async () => {
    try {
      const data = await getDrugNames(998, 99800001, 10);
      let drugNames = [];
      data.forEach((element) => {
        const obj = {
          label: element.itemname,
          value: element.hstnum_item_id,
          data: element.hstnum_itembrand_id,
        };
        drugNames.push(obj);
      });
      dispatcher({
        type: "SET_FIELD",
        field: "drugsList",
        value: [{ label: "All", value: 0, data: 0 }, ...drugNames],
      });
    } catch (err) {
      console.log("Failed to fetch drugs.", err);
    }
  };

  const loadLevels = async () => {
    try {
      const data = await getLevelTypes(998);
      let levels = [];
      data.forEach((element) => {
        const obj = {
          label: element.sststr_level_type_name,
          value: element.sstnum_level_type_id,
        };
        levels.push(obj);
      });
      dispatcher({
        type: "SET_FIELD",
        field: "levelsList",
        value: levels,
      });
    } catch (err) {
      console.log("Failed to fetch levels.", err);
    }
  };

  const loadPackagingTypes = async () => {
    try {
      const data = await getPackagingType(998);
      let packagingTypes = [];
      data.forEach((element) => {
        const obj = {
          label: element.gstr_unit_name,
          value: element.gnum_unit_id,
        };
        packagingTypes.push(obj);
      });
      dispatcher({
        type: "SET_FIELD",
        field: "packagingTypes",
        value: packagingTypes,
      });
    } catch (err) {
      console.log("Failed to fetch packaging types.", err);
    }
  };

  useEffect(() => {
    loadDrugs();
    loadLevels();
    loadManufacturers();
    loadBudgetClasses();
    loadTenders();
    getStores();
    loadPackagingTypes();
  }, []);

  function handleBack() {
    navigate("/home/AS/menus/rate-contract");
  }

  async function handleSave() {
    const data = {
      gnumHospitalCode: 998,
      hstnumItemId: formState.selectedDrug,
      sstnumItemCatNo: formState.selectedBudgetclass,
      sstnumLevelTypeId: formState.selectedLevel,
      hststrTenderNo: formState.selectedTender,
      hstdtContractFrmdate: formState.contractFrom,
      hstdtContractTodate: formState.contractTo,
      hstnumContractQty: formState.estQty,
      hstnumShelfLife: formState.shelfLife,
      hstnumTaxType: formState.selectedTaxType,
      hstnumTax: formState.taxPercent,
      hstnumPackingUnitid: formState.selectedPackagingType,
      hstnumDeliveryDays: formState.deliveryDays,
      hstnumRcNo: formState.rcNumber,
      hstnumImportedFlag: formState.whetherImpFlag,
      hstnumPbgFlag: formState.whetherPBGFlag,
      gstrRemarks: formState.gstrRemarks,
      hstnumRateIncTax: formState.rcPerNoWithGST,
      hstnumRatePerUnit: formState.rcPckgUnit,
      hstnumRatePerUnitIncTax: formState.totalRate,
      hstnumRateUnitid: formState.rcPckgUnit,
      hstnumSupplierId: formState.selectedManuf,
      hstnumRcNoFlag: formState.rcNumberFlag,
      hstnumContractTypeId: selectedContract,
      gnumSeatid: userId,
      hstnumItembrandId: formState.selectedDrug,
      hstnumStoreId: formState.healthFacilities.at(0).value,
      gnumSlno: 1,
    };

    console.log("Sending data ", data);
    // const response = await saveRateContract(data);
    // console.log(response);
  }

  return (
    <section className="rateContractAddASM">
      <h3 className="rateContractAddASM__heading">Rate Contract Add</h3>
      <div className="rateContractAddASM__menus-menu">
        <h4 className="rateContractAddASM__menus-menu-heading">
          Itemwise Details
        </h4>
        <div className="rateContractAddASM__menus-menu-container">
          {/* <span className="rateContractAddASM__menus-menu-container--divider"></span> */}
          {formState.healthFacilities.length > 0 && (
            <div className="rateContractAddASM__menus-menu-item">
              <label htmlFor="taxType" className="rateContractAddASM__label">
                Health Facility Name
              </label>
              <ComboDropDown
                options={formState.healthFacilities}
                value={formState.healthFacilities.at(0).value}
                isDisabled={true}
              />
            </div>
          )}
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="contractList" className="rateContractAddASM__label">
              Contract Types
            </label>
            <ComboDropDown
              options={contractList}
              value={selectedContract}
              isDisabled={true}
            />
          </div>
          {formState.budgetCategories.length > 0 && (
            <div className="rateContractAddASM__menus-menu-item">
              <label
                htmlFor="selectedBudgetclass"
                className="rateContractAddJHK__label"
              >
                Budget Category
              </label>
              <ComboDropDown
                options={formState.budgetCategories}
                onChange={handleChange}
                value={formState.selectedBudgetclass}
                name={"selectedBudgetclass"}
                addOnClass="rateContract__container--dropdown"
              />
            </div>
          )}
          {formState.drugsList.length > 0 && (
            <div className="rateContractAddASM__menus-menu-item">
              <label
                htmlFor="selectedDrug"
                className="rateContractAddJHK__label"
              >
                Drug Name
              </label>
              <ComboDropDown
                options={formState.drugsList}
                onChange={handleChange}
                value={formState.selectedDrug}
                name={"selectedDrug"}
                addOnClass="rateContract__container--dropdown"
              />
            </div>
          )}
          {formState.manufList.length > 0 && (
            <div className="rateContractAddASM__menus-menu-item">
              <label
                htmlFor="selectedManuf"
                className="rateContractAddJHK__label"
              >
                Manufacturer Name
              </label>
              <ComboDropDown
                options={formState.manufList}
                onChange={handleChange}
                value={formState.selectedManuf}
                name={"selectedManuf"}
                addOnClass="rateContract__container--dropdown"
              />
            </div>
          )}
        </div>
      </div>
      <div className="rateContractAddASM__menus-menu">
        <h4 className="rateContractAddASM__menus-menu-heading">
          Tender Details
        </h4>
        <div className="rateContractAddASM__menus-menu-container">
          {/* <span className="rateContractAddASM__menus-menu-container--divider"></span> */}
          {formState.levelsList.length > 0 && (
            <div className="rateContractAddASM__menus-menu-item">
              <label htmlFor="taxType" className="rateContractAddASM__label">
                Level type
              </label>
              <ComboDropDown
                options={formState.levelsList}
                value={formState.selectedLevel}
                onChange={handleChange}
                name={"selectedLevel"}
              />
            </div>
          )}
          {formState.tenderList.length > 0 && (
            <div className="rateContractAddASM__menus-menu-item">
              <label
                htmlFor="selectedTender"
                className="rateContractAddASM__label"
              >
                Tender
              </label>
              <ComboDropDown
                options={formState.tenderList}
                value={formState.selectedTender}
                onChange={handleChange}
                name={"selectedTender"}
              />
            </div>
          )}
          <div className="rateContractAddASM__menus-menu-item">
            <DatePickerComponent
              selectedDate={formState.contractFrom}
              setSelectedDate={(val) => handleDateChange(val, "contractFrom")}
              labelText={"Contract From Date"}
              labelFor={"contractFrom"}
              name={"contractFrom"}
              allowMin={true}
            />
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <DatePickerComponent
              selectedDate={formState.contractTo}
              setSelectedDate={(val) => handleDateChange(val, "contractTo")}
              labelText={"Contract To Date"}
              labelFor={"contractTo"}
              name={"contractTo"}
            />
          </div>
        </div>
      </div>
      <div className="rateContractAddASM__menus-menu">
        <h4 className="rateContractAddASM__menus-menu-heading">
          Contract Details
        </h4>
        <div className="rateContractAddASM__menus-menu-container">
          {/* <span className="rateContractAddASM__menus-menu-container--divider"></span> */}
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="estQty" className="rateContractAddJHK__label">
              Estimated Quantity (In No)
            </label>
            <InputField
              id="estQty"
              className="rateContractAddJHK__input"
              type="text"
              name={"estQty"}
              placeholder="Enter Estimated Quantity"
              value={formState.estQty}
              onChange={handleChange}
            />
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="shelfLife" className="rateContractAddJHK__label">
              Shelf Life (In Days)
            </label>
            <InputField
              id="shelfLife"
              className="rateContractAddJHK__input"
              type="text"
              name={"shelfLife"}
              placeholder="Enter Shelf Life"
              value={formState.shelfLife}
              onChange={handleChange}
            />
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label
              htmlFor="selectedTaxType"
              className="rateContractAddASM__label"
            >
              Tax Type
            </label>
            <ComboDropDown
              options={taxTypes}
              value={formState.selectedTaxType}
              onChange={handleChange}
              name={"selectedTaxType"}
            />
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="taxPercent" className="rateContractAddJHK__label">
              Tax Percentage
            </label>
            <InputField
              id="taxPercent"
              className="rateContractAddJHK__input"
              type="text"
              name={"taxPercent"}
              placeholder="Enter Tax Percentage"
              value={formState.taxPercent}
              onChange={handleChange}
            />
          </div>
          {formState.packagingTypes.length > 0 && (
            <div className="rateContractAddASM__menus-menu-item">
              <label
                htmlFor="selectedPackagingType"
                className="rateContractAddASM__label"
              >
                Packaging Unit
              </label>
              <ComboDropDown
                options={formState.packagingTypes}
                value={formState.selectedPackagingType}
                onChange={handleChange}
                name={"selectedPackagingType"}
              />
            </div>
          )}
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="taxPercent" className="rateContractAddJHK__label">
              Rate (in Rs) (in No)
            </label>
            <InputField
              id="rcPerNo"
              className="rateContractAddJHK__input"
              type="text"
              name={"rcPerNo"}
              placeholder="Enter Rate of Per Numbers"
              value={formState.rcPerNo}
              onChange={handleChange}
            />
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="taxPercent" className="rateContractAddJHK__label">
              Rate (in Rs) (With GST)
            </label>
            <InputField
              id="rcPerNoWithGST"
              className="rateContractAddJHK__input"
              type="text"
              name={"rcPerNoWithGST"}
              placeholder="Enter Total Rate"
              value={formState.rcPerNoWithGST}
              onChange={handleChange}
            />
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="taxPercent" className="rateContractAddJHK__label">
              Delivery Day(s)
            </label>
            <InputField
              id="deliveryDays"
              className="rateContractAddJHK__input"
              type="text"
              name={"deliveryDays"}
              placeholder="Enter Total Rate"
              value={formState.deliveryDays}
              onChange={handleChange}
            />
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="rcPckgUnit" className="rateContractAddJHK__label">
              Rate (in Rs) (Packaging Unit)
            </label>
            <InputField
              id="rcPckgUnit"
              className="rateContractAddJHK__input"
              type="text"
              name={"rcPckgUnit"}
              placeholder="Rate in Packing Unit"
              value={formState.rcPckgUnit}
              onChange={handleChange}
            />
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="totalRate" className="rateContractAddJHK__label">
              Rate (in Rs) per Packaging Unit (With GST)
            </label>
            <InputField
              id="totalRate"
              className="rateContractAddJHK__input"
              type="text"
              name={"totalRate"}
              placeholder="Enter Total Rate"
              value={formState.totalRate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="rateContractAddASM__radio-container">
        <div className="rateContractAddASM__radio-container-radio">
          <h2
            className="rateContract__heading"
            style={{ marginBottom: "1.2rem" }}
          >
            RC Number:
          </h2>
          {rcNumberRadio.map((data, index) => (
            <RadioButton
              label={data.label}
              name="rcNumberFlag"
              value={data.value}
              checked={formState.rcNumberFlag == data.value}
              onChange={handleChange}
              keyProp={index}
            />
          ))}
          {formState.rcNumberFlag !== "1" && (
            <InputField
              id="rcNumber"
              className="rateContractAddJHK__input"
              type="text"
              name={"rcNumber"}
              placeholder="Enter RC Number"
              value={formState.rcNumber}
              onChange={handleChange}
            />
          )}
        </div>
        <div className="rateContractAddASM__radio-container-radio">
          <h2
            className="rateContract__heading"
            style={{ marginBottom: "1.2rem" }}
          >
            Is Imported (Y/N)
          </h2>
          {whetherImportedRadio.map((data, index) => (
            <RadioButton
              label={data.label}
              name="whetherImpFlag"
              value={data.value}
              checked={formState.whetherImpFlag == data.value}
              onChange={handleChange}
              keyProp={index}
            />
          ))}
        </div>
        <div className="rateContractAddASM__radio-container-radio">
          <h2
            className="rateContract__heading"
            style={{ marginBottom: "1.2rem" }}
          >
            Is PBG Required (Y/N)
          </h2>
          {whetherPBGRequiredRadio.map((data, index) => (
            <RadioButton
              label={data.label}
              name="whetherPBGFlag"
              value={data.value}
              checked={formState.whetherPBGFlag == data.value}
              onChange={handleChange}
              keyProp={index}
            />
          ))}
        </div>
      </div>
      <div className="rateContractAddASM__remarks">
        <label htmlFor="gstrRemarks" className="rateContractAddJHK__label">
          <b>Any Remarks</b>
        </label>
        <InputField
          id="gstrRemarks"
          className="rateContractAddJHK__input"
          type="text"
          name={"gstrRemarks"}
          placeholder="Any Remarks"
          value={formState.gstrRemarks}
          onChange={handleChange}
        />
      </div>
      <div className="rateContractAddASM__buttons-container">
        <button
          className="bankmaster__container-controls-btn"
          onClick={handleSave}
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
          onClick={handleBack}
        >
          Back
        </button>
      </div>
    </section>
  );
}

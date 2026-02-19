import { useEffect, useReducer, useState } from "react";
import {
  getExistingRateContractData,
  getLevelTypes,
  getPackagingType,
  loadTenderList,
  saveRateContract,
} from "../../../../../api/Assam/services/rateContractAPI";
import {
  ComboDropDown,
  DatePickerComponent,
  InputField,
  RadioButton,
} from "../../../../commons/FormElements";
import { useSelector } from "react-redux";
import ReactDataTable from "../../../../commons/ReactDataTable";


let { userId } = JSON.parse(
  !localStorage.getItem("data") ? 102234 : localStorage.getItem("data")
);

const taxTypes = [{ label: "GST", value: "1" }];
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

export default function RateContractAddAssam(props) {

  const { setIsRateContractAddForm, budgetCategory, manufacturers, drugList, loadDrugs, healthFacilities } = props;

  //Redux states
  const selectedContract = useSelector(
    (state) => state.rateContractASM.selectedContract
  );

  const contractList = useSelector(
    (state) => state.rateContractASM.contractList
  );

  // Controlled state for inputs
  const initialState = {
    levelsList: [],
    tenderList: [],
    packagingTypes: [],
    selectedDrug: '',
    selectedBudgetclass: 10,
    selectedManuf: '',
    selectedLevel: 1,
    selectedTender: "",
    contractFrom: "",
    contractTo: "",
    estQty: "",
    shelfLife: "",
    selectedTaxType: "1",
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
    tenderDate: "",
    tenderAmount: ""
  };


  function addFormReducer(state, action) {
    switch (action.type) {
      case "SET_FIELD":
        return { ...state, [action.field]: action.value };
      case "SET_VALUES":
        return { ...state, ...action?.payload };
      case "RESET_FORM":
        return initialState;
      default:
        return state;
    }
  }

  const [formState, dispatcher] = useReducer(addFormReducer, initialState);
  const [existingRCData, setExistingRCData] = useState([]);

  const [errors, setErrors] = useState({
    selectedDrugErr: "",
    selectedBudgetclassErr: "",
    selectedManufErr: "",
    selectedLevelErr: "",
    selectedTenderErr: "",
    contractFromErr: "",
    contractToErr: "",
    estQtyErr: "",
    shelfLifeErr: "",
    selectedTaxTypeErr: "",
    taxPercentErr: "",
    selectedPackagingTypeErr: "",
    rcPerNoErr: "",
    rcPerNoWithGSTErr: "",
    deliveryDaysErr: "",
    rcPckgUnitErr: "",
    totalRateErr: "",
    rcNumberFlagErr: "",
    whetherImpFlagErr: "",
    whetherPBGFlagErr: "",
    gstrRemarksErr: "",
    rcNumberErr: "",
    tenderDateErr: ""
  })

  const handleDateChange = (value, fieldName) => {
    const errName = fieldName + "Err";
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
    setErrors({ ...errors, [errName]: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errName = name + "Err";
    if (name === "selectedTender") {

      const dt = formState?.tenderList?.find(dt => dt?.value === value);
      dispatcher({ type: "SET_FIELD", field: name, value });
      dispatcher({ type: "SET_FIELD", field: "tenderAmount", value: dt?.amount || 0 });
      dispatcher({ type: "SET_FIELD", field: "tenderDate", value: dt?.date });
    } else {
      dispatcher({ type: "SET_FIELD", field: name, value });
    }
    setErrors({ ...errors, [errName]: "" });
  };

  const handleReset = () => {
    dispatcher({ type: "RESET_FORM" });
  };

  //router states
  async function loadTenders() {
    try {
      const data = await loadTenderList(998, 1, formState.selectedBudgetclass);
      let tenderData = [];

      data.forEach((item) => {
        const { hstnum_tender_no, hststr_tender_ref_no, hstdt_tender_date, hstnum_tender_amount } = item;
        tenderData.push({
          label: hststr_tender_ref_no,
          value: hstnum_tender_no,
          amount: hstnum_tender_amount,
          date: hstdt_tender_date
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
          label: element?.gstr_unit_name,
          value: `${element?.gnum_unit_id}##${element?.gnum_base_unitvalue}`,
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

  const getExistingRCData = (suppid, itembid) => {
    const val = {
      "gnumHospitalCode": 998,
      "gnumIsvalid": 1,
      "hstnumSupplierId": suppid || 0,
      "hstnumItembrandId": itembid || 0
    }

    getExistingRateContractData(val)?.then((res) => {
      console.log('res', res)
    })
  }

  useEffect(() => {
    if (formState.selectedDrug) {
      getExistingRCData(formState.selectedManuf, formState.selectedDrug)
    }
  }, [formState.selectedManuf, formState.selectedDrug])

  useEffect(() => {
    if (formState.selectedBudgetclass) {
      loadDrugs(formState.selectedBudgetclass);
    }
  }, [formState.selectedBudgetclass])

  useEffect(() => {
    loadLevels();
    loadTenders();
    loadPackagingTypes();
  }, []);

  function handleBack() {
    setIsRateContractAddForm(false);
  }

  useEffect(() => {
    const taxPercent = Number(formState?.taxPercent);
    const rcPerNo = Number(formState?.rcPerNo);
    const packagingMultiplier = Number(
      formState?.selectedPackagingType?.split("##")?.[1]
    );

    if (isNaN(taxPercent) || isNaN(rcPerNo) || isNaN(packagingMultiplier)) { return; }

    const rcValueWithGST = rcPerNo + (rcPerNo * taxPercent) / 100;
    const rcValuePackingUnit = rcPerNo * packagingMultiplier;
    const rcValueTotal = rcValuePackingUnit + (rcValuePackingUnit * taxPercent) / 100;

    dispatcher({
      type: "SET_VALUES",
      payload: {
        rcPerNoWithGST: Number(rcValueWithGST.toFixed(2)),
        rcPckgUnit: Number(rcValuePackingUnit.toFixed(2)),
        totalRate: Number(rcValueTotal.toFixed(2)),
      },
    });
  }, [formState?.taxPercent, formState?.rcPerNo, formState?.selectedPackagingType,]);

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
      hstnumTaxType: parseInt(formState.selectedTaxType),
      hstnumTax: formState.taxPercent,
      hstnumPackingUnitid: parseInt(formState.selectedPackagingType?.split('##')[0]),
      hstnumDeliveryDays: formState.deliveryDays,
      hstnumRcNo: parseInt(formState.rcNumber),
      hstnumImportedFlag: formState.whetherImpFlag,
      hstnumPbgFlag: formState.whetherPBGFlag,
      gstrRemarks: formState.gstrRemarks,
      hstnumRateIncTax: formState.rcPerNoWithGST,
      hstnumRatePerUnit: formState.rcPckgUnit,
      hstnumRatePerUnitIncTax: formState.totalRate,
      hstnumRateUnitid: parseInt(formState.rcPckgUnit),
      hstnumSupplierId: formState.selectedManuf,
      hstnumRcNoFlag: formState.rcNumberFlag,
      hstnumContractTypeId: selectedContract,
      gnumSeatid: userId,
      hstnumItembrandId: formState.selectedDrug,
      hstnumStoreId: healthFacilities.at(0).value,
      gnumSlno: 1,
      // "hstnumRcId": 0,
    };

    console.log("Sending data ", data);
    saveRateContract(data)?.then((res) => {
      console.log(res, 'res');
    });
  }

  const handleValidation = () => {
    let isValid = true;

    if (!formState?.selectedBudgetclass?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "selectedBudgetclassErr": "Please select budget category" }));
      isValid = false;
    }
    if (!formState?.selectedDrug?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "selectedDrugErr": "Please select drug name" }));
      isValid = false;
    }
    if (!formState?.selectedManuf?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "selectedManufErr": "Please select manufacturer" }));
      isValid = false;
    }
    if (!formState?.selectedLevel?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "selectedLevelErr": "Please select level type" }));
      isValid = false;
    }
    if (!formState?.selectedTender?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "selectedTenderErr": "Please select a tender" }));
      isValid = false;
    }
    if (!formState?.contractFrom?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "contractFromErr": "Please select from date" }));
      isValid = false;
    }
    if (!formState?.contractTo?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "contractToErr": "Please select to date" }));
      isValid = false;
    }
    if (!formState?.estQty?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "estQtyErr": "This field is required" }));
      isValid = false;
    }
    if (!formState?.shelfLife?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "shelfLifeErr": "This field is required" }));
      isValid = false;
    }
    if (!formState?.selectedTaxType?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "selectedTaxTypeErr": "Please select tax type" }));
      isValid = false;
    }
    if (!formState?.taxPercent?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "taxPercentErr": "This field is required" }));
      isValid = false;
    }
    if (!formState?.selectedPackagingType?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "selectedPackagingTypeErr": "Please select packaging unit" }));
      isValid = false;
    }
    if (!formState?.rcPerNo?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "rcPerNoErr": "This field is required" }));
      isValid = false;
    }
    if (!formState?.rcPerNoWithGST?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "rcPerNoWithGSTErr": "This field is required" }));
      isValid = false;
    }
    if (!formState?.deliveryDays?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "deliveryDaysErr": "This field is required" }));
      isValid = false;
    }
    if (!formState?.rcPckgUnit?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "rcPckgUnitErr": "This field is required" }));
      isValid = false;
    }
    if (!formState?.totalRate?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "totalRateErr": "This field is required" }));
      isValid = false;
    }
    if (!formState?.rcNumberFlag?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "rcNumberFlagErr": "Please check this field" }));
      isValid = false;
    }
    if (!formState?.whetherImpFlag?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "whetherImpFlagErr": "Please check this field" }));
      isValid = false;
    }
    if (!formState?.whetherPBGFlag?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "whetherPBGFlagErr": "Please check this field" }));
      isValid = false;
    }
    if (formState?.rcNumberFlag == 0 && !formState?.rcNumber?.toString()?.trim()) {
      setErrors(prev => ({ ...prev, "rcNumberFlagErr": "This field is required" }));
      isValid = false;
    }

    if (isValid) {
      handleSave();
    }

  }

  const existingRateContractColumns = [
    {
      name: (<span className='text-center'>S.No.</span>),
      selector: (row, index) => index + 1,
      sortable: true,
      wrap: true,
      width: "8%"
    },
    {
      name: (<span className='text-center'>Manufacturer Name</span>),
      selector: row => row?.drugName || '---',
      sortable: true,
      wrap: true,
    },
    {
      name: (<span className='text-center'>Level Type</span>),
      selector: row => row?.menuFacName,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span className='text-center'> Item Name </span>),
      selector: row => row?.batchNoName,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span className='text-center'>Shelf Life </span>),
      selector: row => row?.expDate,
      sortable: true,
      wrap: true,
    },
    {
      name: (
        <span className='text-center'> Rate/Unit (₹)</span>
      ),
      selector: row => row?.mfgDate,
      sortable: true,
      wrap: true,
    },
    {
      name: (
        <span className='text-center d-flex'>Rate/Unit (in No) (₹)</span>
      ),
      selector: row => row?.balanceQty,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span className='text-center'>Rate Contract No</span>),
      selector: row => row?.NPCDCS,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span className='text-center'>Existing Contact Valitity</span>),
      selector: row => row?.NPCDCS,
      sortable: true,
      wrap: true,
    }
  ]

  console.log('formState', formState)

  return (
    <section className="rateContractAddASM">
      <h3 className="rateContractAddASM__heading">Rate Contract Add</h3>

      <div className="rateContractAddASM__menus-menu">
        <h4 className="rateContractAddASM__menus-menu-heading">
          Itemwise Details
        </h4>
        <div className="rateContractAddASM__menus-menu-container">
          {/* <span className="rateContractAddASM__menus-menu-container--divider"></span> */}
          {healthFacilities.length > 0 && (
            <div className="rateContractAddASM__menus-menu-item">
              <label htmlFor="taxType" className="rateContractAddASM__label">
                Health Facility Name
              </label>
              <ComboDropDown
                options={healthFacilities}
                value={healthFacilities.at(0).value}
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
          {/* {budgetCategory.length > 0 && ( */}
          <div className="rateContractAddASM__menus-menu-item">
            <label
              htmlFor="selectedBudgetclass"
              className="rateContractAddJHK__label required-label"
            >
              Budget Category
            </label>
            <ComboDropDown
              options={budgetCategory}
              onChange={handleChange}
              value={formState.selectedBudgetclass}
              name={"selectedBudgetclass"}
              addOnClass="rateContract__container--dropdown"
            />
            {errors?.selectedBudgetclassErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.selectedBudgetclassErr}
              </span>
            }
          </div>
          {/* )} */}
          {/* {drugList.length > 0 && ( */}
          <div className="rateContractAddASM__menus-menu-item">
            <label
              htmlFor="selectedDrug"
              className="rateContractAddJHK__label required-label"
            >
              Drug Name
            </label>
            <ComboDropDown
              options={drugList?.filter(dt => dt?.value !== 0)}
              onChange={handleChange}
              value={formState.selectedDrug}
              name={"selectedDrug"}
              addOnClass="rateContract__container--dropdown"
            />
            {errors?.selectedDrugErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.selectedDrugErr}
              </span>
            }
          </div>
          {/* )} */}
          {/* {manufacturers.length > 0 && ( */}
          <div className="rateContractAddASM__menus-menu-item">
            <label
              htmlFor="selectedManuf"
              className="rateContractAddJHK__label required-label"
            >
              Manufacturer Name
            </label>
            <ComboDropDown
              options={manufacturers?.filter(dt => dt?.value !== 0)}
              onChange={handleChange}
              value={formState.selectedManuf}
              name={"selectedManuf"}
              addOnClass="rateContract__container--dropdown"
            />
            {errors?.selectedManufErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.selectedManufErr}
              </span>
            }
          </div>
          {/* )} */}
        </div>
      </div>

      <div className="rateContractAddASM__menus-menu">
        <h4 className="rateContractAddASM__menus-menu-heading">
          Existing Rate Contract
        </h4>
        <div className="rateContractAddASM__menus-menu-container d-block mt-3">
          <div style={{ marginBottom: "2rem" }}>
            <ReactDataTable title={'existingratecontract'} column={existingRateContractColumns} data={[]} isSearchReq={true} isPagination={true} />
          </div>
        </div>
      </div>

      <div className="flex items-center mb-2 mt-6">
        <div className="w-10 border-1 border-[#097080]"></div>
        <span className="mx-3 font-bold text-[#097080]">
          Rate Contract Details
        </span>
        <div className="flex-grow border-1 border-[#097080]"></div>
      </div>

      <div className="rateContractAddASM__menus-menu mt-4">
        <h4 className="rateContractAddASM__menus-menu-heading">
          Tender Details
        </h4>
        <div className="rateContractAddASM__menus-menu-container">
          {/* <span className="rateContractAddASM__menus-menu-container--divider"></span> */}
          {/* {formState.levelsList.length > 0 && ( */}
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="taxType" className="rateContractAddASM__label required-label">
              Level type
            </label>
            <ComboDropDown
              options={formState.levelsList}
              value={formState.selectedLevel}
              onChange={handleChange}
              name={"selectedLevel"}
            />
            {errors?.selectedLevelErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.selectedLevelErr}
              </span>
            }
          </div>
          {/* )} */}
          {/* {formState.tenderList.length > 0 && ( */}
          <div className="rateContractAddASM__menus-menu-item">
            <label
              htmlFor="selectedTender"
              className="rateContractAddASM__label required-label"
            >
              Tender
            </label>
            <ComboDropDown
              options={formState.tenderList}
              value={formState.selectedTender}
              onChange={handleChange}
              name={"selectedTender"}
            />
            {errors?.selectedTenderErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.selectedTenderErr}
              </span>
            }
          </div>
          {/* )} */}
          <div className="rateContractAddASM__menus-menu-item">
            <DatePickerComponent
              selectedDate={formState.contractFrom}
              setSelectedDate={(val) => handleDateChange(val, "contractFrom")}
              labelText={"Rate Contract From Date"}
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
          <div className="rateContractAddASM__menus-menu-item">
            <DatePickerComponent
              selectedDate={formState.contractTo}
              setSelectedDate={(val) => handleDateChange(val, "contractTo")}
              labelText={"Rate Contract Till Date"}
              labelFor={"contractTo"}
              name={"contractTo"}
              isRequired
            />
            {errors?.contractToErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.contractToErr}
              </span>
            }
          </div>

          {formState.selectedTender &&
            <>
              <div className="rateContractAddASM__menus-menu-item">
                <DatePickerComponent
                  selectedDate={formState.tenderDate}
                  // setSelectedDate={(val) => handleDateChange(val, "tenderDate")}
                  labelText={"Tender Date"}
                  labelFor={"tenderDate"}
                  name={"tenderDate"}
                  isRequired
                />
                {errors?.tenderDateErr &&
                  <span className="text-sm text-[#9b0000] mt-1 ms-1">
                    {errors?.tenderDateErr}
                  </span>
                }
              </div>

              <div className="rateContractAddASM__menus-menu-item">
                <label htmlFor="tenderAmount" className="rateContractAddJHK__label">
                  Tender Amount
                </label>
                <InputField
                  id="tenderAmount"
                  className="rateContractAddJHK__input"
                  type="text"
                  name={"tenderAmount"}
                  placeholder="Enter Tax Percentage"
                  value={formState.tenderAmount}
                  // onChange={handleChange}
                  readOnly
                />
              </div>
            </>
          }

        </div>
      </div>

      <div className="rateContractAddASM__menus-menu">
        <h4 className="rateContractAddASM__menus-menu-heading">
          Contract Details
        </h4>
        <div className="rateContractAddASM__menus-menu-container">
          {/* <span className="rateContractAddASM__menus-menu-container--divider"></span> */}
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="estQty" className="rateContractAddJHK__label required-label">
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
            {errors?.estQtyErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.estQtyErr}
              </span>
            }
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="shelfLife" className="rateContractAddJHK__label required-label">
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
            {errors?.shelfLifeErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.shelfLifeErr}
              </span>
            }
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label
              htmlFor="selectedTaxType"
              className="rateContractAddASM__label required-label"
            >
              Tax Type
            </label>
            <ComboDropDown
              options={taxTypes}
              value={formState.selectedTaxType}
              onChange={handleChange}
              name={"selectedTaxType"}
            />
            {errors?.selectedTaxTypeErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.selectedTaxTypeErr}
              </span>
            }
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="taxPercent" className="rateContractAddJHK__label required-label">
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
            {errors?.taxPercentErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.taxPercentErr}
              </span>
            }
          </div>
          {/* {formState.packagingTypes.length > 0 && ( */}
          <div className="rateContractAddASM__menus-menu-item">
            <label
              htmlFor="selectedPackagingType"
              className="rateContractAddASM__label required-label"
            >
              Packaging Unit
            </label>
            <ComboDropDown
              options={formState.packagingTypes}
              value={formState.selectedPackagingType}
              onChange={handleChange}
              name={"selectedPackagingType"}
            />
            {errors?.selectedPackagingTypeErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.selectedPackagingTypeErr}
              </span>
            }
          </div>
          {/* )} */}
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="taxPercent" className="rateContractAddJHK__label required-label">
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
            {errors?.rcPerNoErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.rcPerNoErr}
              </span>
            }
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="taxPercent" className="rateContractAddJHK__label required-label">
              Rate (in Rs) (With GST)
            </label>
            <InputField
              id="rcPerNoWithGST"
              className="rateContractAddJHK__input"
              type="text"
              name={"rcPerNoWithGST"}
              placeholder="Enter Total Rate"
              value={formState.rcPerNoWithGST}
              // onChange={handleChange}
              readOnly
            />
            {errors?.rcPerNoWithGSTErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.rcPerNoWithGSTErr}
              </span>
            }
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="taxPercent" className="rateContractAddJHK__label required-label">
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
            {errors?.deliveryDaysErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.deliveryDaysErr}
              </span>
            }
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="rcPckgUnit" className="rateContractAddJHK__label required-label">
              Rate (in Rs) (Packaging Unit)
            </label>
            <InputField
              id="rcPckgUnit"
              className="rateContractAddJHK__input"
              type="text"
              name={"rcPckgUnit"}
              placeholder="Rate in Packing Unit"
              value={formState.rcPckgUnit}
              // onChange={handleChange}
              readOnly
            />
            {errors?.rcPckgUnitErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.rcPckgUnitErr}
              </span>
            }
          </div>
          <div className="rateContractAddASM__menus-menu-item">
            <label htmlFor="totalRate" className="rateContractAddJHK__label required-label">
              Rate (in Rs) per Packaging Unit (With GST)
            </label>
            <InputField
              id="totalRate"
              className="rateContractAddJHK__input"
              type="text"
              name={"totalRate"}
              placeholder="Enter Total Rate"
              value={formState.totalRate}
              // onChange={handleChange}
              readOnly
            />
            {errors?.totalRateErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.totalRateErr}
              </span>
            }
          </div>
        </div>
      </div>
      <div className="rateContractAddASM__radio-container">
        <div className="rateContractAddASM__radio-container-radio">
          <h2
            className="rateContract__heading required-label"
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
          <br />
          {errors?.rcNumberFlagErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.rcNumberFlagErr}
            </span>
          }
        </div>
        <div className="rateContractAddASM__radio-container-radio">
          <h2
            className="rateContract__heading required-label"
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
          <br />
          {errors?.whetherImpFlagErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.whetherImpFlagErr}
            </span>
          }
        </div>
        <div className="rateContractAddASM__radio-container-radio">
          <h2
            className="rateContract__heading required-label"
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
          <br />
          {errors?.whetherPBGFlagErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.whetherPBGFlagErr}
            </span>
          }
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
          onClick={handleValidation}
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

import { useEffect, useReducer } from "react";
import {
  ComboDropDown,
  DatePickerComponent,
  InputField,
} from "../../../../commons/FormElements";
import { useDispatch } from "react-redux";
import { hidePopup } from "../../../../../features/commons/popupSlice";
import {
  getBudgetClasses,
  getExistingTenderDetails,
  loadTenderList,
  modifyTenderDetails,
} from "../../../../../api/Assam/services/rateContractAPI";
import MiniTable from "../../../../commons/Minitable";
import { parseDate } from "../../../../commons/utilFunctions";

const tenders = [
  { label: "Tender", value: "0" },
  { label: "Other Source", value: "1" },
];

const existingRcCols = [
  { key: "sstnum_item_cat_no", label: "Tender Type" },
  { key: "hststr_tender_ref_no", label: "Tender Number" },
  { key: "hstdt_tender_date", label: "Tender Date" },
  { key: "hstdt_tender_open_date", label: "Tender Open Date" },
  { key: "hstdt_tender_close_date", label: "Tender Close Date" },
];

export default function RateContractTenderForm() {
  //redux states
  const dispatch = useDispatch();

  // Controlled state for inputs
  const initialState = {
    sourceType: "",
    tenderList: [],
    itemCategories: [],
    selectedItemCat: 10,
    selectedTender: "0",
    tenderNumber: "",
    tenderDate: "",
    tenderAmount: "",
    tenderOpeningDate: "",
    tenderClosingDate: "",
    isDisabled: false,
    existingRCTableData: [],
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatcher({ type: "SET_FIELD", field: name, value });
  };

  const handleTenderChange = async (e) => {
    const { name, value } = e.target;
    dispatcher({ type: "SET_FIELD", field: name, value });

    if (value !== "0") {
      dispatcher({ type: "SET_FIELD", field: "isDisabled", value: true });

      const response = await getExistingTenderDetails(
        998,
        1,
        formState.selectedItemCat,
        value
      );

      const {
        hststr_tender_ref_no,
        hstdt_tender_open_date,
        hstdt_tender_close_date,
        hstnum_tender_amount,
      } = response.at(0);

      dispatcher({
        type: "SET_FIELD",
        field: "existingRCTableData",
        value: response,
      });

      dispatcher({
        type: "SET_FIELD",
        field: "tenderNumber",
        value: hststr_tender_ref_no,
      });
      dispatcher({
        type: "SET_FIELD",
        field: "tenderOpeningDate",
        value: hstdt_tender_open_date,
      });
      dispatcher({
        type: "SET_FIELD",
        field: "tenderClosingDate",
        value: hstdt_tender_close_date,
      });
      dispatcher({
        type: "SET_FIELD",
        field: "tenderAmount",
        value: hstnum_tender_amount,
      });
    } else {
      dispatcher({ type: "SET_FIELD", field: "isDisabled", value: false });
    }
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

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    dispatcher({ type: "RESET_FORM" });
  }

  async function handleModify() {
    const data = {
      tenderAmount: formState.tenderAmount,
      tenderOpenDate: parseDate(formState.tenderOpeningDate),
      tenderCloseDate: parseDate(formState.tenderClosingDate),
      hospitalCode: 998,
      tenderRefNo: formState.tenderNumber,
    };

    console.log("Sending data ", data);

    const response = await modifyTenderDetails(JSON.stringify(data));
    console.log(response);
  }

  useEffect(() => {
    const loadItemCategories = async () => {
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
          field: "itemCategories",
          value: budgetClassOptions,
        });
      } catch (err) {
        console.log("Failed to fetch item categories.", err);
      }
    };

    loadItemCategories();
  }, []);

  useEffect(() => {
    async function loadTenders() {
      try {
        const data = await loadTenderList(998, 1, formState.selectedItemCat);
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
          value: [{ label: "New", value: "0" }, ...tenderData],
        });
      } catch (err) {
        console.log("Failed to fetch pie chart data.", err);
      }
    }

    loadTenders();
  }, [formState.selectedItemCat]);

  return (
    <>
      <h3 className="employeeMaster__heading">Tender Add</h3>
      <div className="employeeMaster__container">
        <h4 className="employeeMaster__container-heading">Source Details</h4>
        <div>
          <label htmlFor="tender" className="employeeMaster__label">
            Source Type
          </label>
          <ComboDropDown
            options={tenders}
            onChange={handleChange}
            name={"sourceType"}
            value={formState.sourceType}
          />
        </div>
      </div>
      {formState.sourceType === "0" && (
        <>
          <div className="employeeMaster__container">
            <h4 className="employeeMaster__container-heading">
              Tender Details
            </h4>
            <div>
              <label htmlFor="tender" className="employeeMaster__label">
                Tender
              </label>
              <ComboDropDown
                options={formState.tenderList}
                onChange={handleTenderChange}
                name={"selectedTender"}
                value={formState.selectedTender}
              />
            </div>
            <div>
              <label htmlFor="tender" className="employeeMaster__label">
                Tender Type
              </label>
              <ComboDropDown
                options={formState.itemCategories}
                onChange={handleChange}
                name={"itemCategories"}
                value={formState.selectedItemCat}
              />
            </div>
            <div>
              <label htmlFor="tender" className="employeeMaster__label">
                Tender Number
              </label>
              <InputField
                id="tenderNumber"
                className="rateContractAddJHK__input"
                type="text"
                name={"tenderNumber"}
                placeholder="Enter Tender Number"
                value={formState.tenderNumber}
                onChange={handleChange}
                disabled={formState.isDisabled}
              />
            </div>
            {formState.selectedTender === "0" && (
              <div>
                <DatePickerComponent
                  selectedDate={formState.tenderDate}
                  setSelectedDate={(val) => handleDateChange(val, "tenderDate")}
                  labelText={"Tender Date"}
                  labelFor={"tenderDate"}
                  name={"tenderDate"}
                  allowMin={true}
                  disableFutureDates={true}
                />
              </div>
            )}
            <div>
              <label htmlFor="tender" className="employeeMaster__label">
                Tender Amount
              </label>
              <InputField
                id="tenderAmount"
                className="rateContractAddJHK__input"
                type="text"
                name={"tenderAmount"}
                placeholder="Enter Tender Amount"
                value={formState.tenderAmount}
                onChange={handleChange}
                disabled={formState.isDisabled}
              />
            </div>
            <div>
              <DatePickerComponent
                selectedDate={formState.tenderOpeningDate}
                setSelectedDate={(val) =>
                  handleDateChange(val, "tenderOpeningDate")
                }
                labelText={"Tender Opening Date"}
                labelFor={"tenderOpeningDate"}
                name={"tenderOpeningDate"}
                allowMin={true}
              />
            </div>
            <div>
              <DatePickerComponent
                selectedDate={formState.tenderClosingDate}
                setSelectedDate={(val) =>
                  handleDateChange(val, "tenderClosingDate")
                }
                labelText={"Tender Closing Date"}
                labelFor={"tenderClosingDate"}
                name={"tenderClosingDate"}
                allowMin={true}
              />
            </div>
          </div>
          {formState.selectedTender !== "0" && (
            <div
              className="employeeMaster__container"
              style={{ display: "block" }}
            >
              <h4 className="employeeMaster__container-heading">
                Existing Tender Details
              </h4>

              <div style={{ overflowX: "scroll" }}>
                <MiniTable
                  columns={existingRcCols}
                  data={formState.existingRCTableData}
                />
              </div>
            </div>
          )}
        </>
      )}
      <div className="bankmaster__container-controls">
        {formState.sourceType === "0" && (
          <>
            <button
              className="bankmaster__container-controls-btn"
              onClick={handleModify}
            >
              Save
            </button>
            <button
              className="bankmaster__container-controls-btn"
              onClick={handleReset}
            >
              Reset
            </button>
          </>
        )}
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

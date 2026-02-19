import { useEffect, useRef, useState } from "react";
import {
  ComboDropDown,
  InputField,
  RadioButton,
} from "../../../commons/FormElements";
import ServiceNavbar from "../../../commons/ServiceNavbar";
import {
  getBudgetClasses,
  getContractTypes,
  getDrugNames,
  getManufacturers,
  getPieChartData,
  getRcTableData,
  getStoreDetails,
} from "../../../../api/Assam/services/rateContractAPI";
import PieChart from "../../../commons/PieChart";
import DataTable from "../../../commons/Datatable";
import { AnimatePresence, motion } from "framer-motion";
import RateContractTenderForm from "./RateContract/RateContractTenderForm";
import { useDispatch } from "react-redux";
import { showPopup } from "../../../../features/commons/popupSlice";
import { useNavigate } from "react-router-dom";
import {
  setContractList,
  setSelectedContract,
} from "../../../../features/Ratecontract/rateContractASMSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import RateContractAddAssam from "./RateContract/RateContractAdd";
// import '../../../../sass/pages/_rateContract.scss';

const chartColors = {
  red: "linear-gradient(90deg, rgba(54, 187, 174, 1), #319795, #2c7a7b)",
  blue: "linear-gradient(90deg, #fdc554ff, #d89536ff, #d3871cff)",
  orange: "linear-gradient(90deg, #d45d63ff, #dc3545, #b6202fff)",
  green: "linear-gradient(90deg, #997f64ff, #816749, #5b4431)",
  yellow: "linear-gradient(90deg, #55677eff, #475569, #334155)",
};

const columns = [
  { header: "RC Number", field: "hstnum_rc_no" },
  { header: "Manufacturer Name", field: "supplier_name" },
  { header: "Item Name", field: "item_name" },
  { header: "Rate/Unit (In Package Unit Rs)", field: "hstnum_rate" },
  { header: "Tax%", field: "hstnum_tax" },
  {
    header: "Rate/Unit (In Package Unit With Tax%)",
    field: "hstnum_rate_per_unit_inc_tax",
  },
  { header: "Rate/Unit (In Number)", field: "hstnum_rate_per_unit" },
  {
    header: "Rate/Unit (In Number with tax%)",
    field: "hstnum_rate_inc_tax",
  },
  { header: "Contract From", field: "contract_from" },
  { header: "Contract To", field: "contract_to" },
  { header: "Tender Number/Source Name", field: "tender_source_name" },
  { header: "Level Type", field: "sstnum_level_type_id" },
  {
    header: "Action",
    field: "action",
    isJSX: true,
    ele: (row) => (
      <div style={{
        display: "flex",
        gap: "4px",
        flexWrap: "wrap"
      }}>
        <button className="btn btn-sm btn-primary" style={{ padding: "1px 3px" }} onClick={() => handleAction("view", row)} title="Extension"> <FontAwesomeIcon icon={faEdit} size='sm' /></button>

        <button className="btn btn-sm btn-warning" style={{ padding: "1px 3px" }} onClick={() => handleAction("edit", row)} title="Modify"><FontAwesomeIcon icon={faEdit} size='sm' /></button>

        <button className="btn btn-sm btn-danger" style={{ padding: "1px 3px" }} onClick={() => handleAction("approve", row)} title="Cancel"><FontAwesomeIcon icon={faTrash} size='sm' /></button>

        <button className="btn btn-sm btn-success" style={{ padding: "1px 3px" }} onClick={() => handleAction("print", row)} title="View"><FontAwesomeIcon icon={faEye} size='sm' /></button>

        <button className="btn btn-sm btn-secondary" style={{ padding: "1px 3px" }} onClick={() => handleAction("share", row)} title="Early Expiry"><FontAwesomeIcon icon={faEdit} size='sm' /></button>

        <button className="btn btn-sm btn-info" style={{ padding: "1px 3px" }} onClick={() => handleAction("delete", row)} title="RC Amendment"><FontAwesomeIcon icon={faEdit} size='sm' /></button>
      </div>
    ),
  }
];

const handleAction = (type, row) => {
  console.log(type, row);

  switch (type) {
    case "view":
      break;
    case "edit":
      break;
    case "approve":
      break;
    case "print":
      break;
    case "share":
      break;
    case "delete":
      break;
    default:
      break;
  }
};

const radioOptions = [
  { label: "All", value: "0" },
  { label: "Text Input", value: "1" },
];

const fadeSlideVariant = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  visible: {
    opacity: 1,
    height: "auto",
    overflow: "hidden",
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: "hidden",
    transition: { duration: 0.2 },
  },
};

export default function RateContract() {
  const buttonDataset = [
    { label: "Tender", onClick: handleTenderAdd },
    { label: "Rate Contract", onClick: handleRateContractAdd },
  ];

  //redux states
  const dispatch = useDispatch();

  //Router states
  const navigate = useNavigate();

  //local states
  const [manufName, setManufName] = useState(0);
  const [contractType, setContractType] = useState(0);
  const [manufacturers, setManufacturers] = useState([]);
  const [budgetClasses, setBudgetClasses] = useState();
  const [itemName, setItemName] = useState(0);
  const [drugList, setDrugList] = useState([]);

  const [budgetClass, setSelectedBudgetClass] = useState(10);
  const [contractTypes, setContractTypes] = useState([]);

  const [showRadio, setShowRadio] = useState(false);
  const [radioOption, setRadioOption] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");

  const [pieChartData, setPieChartData] = useState([]);
  const [displayTable, setDisplayTable] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [gnumIsvalid, setGnumIsValid] = useState(1);

  const { userId } = JSON.parse(localStorage.getItem("data"));
  const [userSelection, setUserSelection] = useState("");

  const [isRateContractAddForm, setIsRateContractAddForm] = useState(false);
  const [healthFacilities, setHealthFacilities] = useState([]);

  //refs
  const dataTableRef = useRef();

  const componentsList = [
    { mappingKey: "Tender", componentName: () => <RateContractTenderForm itemCategories={budgetClasses} /> },
  ];

  function handleTenderAdd() {
    setUserSelection("Tender");
    dispatch(showPopup());
  }

  function handleRateContractAdd() {
    console.log("Rate Contract");
    setIsRateContractAddForm(true);
    // navigate("add", { replace: true });
  }

  // Handle Search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  async function getStores() {
    const response = await getStoreDetails(998);
    let healthFacilitiesData = [];

    response.forEach((element) => {
      const { hstnum_store_id: value, hststr_store_name: label } = element;
      healthFacilitiesData.push({ label, value });
    });

    setHealthFacilities(healthFacilitiesData)

  }

  async function handleRateContractDisplay() {
    setDisplayTable(true);
    setShowRadio(false);

    const queryData = {
      hstnumStoreId: 99800001,
      sstnumItemCatNo: 10,
      strLevelTypeId: 1,
      hstnumContractTypeId: contractType,
      hstnumSupplierId: manufName,
      hstnumItembrandId: itemName,
      hstnumHospitalCode: 998,
      gnumIsvalid: gnumIsvalid,
      searchItems: radioOption === "0" ? "" : searchQuery,
      selectOption: radioOption,
    };
    console.log("Sending data ", queryData);
    const data = await getRcTableData(JSON.stringify(queryData));
    setTableData(data);
  }

  //effects for combos
  useEffect(() => {

    const loadContractTypes = async () => {
      try {
        const data = await getContractTypes(998);
        let contractTypeOptions = [];
        data.forEach((element) => {
          const obj = {
            label: element.sststr_contracttype_name,
            value: element.sstnum_contracttype_id,
          };
          contractTypeOptions.push(obj);
        });
        setContractType(contractTypeOptions[0]?.value || 0)
        setContractTypes(contractTypeOptions);
        dispatch(setContractList(contractTypeOptions));
      } catch (err) {
        console.log("Failed to fetch data.", err);
      }
    };

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

        setManufacturers([{ label: "All", value: 0 }, ...manufacturerOptions]);
      } catch (err) {
        console.log("Failed to fetch data.", err);
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
        setBudgetClasses(budgetClassOptions);
      } catch (err) {
        console.log("Failed to fetch data.", err);
      }
    };

    loadManufacturers();
    loadBudgetClasses();
    loadContractTypes();
    getStores()
  }, [userId]);

  const loadDrugs = async (budgetClass) => {
    try {
      const data = await getDrugNames(998, healthFacilities.at(0).value, budgetClass);
      let drugNames = [];
      data.forEach((element) => {
        const obj = {
          label: element.itemname,
          value: element.hstnum_item_id,
          data: element.hstnum_itembrand_id,
        };
        drugNames.push(obj);
      });
      setDrugList([{ label: "All", value: 0, data: 0 }, ...drugNames]);
    } catch (err) {
      console.log("Failed to fetch data.", err);
    }
  };

  useEffect(() => {
    if (budgetClass && healthFacilities?.length > 0) {
      loadDrugs(budgetClass);
    }
  }, [budgetClass, healthFacilities])

  //effects for pie chart
  useEffect(() => {
    async function loadPieChart() {
      try {
        const data = await getPieChartData(
          998,
          contractType,
          Number(manufName),
          Number(itemName),
          budgetClass
        );
        console.log("Pie chart data : ", data);
        let statusData = [];

        data.forEach((item) => {
          const { count, label, status, color } = item;
          statusData.push({
            name: label,
            y: Number(count),
            status,
            datapointColor: chartColors[color],
          });
        });

        setPieChartData(statusData);
      } catch (err) {
        console.log("Failed to fetch pie chart data.", err);
      }
    }

    if (contractType && budgetClass) {
      loadPieChart();
    }

  }, [contractType, manufName, itemName, budgetClass]);

  console.log('tableData', tableData)

  return (
    <>
      {isRateContractAddForm ?
        <RateContractAddAssam setIsRateContractAddForm={setIsRateContractAddForm} budgetCategory={budgetClasses} manufacturers={manufacturers} drugList={drugList} loadDrugs={loadDrugs} healthFacilities={healthFacilities} getStores={getStores}/>
        :
        (<>
          <ServiceNavbar
            buttons={buttonDataset}
            heading={"Rate Contract"}
            userSelection={userSelection}
            componentsList={componentsList}
            isLargeDataset={true}
            filtersVisibleOnLoad={true}
          >
            <div className="rateContract__filterSection">
              <div className="rateContract__filterSection--filters">
                <div className="rateContract__container">
                  <ComboDropDown
                    options={contractTypes}
                    onChange={(e) => {
                      setContractType(e.target.value);
                      dispatch(setSelectedContract(e.target.value));
                    }}
                    value={contractType}
                    label={"Contract Type"}
                    addOnClass="rateContract__container--dropdown"
                  />
                  <ComboDropDown
                    options={budgetClasses}
                    onChange={(e) => setSelectedBudgetClass(e.target.value)}
                    value={budgetClass}
                    label={"Budget Class"}
                    addOnClass="rateContract__container--dropdown"
                  />
                  <ComboDropDown
                    options={manufacturers}
                    onChange={(e) => setManufName(e.target.value)}
                    value={manufName}
                    label={"Manufacturer Name"}
                    addOnClass="rateContract__container--dropdown"
                  />
                  <ComboDropDown
                    options={drugList}
                    onChange={(e) => setItemName(e.target.value)}
                    value={itemName}
                    label={"Item Name"}
                    addOnClass="rateContract__container--dropdown"
                  />
                </div>
                {pieChartData.length > 0 && (
                  <div className="rateContract__status">
                    {pieChartData.map((data, index) => {
                      return (
                        <div
                          key={index}
                          className="rateContract__status--container"
                          style={{ backgroundImage: data.datapointColor }}
                          onClick={() => {
                            setShowRadio(true);
                            setGnumIsValid(data.status);
                          }}
                        >
                          <h2
                            className="rateContract__heading"
                            style={{ userSelect: "none" }}
                          >
                            {data.name}
                          </h2>
                          <h4
                            className="rateContract__heading--count"
                            style={{ userSelect: "none" }}
                          >
                            {data.y}
                          </h4>
                        </div>
                      );
                    })}
                  </div>
                )}
                <AnimatePresence>
                  {showRadio && (
                    <motion.div
                      variants={fadeSlideVariant}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="rateContract__radioWrapper" // You can wrap both sections in one animated div
                    >
                      <div className="rateContract__radioOptions">
                        <h2
                          className="rateContract__heading"
                          style={{ margin: "0" }}
                        >
                          Search By:
                        </h2>
                        <div>
                          {radioOptions.map((data, index) => (
                            <RadioButton
                              label={data.label}
                              name="status"
                              value={data.value}
                              checked={radioOption === data.value}
                              onChange={(e) => setRadioOption(e.target.value)}
                              keyProp={index}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="rateContract__radioOptions--controls">
                        <AnimatePresence mode="wait">
                          {radioOption === "1" && (
                            <motion.div
                              key="text-input"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.2 },
                              }}
                              exit={{
                                opacity: 0,
                                y: -10,
                                transition: { duration: 0.2 },
                              }}
                            >
                              <InputField
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search.."
                                className="rateContract__radioOptions--controls-input"
                                id="DatatableSearch"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <button
                          className="rateContract__radioOptions--controls-btn"
                          onClick={handleRateContractDisplay}
                        >
                          Submit
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {pieChartData.length > 0 && (
                <div className="rateContract__filterSection--chart">
                  {/* <h2
                className="rateContract__heading"
                style={{ textAlign: "center" }}
              >
                Rate Contract Status Overview
              </h2> */}
                  <PieChart data={pieChartData} />
                </div>
              )}
            </div>
          </ServiceNavbar>

          <div>
            {displayTable && (
              <DataTable
                masterName={"Rate Contract"}
                ref={dataTableRef}
                columns={columns}
                data={tableData}
              />
            )}
          </div>
        </>)
      }
    </>
  );
}

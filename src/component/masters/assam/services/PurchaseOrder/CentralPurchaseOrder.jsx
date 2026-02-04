import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBudgetClasses, getContractTypes, getDrugNames, getManufacturers, 
    getPieChartData, getRcTableData } 
    from "../../../../../api/Assam/services/rateContractAPI";
import { setContractList } from "../../../../../features/Ratecontract/rateContractASMSlice";
import { getFinancialData } from "../../../../../api/Assam/services/poServiceAPI";
import { ComboDropDown } from "../../../../commons/FormElements";
import DataTable from "../../../../commons/Datatable";
import ServiceNavbar from "../../../../commons/ServiceNavbar";

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
  { header: "Action", field: "" },
];

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

export default function CentralPurchaseOrder() {
  const buttonDataset = [
    { label: "Item Draft", onClick: handleItemDraft },
    { label: "Po Generate", onClick: handlePoGenerate },
  ];


  function handleItemDraft(){}

  function handlePoGenerate(){}


  //redux states
  const dispatch = useDispatch();

  //Router states
  const navigate = useNavigate();

  //local states
  const [financialYear, setFinancialYear] = useState();
  const [selectedFinancialYear, setSelectedFinancialYear] = useState();

  const { userId } = JSON.parse(localStorage.getItem("data"));
//   const [userSelection, setUserSelection] = useState("");

  //refs
  const dataTableRef = useRef();

//   function handleTenderAdd() {
//     setUserSelection("Tender");
//     dispatch(showPopup());
//   }

//   function handleRateContractAdd() {
//     console.log("Rate Contract");
//     navigate("add", { replace: true });
//   }

//   // Handle Search
//   const handleSearch = (event) => {
//     const query = event.target.value.toLowerCase();
//     setSearchQuery(query);
//   };

//   async function handleRateContractDisplay() {
//     setDisplayTable(true);
//     setShowRadio(false);

//     const queryData = {
//       hstnumStoreId: 99800001,
//       sstnumItemCatNo: 10,
//       strLevelTypeId: 1,
//       hstnumContractTypeId: contractType,
//       hstnumSupplierId: manufName,
//       hstnumItembrandId: itemName,
//       hstnumHospitalCode: 998,
//       gnumIsvalid: gnumIsvalid,
//       searchItems: radioOption === "0" ? "" : searchQuery,
//       selectOption: radioOption,
//     };
//     console.log("Sending data ", queryData);
//     const data = await getRcTableData(JSON.stringify(queryData));
//     setTableData(data);
//   }

  //effects for combos
  useEffect(() => {
    const loadFinancialYear = async () => {
      try {
        const data = await getFinancialData();
        let financialYearCombo = [];
        data.forEach((element) => {
          const obj = {
            label: element?.financialYear,
            value: element?.financialYear,
          };
          financialYearCombo.push(obj);
        });
        setFinancialYear(financialYearCombo);
      } catch (err) {
        console.log("Failed to fetch data.", err);
      }
    };

    loadFinancialYear();
  }, []);

//   //effects for pie chart
//   useEffect(() => {
//     async function loadPieChart() {
//       try {
//         const data = await getPieChartData(
//           998,
//           contractType || 1,
//           Number(manufName),
//           Number(itemName),
//           10
//         );
//         console.log("Pie chart data : ", data);
//         let statusData = [];

//         data.forEach((item) => {
//           const { count, label, status, color } = item;
//           statusData.push({
//             name: label,
//             y: Number(count),
//             status,
//             datapointColor: chartColors[color],
//           });
//         });

//         setPieChartData(statusData);
//       } catch (err) {
//         console.log("Failed to fetch pie chart data.", err);
//       }
//     }

//     loadPieChart();
//   }, [contractType, manufName, itemName]);

  return (
    <>
      <ServiceNavbar
        buttons={buttonDataset}
        heading={"Central Purchase Order"}
        // userSelection={userSelection}
        componentsList={[]}
        isLargeDataset={true}
        filtersVisibleOnLoad={true}
      >
        <div className="rateContract__filterSection">
          <div className="rateContract__filterSection--filters">
            <div className="rateContract__container">
              <ComboDropDown
                options={financialYear}
                onChange={(e) => {
                  setSelectedFinancialYear(e.target.value);
                }}
                value={selectedFinancialYear}
                label={"Financial Year"}
                addOnClass="rateContract__container--dropdown"
              />
            </div>
            {/* {pieChartData.length > 0 && (
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
            )} */}
            {/* <AnimatePresence>
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
            </AnimatePresence> */}
          </div>
          {/* {pieChartData.length > 0 && (
            <div className="rateContract__filterSection--chart">
              <PieChart data={pieChartData} />
            </div>
          )} */}
        </div>
      </ServiceNavbar>
      <div>
        {/* {displayTable && (
          <DataTable
            masterName={"Rate Contract"}
            ref={dataTableRef}
            columns={columns}
            data={tableData}
          />
        )} */}
      </div>
    </>
  );
}

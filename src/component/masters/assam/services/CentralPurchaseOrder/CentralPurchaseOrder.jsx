import React, { useState, useEffect, useRef } from 'react'; 
import { ComboDropDown, RadioButton, InputField } from '../../../../commons/FormElements';
import { getCountList, getFinancialYears } from '../../../../../api/Assam/services/CentralPurchaseOrderApi';
import { AnimatePresence, motion } from "framer-motion";
import ServiceNavbar from '../../../../commons/ServiceNavbar';
import PieChart from '../../../../commons/PieChart';
// In components ko aapne use kiya hai, inka import check kar lijiye:
// import ServiceNavbar from '...'; 
// import PieChart from '...';
// import DataTable from '...';

const CentralPurchaseOrder = () => {
  // --- 1. Saari States jo aapke code mein use ho rahi hain ---
  const [financialYears, setFinancialYears] = useState([]); 
  const [selectedFY, setSelectedFY] = useState(""); 
  const [pieChartData, setPieChartData] = useState([]);
  const [displayTable, setDisplayTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showRadio, setShowRadio] = useState(false);
  const [radioOption, setRadioOption] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [gnumIsValid, setGnumIsValid] = useState(""); // data.status ke liye
  const dataTableRef = useRef(null);

  // Animation Variant
  const fadeSlideVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const chartColors = {
    red: "linear-gradient(90deg, #d45d63, #dc3545, #b6202f)",
  blue: "linear-gradient(90deg, #55677e, #475569, #334155)",
  orange: "linear-gradient(90deg, #fdc554, #d89536, #d3871c)",
  green: "linear-gradient(90deg, #36bbae, #319795, #2c7a7b)",
  yellow: "linear-gradient(90deg, #f6e05e, #ecc94b, #d69e2e)",

  // New Colors from your API Response
  pink: "linear-gradient(90deg, #ed6ea0, #ec4899, #be185d)",
  brown: "linear-gradient(90deg, #a0522d, #8b4513, #5d2906)",
  purple: "linear-gradient(90deg, #a78bfa, #8b5cf6, #6d28d9)",
  teal: "linear-gradient(90deg, #5eead4, #14b8a6, #0f766e)",
  peach: "linear-gradient(90deg, #ffb07c, #ff8c00, #e67e22)"
  };

  // --- 2. Handlers ---
  const handleSearch = (e) => setSearchQuery(e.target.value);

  async function handlePOrderGenrationDisplay() {
    setDisplayTable(true);
    setShowRadio(false);

    const queryData = {
      financialYearValue: selectedFY,
      searchItems: radioOption === "0" ? "" : searchQuery,
      selectOption: radioOption,
    };
    
    console.log("Sending data ", queryData);
    // Yahan ensure karein ki getRcTableData import ho ya renamed ho
    // const data = await getRcTableData(JSON.stringify(queryData));
    // setTableData(data);
  }

  // --- 3. Effects ---

  // Financial Year Load karne ke liye
  useEffect(() => {
    const fetchFY = async () => {
      try {
        const response = await getFinancialYears(); 
        const formattedData = response.map(item => ({
          label: item.financialYear,
          value: item.financialYearValue    
        }));
        setFinancialYears(formattedData);
      } catch (error) {
        console.error("FY not fetch:", error);
      }
    };
    fetchFY();
  }, []);

  // Dashboard Counts load karne ke liye (Jab FY select ho)
  useEffect(() => {
    const loadCounts = async () => {
      if (selectedFY) { 
        try {
          const data = await getCountList(selectedFY);
          console.log('data', data)
          const statusData = data.map((item) => ({
            name: item[0].label || "Orders", 
            y: Number(item[0].count),
            status: item[0].isDataCard,
            datapointColor: chartColors[item[0].color] || item[0].color, 
          }));
          setPieChartData(statusData);
        } catch (err) {
          console.error("Dashboard update fail:", err);
        }
      }
    };
    loadCounts();
  }, [selectedFY]); 
console.log('pieChartData', pieChartData)
  // --- 4. UI Return ---
  return (
    <>
      <ServiceNavbar
        buttons={[]}    
        heading={"Rate Contract"}
        userSelection={[]}
        componentsList={[]}
        isLargeDataset={true}
        filtersVisibleOnLoad={true}
      >
        <div className="pOrder__filterSection">
          <div className="pOrder__filterSection--filters">
            <div className="financialYear__wrapper">
              <ComboDropDown
                options={financialYears}
                onChange={(e) => setSelectedFY(e.target.value)}
                value={selectedFY}
                label={"Financial Year"}
                addOnClass="financialYear__container--dropdown"
              />
              <p>Selected Financial Year: {selectedFY}</p>
            </div>

            {pieChartData.length > 0 && (
              <div className="pOrder__status">
                {pieChartData.map((data, index) => (
                  <div
                    key={index}
                    className="pOrder__status--container"
                    style={{ backgroundImage: data.datapointColor }}
                    onClick={() => {
                      setShowRadio(true);
                      setGnumIsValid(data.status);
                    }}
                  >
                    <h2 className="pOrder__heading" style={{ userSelect: "none" }}>
                      {data.name}
                    </h2>
                    <h4 className="pOrder__heading--count" style={{ userSelect: "none" }}>
                      {data.y}
                    </h4>
                  </div>
                ))}
              </div>
            )}

            <AnimatePresence>
              {showRadio && (
                <motion.div
                  variants={fadeSlideVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="pOrder__radioWrapper"
                >
                  <div className="pOrder__radioOptions">
                    <h2 className="pOrder__heading" style={{ margin: "0" }}>Search By:</h2>
                    <div>
                      {/* radioOptions array defined hona chahiye (ya hardcoded) */}
                      {[{label: "Option 1", value: "1"}, {label: "All", value: "0"}].map((data, index) => (
                        <RadioButton
                          key={index}
                          label={data.label}
                          name="status"
                          value={data.value}
                          checked={radioOption === data.value}
                          onChange={(e) => setRadioOption(e.target.value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pOrder__radioOptions--controls">
                    <AnimatePresence mode="wait">
                      {radioOption === "1" && (
                        <motion.div
                          key="text-input"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <InputField
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Search.."
                            className="pOrder__radioOptions--controls-input"
                            id="DatatableSearch"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button
                      className="pOrder__radioOptions--controls-btn"
                      onClick={handlePOrderGenrationDisplay}
                    >
                      Submit
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {pieChartData.length > 0 && (
            <div className="pOrder__filterSection--chart">
              {/* Ensure PieChart component is imported */}
              <PieChart data={pieChartData} />
            </div>
          )}
        </div>
      </ServiceNavbar>

      <div>
        {displayTable && (
          <DataTable
            masterName={"Central Purchase Order Generation"}
            ref={dataTableRef}
            // columns define honi chahiye
            columns={[]} 
            data={tableData}
          />
        )}
      </div>
    </>
  );
}

export default CentralPurchaseOrder;
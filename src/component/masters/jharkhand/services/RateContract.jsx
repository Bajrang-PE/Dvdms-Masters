import { useEffect, useRef, useState } from "react";
import ServiceNavbar from "../../../commons/ServiceNavbar";
import { ComboDropDown } from "../../../commons/FormElements";
import DataTable from "../../../commons/Datatable";
import {
  cancelRateContract,
  getContractTypes,
  getDrugNames,
  getRateContractList,
  getRcGraphData,
  getStoreName,
  getSuppliers,
} from "../../../../api/Jharkhand/api/rateContractAPI";
import { useDispatch, useSelector } from "react-redux";
import { showPopup } from "../../../../features/commons/popupSlice";
import RateContractAddForm from "./RateContract/RateContractAdd";
import RateContractTenderForm from "./RateContract/RateContractTenderForm";
import {
  setContractDetails,
  setDrugsList,
  setStore,
  setSupplierData,
} from "../../../../features/Ratecontract/rateContractJHKSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import PieChart from "../../../commons/PieChart";

const columns = [
  { header: "Supplier Name", field: "suppName" },
  { header: "Drug Name", field: "itemName" },
  { header: "Rate/Unit", field: "rate" },
  { header: "Tax%", field: "tax" },
  { header: "Contract From", field: "contractFromDate" },
  { header: "Contract To", field: "contractToDate" },
  { header: "RC Number", field: "rcNo" },
  { header: "Tender Number", field: "tenderId" },
];

const statusList = [
  { label: "All", value: "0" },
  { label: "Active", value: "1" },
  { label: "Cancel", value: "2" },
  { label: "Draft Save", value: "9" },
  { label: "Approval Pending", value: "7" },
  { label: "Rejected", value: "5" },
];

const chartColors = {
  red: "linear-gradient(90deg, rgba(54, 187, 174, 1), #319795, #2c7a7b)",
  blue: "linear-gradient(90deg, #fdc554ff, #d89536ff, #d3871cff)",
  orange: "linear-gradient(90deg, #d45d63ff, #dc3545, #b6202fff)",
  green: "linear-gradient(90deg, #997f64ff, #816749, #5b4431)",
  yellow: "linear-gradient(90deg, #55677eff, #475569, #334155)",
  white: "linear-gradient(90deg, #55677eff, #475569, #334155)",
};

export default function RateContractJH() {

  // const { contractDetails } = useSelector((state) => state.rateContractJHK);
  const dispatch = useDispatch();

  const [contractTypes, setContractTypes] = useState([]);
  const [selectedContractType, setSelectedContractType] = useState();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('0');
  const [drugList, setDrugList] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState('0');
  const [storeName, setStoreName] = useState();
  const [stores, setStores] = useState([]);
  const [userSelection, setUserSelection] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [tableData, setTableData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  const [selectedRowRc, setSelectedRowRc] = useState(null);

  const handleRowSelect = (row) => {
    setSelectedRowRc(row);
  }

  const componentsList = [
    { mappingKey: "Tender", componentName: RateContractTenderForm },
    { mappingKey: "add", componentName: RateContractAddForm },
  ];

  const navigate = useNavigate();

  const buttonDataset = [
    { label: "Add", onClick: handleRateContractAdd },
    { label: "Tender Details", onClick: handleTenderDetails },
    ...(selectedRowRc?.length > 0 && activeStatus !== '2'
      ? [{ label: "Cancel", onClick: cencelRateContractData, color: "#bb5e00", icon: <FontAwesomeIcon icon={faXmark} className="mr-1" /> }]
      : []
    ),
    ...(selectedRowRc?.length > 0 && activeStatus === '1'
      ? [{ label: "Renew", onClick: renewRateContractData, color: "#03772fff", icon: <FontAwesomeIcon icon={faRotateRight} className="mr-1" /> }]
      : []
    )
  ];

  //refs
  const dataTableRef = useRef();

  function handleRateContractAdd() {
    setUserSelection("add");
    dispatch(showPopup());
  }

  function handleTenderDetails() {
    setUserSelection("Tender");
    dispatch(showPopup());
  }

  //effects
  useEffect(() => {
    const loadContracts = async () => {
      try {
        const data = await getContractTypes(998);
        let contractOptions = [];
        data?.data.forEach((element) => {
          const obj = {
            label: element.name,
            value: element.id,
          };
          contractOptions.push(obj);
        });

        setContractTypes(contractOptions);
        setSelectedContractType(contractOptions.at(0).value);
        dispatch(setContractDetails(contractOptions.at(0)));
      } catch (err) {
        console.log("Failed to fetch data.", err);
      }
    };

    const loadSuppliers = async () => {
      try {
        let supplierList = [];
        const data = await getSuppliers(998);
        data?.forEach((element) => {
          const supplierID = element.id.split("^").at(0);
          const obj = {
            label: element.name,
            value: supplierID,
          };
          supplierList.push(obj);
        });
        setSuppliers(supplierList);
        dispatch(setSupplierData(supplierList));
        // setSelectedSupplier(supplierList.at(0).value);
      } catch (err) {
        console.log("Failed to fetch data.", err);
      }
    };

    const loadDruglist = async () => {
      try {
        let drugList = [];
        const data = await getDrugNames(998);
        data?.data.forEach((element) => {
          const drugId = element.brandid_itemid.split("^").at(0);
          const itId = element.brandid_itemid.split("^").at(1);
          const obj = {
            label: element.item_name,
            value: drugId,
            itemId: itId
          };
          drugList.push(obj);
        });

        setDrugList(drugList);
        // setSelectedDrug(drugList.at(0).value);
        dispatch(setDrugsList(drugList));
      } catch (err) {
        console.log("Failed to fetch drugs.", err);
      }
    };

    const loadStores = async () => {
      try {
        let stores = [];
        const data = await getStoreName(998);
        data?.data.forEach((element) => {
          const obj = {
            label: element.hststr_store_name,
            value: element.hstnum_store_id,
          };
          stores.push(obj);
        });
        setStores(stores);
        setStoreName(stores.at(0).value);
        dispatch(setStore(stores.at(0)));
      } catch (err) {
        console.log("Failed to fetch drugs.", err);
      }
    };

    loadContracts();
    loadSuppliers();
    loadDruglist();
    loadStores();
  }, [dispatch]);

  useEffect(() => {
    if (storeName && selectedContractType) {
      getGraphDataForRc();
    }
  }, [selectedSupplier, selectedContractType, selectedDrug, storeName]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!selectedSupplier || !selectedContractType || !activeStatus) return;
      getRateContractList(998, selectedSupplier, selectedContractType, activeStatus, storeName, selectedDrug).then((data) => setTableData(data?.data || []));
    }, 200);
    return () => clearTimeout(timeout);
  }, [activeStatus]);

  function cencelRateContractData() {
    const val = {
      gnumHospitalCode: 998,
      hstnumRcId: selectedRowRc[0]?.rcId,
      hststrCancelRmks: "",
      gnumSeatid: 14462
    }
    if (selectedRowRc[0]?.isValid === "2") {
      alert('Mare hue ko kitna maroge, hmm');
    } else {
      cancelRateContract(val)?.then((data) => {
        if (data?.status === 1) {
          alert("Rate contract canceled")
          getRateContractList(
            998,
            selectedSupplier,
            selectedContractType,
            activeStatus,
            storeName,
            selectedDrug
          ).then((data) => setTableData(data?.data || []));
        } else {
          console.log(data?.message)
        }
      })
    }
  }

  function renewRateContractData() {
    const val = {
      gnumHospitalCode: 998,
      hstnumRcId: selectedRowRc[0]?.rcId,
      hststrCancelRmks: "",
      gnumSeatid: 14462
    }
    if (selectedRowRc[0]?.isValid === "2") {
      alert('Mare hue ko kitna maroge, hmm');
    } else {
      cancelRateContract(val)?.then((data) => {
        if (data?.status === 1) {
          alert("Rate contract canceled")
          getRateContractList(
            998,
            selectedSupplier,
            selectedContractType,
            activeStatus,
            storeName,
            selectedDrug
          ).then((data) => setTableData(data?.data || []));
        } else {
          console.log(data?.message)
        }
      })
    }
  }

  const getGraphDataForRc = () => {
    getRcGraphData(998, storeName, selectedSupplier, selectedContractType, selectedDrug)?.then((data) => {
      if (data?.status === 1) {
        let statusData = [];

        data?.data.forEach((item) => {
          const { count, label, status, color } = item;
          statusData.push({
            name: label,
            y: Number(count),
            status,
            datapointColor: chartColors[color],
          });
        });
        setPieChartData(statusData);
      } else {
        setPieChartData([]);
      }
      console.log('data', data);
    })
  }

  console.log('pieChartData', pieChartData)

  return (
    <>
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
            <div className="rateContract__container mb-4">
              <ComboDropDown
                options={stores}
                onChange={(e) => {
                  setStoreName(e.target.value);
                  dispatch(
                    setStore(stores?.find((dt) => dt?.value == e.target.value))
                  );
                }}
                value={storeName}
                label={"Store Name"}
                addOnClass="rateContract__container--dropdown"
              />
              <ComboDropDown
                options={suppliers}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                value={selectedSupplier}
                label={"Supplier Name"}
                addOnClass="rateContract__container--dropdown"
              />
              <ComboDropDown
                options={contractTypes}
                onChange={(e) => {
                  setSelectedContractType(e.target.value);
                  dispatch(
                    setContractDetails(
                      contractTypes?.find((dt) => dt?.value == e.target.value)
                    )
                  );
                }}
                value={selectedContractType}
                label={"Contract Type"}
                addOnClass="rateContract__container--dropdown"
              />
              <ComboDropDown
                options={drugList}
                onChange={(e) => setSelectedDrug(e.target.value)}
                value={selectedDrug}
                label={"Drug Name"}
                addOnClass="rateContract__container--dropdown"
              />
              <ComboDropDown
                options={statusList}
                onChange={(e) => setActiveStatus(e.target.value)}
                value={activeStatus}
                label={"Status"}
                addOnClass="rateContract__container--dropdown"
              />
            </div>

            {pieChartData.length > 0 && (
              <div className="rateContract__status mb-4">
                {pieChartData.map((data, index) => {
                  return (
                    <div
                      key={index}
                      className="rateContract__status--container"
                      style={{ backgroundImage: data.datapointColor }}
                      onClick={() => {
                        setActiveStatus(data.status);
                      }}
                    >
                      <h2
                        className="rateContract__heading text-center"
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

          </div>
          {pieChartData.length > 0 && (
            <div className="rateContract__filterSection--chart">
              <PieChart data={pieChartData?.filter(dt => dt?.name !== "All" || dt?.status !== "0")} />
            </div>
          )}
        </div>
      </ServiceNavbar>
      <div>
        <DataTable
          masterName={"Rate Contract"}
          ref={dataTableRef}
          columns={columns}
          data={tableData}
          handleRowSelect={handleRowSelect}
        />
      </div>
    </>
  );
}

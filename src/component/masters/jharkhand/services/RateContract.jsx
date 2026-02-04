import { useEffect, useRef, useState } from "react";
import ServiceNavbar from "../../../commons/ServiceNavbar";
import { ComboDropDown } from "../../../commons/FormElements";
import DataTable from "../../../commons/Datatable";
import {
  getContractTypes,
  getDrugNames,
  getRateContractList,
  getStoreName,
  getSuppliers,
} from "../../../../api/Jharkhand/api/rateContractAPI";
import { useDispatch } from "react-redux";
import { showPopup } from "../../../../features/commons/popupSlice";
import RateContractAddForm from "./RateContract/RateContractAdd";
import RateContractTenderForm from "./RateContract/RateContractTenderForm";
import {
  setContractDetails,
  setDrugsList,
  setStore,
  setSupplierData,
} from "../../../../features/Ratecontract/rateContractJHKSlice";

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
  { label: "Active", value: "1" },
  { label: "Cancel", value: "0" },
];

export default function RateContractJH() {
  const buttonDataset = [
    { label: "Add", onClick: handleRateContractAdd },
    { label: "Tender Details", onClick: handleTenderDetails },
  ];

  // const { contractDetails } = useSelector((state) => state.rateContractJHK);
  const dispatch = useDispatch();

  const [contractTypes, setContractTypes] = useState([]);
  const [selectedContractType, setSelectedContractType] = useState();

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState();

  const [drugList, setDrugList] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState();

  const [storeName, setStoreName] = useState();
  const [stores, setStores] = useState([]);

  const [userSelection, setUserSelection] = useState("");

  const [activeStatus, setActiveStatus] = useState("1");

  const [tableData, setTableData] = useState([]);

  const componentsList = [
    { mappingKey: "Tender", componentName: RateContractTenderForm },
    { mappingKey: "add", componentName: RateContractAddForm },
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
        data?.data.forEach((element) => {
          const supplierID = element.id.split("^").at(0);
          const obj = {
            label: element.name,
            value: supplierID,
          };
          supplierList.push(obj);
        });
        setSuppliers(supplierList);
        dispatch(setSupplierData(supplierList));
        setSelectedSupplier(supplierList.at(0).value);
      } catch (err) {
        console.log("Failed to fetch data.", err);
      }
    };

    const loadDruglist = async () => {
      try {
        let drugList = [{ label: "All", value: "0" }];
        const data = await getDrugNames(998);
        data?.data.forEach((element) => {
          const drugId = element.brandid_itemid.split("^").at(0);
          const obj = {
            label: element.item_name,
            value: drugId,
          };
          drugList.push(obj);
        });

        setDrugList(drugList);
        setSelectedDrug(drugList.at(0).value);
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
    const timeout = setTimeout(() => {
      if (!selectedSupplier || !selectedContractType) return;

      getRateContractList(
        998,
        selectedSupplier,
        selectedContractType,
        activeStatus,
        storeName,
        selectedDrug
      ).then((data) => setTableData(data?.data || []));
    }, 400); // wait 400ms after last change

    return () => clearTimeout(timeout);
  }, [
    selectedSupplier,
    selectedContractType,
    activeStatus,
    selectedDrug,
    storeName,
  ]);

  return (
    <>
      <ServiceNavbar
        buttons={buttonDataset}
        heading={"Rate Contract"}
        userSelection={userSelection}
        componentsList={componentsList}
        isLargeDataset={true}
      >
        <div className="rateContract__filterSection">
          <div className="rateContract__filterSection--filters">
            <div className="rateContract__container">
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
          </div>
        </div>
      </ServiceNavbar>
      <div>
        <DataTable
          masterName={"Rate Contract"}
          ref={dataTableRef}
          columns={columns}
          data={tableData}
        />
      </div>
    </>
  );
}

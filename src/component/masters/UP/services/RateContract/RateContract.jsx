import { useEffect, useState } from "react";
import { ComboDropDown } from "../../../../commons/FormElements";
import { 
  getContractType, 
  getDrugName, 
  getManufacturers, 
  getStoreName, // Check API export name in your file
  getRcTableData 
} from "../../../../../api/UP/rateContractAPI";

const RateContract = () => {
  // --- Local States for Dropdowns ---
  const [storeDrpData, setStoreDrpData] = useState([]);
  const [contracteDrpData, setContractDrpData] = useState([]);
  const [supplierDrpData, setSupplierDrpData] = useState([]);
  const [drugDrpData, setDrugDrpData] = useState([]);

  // --- States for Selected Values (4 Parameters) ---
  const [storeId, setStoreId] = useState('');
  const [contractId, setContractId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [itemId, setItemId] = useState('');

  // --- Table States ---
  const [tableData, setTableData] = useState([]);
  const [displayTable, setDisplayTable] = useState(false);

  // 1. Fetch Store Data
  const getStoreComboData = () => {
    getStoreName(998)?.then((res) => {
      if (res?.status === 1) {
        setStoreDrpData(res.data.map(dt => ({ value: dt.storeId, label: dt.storeName })));
      }
    });
  };

  // 2. Fetch Contract Type Data
  const getContractComboData = () => {
    getContractType(998)?.then((res) => {
      if (res?.status === 1) {
        setContractDrpData(res.data.map(dt => ({ value: dt.sstnumContracttypeId, label: dt.sststrContracttypeName })));
      }
    });
  };

  // 3. Fetch Supplier Data
  const getSupplierComboData = () => {
    getManufacturers(998)?.then((res) => {
      if (res?.status === 1) {
        setSupplierDrpData(res.data.map(dt => ({ value: dt.supplierId, label: dt.supplierName })));
      }
    });
  };

  // 4. Fetch Item/Drug Data
  const getIteamComboData = () => {
    getDrugName(998)?.then((res) => {
      if (res?.status === 1) {
        setDrugDrpData(res.data.map(dt => ({ value: dt.itemBrandId, label: dt.itemName })));
      }
    });
  };

  // --- Handle List Load (Using your 4 Parameters) ---
  const handleRateContractDisplay = async () => {
    setDisplayTable(true);

    const queryData = {
      hstnumStoreId: storeId,        // Param 1
      hstnumContractTypeId: contractId, // Param 2
      hstnumSupplierId: supplierId,  // Param 3
      hstnumItembrandId: itemId,     // Param 4
      hstnumHospitalCode: 998,
      gnumIsvalid: 1 // Default valid state
    };

    console.log("Fetching Table Data with:", queryData);
    try {
      const data = await getRcTableData(JSON.stringify(queryData));
      setTableData(data);
    } catch (error) {
      console.error("Table Load Error:", error);
    }
  };

  useEffect(() => {
    getSupplierComboData();
    getStoreComboData();
    getContractComboData();
    getIteamComboData();
  }, []);

  return (
    <div className="rateContract__wrapper">
      <div className="rateContract__container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <ComboDropDown
          options={storeDrpData}
          onChange={(e) => setStoreId(e.target.value)}
          value={storeId}
          label={"Store Name"}
        />
        <ComboDropDown
          options={contracteDrpData}
          onChange={(e) => setContractId(e.target.value)}
          value={contractId}
          label={"Contract Type"}
        />
        <ComboDropDown
          options={supplierDrpData}
          onChange={(e) => setSupplierId(e.target.value)}
          value={supplierId}
          label={"Supplier Name"}
        />
        <ComboDropDown
          options={drugDrpData}
          onChange={(e) => setItemId(e.target.value)}
          value={itemId}
          label={"Item Name"}
        />
        
        <button 
          className="btn btn-primary" 
          onClick={handleRateContractDisplay}
          style={{ marginTop: '25px' }}
        >
          Search List
        </button>
      </div>

      {/* Table Render Section */}
      {displayTable && (
        <div style={{ marginTop: '20px' }}>
          {/* Yahan apna DataTable component rakhein */}
          <pre>{JSON.stringify(tableData, null, 2)}</pre> 
        </div>
      )}
    </div>
  );
};

export default RateContract;
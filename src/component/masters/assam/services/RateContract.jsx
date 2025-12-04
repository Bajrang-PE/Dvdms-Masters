import { useEffect, useRef, useState } from 'react';
import {
  ComboDropDown,
  InputField,
  RadioButton,
} from '../../../commons/FormElements';
import ServiceNavbar from '../../../commons/ServiceNavbar';
import {
  getBudgetClasses,
  getContractTypes,
  getDrugNames,
  getManufacturers,
} from '../../../../api/Assam/services/rateContractAPI';
import PieChart from '../../../commons/PieChart';
import DataTable from '../../../commons/Datatable';
import { AnimatePresence, motion } from 'framer-motion';
// import '../../../../sass/pages/_rateContract.scss';

const statusData = [
  {
    name: 'Active',
    y: 45,
    datapointColor:
      'linear-gradient(90deg, rgba(54, 187, 174, 1), #319795, #2c7a7b)', // lighter blue → royal → dark navy
  },
  {
    name: 'Cancel',
    y: 10,
    datapointColor: 'linear-gradient(90deg, #fdc554ff, #d89536ff, #d3871cff)', // soft gold → gold → deep amber
  },
  {
    name: 'Expired',
    y: 15,
    datapointColor: 'linear-gradient(90deg, #d45d63ff, #dc3545, #b6202fff)', // coral → red → dark red
  },
  {
    name: 'Debarred',
    y: 20,
    datapointColor: 'linear-gradient(90deg, #997f64ff, #816749, #5b4431)', // bright green → mid green → dark green
  },
  {
    name: 'Blacklist',
    y: 10,
    datapointColor: 'linear-gradient(90deg, #55677eff, #475569, #334155)', // medium grey → dark grey → almost black
  },
];

const data = [
  {
    a: '20002222',
    b: 'Abbot',
    c: 'sdsad',
    d: 'asdasd',
    e: 'dasd',
    f: 'dasdfasd',
    g: 'wetgewrgbv',
    h: 'adr4ewfd',
    i: 'rqafs',
    j: 'adfe',
    k: 'rqerfa',
    l: 'wtefed',
  },
  {
    a: '20002222',
    b: 'Abbot',
    c: 'sdsad',
    d: 'asdasd',
    e: 'dasd',
    f: 'dasdfasd',
    g: 'wetgewrgbv',
    h: 'adr4ewfd',
    i: 'rqafs',
    j: 'adfe',
    k: 'rqerfa',
    l: 'wtefed',
  },
];

const columns = [
  { header: 'RC Number', field: 'a' },
  { header: 'Manufacturer Name', field: 'b' },
  { header: 'Item Name', field: 'gstrIfscCode' },
  { header: 'Rate/Unit (In Package Unit Rs)', field: 'c' },
  { header: 'Tax%', field: 'dd' },
  {
    header: 'Rate/Unit (In Package Unit With Tax%)',
    field: 'e',
  },
  { header: 'Rate/Unit (In Number)', field: 'f' },
  { header: 'Rate/Unit (In Number with tax%)', field: 'g' },
  { header: 'Contract From', field: 'h' },
  { header: 'Contract To', field: 'i' },
  { header: 'Tender Number/Source Name', field: 'j' },
  { header: 'Level Type', field: 'k' },
  { header: 'Action', field: '' },
];

const radioOptions = [
  { label: 'All', value: 'all' },
  { label: 'Text Input', value: 'text' },
];

const fadeSlideVariant = {
  hidden: { opacity: 0, height: 0, overflow: 'hidden' },
  visible: {
    opacity: 1,
    height: 'auto',
    overflow: 'hidden',
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
    transition: { duration: 0.2 },
  },
};

export default function RateContract() {
  const buttonDataset = [
    { label: 'Tender', onClick: handleTenderAdd },
    { label: 'Rate Contract', onClick: handleRateContractAdd },
  ];

  const componentsList = [{ mappingKey: 'Add', componentName: null }];

  const [manufName, setManufName] = useState();
  const [manufacturers, setManufacturers] = useState([]);
  const [budgetClasses, setBudgetClasses] = useState();
  const [itemName, setItemName] = useState();
  const [drugList, setDrugList] = useState([]);

  const [budgetClass, setSelectedBudgetClass] = useState(10);
  const [contractTypes, setContractTypes] = useState([]);

  const [showRadio, setShowRadio] = useState(false);
  const [radioOption, setRadioOption] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  //refs
  const dataTableRef = useRef();

  function handleTenderAdd() {
    console.log('Tender');
  }

  function handleRateContractAdd() {
    console.log('Rate Contract');
  }

  // Handle Search
  const handleSearch = event => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  //effects
  useEffect(() => {
    const loadManufacturers = async () => {
      try {
        const data = await getManufacturers(20000001);
        let manufacturerOptions = [];
        data.forEach(element => {
          const obj = {
            label: element.hststr_supplier_name,
            value: element.hstnum_supplier_id,
          };
          manufacturerOptions.push(obj);
        });

        setManufacturers(manufacturerOptions);
      } catch (err) {
        console.log('Failed to fetch data.', err);
      }
    };

    const loadBudgetClasses = async () => {
      try {
        let budgetClassOptions = [];
        const data = await getBudgetClasses(998);
        data.forEach(element => {
          const obj = {
            label: element.sststr_budget_class_name,
            value: element.sstnum_budget_class_id,
          };
          budgetClassOptions.push(obj);
        });
        setBudgetClasses(budgetClassOptions);
      } catch (err) {
        console.log('Failed to fetch data.', err);
      }
    };

    const loadContractTypes = async () => {
      try {
        const data = await getContractTypes(998);
        let contractTypeOptions = [];
        data.forEach(element => {
          const obj = {
            label: element.sststr_contracttype_name,
            value: element.sststr_contracttype_id,
          };
          contractTypeOptions.push(obj);
        });
        setContractTypes(contractTypeOptions);
      } catch (err) {
        console.log('Failed to fetch data.', err);
      }
    };

    const loadDrugs = async () => {
      try {
        const data = await getDrugNames(998, 99800001, 10);
        console.log(data);
        let drugNames = [];
        data.forEach(element => {
          const obj = {
            label: element.hststr_item_name,
            value: element.hstnum_item_id,
          };
          drugNames.push(obj);
        });
        setDrugList(drugNames);
      } catch (err) {
        console.log('Failed to fetch data.', err);
      }
    };

    loadDrugs();
    loadContractTypes();
    loadManufacturers();
    loadBudgetClasses();
  }, []);

  return (
    <>
      <ServiceNavbar
        buttons={buttonDataset}
        heading={'Rate Contract'}
        componentsList={componentsList}
        isLargeDataset={true}
      >
        <div className="rateContract__filterSection">
          <div className="rateContract__filterSection--filters">
            <div className="rateContract__container">
              <ComboDropDown
                options={contractTypes}
                onChange={e => setManufName(e.target.value)}
                value={manufName}
                label={'Contract Type'}
                addOnClass="rateContract__container--dropdown"
              />
              <ComboDropDown
                options={budgetClasses}
                onChange={e => setSelectedBudgetClass(e.target.value)}
                value={budgetClass}
                label={'Budget Class'}
                addOnClass="rateContract__container--dropdown"
              />
              <ComboDropDown
                options={manufacturers}
                onChange={e => setManufName(e.target.value)}
                value={manufName}
                label={'Manufacturer Name'}
                addOnClass="rateContract__container--dropdown"
              />
              <ComboDropDown
                options={drugList}
                onChange={e => setItemName(e.target.value)}
                value={itemName}
                label={'Item Name'}
                addOnClass="rateContract__container--dropdown"
              />
              {/* <ComboDropDown
        options={contractTypes}
        onChange={e => setSelectedContractType(e.target.value)}
        value={selectedContractType}
        label={'Contract Type'}
        /> */}
            </div>
            <div className="rateContract__status">
              {statusData.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="rateContract__status--container"
                    style={{ backgroundImage: data.datapointColor }}
                    onClick={() => {
                      setShowRadio(true);
                    }}
                  >
                    <h2
                      className="rateContract__heading"
                      style={{ userSelect: 'none' }}
                    >
                      {data.name}
                    </h2>
                  </div>
                );
              })}
            </div>
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
                      style={{ margin: '0' }}
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
                          onChange={e => setRadioOption(e.target.value)}
                          key={index}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rateContract__radioOptions--controls">
                    <AnimatePresence mode="wait">
                      {radioOption === 'text' && (
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
                    <button className="rateContract__radioOptions--controls-btn">
                      Submit
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="rateContract__filterSection--chart">
            <h2
              className="rateContract__heading"
              style={{ textAlign: 'center' }}
            >
              Rate Contract Status Overview
            </h2>
            <PieChart data={statusData} />
          </div>
        </div>
      </ServiceNavbar>
      <div>
        <DataTable
          masterName={'Rate Contract'}
          ref={dataTableRef}
          columns={columns}
          data={data}
        />
      </div>
    </>
  );
}

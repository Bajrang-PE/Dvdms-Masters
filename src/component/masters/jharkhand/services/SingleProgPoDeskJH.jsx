import React, { useEffect, useRef, useState } from 'react'
import ServiceNavbar from '../../../commons/ServiceNavbar';
import { ComboDropDown } from '../../../commons/FormElements';
import DataTable from '../../../commons/Datatable';
import { useDispatch } from 'react-redux';
import { getSinglePoGraphCounts, getSinglePoListData, getSinglePoStoreName } from '../../../../api/Jharkhand/services/SingleProgPoDeskAPI_JH';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faXmark } from '@fortawesome/free-solid-svg-icons';
import { showPopup } from '../../../../features/commons/popupSlice';
import SingleProgPoModifyJH from './SingleProgPoDeskJH/SingleProgPoModifyJH';
import CancelSingleProgPoJH from './SingleProgPoDeskJH/CancelSingleProgPoJH';
import GenerateSingleProgPoJH from './SingleProgPoDeskJH/GenerateSingleProgPoJH';
import PieChart from '../../../commons/PieChart';
import { chartColorArr } from '../../common/StaticData';

const SingleProgPoDeskJH = () => {

  const statusList = [
    { label: "Select", value: "" },
    { label: "Pending", value: "1" },
    { label: "Closed", value: "2" },
    { label: "In Process", value: "3" },
    { label: "Rejected", value: "4" },
    { label: "Cancelled", value: "5" },
    { label: "Auto Cancelled", value: "6" },
    { label: "Forcefully Closed", value: "7" }
  ];

  const SEAT_ID = 14462;
  const dataTableRef = useRef();
  const dispatch = useDispatch();
  const [selectedRowRc, setSelectedRowRc] = useState(null);
  const [userSelection, setUserSelection] = useState("");
  const [tableData, setTableData] = useState([]);
  const [storeName, setStoreName] = useState();
  const [stores, setStores] = useState([]);
  const [activeStatus, setActiveStatus] = useState("");
  const [selectedStore, setSelectedStore] = useState({});
  const [pieChartData, setPieChartData] = useState([]);

  const componentsList = [
    { mappingKey: "Generate", componentName: (props) => (<GenerateSingleProgPoJH store={selectedStore} selectedData={selectedRowRc} actionType={'generate'} />) },
    { mappingKey: "Modify", componentName: (props) => (<SingleProgPoModifyJH store={selectedStore} selectedData={selectedRowRc} actionType={"Modify"} getAllListData={getAllListData} />) },
    { mappingKey: "Cancel", componentName: (props) => (<CancelSingleProgPoJH store={selectedStore} selectedData={selectedRowRc} actionType={"Cancel"} />) },
    { mappingKey: "View", componentName: (props) => (<SingleProgPoModifyJH store={selectedStore} selectedData={selectedRowRc} actionType={"View"} getAllListData={getAllListData} />) },
  ];

  const columns = [
    { header: "PO Prefix", field: "poPrefix" },
    { header: "PO No.", field: "poNoWithType" },
    { header: "PO Date", field: "poDate" },
    { header: "PO Value", field: "poNetAmount" },
    { header: "Supplier Name", field: "supplier" },
    { header: "Drug Name", field: "itemName" },
    ...(activeStatus === "3" ? [{ header: "Supply Status", field: "supplyFlag" }] : [])
  ];

  const buttonDataset = [
    { label: "Generate", onClick: (() => { handlePoGenerate('Generate') }) },
    ...((selectedRowRc?.length > 0 && activeStatus === "1")
      ? [
        { label: "Modify", onClick: (() => { handlePoGenerate('Modify') }), color: "#979203", icon: <FontAwesomeIcon icon={faEdit} className="mr-1" /> },
        { label: "Cancel", onClick: (() => { handlePoGenerate('Cancel') }), color: "#d65104ff", icon: <FontAwesomeIcon icon={faXmark} className="mr-1" /> },
      ]
      : []
    ),
    ...(selectedRowRc?.length > 0 ?
      [
        { label: "View", onClick: (() => { handlePoGenerate('View') }), color: "#038d0eff", icon: <FontAwesomeIcon icon={faEye} className="mr-1" /> }
      ]
      : []
    ),
  ];

  function handlePoGenerate(key) {
    setUserSelection(key);
    dispatch(showPopup());
  }

  const handleRowSelect = (row) => {
    setSelectedRowRc(row);
  }

  const getStoreDrpData = () => {
    getSinglePoStoreName(998, SEAT_ID)?.then((data) => {
      if (data?.status === 1) {
        const drpDt = data?.data?.map((dt) => ({
          value: dt?.hstnum_store_id,
          label: dt?.store_name
        }))
        setStores(drpDt);
        setStoreName(drpDt?.at(0)?.value);
        console.log('drpDt', drpDt)
        setSelectedStore(drpDt?.at(0));
      } else {
        setStores([]);
        setSelectedStore({});
      }
    })
  }
  const getAllListData = () => {
    getSinglePoListData(998, storeName, activeStatus)?.then((data) => {
      if (data?.status === 1) {
        setTableData(data?.data);
      } else {
        setTableData([]);
      }
    })
  }

  const getGraphCounts = (storeId) => {
    getSinglePoGraphCounts(998, storeId)?.then((res) => {
      console.log('res', res)
      if (res?.status === 1) {
        let statusData = [];

        res?.data.forEach((item, index) => {
          const { count, label, status } = item;
          statusData.push({
            name: label,
            y: Number(count),
            status: status,
            datapointColor: chartColorArr[index],
          });
        });
        setPieChartData(statusData);
      } else {
        setPieChartData([]);
      }
    })
  }

  useEffect(() => {
    getStoreDrpData();
  }, [])

  useEffect(() => {
    if (storeName && activeStatus) {
      getAllListData();
    }
  }, [activeStatus])

  useEffect(() => {
    if (storeName) {
      getGraphCounts(storeName);
    }
  }, [storeName])


  return (
    <>
      <ServiceNavbar
        buttons={buttonDataset}
        heading={"Single Program PO Desk"}
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
                  setSelectedStore(stores?.find((dt) => dt?.value == e.target.value))
                }}
                value={storeName}
                label={"Store Name"}
                addOnClass="rateContract__container--dropdown"
              />
              <ComboDropDown
                options={statusList}
                onChange={(e) => setActiveStatus(e.target.value)}
                value={activeStatus}
                label={"PO Status"}
                addOnClass="rateContract__container--dropdown"
              />
            </div>
            {pieChartData.length > 0 && (
              <div className="rateContract__status mb-4">
                {pieChartData?.map((data, index) => {
                  return (
                    <div
                      key={index}
                      className="rateContract__status--container"
                      style={{ backgroundImage: data.datapointColor }}
                      onClick={() => {
                        setActiveStatus(data.status?.toString());
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
              <PieChart data={pieChartData?.filter(dt => dt?.name !== "All" || dt?.status !== "0")} setStatus={setActiveStatus} />
            </div>
          )}
        </div>
      </ServiceNavbar>

      <div>
        <DataTable
          masterName={"Single Program PO Desk"}
          ref={dataTableRef}
          columns={columns}
          data={tableData}
          handleRowSelect={handleRowSelect}
        />
      </div>
    </>
  );
}

export default SingleProgPoDeskJH

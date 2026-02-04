import React, { useEffect, useRef, useState } from 'react'
import ServiceNavbar from '../../../commons/ServiceNavbar';
import { ComboDropDown } from '../../../commons/FormElements';
import DataTable from '../../../commons/Datatable';
import { setStore } from '../../../../features/Ratecontract/rateContractJHKSlice';
import { useDispatch } from 'react-redux';
import { getSinglePoListData, getSinglePoStoreName } from '../../../../api/Jharkhand/services/SingleProgPoDeskAPI_JH';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faXmark } from '@fortawesome/free-solid-svg-icons';
import { showPopup } from '../../../../features/commons/popupSlice';
import SingleProgPoModifyJH from './SingleProgPoDeskJH/SingleProgPoModifyJH';
import CancelSingleProgPoJH from './SingleProgPoDeskJH/CancelSingleProgPoJH';
import GenerateSingleProgPoJH from './SingleProgPoDeskJH/GenerateSingleProgPoJH';

const SingleProgPoDeskJH = () => {

  const statusList = [
    // { label: "All", value: "0" },
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
  const [activeStatus, setActiveStatus] = useState("1");

  const componentsList = [
    { mappingKey: "Generate", componentName: (props) => (<GenerateSingleProgPoJH selectedData={selectedRowRc} actionType={"Generate"} />) },
    { mappingKey: "Modify", componentName: (props) => (<SingleProgPoModifyJH selectedData={selectedRowRc} actionType={"Modify"} getAllListData={getAllListData}/>) },
    { mappingKey: "Cancel", componentName: (props) => (<CancelSingleProgPoJH selectedData={selectedRowRc} actionType={"Cancel"} />) },
    { mappingKey: "View", componentName: (props) => (<SingleProgPoModifyJH selectedData={selectedRowRc} actionType={"View"} getAllListData={getAllListData}/>) },
  ];

  const columns = [
    { header: "PO Prefix", field: "poPrefix" },
    { header: "PO No.", field: "poNo" },
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
        dispatch(setStore(drpDt?.at(0)));
      } else {
        setStores([]);
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

  useEffect(() => {
    getStoreDrpData();
  }, [])

  useEffect(() => {
    if (storeName && activeStatus) {
      getAllListData();
    }
  }, [storeName, activeStatus])

  return (
    <>
      <ServiceNavbar
        buttons={buttonDataset}
        heading={"Single Program PO Desk"}
        userSelection={userSelection}
        componentsList={componentsList}
        isLargeDataset={true}
        filtersVisibleOnLoad={false}
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
                options={statusList}
                onChange={(e) => setActiveStatus(e.target.value)}
                value={activeStatus}
                label={"PO Status"}
                addOnClass="rateContract__container--dropdown"
              />
            </div>
          </div>
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

import React, { useEffect, useReducer, useState } from 'react'
import DataTable from '../../../../commons/Datatable';
import ReactDataTable from '../../../../commons/ReactDataTable';
import InputBox from '../../../../commons/InputBox';
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { ComboDropDown, DatePickerComponent, InputField } from '../../../../commons/FormElements';
import RichTextEditor from '../../../../commons/RichTextEditor';
import { getJHPoDwhPoDetails, getJHPoFundingSrcCombo, getJHPoIndentNumberCombo, getJHPoProgramCombo, getJHPoSupplierValues, getPoTypeCombo, getSinglePoComponentDetails, getSinglePoDwhPoDetails, getSinglePoItemCmbData, getSinglePoTestingData, modifySinglePoDwhPoModifySave } from '../../../../../api/Jharkhand/services/SingleProgPoDeskAPI_JH';
import SelectBox from '../../../../commons/SelectBox';
import { convertToISODate, parseDate } from '../../../../commons/utilFunctions';

const GenerateSingleProgPoJH = (props) => {
  const { store, selectedData, actionType } = props;

  const { value: storeID, label: storeName } = store;

  const initialState = {
    //PO detail
    poType: "",
    poGenPeriod: "2025 - 2026",
    poDate: new Date(),
    poNumber: "",
    supplierName: "",
    drugName: "",
    itemName: "",
    itemCategory: "",
    itemSpecification: "",
    programmeName: "",
    fundingSource: "",
    budgetAvail: "",
    gstNo: "",

    //Purchase Details
    poRef: "",
    totalPoCost: 0,
    pCommitteeMeetDate: "",
    pCommitteeMeetCopy: "",
    remarks: "",
    rateUnit: "",
    deliveryDays: "60",

    //component details
    tAndc: "",
    tAndcAccept: false,
    indentPoNo: "",
    quotationDate: "",
    quotationNo: ""
  };

  function addFormReducer(state, action) {
    switch (action.type) {
      case "SET_FIELD":
        return { ...state, [action.field]: action.value };
      case "SET_FIELDS":
        return { ...state, ...action.payload };
      case "RESET_FORM":
        return initialState;
      default:
        return state;
    }
  }

  const SEAT_ID = 14462;
  const dispatch = useDispatch();
  const [formState, dispatcher] = useReducer(addFormReducer, initialState);
  const [rcDetailsList, setRcDetailsList] = useState([]);
  const [poDetailsList, setPoDetailsList] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState({});
  const [supplierList, setSupplierList] = useState([]);
  const [unitDrpData, setUnitDrpData] = useState([]);

  const [totalOrderQuantity, setTotalOrderQuantity] = useState(0);
  const [componentDetails, setComponentDetails] = useState([]);

  const [programNameList, setProgramNameList] = useState([]);
  const [fundSourceList, setFundSourceList] = useState([]);

  const [drugList, setDrugList] = useState([]);
  const [poTypeList, setPoTypeList] = useState([]);
  const [indentPoNoList, setIndentPoNoList] = useState([]);

  const [errors, setErrors] = useState({
    fundingSourceErr: "", programmeNameErr: "", drugNameErr: ""
  })

  const handleReset = () => {
    dispatcher({ type: 'RESET_FORM' });
  }

  function handleClose() {
    dispatch(hidePopup());
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errname = name + "Err";
    dispatcher({ type: "SET_FIELD", field: name, value });
    setErrors({ ...errors, [errname]: "" });
  };

  const handleDateChange = (value, fieldName) => {
    const errname = fieldName + "Err";
    const formattedDate = value
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");

    dispatcher({
      type: "SET_FIELD",
      field: fieldName,
      value: formattedDate,
    });
  };

  const handleRowSelect = (row, index) => {
    const upRow = { ...row, "index": index }
    setSelectedRowId(upRow);
    setOrderQuantity({});
    setTotalOrderQuantity(0);
    dispatcher({ type: "SET_FIELD", field: "totalPoCost", value: 0 });

  };

  const handleQuantityChange = (rowId, value) => {
    if (selectedRowId) {
      setOrderQuantity(prev => ({
        ...prev, [rowId]: value
      }));
    } else {
      ToastAlert('Please Select RateContract before Entering Quantity', 'error')
    }
  };

  const getPoTypeDrpDt = (storeId) => {

    getPoTypeCombo(998, storeId, 10)?.then((res) => {
      let potype = [];
      if (res?.status === 1) {
        res?.data.forEach((element) => {
          const obj = {
            label: element.name,
            value: element.typeid_authid,
          };
          potype.push(obj);
        });
        setPoTypeList(potype);
        dispatcher({ type: "SET_FIELD", field: 'poType', value: potype.at(0)?.value });
      } else {
        setPoTypeList([]);
      }
    })
  }

  const getPoDrugNameDrpDt = (authTyp) => {
    getSinglePoItemCmbData(998, authTyp)?.then((res) => {
      let drugs = [];
      if (res?.status === 1) {
        res?.data.forEach((element) => {
          const obj = {
            label: element.item_name,
            value: element.item_id,
          };
          drugs.push(obj);
        });
        setDrugList(drugs);
      } else {
        setDrugList([]);
      }
    })
  }

  const getPoProgrammeNameDrpDt = (itemId, year) => {
    getJHPoProgramCombo(998, storeID, itemId, year)?.then((res) => {
      let programs = [];
      if (res?.status === 1) {
        res?.data.forEach((element) => {
          const obj = {
            label: element.display,
            value: element.value,
          };
          programs.push(obj);
        });
        setProgramNameList(programs);
      } else {
        setProgramNameList([]);
      }
    })
  }

  const getPoFundingSourceDrpDt = (storeId, drugClass, programId, year) => {
    getJHPoFundingSrcCombo(998, storeId, drugClass, programId, year)?.then((res) => {
      let fundsrc = [];
      if (res?.status === 1) {
        res?.data.forEach((element) => {
          const obj = {
            label: element.display,
            value: element.value,
          };
          fundsrc.push(obj);
        });
        setFundSourceList(fundsrc);
      } else {
        setFundSourceList([]);
      }
    })
  }

  const getSupplierValuesOnFundingSrc = (fundId) => {
    const val = {
      "gnumHospitalCode": 998,
      "hstnumStoreId": parseInt(storeID),
      "strIndentPeriodValue": formState?.poGenPeriod,
      "strComboPOTypeId": formState?.poType?.split("^")[0],
      "hstdtPoDate": convertToISODate(parseDate(formState.poDate)),
      "hstnumItembrandId": parseInt(formState?.drugName?.split('^')[1]),
      "programmeId": parseInt(formState.programmeName),
      "fundingSourceId": parseInt(fundId),
      "hstnumItemId": parseInt(formState?.drugName?.split('^')[0]),
      "strIndentCellPOCombo": "",
      "hstnumSupplierId": 0,
      "hstnumPoNo": 0,
      "strContractType": formState?.poType
    }

    getJHPoSupplierValues(val)?.then((res) => {
      console.log('res', res)
      if (res?.status === 1) {

      } else {
      }
    })
  }

  const getDwhPoDetailsOnGo = () => {
    const val = {
      "gnumHospitalCode": 998,
      "hstnumStoreId": "",
      "strIndentPeriodValue": "",
      "strComboPOTypeId": "",
      "hstdtPoDate": "",
      "hstnumItembrandId": "",
      "programmeId": "",
      "strIndentCellPOCombo": "",
      "hstnumSupplierId": "",
      "hstnumPoNo": "",
      "fundingSourceId": "",
      "strContractType": ""
    }
    getJHPoDwhPoDetails(val)?.then((res) => {
      if (res?.status === 1) {

      } else {
      }
    })
  }

  const getIndentNoDrpData = () => {
    getJHPoIndentNumberCombo()?.then((res) => {
      console.log('res', res)
      if (res?.status === 1) {
        const dt = res?.data?.map((item) => ({
          value: item?.value,
          label: item?.display
        }))
        setIndentPoNoList(dt);
      } else {
        setIndentPoNoList([]);
      }
    })
  }

  useEffect(() => {
    if (formState?.poType && formState?.poType !== "223^5") {
      getPoDrugNameDrpDt(formState?.poType?.split("^")[1]);
    } else if (formState?.poType && formState?.poType === "223^5") {
      getIndentNoDrpData();
      setDrugList([]);
    }
  }, [formState?.poType])

  useEffect(() => {
    if (selectedData?.length > 0 && storeID) {
      // getAllPoDataTesting(selectedData[0]?.poNo, storeID, selectedData[0]?.poDate)
      getPoComponentDetails(selectedData[0]?.poTypeId, 3, storeID, selectedData[0]?.poNo)
    }
  }, [selectedData])

  useEffect(() => {
    if (storeID) {
      getPoTypeDrpDt(storeID)
    }
  }, [storeID])


  const getPoComponentDetails = (poType, mode, storeId, poNo) => {
    getSinglePoComponentDetails(998, poType, mode, storeId, poNo)?.then((res) => {
      if (res?.status === 1) {
        const allData = res?.data?.map((dt) => ({ ...dt, isCheck: false }))
        setComponentDetails(allData);
      } else {
        setComponentDetails([]);
      }
    })
  }

  const handleTotalQuantity = () => {

    const quantities = Object.values(orderQuantity || {});
    const totalQuantity = quantities.reduce(
      (sum, q) => sum + Number(q || 0),
      0
    );

    setTotalOrderQuantity(totalQuantity);

    const rate = parseFloat(selectedRowId?.ratePerUnit?.split('/')[0]) || 0;
    const tax = parseFloat(selectedRowId?.strTax?.split('%')[0]) || 0;
    const unit = Number(selectedRowId?.numBaseUnitvalue) || 1;
    const discount = Number(selectedRowId?.numDiscount) || 0;

    const baseRate = rate / unit;
    const discountedRate = baseRate - (baseRate * discount) / 100;
    const finalRate = discountedRate + (discountedRate * tax) / 100;
    const totalCost = totalQuantity * finalRate;

    dispatcher({
      type: "SET_FIELD",
      field: "totalPoCost",
      value: totalCost.toFixed(2)
    });
  };

  const getAllRateChange = (ratePerUnit, unitVal, numDiscount, strTax) => {
    const rate = Number(ratePerUnit);
    const unit = Number(unitVal);
    const discount = Number(numDiscount);
    const tax = Number(strTax);

    const baseRate = rate / unit;

    const discountedRate = baseRate - (baseRate * discount) / 100;

    const rateWithTax = discountedRate + (discountedRate * tax) / 100;

    return rateWithTax.toFixed(4);
  };

  const saveModifyPoDetails = () => {
    const y = new Date().getFullYear();
    const val = {
      "gnumHospitalCode": 998,
      "hstnumStoreId": parseInt(storeID),
      "sstnumItemCatNo": parseInt(formState?.drugName?.split('^')[5]),
      "strComboPOTypeId": formState?.poType,
      "hstnumCurrencyId": 1,
      "sstnumPurchaseSourceId": 1,
      "hstnumSupplierId": selectedRowId?.numSupplierId,
      // "hstdtPoDate": "2026-03-11T00:00:00",
      "hstdtFinancialStartDate": `${y - 1}-04-01T00:00:00`,//
      "hstdtFinancialEndDate": `${y}-03-31T00:00:00`,//
      "gstrPoRemarks": formState?.remarks,
      "gnumSeatid": SEAT_ID,
      // "hstnumTax": 12.5,
      // "hststrVerifyBy": "admin",
      "hstnumRcId": selectedRowId?.hstnumRcId,
      "sststrPoPrefixNo": formState?.poRef,
      "financialYear": formState?.poGenPeriod,
      "hstnumProgramId": parseInt(formState?.programmeName),
      "hstnumFundingSourceId": parseInt(formState?.fundingSource),
      "items": [
        {
          "hstnumScheduleNo": 1,
          "hstnumManufId": selectedRowId?.numSupplierId,
          "hstnumRate": Number(selectedRowId?.ratePerUnit?.split('/')[0]) || 0,
          "hstnumRateUnitid": selectedRowId?.numRateUnitid,
          "hstnumOrderQty": totalOrderQuantity,
          "hstnumOrderQty2": 0,
          "hstnumOrderQty3": 0,
          "hstnumOrderQty4": 0,
          "gstrRemarks": formState?.remarks,
          "hstnumItemTax": Number(selectedRowId?.strTax?.split('%')[0]) || 0,
          "hstnumItemMake": 0,
          "hstnumDeliveryLocation": parseInt(storeID),
          "hstnumTotDemandedQty": 0,
          "hstnumTotOrderedQty": 0,
          "hstnumTotSuppliedQty": 0,
          "hstnumTotIssuedQty": 0,
          "hstnumTotPipelineQty": 0,
          "hstnumTotInhandQty": 0,
          "hstnumTotQuarantineQty": 0,
          "hstnumTotSubstrInhandQty": 0,
          "hstnumReorderValue": 0.0,
          "hstnumItemId": parseInt(formState?.drugName?.split('^')[1]),
          "hstnumItemBrandId": parseInt(formState?.drugName?.split('^')[0]),
          "strDDeliveryDays": formState?.deliveryDays,
          "strDDeliveryDays2": "0",
          "strDDeliveryDays3": "0",
          "strDDeliveryDays4": "0"
        }
      ]
    }

    addPoHpPODetails(val)?.then((data) => {
      if (data?.status === 1) {
        alert("Po Modified successfully");
      } else {
        alert('failed');
      }
    })
  }

  const handleModifyPo = () => {
    let isValid = true;
    if (!orderQuantity || Object.keys(orderQuantity).length === 0) {
      ToastAlert('Please enter order quantity', 'error');
      isValid = false;
    }

    if (!selectedRowId || Object.keys(selectedRowId).length === 0) {
      ToastAlert('Please select RC details', 'error');
      isValid = false;
    }

    if (!formState?.remarks?.trim()) {
      ToastAlert('Please enter remarks', 'error');
      isValid = false;
    }
    if (isValid) {
      saveModifyPoDetails();
    }
  }

  const handleComponentChange = (index, name, e) => {
    const value =
      name === 'isCheck' ? e.target.checked : e;
    setComponentDetails(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  const getRcDetailsListData = () => {
    getHpRcListData(998, formState?.drugName?.split('^')[0])?.then((res) => {
      if (res?.status === 1) {
        const apiData = res?.data?.content || [];

        const nonRcRow = {
          strContractType: "Non-RC",
          strSupplierName: "",
          strLevelTypeName: "-",
          ratePerUnit: "",
          numDiscount: "0",
          strTax: "0",
          rate: "0",
          numBaseUnitvalue: "",
          totalRate: "",
          discountedRate: "",
          isManual: true,
          unit: ""
        };

        setRcDetailsList([...apiData, nonRcRow]);
        const poDt = [{ storeName: storeName, anualDmdQty: 0, QtyPipeline: 0, currentStock: 0, reorderLevel: 0, suggestedQty: 10000, orderQty: 0 }]
        setPoDetailsList(poDt)
      } else {
        setRcDetailsList([]);
      }
    })
  }

  const handleManualChange = (field, value) => {
    if (field === "unit") {
      const upRow = { ...selectedRowId, [field]: value, numBaseUnitvalue: value?.split('^')[1] }
      setSelectedRowId(upRow);
    } else {
      const upRow = { ...selectedRowId, [field]: value }
      setSelectedRowId(upRow);
    }
  };

  const handleAllRateChange = () => {
    const rate = parseFloat(selectedRowId?.ratePerUnit);
    const unit = parseFloat(selectedRowId?.numBaseUnitvalue);
    const discount = parseFloat(selectedRowId?.numDiscount);
    const tax = parseFloat(selectedRowId?.strTax);


    const baseRate = rate / unit;
    const discountedRate = baseRate - (baseRate * discount) / 100;
    const totalRate = discountedRate + (discountedRate * tax) / 100;

    const upRow = {
      ...selectedRowId,
      discountedRate: discountedRate,
      totalRate: totalRate,
    }
    setSelectedRowId(upRow);
  };

  const getSupplierDrpDt = () => {
    getCommonHpSupplierCombo(998)?.then((res) => {
      if (res?.status === 1) {
        const drpDt = res?.data?.map((dt) => ({
          value: dt?.value,
          label: dt?.display,
        }));
        setSupplierList(drpDt);
      } else {
        setSupplierList([]);
      }
    })
  }

  const getUnitDrpDt = () => {
    getCommonHpUnitCombo(998)?.then((res) => {
      if (res?.status === 1) {
        const drpDt = res?.data?.map((dt) => ({
          value: dt?.value,
          label: dt?.display,
        }));
        setUnitDrpData(drpDt);
        setSelectedRowId({ ...selectedRowId, 'unit': drpDt?.at(0)?.value })
      } else {
        setUnitDrpData([]);
      }
    });
  }

  const handleGoButtonClick = () => {
    let isValid = true;

    if (!formState?.drugName?.trim()) {
      setErrors((prev => ({ ...prev, 'drugNameErr': "Please select drug name!" })));
      isValid = false;
    }

    if (!formState?.programmeName?.trim()) {
      setErrors((prev => ({ ...prev, 'programmeNameErr': "Please select programme name!" })));
      isValid = false;
    }

    if (!formState?.fundingSource?.trim()) {
      setErrors((prev => ({ ...prev, 'fundingSourceErr': "Please select funding source!" })));
      isValid = false;
    }

    if (isValid) {
      getRcDetailsListData();
      getUnitDrpDt();
      getSupplierDrpDt();
    }
  }

  const poDetailsCols = [

    {
      name: (<span>Store Name</span>),
      selector: row => row?.storeName,
      sortable: true,
      wrap: true,
      // width: "20%"
    },
    {
      name: (<span>Annual Demanded Quantity</span>),
      selector: row => row?.anualDmdQty,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Quantity. In Pipeline(Transit)</span>),
      selector: row => row?.QtyPipeline,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Current Stock</span>),
      selector: row => row?.currentStock,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Reorder Level</span>),
      selector: row => row?.reorderLevel,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Suggested Qty.</span>),
      selector: row => row?.suggestedQty,
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>*Order Quantity(No.)</span>),
      cell: (row, index) =>
        <div style={{ position: 'absolute', top: 3, left: 0 }}>
          <InputBox
            id="orderQuantiy"
            className="bg-[#d2d0c6]"
            type="text"
            name={"orderQuantiy"}
            placeholder=""
            value={orderQuantity[index] || ""}
            // disabled={selectedRowId?.index !== index}
            onChange={(e) => { handleQuantityChange(index, e?.target?.value); }}
            onBlur={handleTotalQuantity}
          />

        </div>,
      sortable: false,
    },
  ]

  const rcDetailsColms = [
    {
      name: <input
        type="checkbox"
        disabled={true}
        className="form-check-input log-select text-start"
      />,
      cell: (row, index) =>
        <div style={{ position: 'absolute', top: 4, left: 10 }}>
          <span className="btn btn-sm text-white px-1 py-0 mr-1" >
            <input
              type="checkbox"
              checked={selectedRowId?.index === index}
              onChange={(e) => { handleRowSelect(row, index) }}
            />
          </span>
        </div>,
      width: "5%"
    },
    {
      name: (<span>Contract Type</span>),
      selector: row => row?.strContractType?.split('^')[0],
      sortable: true,
      wrap: true,
      // width: "20%"
    },
    {
      name: "Supplier",
      cell: (row, index) =>
        row.isManual ? (
          <select
            className="w-full py-1 border ring-gray-500 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 mb-2 mt-1"
            onChange={(e) => handleManualChange("strSupplierName", e.target.value)}
          >
            <option>Select Value</option>
            {supplierList?.map((sup) => (
              <option value={sup.value}>{sup.label}</option>
            ))}
          </select>
        ) : (
          row?.strSupplierName
        ),
    },
    {
      name: (<span>Level Type</span>),
      selector: row => row?.strLevelTypeName,
      sortable: true,
      wrap: true,
    },
    {
      name: "Rate",
      cell: (row, index) =>
        row.isManual ? (
          <div className='row'>
            <InputBox
              id="ratePerUnit"
              className="px-2"
              type="text"
              name={"ratePerUnit"}
              placeholder=""
              inputClass="col-6 p-0 mt-1"
              onChange={(e) => { handleManualChange("ratePerUnit", e?.target?.value); }}
              onBlur={handleAllRateChange}
            />
            <div className='col-6 mb-2 p-0 d-flex mt-1'>
              {/* <div> */}
              <span className='py-1 px-1'>/</span>
              <select
                className="w-full py-1 border ring-gray-500 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 "
                onChange={(e) => { handleManualChange("unit", e.target.value) }}
              >
                <option>Select Value</option>
                {unitDrpData?.map((sup) => (
                  <option value={sup.value}>{sup.label}</option>
                ))}
              </select>
              {/* </div> */}
            </div>

          </div>
        ) : (
          row?.ratePerUnit
        ),
      width: "18%",
      center: "true"
    },
    {
      name: (<span>Discount(%)</span>),
      // selector: row => row?.numDiscount,
      cell: (row, index) =>
        row.isManual ? (
          <div style={{ position: 'absolute', top: 5, left: 10, right: 10 }}>
            <InputBox
              id="numDiscount"
              className=""
              type="text"
              name={"numDiscount"}
              placeholder=""
              value={selectedRowId?.numDiscount}
              // disabled={selectedRowId?.index !== index}
              onChange={(e) => { handleManualChange("numDiscount", e?.target?.value); }}
              onBlur={handleAllRateChange}
            />

          </div>
        ) : (
          row?.numDiscount
        ),
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>Discounted Rate</span>),
      // selector: row => row?.numDiscount,
      cell: (row, index) =>
        row.isManual ? (
          <div style={{ position: 'absolute', top: 5, left: 10, right: 10 }}>
            <InputBox
              id="discountedRate"
              className=""
              type="text"
              name={"discountedRate"}
              placeholder=""
              value={selectedRowId?.discountedRate}
              disabled={true}
            // onChange={(e) => { handleManualChange("discountedRate", e?.target?.value); }}
            // onBlur={handleTotalQuantity}
            />

          </div>
        ) : (
          getAllRateChange(parseFloat(row?.ratePerUnit?.split('/')[0]), row?.numBaseUnitvalue || 1, row?.numDiscount, 0)
        ),
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>GST (%)</span>),
      // selector: row => row?.strTax?.split('%')[0],
      cell: (row, index) =>
        row.isManual ? (
          <div style={{ position: 'absolute', top: 5, left: 10, right: 10 }}>
            <InputBox
              id="strTax"
              className=""
              type="text"
              name={"strTax"}
              placeholder=""
              value={selectedRowId?.strTax}
              // disabled={selectedRowId?.index !== index}
              onChange={(e) => { handleManualChange("strTax", e?.target?.value); }}
              onBlur={handleAllRateChange}
            />
          </div>
        ) : (
          row?.strTax?.split('%')[0]
        ),
      sortable: true,
      wrap: true,
    },
    {
      name: (<span>(₹)Total Rate(One Unit)(With Tax)</span>),
      // selector: row => parseInt(row?.ratePerUnit?.split('/')[0]) * parseInt(row?.strTax?.split('%')[0]) / 100 + parseInt(row?.ratePerUnit?.split('/')[0]),
      cell: (row, index) =>
        row.isManual ? (
          <div style={{ position: 'absolute', top: 5, left: 10, right: 10 }}>
            <InputBox
              id="totalRate"
              className=""
              type="text"
              name={"totalRate"}
              placeholder=""
              value={selectedRowId?.totalRate}
              disabled={true}
            // onChange={(e) => { handleManualChange(index, e?.target?.value); }}
            // onBlur={handleTotalQuantity}
            />
          </div>
        ) : (
          getAllRateChange(parseFloat(row?.ratePerUnit?.split('/')[0]), row?.numBaseUnitvalue || 1, row?.numDiscount, parseFloat(row?.strTax?.split('%')[0]))
        ),
      sortable: true,
      wrap: true,
    },
  ]

  console.log('storeID', storeID)
  console.log('formState', formState)

  return (
    <section className="rateContractAddJHK">
      <h3 className="rateContractAddJHK__heading">
        {`Purchase Order Generation Form`}
      </h3>

      <div className="rateContractAddJHK__container pb-3">
        <h4 className="rateContractAddJHK__container-heading">
          PO Details
        </h4>

        <div className='align-content-center'>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Store Name :{" "}
            <span className="fs-6 fw-normal">{storeName}</span>{" "}
          </label>
        </div>

        <div className='row align-items-center'>
          <label
            htmlFor="taxType"
            className="rateContractAddJHK__label required-label col-4"
          >
            PO Type :
          </label>
          <SelectBox
            id="poType"
            options={poTypeList}
            onChange={(e) => {
              handleChange(e);
              // getPoDrugNameDrpDt(e?.target?.value?.split("^")[1]);
            }}
            name={"poType"}
            value={formState?.poType}
            className="Wrapper__select p-4"
            selectClass="col-8"
          // error={errors?.supplierNameErr}
          />
        </div>

        <ComboDropDown
          options={[{ value: "2025 - 2026", label: "2025-2026" }, { value: "2026 - 2027", label: "2026-2027" }]}
          onChange={handleChange}
          value={formState?.poGenPeriod}
          name="poGenPeriod"
          label={"PO Generation Period :"}
          addOnClass="rateContract__container--dropdown m-0"
        />

        <DatePickerComponent
          selectedDate={formState.poDate}
          setSelectedDate={(e) => handleDateChange(e, "poDate")}
          labelText={"Purchase Order Date :"}
          labelFor={"poDate"}
          name={"poDate"}
          allowMin={true}
        />

        {formState?.poType === "223^5" &&
          <div>
            <ComboDropDown
              options={indentPoNoList}
              onChange={(e) => {
                handleChange(e);
                // getPoProgrammeNameDrpDt(e?.target?.value?.split('^')[1], formState?.poGenPeriod)
              }}
              value={formState?.indentPoNo}
              name="indentPoNo"
              label={"Indent PO No :"}
              addOnClass="rateContract__container--dropdown m-0"
            />
          </div>
        }

        <div>
          <ComboDropDown
            options={drugList}
            onChange={(e) => {
              handleChange(e);
              dispatcher({ type: "SET_FIELD", field: 'itemName', value: drugList?.find(dt => dt?.value == e?.target?.value)?.label });
              getPoProgrammeNameDrpDt(e?.target?.value?.split('^')[1], formState?.poGenPeriod)
            }}
            value={formState?.drugName}
            name="drugName"
            label={"Drug Name :"}
            addOnClass="rateContract__container--dropdown m-0"
          />
          {/* {errors?.drugNameErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.drugNameErr}
            </span>
          } */}

        </div>
        {formState?.poType !== "223^5" && <div></div>}

        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0 ">
            Selected Drug/Item Name :{" "}
            <span className="fs-6 fw-bold text-primary">{formState?.itemName}</span>{" "}
          </label>
        </div>

        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Item Category :{" "}
            <span className="fs-6 fw-bold text-success">{formState?.drugName?.split('^')[6]}</span>{" "}
          </label>
        </div>

        <ComboDropDown
          options={programNameList}
          // onChange={handleChange}
          onChange={(e) => {
            handleChange(e);
            getPoFundingSourceDrpDt(storeID, formState?.drugName?.split('^')[5], e?.target?.value, formState?.poGenPeriod);
          }}
          name={'programmeName'}
          value={formState?.programmeName}
          label={"Programme Name :"}
          addOnClass="rateContract__container--dropdown m-0"
        />

        <ComboDropDown
          options={fundSourceList}
          onChange={(e) => { handleChange(e); getSupplierValuesOnFundingSrc(e?.target?.value); }}
          value={formState?.fundingSource}
          name={'fundingSource'}
          label={"Funding Source :"}
          addOnClass="rateContract__container--dropdown m-0"
        />

        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0 ">
            Item Specification :{" "}
            <span className="fs-6 fw-normal">{formState?.itemSpecification}</span>{" "}
          </label>
        </div>

        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Budget Available :{" "}
            <span className="fs-6 fw-normal text-danger">{formState?.budgetAvail}</span>{" "}
          </label>
        </div>

        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            GST No. :{" "}
            <span className="fs-6 fw-normal text-danger">{formState?.gstNo}</span>{" "}
          </label>
        </div>

        <div>
          <hr />
          <button className='btn btn-success btn-sm' onClick={handleGoButtonClick}>Go</button>
        </div>

      </div>

      <div className="">
        <h4 className="bg-[#097080] text-white p-1 rounded fw-normal ">Rate Contract Details</h4>
        <div style={{ marginBottom: "2rem" }}>
          <DataTable
            masterName={"Rate Contract Details"}
            ref={null}
            columns={rcDetailsColms}
            data={rcDetailsList}
            isPagination={false}
            isSearchReq={false}
            isReport={false}
          />
        </div>
      </div>

      <div className={`employeeMaster__container d-block`}>
        <h4 className="employeeMaster__container-heading">Purchase Order Details</h4>
        {/* PURCHASE ORDER DETAILS */}
        <div className="">
          <ReactDataTable
            title={''}
            column={poDetailsCols}
            data={poDetailsList}
            isSearchReq={false}
            isPagination={false}
          />
          <div className='d-flex row m-0 border-1 fs-13'>
            <div className='col-10 text-end'>Total Order Quantity</div>
            <span className='col-2 text-center fw-bold'>{totalOrderQuantity}</span>
          </div>
        </div>
      </div>

      <div className="employeeMaster__container">
        <h4 className="employeeMaster__container-heading">Purchase Details</h4>

        <div>
          <label htmlFor="tenderNo" className="employeeMaster__label required-label">
            PO Reference :
          </label>
          <InputField
            id="poRef"
            className="employeeMaster__input"
            type="text"
            name={"poRef"}
            placeholder="Enter..."
            value={formState?.poRef}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="" className="rateContractAddJHK__label mb-0">
            Total PO Cost (INR) :{" "}
            <span className="fs-6 fw-normal text-danger">{formState?.totalPoCost}</span>{" "}
          </label>
        </div>

        {formState?.poType !== "28^3" &&
          <>
            <div className=''>
              <label
                htmlFor="taxType"
                className="rateContractAddJHK__label "
              >
                Quotation No. :
              </label>
              <InputField
                id="quotationNo"
                className="employeeMaster__input"
                type="text"
                name={"quotationNo"}
                placeholder="Enter..."
                value={formState?.quotationNo}
                onChange={handleChange}
              />
            </div>

            <div>
              <DatePickerComponent
                selectedDate={formState.quotationDate}
                setSelectedDate={(e) => handleDateChange(e, "quotationDate")}
                labelText={"Quotation Date"}
                labelFor={"quotationDate"}
                name={"quotationDate"}
                allowMin={true}
              />
            </div>
          </>
        }

        <div className=''>
          <label
            htmlFor="taxType"
            className="rateContractAddJHK__label "
          >
            Delivery Days :
          </label>
          <InputField
            id="deliveryDays"
            className="employeeMaster__input"
            type="text"
            name={"deliveryDays"}
            placeholder="Enter..."
            value={formState?.deliveryDays}
            onChange={handleChange}
          />
        </div>

        <div>
          <DatePickerComponent
            selectedDate={formState.pCommitteeMeetDate}
            setSelectedDate={(e) => handleDateChange(e, "pCommitteeMeetDate")}
            labelText={"Purchase Committee Meeting Date"}
            labelFor={"pCommitteeMeetDate"}
            name={"pCommitteeMeetDate"}
            allowMin={true}
          />
        </div>

        <div>
          <label htmlFor="remarks" className="employeeMaster__label">
            Remarks :
          </label>
          <textarea
            id="remarks"
            className="rateContractAddJHK__input"
            type="text"
            name={"remarks"}
            placeholder="Enter here..."
            value={formState?.remarks}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="file" className="employeeMaster__label">
            Purchase Committee Meeting Copy (pdf) :
          </label>
          <input
            className="rateContractAddJHK__fileUpload"
            type="file"
            placeholder='Choose file...'
          // onChange={onFileChange}
          />
        </div>

      </div>

      <div className="employeeMaster__container d-block">
        <h4 className="employeeMaster__container-heading">Component Details</h4>
        <div>
          <label htmlFor="tAndc" className="employeeMaster__label">
            Term & Conditions:
          </label>
          <RichTextEditor
            id={formState?.component}
            name={formState?.component}
            value={formState?.nvl}
            onChange={(e) => { handleComponentChange(index, 'nvl', e) }}
          />
        </div>
      </div>

      <div className="bankmaster__container-controls">
        {actionType === "Modify" &&
          <button className="bankmaster__container-controls-btn" onClick={handleModifyPo}>Save</button>
        }
        <button
          className="bankmaster__container-controls-btn"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="bankmaster__container-controls-btn"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
      <style>
        {`
          .inner ol{
               list-style: auto !important;
          }
        `}
      </style>
    </section>

  );
}

export default GenerateSingleProgPoJH;

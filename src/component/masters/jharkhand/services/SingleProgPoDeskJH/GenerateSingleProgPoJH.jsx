import React, { useEffect, useReducer, useState } from 'react'
import DataTable from '../../../../commons/Datatable';
import ReactDataTable from '../../../../commons/ReactDataTable';
import InputBox from '../../../../commons/InputBox';
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { ComboDropDown, DatePickerComponent, InputField } from '../../../../commons/FormElements';
import RichTextEditor from '../../../../commons/RichTextEditor';
import { getJHPoDwhPoDetails, getJHPoFundingSrcCombo, getJHPoIndenDrugNameCombo, getJHPoIndentFundingSrcCombo, getJHPoIndentNumberCombo, getJHPoIndentProgramCombo, getJHPoInitDataVerifyByCombo, getJHPoProgramCombo, getJHPoSupplierValues, getJHSinglePoGstNo, getPoTypeCombo, getSinglePoComponentDetails, getSinglePoDwhPoDetails, getSinglePoItemCmbData, getSinglePoTestingData, modifySinglePoDwhPoModifySave, saveJhGenerateNewPo } from '../../../../../api/Jharkhand/services/SingleProgPoDeskAPI_JH';
import SelectBox from '../../../../commons/SelectBox';
import { convertToISODate, parseDate } from '../../../../commons/utilFunctions';
import { ToastAlert } from '../../../../../utils/Toast';

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
    quotationNo: "",
    verifiedBy: ""
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
  const [strIndrx, setStrIndrx] = useState("");

  const [errors, setErrors] = useState({
    fundingSourceErr: "", programmeNameErr: "", drugNameErr: ""
  })

  const handleReset = () => {
    dispatcher({
      type: 'SET_FIELDS', payload: {
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

        poRef: "",
        totalPoCost: 0,
        pCommitteeMeetDate: "",
        pCommitteeMeetCopy: "",
        remarks: "",
        rateUnit: "",
        deliveryDays: "60",

        tAndc: "",
        tAndcAccept: false,
        indentPoNo: "",
        quotationDate: "",
        quotationNo: "",
        verifiedBy: "",
        purchaseSourceId: ""
      }
    });
    setPoDetailsList([]);
    setRcDetailsList([]);
    setProgramNameList([]);
    setFundSourceList([]);
    setDrugList([]);
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
    const upRow = {
      ...row,
      "index": index,
      discountedRate: row?.suppId?.split('^')[1] || "0",
      numBaseUnitvalue: row?.suppId?.split('^')[1] || "0",
      numDiscount: row?.suppId?.split('^')[22] || "",
      ratePerUnit: row?.suppId?.split('^')[1] || "0",
      strTax: row?.suppId?.split('^')[11] || "0",
      totalRate: row?.suppId?.split('^')[3] || "0",
      strSupplierName: ""

    }
    setSelectedRowId(upRow);
    setOrderQuantity({});
    setTotalOrderQuantity(0);
    dispatcher({ type: "SET_FIELD", field: "totalPoCost", value: 0 });

  };

  const handleQuantityChange = (rowId, value) => {
    if (selectedRowId) {
      if (formState?.poType === "21^2") {
        const isValidRc = IsValidateSelectedRc();
        if (!isValidRc) return;
      }
      const val = parseInt(totalOrderQuantity) || 0;
      const bud = parseInt(formState?.budgetAvail) || 0;

      if (val > bud) {
        ToastAlert('Quantity should not more than available budget', 'error')
      } else {
        setOrderQuantity(prev => ({
          ...prev, [rowId]: value
        }));
      }
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
  const getPoDrugNameDrpDtForIndent = (indentNo) => {
    getJHPoIndenDrugNameCombo(998, indentNo)?.then((res) => {
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

    if (formState?.poType === "223^5") {
      getJHPoIndentProgramCombo(998, formState?.indentPoNo)?.then((res) => {
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
    } else {
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
  }

  const getPoFundingSourceDrpDt = (storeId, drugClass, programId, year) => {
    if (formState?.poType === "223^5") {
      getJHPoIndentFundingSrcCombo(998, storeId, formState?.indentPoNo, programId, year)?.then((res) => {
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
    } else {
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
  }

  const getSupplierValuesOnFundingSrc = (fundId) => {
    const val = {
      "gnumHospitalCode": 998,
      "hstnumStoreId": parseInt(storeID),
      "strIndentPeriodValue": formState?.poGenPeriod,
      "strComboPOTypeId": formState?.poType + "^1", //rc=1, nonrc=2, for now 1 is hardcoded, because drpdn is hidden on uat
      "strPoDate": parseDate(formState.poDate),
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
        const unitDrpDt = res?.data?.strRateUnitValues?.map((unt) => ({
          value: unt?.unit_id,
          label: unt?.unit_name
        }))
        const suppDrpDt = res?.data?.suplierCombo?.map((unt) => ({
          value: unt?.value,
          label: unt?.display
        }))
        dispatcher({
          type: "SET_FIELDS", payload:
          {
            "budgetAvail": res?.data?.budgetAvailable,
            "deliveryDays": suppDrpDt[0]?.value?.split('^')[4]
          }
        });
        setUnitDrpData(unitDrpDt);
        setSupplierList(suppDrpDt);
        setRcDetailsList(res?.data?.poRateDivId || []);
      } else {
        setUnitDrpData([]);
        setSupplierList([]);
        setRcDetailsList([]);
      }
    })
  }

  const getDwhPoDetailsOnGo = () => {
    const val = {
      "gnumHospitalCode": 998,
      "hstnumStoreId": parseInt(storeID),
      "strIndentPeriodValue": formState?.poGenPeriod,
      "strComboPOTypeId": formState?.poType + "^1", //rc=1, nonrc=2, for now 1 is hardcoded, because drpdn is hidden on uat
      // "strPoDate": parseDate(formState.poDate),
      "hstnumItembrandId": parseInt(formState?.drugName?.split('^')[1]),
      "programmeId": parseInt(formState.programmeName),
      "fundingSourceId": parseInt(formState?.fundingSource),
      // "hstnumItemId": parseInt(formState?.drugName?.split('^')[0]),
      "strIndentCellPOCombo": "",
      "hstnumSupplierId": 0,
      "hstnumPoNo": 0,
      "strContractType": formState?.poType,
      "strViewFlg": 0
    }
    getJHPoDwhPoDetails(val)?.then((res) => {
      if (res?.status === 1) {
        setPoDetailsList(res?.data?.purchaseOrderDetails || []);
      } else {
        setPoDetailsList([])
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

  const getPoGstNo = (storeId) => {
    getJHSinglePoGstNo(998, storeId)?.then((res) => {
      console.log('res', res)
      if (res?.status === 1) {
        dispatcher({ type: "SET_FIELD", field: "gstNo", value: res?.data });
      } else {
        dispatcher({ type: "SET_FIELD", field: "gstNo", value: "" });
      }
    })
  }

  const getVerifyByCmbInitData = (storeId) => {
    getJHPoInitDataVerifyByCombo(998, storeId)?.then((res) => {
      if (res?.status === 1) {
        const val = res?.data?.varifiedBy[0]?.str_emp_no || "";
        const value = res?.data?.purchaseSourceValues[1]?.value || "";
        dispatcher({ type: "SET_FIELDS", payload: { "verifiedBy": val, "purchaseSourceId": value } });
      } else {
        dispatcher({ type: "SET_FIELDS", payload: { "verifiedBy": "", "purchaseSourceId": "" } });
      }
    })
  }

  const IsValidateSelectedRc = () => {
    let isValid = true;
    if (!selectedRowId?.strSupplierName?.trim()) {
      ToastAlert("Please select a supplier", "error");
      return false;
    }
    if (!selectedRowId?.ratePerUnit?.trim()) {
      ToastAlert("Please enter rate", "error");
      return false;
    }
    if (!selectedRowId?.unit?.trim()) {
      ToastAlert("Please select unit", "error");
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (formState?.poType && formState?.poType !== "223^5") {
      getPoDrugNameDrpDt(formState?.poType?.split("^")[1]);
      // handleReset();
    } else if (formState?.poType && formState?.poType === "223^5") {
      getIndentNoDrpData();
      setDrugList([]);
      // handleReset();
    }
  }, [formState?.poType, formState?.poGenPeriod])

  useEffect(() => {
    if (selectedData?.length > 0 && storeID) {
      // getAllPoDataTesting(selectedData[0]?.poNo, storeID, selectedData[0]?.poDate)
      getPoComponentDetails(selectedData[0]?.poTypeId, 3, storeID, selectedData[0]?.poNo)
    }
  }, [selectedData])

  useEffect(() => {
    if (storeID) {
      getPoTypeDrpDt(storeID)
      getPoGstNo(storeID);
      getVerifyByCmbInitData(storeID);
    }
  }, [storeID])


  const getPoComponentDetails = (poType, mode, storeId, poNo) => {
    getSinglePoComponentDetails(998, poType, mode, storeId, 0)?.then((res) => {
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
    const bud = parseInt(formState?.budgetAvail) || 0;
    if (formState?.poType === "28^3") {
      const rate = parseFloat(selectedRowId?.suppId?.split('^')[1]) || 0;
      const totalCost = totalQuantity * rate;
      if (totalCost > bud) {
        ToastAlert('Total order quantity value is more than available budget for selected consignee. ', 'error');
        dispatcher({
          type: "SET_FIELD",
          field: "totalPoCost",
          value: 0
        });
        return;
      }
      dispatcher({
        type: "SET_FIELD",
        field: "totalPoCost",
        value: totalCost.toFixed(2)
      });
    } else {
      const rate = parseFloat(selectedRowId?.ratePerUnit?.split('/')[0]) || 0;
      const tax = parseFloat(selectedRowId?.strTax?.split('%')[0]) || 0;
      const unit = Number(selectedRowId?.numBaseUnitvalue) || 1;
      const discount = Number(selectedRowId?.numDiscount) || 0;

      const baseRate = rate / unit;
      const discountedRate = baseRate - (baseRate * discount) / 100;
      const finalRate = discountedRate + (discountedRate * tax) / 100;
      const totalCost = totalQuantity * finalRate;

      if (totalCost > bud) {
        ToastAlert('Total order quantity value is more than available budget for selected consignee. ', 'error');
        dispatcher({
          type: "SET_FIELD",
          field: "totalPoCost",
          value: 0
        });
        return;
      }

      dispatcher({
        type: "SET_FIELD",
        field: "totalPoCost",
        value: totalCost.toFixed(2)
      });
    }
    setTotalOrderQuantity(totalQuantity);
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

  const saveGeneratePoDetails = () => {

    const strRC = selectedRowId?.suppId?.split("^");
    const val = {
      "gnumHospitalCode": 998,
      "gnumSeatId": SEAT_ID,
      "hstnumStoreId": parseInt(storeID),
      // "hstnumPoNo": "",
      "hstnumItemId": parseInt(formState?.drugName?.split('^')[0]) || 0,
      "hstnumItembrandId": parseInt(formState?.drugName?.split('^')[1]) || 0,
      // "reqType": formState?.poType,
      "itemCat": parseInt(formState?.drugName?.split('^')[5]) || 10,
      "strComboPOTypeId": formState?.poType || "",
      "strPoRefrenceNo": formState?.poRef,
      "strPoRefrenceNoText": formState?.poRef,
      "strStrIndrx":"0" ,//strIndrx || "0",
      "strIndentPeriodValue": formState?.poGenPeriod,
      "strPoDate": parseDate(formState?.poDate),
      "programmeId": parseInt(formState?.programmeName),
      "fundingSourceId": parseInt(formState?.fundingSource),
      "strRPPONo": "",
      "strLPRCId": formState?.poType !== "21^2" ? ["0"] : [selectedRowId?.suppId?.split('^')[14] || ""],
      "strLPRate": formState?.poType !== "21^2" ? ["0"] : [selectedRowId?.discountedRate],
      "strLPUnit": formState?.poType !== "21^2" ? ["0"] : [selectedRowId?.unit],
      "strLPTax": formState?.poType !== "21^2" ? ["0"] : [selectedRowId?.strTax],
      "strDiscount": formState?.poType !== "21^2" ? ["0"] : [selectedRowId?.numDiscount],
      "strSupplierDtl": formState?.poType !== "21^2" ?
        [
          strRC[0] + "^" + strRC[1] + "^" + strRC[2] + "^" + strRC[3] + "^" + strRC[4] + "^" + strRC[5] + "^" + strRC[6] + "^" + strRC[7] + "^" + strRC[8] + "^" + strRC[9] + "^" + strRC[10] + "^" + strRC[11] + "^" + strRC[12] + "^0^" + strRC[14] + "^" + strRC[15] + "^" + strRC[16] + "^" + strRC[17] + "^" + strRC[18] + "^" + strRC[19] + "^" + strRC[20] + "^" + strRC[21] + "^" + strRC[22]
        ] :
        [
          selectedRowId?.strSupplierName?.split("^")[0] + "^" + strRC[1] + "^" + strRC[2] + "^" + strRC[3] + "^" + strRC[4] + "^" + strRC[5] + "^" + strRC[6] + "^" + strRC[7] + "^" + strRC[8] + "^" + strRC[9] + "^" + strRC[10] + "^" + strRC[11] + "^" + strRC[12] + "^0^" + strRC[14] + "^" + strRC[15] + "^" + strRC[16] + "^" + strRC[17] + "^" + strRC[20]
        ],

      "strItemManufacturerId": "0",
      "strPODetailsHidValue": poDetailsList?.length ? poDetailsList?.map((data) => data[0] + "^" + data[1] + "^" + data[1]?.split("#")[8] + "^" + data[3] + "^" + data[4] + "^" + data[5]) : [],
      "strQrderQty1": poDetailsList?.length ? poDetailsList?.map((data, index) => orderQuantity[index] ? orderQuantity[index] : data[5]?.split("#")[0]) : [],
      "strQrderQty2": poDetailsList?.length ? poDetailsList?.map((data, index) => data[5]?.split("#")[1]) : [],
      "strQrderQty3": poDetailsList?.length ? poDetailsList?.map((data, index) => data[5]?.split("#")[2]) : [],
      "strQrderQty4": poDetailsList?.length ? poDetailsList?.map((data, index) => data[5]?.split("#")[3]) : [],
      "strDDeliveryDays": formState?.deliveryDays,
      "strDDeliveryDays2": "0",
      "strDDeliveryDays3": "0",
      "strDDeliveryDays4": "0",
      "strDPurchaseSource": formState?.purchaseSourceId || "0",
      "strDQuotationNo": formState?.poType !== "21^2" ? "" : formState?.quotationNo, //only for local purchase
      "strDQuotationDate": formState?.poType !== "21^2" ? "" : formState?.quotationDate,//only for local purchase
      "strDRemarks": formState?.remarks,
      "strVerifiedBy": formState?.verifiedBy || "",
      "strVerifiedDate": parseDate(new Date()),
      "strNextPoDate": "",
      "strPurchaseCommitteMeetingDate": formState?.pCommitteeMeetDate,
      "strFileName": formState?.fileName || "",
      "strIndentCellPOCombo": "",
      "strDComponentId": componentDetails?.map(dt => dt?.hstnum_component_id),
      "strDComponentValue": componentDetails?.map(dt => dt?.nvl)
    }

    console.log('val', val)

    saveJhGenerateNewPo(val)?.then((data) => {
      console.log('data', data)
      if (data?.status === 1) {
        ToastAlert(data?.message, 'success');
      } else {
        ToastAlert(data?.message, 'error');
      }
    })
  }

  const handleGeneratePo = () => {
    let isValid = true;
    // if (!orderQuantity || Object.keys(orderQuantity).length === 0) {
    //   ToastAlert('Please enter order quantity', 'error');
    //   isValid = false;
    // }
    if (formState?.poType === "21^2") {
      const isValidRc = IsValidateSelectedRc();
      if (!isValidRc) return;
    }

    if (!selectedRowId || Object.keys(selectedRowId).length === 0) {
      ToastAlert('Please select RC details', 'error');
      isValid = false;
    }

    if (!formState?.poRef?.trim()) {
      ToastAlert('Please enter PO reference', 'error');
      isValid = false;
    }

    if (!formState?.remarks?.trim()) {
      ToastAlert('Please enter remarks', 'error');
      isValid = false;
    }
    if (isValid) {
      saveGeneratePoDetails();
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
      getDwhPoDetailsOnGo();
      getPoComponentDetails(formState?.poType?.split("^")[0], 3, storeID, selectedData[0]?.poNo);

    }
  }
  const calculateSomeTrickyValue = (ind, row) => {

    const poType = formState?.poType?.split("^")[0];

    const rateContractExist =
      row?.contractType?.split("^")?.[1];

    // if (poType === "28") {

    //   if (
    //     rateContractExist === 1 ||
    //     rateContractExist === "1"
    //   ) {
    //     alert(
    //       "State Rate Contact exist for this item. You can generate PO with this contract type with remarks"
    //     );
    //   }
    // }

    setStrIndrx(ind);

    // reset qty except PO type 223
    // if (poType !== "223") {

    //   const updatedQtyObj = {};

    //   Object.keys(orderQuantity || {}).forEach((key) => {
    //     updatedQtyObj[key] = 0;
    //   });

    //   setOrderQuantity(updatedQtyObj);

    //   calculateTotalScheduleQty(
    //     updatedQtyObj,
    //     poDetailsList,
    //     1
    //   );
    // }
  };


  const poDetailsCols = [

    {
      name: (<span className='text-center'>Store Name</span>),
      selector: row => row[0],
      sortable: true,
      wrap: true,
      // center: "true"
      width: "20%"
    },
    {
      name: (<span>Available Budget</span>),
      selector: row => row[9],
      sortable: true,
      wrap: true,
      center: "true"
    },
    {
      name: (<span className='text-center'>Annual Demanded Quantity (A)</span>),
      selector: row => row[1]?.split('#')[0],
      sortable: true,
      wrap: true,
      center: "true"
    },
    {
      name: (<span className='text-center'>Ordered Quantity (B)</span>),
      selector: row => row[1]?.split('#')[1],
      sortable: true,
      wrap: true,
      center: "true"
    },
    {
      name: (<span className='text-center'>Current Stock</span>),
      selector: row => row[10],
      sortable: true,
      wrap: true,
      center: "true"
    },
    {
      name: (<span className='text-center'>Suggested Qty. (A-B)</span>),
      selector: row => parseInt(row[1]?.split('#')[0]) - parseInt(row[1]?.split('#')[1]),
      sortable: true,
      wrap: true,
      center: "true"
    },
    {
      name: (<span className='text-center'>*Order Quantity(No.)</span>),
      cell: (row, index) =>
        <div style={{ position: 'absolute', top: 3, left: 0 }}>
          <InputBox
            id="orderQuantiy"
            className="bg-[#d2d0c6]"
            type="number"
            name={"orderQuantiy"}
            placeholder=""
            value={orderQuantity[index] || row[5]?.split('#')[0]}
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
              onChange={(e) => { handleRowSelect(row, index); calculateSomeTrickyValue(index, row) }}
            />
          </span>
        </div>,
      width: "5%"
    },
    {
      name: (<span>Contract Type</span>),
      selector: row => row?.contractType?.split('^')[0],
      sortable: true,
      wrap: true,
      // width: "20%"
    },
    {
      name: "Supplier",
      cell: (row, index) =>
        formState?.poType === "21^2" && selectedRowId?.index === index ? (
          <select
            className="w-full py-1 border ring-gray-500 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 mb-2 mt-1"
            onChange={(e) => handleManualChange("strSupplierName", e.target.value)}
            value={selectedRowId?.strSupplierName || ""}
          >
            <option>Select</option>
            {supplierList?.map((sup) => (
              <option value={sup.value}>{sup.label}</option>
            ))}
          </select>
        ) : (
          row?.suppName
        ),
    },
    {
      name: (<span>Level Type</span>),
      selector: row => row?.supplierLevel,
      sortable: true,
      wrap: true,
    },
    {
      name: formState?.poType === "28^3" ? "Rate/Unit(Inclusive of Tax)" : "Rate",
      cell: (row, index) =>
        formState?.poType === "21^2" && selectedRowId?.index === index ? (
          <div className='row'>
            <InputBox
              id="ratePerUnit"
              className="px-2"
              type="text"
              name={"ratePerUnit"}
              value={selectedRowId?.ratePerUnit || ""}
              placeholder=""
              inputClass="col-6 p-0 mt-1"
              onChange={(e) => { handleManualChange("ratePerUnit", e?.target?.value); }}
              onBlur={handleAllRateChange}
            />
            <div className='col-6 mb-2 p-0 d-flex mt-1'>
              <span className='py-1 px-1'>/</span>
              <select
                className="w-full py-1 border ring-gray-500 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 "
                onChange={(e) => { handleManualChange("unit", e.target.value) }}
                value={selectedRowId?.unit || ""}
              >
                <option>Select</option>
                {unitDrpData?.map((sup) => (
                  <option value={sup.value}>{sup.label}</option>
                ))}
              </select>
            </div>

          </div>
        ) : (
          row?.suppId?.split('^')[1]
        ),
      // width: "18%",
      center: "true"
    },
    ...(formState?.poType !== "28^3" ? [
      {
        name: (<span>Discount(%)</span>),
        cell: (row, index) =>
          formState?.poType === "21^2" && selectedRowId?.index === index ? (
            <div style={{ position: 'absolute', top: 5, left: 10, right: 10 }}>
              <InputBox
                id="numDiscount"
                className=""
                type="text"
                name={"numDiscount"}
                value={selectedRowId?.numDiscount || ""}
                placeholder=""
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
        cell: (row, index) =>
          formState?.poType === "21^2" && selectedRowId?.index === index ? (
            <div style={{ position: 'absolute', top: 5, left: 10, right: 10 }}>
              <InputBox
                id="discountedRate"
                className=""
                type="text"
                name={"discountedRate"}
                placeholder=""
                value={selectedRowId?.discountedRate}
                disabled={true}
              />

            </div>
          ) : (
            getAllRateChange(parseFloat(row?.ratePerUnit?.split('/')[0]), row?.numBaseUnitvalue || 1, row?.numDiscount, 0)
          ),
        sortable: true,
        wrap: true,
      },
    ] : []),
    {
      name: (<span>GST (%)</span>),
      cell: (row, index) =>
        formState?.poType === "21^2" && selectedRowId?.index === index ? (
          <div style={{ position: 'absolute', top: 5, left: 10, right: 10 }}>
            <InputBox
              id="strTax"
              className=""
              type="text"
              name={"strTax"}
              placeholder=""
              value={selectedRowId?.strTax}
              onChange={(e) => { handleManualChange("strTax", e?.target?.value); }}
              onBlur={handleAllRateChange}
            />
          </div>
        ) : (
          row?.suppId?.split('^')[11]
        ),
      sortable: true,
      wrap: true,
    },
    ...(formState?.poType !== "28^3" ? [
      {
        name: (<span>(₹)Total Rate(One Unit)(With Tax)</span>),
        cell: (row, index) =>
          formState?.poType === "21^2" && selectedRowId?.index === index ? (
            <div style={{ position: 'absolute', top: 5, left: 10, right: 10 }}>
              <InputBox
                id="totalRate"
                className=""
                type="text"
                name={"totalRate"}
                placeholder=""
                value={selectedRowId?.totalRate}
                disabled={true}
              />
            </div>
          ) : (
            getAllRateChange(parseFloat(row?.ratePerUnit?.split('/')[0]), row?.numBaseUnitvalue || 1, row?.numDiscount, parseFloat(row?.strTax?.split('%')[0]))
          ),
        sortable: true,
        wrap: true,
      },
    ] : []),
  ]


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
          isRequired
        />

        {formState?.poType === "223^5" &&
          <div>
            <ComboDropDown
              options={indentPoNoList}
              onChange={(e) => {
                handleChange(e);
                getPoDrugNameDrpDtForIndent(e?.target?.value);
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
            isRequired
          />
          {errors?.drugNameErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.drugNameErr}
            </span>
          }

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

        <div>
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
            isRequired
          />
          {errors?.programmeNameErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.programmeNameErr}
            </span>
          }
        </div>

        <div>
          <ComboDropDown
            options={fundSourceList}
            onChange={(e) => { handleChange(e); getSupplierValuesOnFundingSrc(e?.target?.value); }}
            value={formState?.fundingSource}
            name={'fundingSource'}
            label={"Funding Source :"}
            addOnClass="rateContract__container--dropdown m-0"
            isRequired
          />
          {errors?.programmeNameErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.programmeNameErr}
            </span>
          }
        </div>

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
          <ReactDataTable
            column={rcDetailsColms}
            data={formState?.poType === "21^2" ? rcDetailsList?.slice(0, 1) : rcDetailsList}
            isPagination={true}
            isSearchReq={false}
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
                maxiDate={new Date(new Date().setDate(new Date().getDate() - 1))}
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
            maxiDate={formState?.poDate ? new Date(formState?.poDate) : new Date()}
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
        {componentDetails?.map((data, index) => (

          <div>
            <label htmlFor="tAndc" className="employeeMaster__label">
              {data?.component}:
            </label>
            <RichTextEditor
              id={data?.component}
              name={data?.component}
              value={data?.nvl}
              onChange={(e) => { handleComponentChange(index, 'nvl', e) }}
            />
          </div>
        ))}
      </div>

      <div className="bankmaster__container-controls">
        <button className="bankmaster__container-controls-btn" onClick={handleGeneratePo}>Save</button>
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

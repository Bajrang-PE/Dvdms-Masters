import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { ComboDropDown, InputField, RadioButton } from '../../../../commons/FormElements';
import DataTable from '../../../../commons/Datatable';
import { addHpRcDetails, getHpRcContractDetailsOnTender, getHpRcDownloadFile, getHpRcDrugCmbWithBrand, getHpRcListData, getHpRcSuppEmdDetails, getHpRcSuppLevelCombo, getHpRcTaxTypeCombo, getHpRcTenderCmbOnSuppId, getHpRcUnitCombo, saveHpRcFileUpload } from '../../../../../api/Himachal/services/rateContractAPI_HP';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEye } from '@fortawesome/free-solid-svg-icons';
import { parseDate } from '../../../../commons/utilFunctions';
import { ToastAlert } from '../../../../../utils/Toast';
import BottomButtons from '../../../../commons/BottomButtons';
import MasterPopUpModal from '../../../../commons/MasterPopUpModal';

const bgdetailsTableCols = [
  { header: "EMD Amount (₹)", field: "hstnumBgAmt" },
  { header: "EMD From Date", field: "hstdtBgFrmDate" },
  { header: "EMD To Date", field: "hstdtBgToDate" },
  { header: "EMD No.", field: "hstnumBgNo" },
  { header: "Refund Amount", field: "hstnumRefundAmount" },
];

const RateContractAddHP = (props) => {
  const { suppliers } = props;

  const { value: storeID, label: storeName } = useSelector(
    (state) => state.himachalMst.storeID
  );
  const { value: contractID, label: contractName } = useSelector(
    (state) => state.himachalMst.contractDetails
  );

  const batchSizeOptions = Array.from({ length: 50 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));

  const initialState = {
    //contract detail
    supplierName: "",
    tenderNo: "",
    isDccMandatory: true,
    contractFrom: "",
    contractTo: "",
    rcFinalDate: "",
    quotationNo: "",
    acceptanceDate: "",
    financeCommitteDate: "",
    bankName: "",
    branchName: "",
    bankIfscCode: "",
    bankID: "",

    //tender detail
    contractedQty: "",
    shelfLife: "",
    noOfBatches: "",
    level: "",
    allocationQty: "",
    taxType: "",
    cgst: "",
    sgst: "",
    rate: "",
    unit: "",
    deliveryDay: "",
    discount: "",
    remarks: "",
    tenderDate: ""
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

  const [errors, seterrors] = useState({
    drugNameErr: "", supplierNameErr: "", tenderNoErr: "", shelfLifeErr: "", noOfBatchesErr: "", whetherImportedErr: "", levelErr: "", taxTypeErr: "", cgstErr: "", sgstErr: "", rateUnitErr: "", deliveryDayErr: "",
  })

  const [formState, dispatcher] = useReducer(addFormReducer, initialState);
  const dispatch = useDispatch();

  const dataTableRef = useRef();
  const [existingRCs, setExistingRCs] = useState([]);
  const [bgList, setBgList] = useState([]);
  const [levelType, setLevelType] = useState([]);
  const [unitDrpDt, setUnitDrpDt] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [whetherImported, setWhetherImported] = useState("No");
  const [drugName, setDrugName] = useState('');
  const [drugBrandList, setDrugBrandList] = useState([]);
  const [tenderNoList, setTenderNoList] = useState([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [viewDetails, setViewDetails] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [taxTypes, setTaxTypes] = useState([]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('e.target', e.target)
    const errName = name + "Err";
    dispatcher({ type: "SET_FIELD", field: name, value });
    if (name === 'rate' || name === 'unit') {
      seterrors({ ...errors, 'rateUnitErr': "" });
    } else {
      seterrors({ ...errors, [errName]: "" });
    }
  };

  function handleClose() {
    dispatch(hidePopup());
  }

  function handleReset() {
    dispatcher({ type: "RESET_FORM" });
  }

  const getContractDetailsOnSuppliers = (suppid, tendNo) => {
    getHpRcContractDetailsOnTender(998, tendNo, suppid)?.then((data) => {
      if (data?.status === 1) {
        dispatcher({
          type: "SET_FIELDS",
          payload: {
            tenderNo: tendNo,
            contractFrom: data?.data[0]?.dtContractFrmDate,
            contractTo: data?.data[0]?.dtContractToDate,
            rcFinalDate: data?.data[0]?.dtTenderDate,
            quotationNo: data?.data[0]?.strQuotationRefNo,
            acceptanceDate: data?.data[0]?.dtAcceptanceDate,
            financeCommitteDate: data?.data[0]?.dtFinancialCommDate,
            bankName: data?.data[0]?.strBankName,
            branchName: data?.data[0]?.strBranchName,
            bankIfscCode: data?.data[0]?.strIfscCode,
            bankID: data?.data[0]?.numBankId,
            tenderDate: data?.data[0]?.dtTenderDate,
          },
        });
      }
    });
  }

  useEffect(() => {
    if (formState?.supplierName && formState?.tenderNo)
      getContractDetailsOnSuppliers(formState?.supplierName, formState?.tenderNo);
  }, [formState?.tenderNo])


  const getContractDetailsWithTender = () => {
    getHpRcTenderCmbOnSuppId(998, formState?.supplierName, contractID).then((res) => {
      console.log("res", res);
      if (res?.status === 1) {
        const drpDt = res?.data?.length > 0 && res?.data?.map((dt) => ({
          value: dt?.value,
          label: dt?.display
        }))
        console.log('drpDt', drpDt)
        if (drpDt?.length > 1) {
          setTenderNoList(drpDt);
        } else if (drpDt?.length === 1) {
          const tendNo = drpDt[0]?.value;
          setTenderNoList(drpDt);
          dispatcher({ type: "SET_FIELD", field: 'tenderNo', value: tendNo });
        } else {
          setTenderNoList([]);
        }
      }
    });
  };

  const levelTypeDrpData = () => {
    getHpRcSuppLevelCombo(998)?.then((res) => {
      if (res?.status === 1) {
        const drpDt = res?.data?.map((dt) => ({
          value: dt?.value,
          label: dt?.display,
        }));
        setLevelType(drpDt);
      } else {
        setLevelType([]);
      }
    });
  };

  const getTaxTypeDrpDt = () => {
    getHpRcTaxTypeCombo(998)?.then((res) => {
      if (res?.status === 1) {
        const dt = res?.data?.map((dt) => ({
          value: dt?.value,
          label: dt?.display
        }))
        setTaxTypes(dt);
      } else {
        setTaxTypes([]);
      }
    })
  }

  const unitDrpData = () => {
    getHpRcUnitCombo(998)?.then((res) => {
      if (res?.status === 1) {
        const drpDt = res?.data?.map((dt) => ({
          value: dt?.value,
          label: dt?.display,
        }));
        setUnitDrpDt(drpDt);
      } else {
        setUnitDrpDt([]);
      }
    });
  };

  const getDrugWithBrandIdDrpDt = () => {
    getHpRcDrugCmbWithBrand(998, 'ACTIVE')?.then((res) => {
      if (res?.status === 1) {
        const drpDt = res?.data
          ?.filter(dt => dt?.value !== '0')
          ?.map((dt) => ({
            value: dt?.value,
            label: dt?.display,
          }));
        setDrugBrandList(drpDt);
      } else {
        setDrugBrandList([]);
      }
    });
  };

  useEffect(() => {
    levelTypeDrpData();
    unitDrpData();
    getDrugWithBrandIdDrpDt();
    getTaxTypeDrpDt();
  }, []);

  useEffect(() => {
    async function fetchExistingRCs() {
      const response = await getHpRcListData(998, '', drugName?.split('^')[0], contractID);
      if (response?.status === 1) {
        setExistingRCs(response?.data?.content);
      } else {
        setExistingRCs([]);
      }
    }
    if (drugName) {
      fetchExistingRCs();
    }
  }, [storeID, drugName, contractID]);

  const fetchBGListDt = () => {
    const { supplierName, tenderNo } = formState;
    getHpRcSuppEmdDetails(998, supplierName, tenderNo)?.then((res) => {
      if (res?.status === 1) {
        setBgList(res?.data);
      } else {
        setBgList([]);
      }
    });
  };

  useEffect(() => {
    if (formState?.supplierName && formState?.tenderNo) {
      fetchBGListDt();
    }
  }, [formState?.supplierName, formState?.tenderNo]);

  useEffect(() => {
    if (formState?.supplierName) {
      getContractDetailsWithTender();
    } else {
      dispatcher({
        type: "SET_FIELDS",
        payload: {
          tenderNo: '',
          contractFrom: '',
          contractTo: '',
          rcFinalDate: '',
          quotationNo: '',
          acceptanceDate: '',
          financeCommitteDate: '',
          bankName: '',
          branchName: '',
          bankIfscCode: '',
        },
      });
    }
  }, [formState?.supplierName]);

  const handleSave = (draft) => {
    let isValid = true;

    if (!drugName?.toString()?.trim()) {
      seterrors((prev => ({ ...prev, 'drugNameErr': "Drug Name is Required!" })));
      isValid = false;
    }
    if (!formState?.supplierName?.trim()) {
      seterrors((prev => ({ ...prev, 'supplierNameErr': "Supplier Name is Required!" })));
      isValid = false;
    }
    if (!formState?.tenderNo) {
      seterrors((prev => ({ ...prev, 'tenderNoErr': "Tendor number is Required!" })));
      isValid = false;
    }
    if (!formState?.shelfLife?.trim()) {
      seterrors((prev => ({ ...prev, 'shelfLifeErr': "Shelf life is Required!" })));
      isValid = false;
    }
    if (!formState?.noOfBatches) {
      seterrors((prev => ({ ...prev, 'noOfBatchesErr': "No. of batches is Required!" })));
      isValid = false;
    }
    if (!formState?.level) {
      seterrors((prev => ({ ...prev, 'levelErr': "Please select a level!" })));
      isValid = false;
    }
    if (!formState?.taxType?.trim()) {
      seterrors((prev => ({ ...prev, 'taxTypeErr': "Please select tax type!" })));
      isValid = false;
    }
    if (!formState?.cgst?.trim()) {
      seterrors((prev => ({ ...prev, 'cgstErr': "CGST is required!" })));
      isValid = false;
    }
    if (!formState?.sgst?.trim()) {
      seterrors((prev => ({ ...prev, 'sgstErr': "SGST is required!" })));
      isValid = false;
    }
    if (!formState?.rate?.trim() || !formState?.unit?.trim()) {
      seterrors((prev => ({ ...prev, 'rateUnitErr': "Rate and Unit are required!" })));
      isValid = false;
    }
    if (!formState?.deliveryDay?.trim()) {
      seterrors((prev => ({ ...prev, 'deliveryDayErr': "Delivery days is required!" })));
      isValid = false;
    }

    if (isValid) {
      saveContractdetails(draft);
    }

  }

  const saveContractdetails = (isdraft) => {
    const y = new Date().getFullYear();
    const val = {
      "gnumHospitalCode": 998,//
      // "gnumCancelSeatid": "",
      "hstnumContractTypeId": contractID,//
      // "hstnumBankId": formState?.bankID,
      // "hstnumBranchId": formState?.branchName,
      // "hststrIfscCode": formState?.bankIfscCode,
      // "hstnumBgAmt": parseInt(bgList[0]?.bg_amt || '0'),
      // "hstnumBgNo": bgList[0]?.hstnum_bg_no || '',
      "hstnumSupplierId": parseInt(formState?.supplierName),//
      "hstnumStoreId": storeID,//
      "hstnumItemBrandId": parseInt(drugName),//
      "gnumSeatid": 10001,//
      // "gnumIsvalid": 1,
      "hstnumItemId": parseInt(drugName?.split('^')[1] || 0),//

      "hststrTenderNo": formState?.tenderNo?.toString(),//bbbb
      "hstnumContractQty": parseInt(formState?.contractedQty),//bbb
      "hstnumShelfLife": parseInt(formState?.shelfLife),//bbb
      "hstnumBatchSize": parseInt(formState?.noOfBatches),//
      "hstnumImportedFlag": whetherImported === "Yes" ? 1 : 0,//bbb
      "sstnumLevelTypeId": parseInt(formState?.level),//
      "hstnumAllocationOrderQty": parseInt(formState?.allocationQty),//bbb
      "hstnumTaxType": parseInt(formState?.taxType),//
      "hstnumRateUnitid": parseInt(formState?.unit?.split('^')[0]),//
      "hstnumRate": parseInt(formState?.rate),//
      "hstnumDeliveryDays": parseInt(formState?.deliveryDay),//bbb
      "hstnumCgst": parseInt(formState?.cgst),//
      "hstnumSgst": parseInt(formState?.sgst),//
      "hstnumDiscount": parseInt(formState?.discount),//bbb
      "gstrRemarks": formState?.remarks,//
      "hstdtContractFrmdate": new Date(formState?.contractFrom),//
      "hstdtContractTodate": new Date(formState?.contractTo),//
      // "hstnumDccRequireFlag": formState?.isDccMandatory ? 1 : 0,

      "hstnumRcNo": "",//
      "hstdtFinancialStartDate": `${y - 1}-04-01T00:00:00`,//
      "hstdtFinancialEndDate": `${y}-03-31T00:00:00`,//
      "hstdtTenderDate": new Date(formState?.tenderDate),//
      "sstnumItemCatNo": 10,//
      // "hstnumTenderId": 5001
      "hststrFileName": fileName,
      'strDraftFlag': isdraft
    }

    console.log('val', val)

    addHpRcDetails(val)?.then((data) => {
      if (data?.status === 1) {
        ToastAlert('Rate Contract Added Successfully', 'success');
        handleReset();
        dispatch(hidePopup());
      } else {
        ToastAlert(data?.message, 'error');
      }
      console.log('data', data)
    })

  }

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile?.name);
      saveHpRcFileUpload(formData)?.then((res) => {
        if (res?.status === 1) {
          setIsFileUploaded(true);
          setFileName(res?.data?.fileName);
          setSelectedFile(null);
          ToastAlert("File uploaded", 'success')
        } else {
          ToastAlert(res?.msg, 'error');
        }
        console.log('res', res);
      })
    } else {
      ToastAlert("Please select a file", 'error');
    }

  }

  const handleViewAction = (row) => {
    getHpRcSuppEmdDetails(998, row?.numSupplierId, row?.hstnumTenderNo)?.then((res) => {
      if (res?.status === 1) {
        setViewDetails(res?.data);
        setViewModal(true);
      } else {
        setViewDetails([]);
        setViewModal(false);
      }
    });

  }

  const onCloseModal = () => {
    setViewModal(false);
    setViewDetails([]);
  }

  const existingRcTableCols = [
    { header: "Supplier Name", field: "strSupplierName", width: "20%" },
    { header: "Level", field: "strLevelTypeName", width: "8%" },
    { header: "Rate/Unit", field: "strTax" },
    { header: "RC No.", field: "hstnumRcNo" },
    {
      header: "Contract Validity", field: "hstdtContractTodate", width: "20%", isJSX: true, ele: (row) => (
        <div style={{
          textAlign: "center"
        }}>
          <span>{`${parseDate(row?.hstdtContractFrmdate)} To ${parseDate(row?.hstdtContractTodate)}`}</span>
        </div>
      )
    },
    {
      header: "Tender No.", field: "tenderNo", isJSX: true, width: "18%", ele: (row) => (
        <div style={{
          textAlign: "center"
        }}>
          <span>{`${row?.strTenderRefNo}(${row?.hstnumTenderNo})`}</span>
        </div>
      )
    },
    {
      header: "BG Details", field: "bgAmt", isJSX: true, width: "8%",
      ele: (row) => (
        <div style={{
          textAlign: "center"
        }}>
          <button className="btn btn-sm btn-success" style={{ padding: "1px 3px" }} onClick={() => handleViewAction(row)} title="View"><FontAwesomeIcon icon={faEye} size='sm' /></button>
        </div>
      ),
    },
  ];

  const mstModalColumn = [
    { label: "Supplier Name", key: "strSupplier" },
    { label: "Tender No.", key: "strTenderRefNo", isJSX: true, ele: (row) => (<span>{row?.strTenderRefNo?.split('^')[0]}</span>) },
    { label: "EMD Amount(₹)", key: "hstnumBgAmt" },
    { label: "EMD From Date", key: "hstdtBgFrmDate" },
    { label: "EMD To Date", key: "hstdtBgToDate" },
    { label: "EMD No.", key: "hstnumBgNo" },
    { label: "Refund Amount(₹)", key: "hstnumRefundAmount" },
  ]

  return (
    <section className="unified-wrapper">
      <h3 className="unified-wrapper__heading">
        Rate Contract Itemwise Details
      </h3>
      <div className="unified-wrapper__container">
        <h4 className="unified-wrapper__container-heading">
          RC Type Details
        </h4>
        <div>
          <label htmlFor="supplierName" className="Wrapper__label">
            <b>Store Name</b> : {storeName}
          </label>
          <label htmlFor="contractType" className="Wrapper__label">
            <b>Contract Type</b> : {contractName}
          </label>
          <div>
            <ComboDropDown
              options={drugBrandList}
              onChange={(e) => {
                setDrugName(e?.target?.value);
                // setItemID(drugList?.find(dt => dt?.value == e?.target?.value)?.itemId || null)
                seterrors({ ...errors, 'drugNameErr': "" });
              }}
              name={"drugName"}
              value={drugName}
              label={'Drug Name :'}
            />
            {errors?.drugNameErr &&
              <span className="text-sm text-[#9b0000] mt-1 ms-1">
                {errors?.drugNameErr}
              </span>
            }
          </div>
        </div>

      </div>
      <h5 className="bg-[#097080] text-white p-1 rounded">
        Existing Rate Contract
      </h5>
      <div style={{ marginBottom: "3rem" }}>
        <DataTable
          masterName={"Existing Rate Contract"}
          ref={dataTableRef}
          columns={existingRcTableCols}
          data={existingRCs}
          isReport={false}
          isPagination={false}
          isSearchReq={false}
        />
      </div>

      <div className="unified-wrapper__container">
        <h4 className="unified-wrapper__container-heading">
          Contract Details
        </h4>

        <div>
          <ComboDropDown
            options={suppliers?.filter(dt => dt?.value !== '0')}
            onChange={handleChange}
            name={"supplierName"}
            value={formState?.supplierName}
            label={"Tender No.:"}
            isRequired
          />
          {errors?.supplierNameErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.supplierNameErr}
            </span>
          }
        </div>

        <div>
          <ComboDropDown
            options={tenderNoList}
            onChange={handleChange}
            name={"tenderNo"}
            value={formState?.tenderNo}
            isDisabled={tenderNoList?.length === 1}
            label={"Tender No.:"}
            isRequired
          />
          {errors?.tenderNoErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.tenderNoErr}
            </span>
          }
        </div>

        <div>
          <label htmlFor="" className="Wrapper__label mb-0">
            Contract From :{" "}
            <span className="fs-6 fw-normal">{formState?.contractFrom}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="Wrapper__label mb-0">
            Contract To :{" "}
            <span className="fs-6 fw-normal">{formState?.contractTo}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="Wrapper__label mb-0">
            RC Finalization Date :{" "}
            <span className="fs-6 fw-normal">{formState?.rcFinalDate}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="Wrapper__label mb-0">
            Quotation No. :{" "}
            <span className="fs-6 fw-normal">{formState?.quotationNo}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="Wrapper__label mb-0">
            Acceptance Date :{" "}
            <span className="fs-6 fw-normal">{formState?.acceptanceDate}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="Wrapper__label mb-0">
            Financial Committee Date :{" "}
            <span className="fs-6 fw-normal">
              {formState?.financeCommitteDate}
            </span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="Wrapper__label mb-0">
            Bank Name :{" "}
            <span className="fs-6 fw-normal">{formState?.bankName}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="Wrapper__label mb-0">
            Branch Name :{" "}
            <span className="fs-6 fw-normal">{formState?.branchName}</span>{" "}
          </label>
        </div>
        <div>
          <label htmlFor="" className="Wrapper__label mb-0">
            Bank IFSC Code :{" "}
            <span className="fs-6 fw-normal">{formState?.bankIfscCode}</span>{" "}
          </label>
        </div>
      </div>

      <div className="unified-wrapper__container">
        <h4 className="unified-wrapper__container-heading">
          Tender Details
        </h4>

        <div>
          <InputField
            id="contractedQty"
            className="Wrapper__inputs"
            type="text"
            name={"contractedQty"}
            placeholder="Enter Qty."
            value={formState?.contractedQty}
            onChange={handleChange}
            isNumber
            label={"Contracted Qty. :"}
          />
        </div>

        <div>
          <InputField
            id="shelfLife"
            className="Wrapper__inputs"
            type="text"
            name={"shelfLife"}
            placeholder="Enter value"
            value={formState?.shelfLife}
            onChange={handleChange}
            isNumber
            label={"Shelf Life(In days) :"}
            isError={errors?.shelfLifeErr}
            isRequired
          />
        </div>

        <div>
          <ComboDropDown
            options={batchSizeOptions}
            onChange={handleChange}
            name={"noOfBatches"}
            value={formState?.noOfBatches}
            label={'No of Batches :'}
          />
          {errors?.noOfBatchesErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.noOfBatchesErr}
            </span>
          }
        </div>

        <div className="">
          <label className="Wrapper__label required-label d-block">
            {" "}
            Whether Imported:
          </label>
          <RadioButton
            label="Yes"
            name="whetherImported"
            value="Yes"
            checked={whetherImported === "Yes"}
            onChange={(e) => setWhetherImported(e?.target?.value)}
            className="ms-2"
          />
          <RadioButton
            label="No"
            name="whetherImported"
            value="No"
            checked={whetherImported === "No"}
            onChange={(e) => setWhetherImported(e?.target?.value)}
            className="ms-2"
          />
        </div>

        <div>
          <ComboDropDown
            options={levelType}
            onChange={handleChange}
            name={"level"}
            value={formState?.level}
            label={'Level :'}
          />
          {errors?.levelErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.levelErr}
            </span>
          }
        </div>

        <div>
          <InputField
            id="allocationQty"
            className="Wrapper__inputs"
            type="text"
            name={"allocationQty"}
            placeholder="Enter qty"
            value={formState?.allocationQty}
            onChange={handleChange}
            isNumber
            label={"Allocation of Ordered Qty.(%) :"}
          />
        </div>

        <div>
          <ComboDropDown
            options={taxTypes}
            onChange={handleChange}
            name={"taxType"}
            value={formState?.taxType}
            label={'Tax Type :'}
          />
          {errors?.taxTypeErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.taxTypeErr}
            </span>
          }
        </div>

        <div>
          <InputField
            id="cgst"
            className="Wrapper__inputs"
            type="text"
            name={"cgst"}
            placeholder="Enter value"
            value={formState?.cgst}
            onChange={handleChange}
            isNumber
            label={'CGST (%) :'}
            isError={errors?.cgstErr}
            isRequired
          />
        </div>

        <div>
          <InputField
            id="sgst"
            className="Wrapper__inputs"
            type="text"
            name={"sgst"}
            placeholder="Enter value"
            value={formState?.sgst}
            onChange={handleChange}
            isNumber
            label={'SGST (%) :'}
            isError={errors?.sgstErr}
            isRequired
          />
        </div>
        <div>
          <label
            htmlFor="rate"
            className="Wrapper__label required-label"
          >
            Rate/Unit
          </label>
          <div className="row">
            <div className="col-4">
              <InputField
                id="rate"
                className="Wrapper__inputs"
                type="text"
                name={"rate"}
                placeholder="Enter value"
                value={formState?.rate}
                onChange={handleChange}
                isNumber
              />
            </div>
            <ComboDropDown
              options={unitDrpDt}
              onChange={handleChange}
              name={"unit"}
              value={formState?.unit}
              addOnClass="col-8 m-0"
            />
          </div>
          {errors?.rateUnitErr &&
            <span className="text-sm text-[#9b0000] mt-1 ms-1">
              {errors?.rateUnitErr}
            </span>
          }
        </div>

        <div>
          <InputField
            id="deliveryDay"
            className="Wrapper__inputs"
            type="text"
            name={"deliveryDay"}
            placeholder="Enter days"
            value={formState?.deliveryDay}
            onChange={handleChange}
            isNumber
            label={"Delivery Day's :"}
            isError={errors?.deliveryDayErr}
            isRequired
          />
        </div>
        <div>
          <InputField
            id="discount"
            className="Wrapper__inputs"
            type="text"
            name={"discount"}
            placeholder="Enter discount"
            value={formState?.discount}
            onChange={handleChange}
            isNumber
            label={"Discount (%) :"}
          />
        </div>
      </div>

      <div className="unified-wrapper__container">
        <h4 className="unified-wrapper__container-heading">
          Specification Upload
        </h4>

        <div>
          <label htmlFor="remarks" className="Wrapper__label">
            Remarks :
          </label>
          <textarea
            id="remarks"
            className="Wrapper__inputs"
            type="text"
            name={"remarks"}
            placeholder="Enter here..."
            value={formState?.remarks}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="file" className="Wrapper__label d-block">
            Upload File (PDF) :
          </label>
          {isFileUploaded ?
            (<>
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => getHpRcDownloadFile(fileName)}
              >
                {fileName}
              </span>
              <span className="text-danger ms-2" title="Remove File" onClick={() => { setIsFileUploaded(false); setFileName("") }} role="button"> <FontAwesomeIcon icon={faClose} size="sm" /></span>
            </>) :
            (<>
              <input
                className="Wrapper__inputs fileUpload w-50"
                type="file"
                onChange={onFileChange}
                role='button'
              />

              <button
                className="buttons__container-controls-btn ms-2"
                onClick={handleFileUpload}
              >
                Upload File
              </button>
            </>)
          }
        </div>


      </div>

      <div className="">
        <h5 className="bg-[#097080] text-white p-1 rounded">EMD Details</h5>

        <div style={{ marginBottom: "3rem" }}>
          <DataTable
            masterName={""}
            ref={null}
            columns={bgdetailsTableCols}
            data={bgList}
            isReport={false}
            isPagination={false}
            isSearchReq={false}
          />
        </div>
      </div>

      {viewModal &&
        <MasterPopUpModal title={'EMD Details'} onCloseModal={onCloseModal} column={mstModalColumn} data={viewDetails} />
      }

      <BottomButtons isSave={true} isReset={true} isClose={true} onSave={() => handleSave('0')} onReset={handleReset} onClose={handleClose} onDraft={() => handleSave('1')} isDraft={true} />

    </section>
  );
}

export default RateContractAddHP

import React from 'react'

const RcModifyViewFormHP = () => {
    return (
        <section className="rateContractAddJHK">
            <h3 className="rateContractAddJHK__heading">
                Rate Contract Itemwise Details
            </h3>
            <div className="rateContractAddJHK__container">
                <h4 className="rateContractAddJHK__container-heading">
                    RC Type Details
                </h4>
                <div>
                    <label htmlFor="supplierName" className="rateContractAddJHK__label">
                        <b>Store Name</b> : {storeName}
                    </label>
                    <label htmlFor="contractType" className="rateContractAddJHK__label">
                        <b>Contract Type</b> : {contractName}
                    </label>
                    <div>
                        <label
                            htmlFor="taxType"
                            className="rateContractAddJHK__label required-label"
                        >
                            <b>Drug Name</b>
                        </label>
                        <ComboDropDown
                            options={drugList}
                            onChange={(e) => {
                                setDrugName(e?.target?.value);
                                setItemID(drugList?.find(dt => dt?.value == e?.target?.value)?.itemId || null)
                            }}
                            name={"drugName"}
                            value={drugName}
                        />
                        {errors?.drugNameErr &&
                            <span className="text-sm text-[#9b0000] mt-1 ms-1">
                                {errors?.drugNameErr}
                            </span>
                        }
                    </div>
                </div>

            </div>
            <h4 className="bg-[#097080] text-white p-2 rounded">
                Existing Rate Contract
            </h4>
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

            <div className="rateContractAddJHK__container">
                <h4 className="rateContractAddJHK__container-heading">
                    Contract Details
                </h4>

                <div>
                    <label
                        htmlFor="taxType"
                        className="rateContractAddJHK__label required-label"
                    >
                        Supplier Name:
                    </label>
                    <SelectBox
                        id="supplierName"
                        options={suppliers}
                        onChange={handleChange}
                        name={"supplierName"}
                        value={formState?.supplierName}
                        className="Wrapper__select p-4"
                        error={errors?.supplierNameErr}
                    />
                </div>

                <div>
                    <label
                        htmlFor="taxType"
                        className="rateContractAddJHK__label required-label"
                    >
                        Tender No.:
                    </label>
                    <SelectBox
                        id="tenderNo"
                        options={[]}
                        onChange={handleChange}
                        name={"tenderNo"}
                        value={formState?.tenderNo}
                        placeholder={`${formState?.tenderNo ? formState?.tenderNo : 'select value'}`}
                        className="Wrapper__select p-4"
                        disabled={formState?.tenderNo}
                        error={formState?.tenderNo ? "" : errors?.tenderNoErr}
                    />
                </div>

                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Contract From :{" "}
                        <span className="fs-6 fw-normal">{formState?.contractFrom}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Contract To :{" "}
                        <span className="fs-6 fw-normal">{formState?.contractTo}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        RC Finalization Date :{" "}
                        <span className="fs-6 fw-normal">{formState?.rcFinalDate}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Quotation No. :{" "}
                        <span className="fs-6 fw-normal">{formState?.quotationNo}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Acceptance Date :{" "}
                        <span className="fs-6 fw-normal">{formState?.acceptanceDate}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Financial Committee Date :{" "}
                        <span className="fs-6 fw-normal">
                            {formState?.financeCommitteDate}
                        </span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Bank Name :{" "}
                        <span className="fs-6 fw-normal">{formState?.bankName}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Branch Name :{" "}
                        <span className="fs-6 fw-normal">{formState?.branchName}</span>{" "}
                    </label>
                </div>
                <div>
                    <label htmlFor="" className="rateContractAddJHK__label mb-0">
                        Bank IFSC Code :{" "}
                        <span className="fs-6 fw-normal">{formState?.bankIfscCode}</span>{" "}
                    </label>
                </div>
            </div>

            <div className="rateContractAddJHK__container">
                <h4 className="rateContractAddJHK__container-heading">
                    Tender Details
                </h4>

                <div>
                    <label htmlFor="contractedQty" className="employeeMaster__label">
                        Contracted Qty.
                    </label>
                    <InputField
                        id="contractedQty"
                        className="rateContractAddJHK__input"
                        type="text"
                        name={"contractedQty"}
                        placeholder="Enter Qty."
                        value={formState?.contractedQty}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label
                        htmlFor="shelfLife"
                        className="employeeMaster__label required-label"
                    >
                        Shelf Life(In days)
                    </label>
                    <InputField
                        id="shelfLife"
                        className="rateContractAddJHK__input"
                        type="text"
                        name={"shelfLife"}
                        placeholder="Enter value"
                        value={formState?.shelfLife}
                        onChange={handleChange}
                    />
                    {errors?.shelfLifeErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.shelfLifeErr}
                        </span>
                    }
                </div>

                <div>
                    <label
                        htmlFor="taxType"
                        className="rateContractAddJHK__label required-label"
                    >
                        No of Batches:
                    </label>
                    <ComboDropDown
                        options={batchSizeOptions}
                        onChange={handleChange}
                        name={"noOfBatches"}
                        value={formState?.noOfBatches}
                    />
                    {errors?.noOfBatchesErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.noOfBatchesErr}
                        </span>
                    }
                </div>

                <div className="bankmaster__container">
                    <label className="bankmaster__label required-label">
                        {" "}
                        Whether Imported:
                    </label>
                    <RadioButton
                        label="Yes"
                        name="whetherImported"
                        value="Yes"
                        checked={whetherImported === "Yes"}
                        onChange={(e) => setWhetherImported(e?.target?.value)}
                    />
                    <RadioButton
                        label="No"
                        name="whetherImported"
                        value="No"
                        checked={whetherImported === "No"}
                        onChange={(e) => setWhetherImported(e?.target?.value)}
                    />
                </div>

                <div>
                    <label
                        htmlFor="level"
                        className="rateContractAddJHK__label required-label"
                    >
                        Level
                    </label>
                    <ComboDropDown
                        options={levelType}
                        onChange={handleChange}
                        name={"level"}
                        value={formState?.level}
                    />
                    {errors?.levelErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.levelErr}
                        </span>
                    }
                </div>

                <div>
                    <label htmlFor="allocationQty" className="employeeMaster__label">
                        Allocation of Ordered Qty.(%)
                    </label>
                    <InputField
                        id="allocationQty"
                        className="rateContractAddJHK__input"
                        type="text"
                        name={"allocationQty"}
                        placeholder="Enter qty"
                        value={formState?.allocationQty}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label
                        htmlFor="taxType"
                        className="rateContractAddJHK__label required-label"
                    >
                        Tax Type
                    </label>
                    <ComboDropDown
                        options={taxTypes}
                        onChange={handleChange}
                        name={"taxType"}
                        value={formState?.taxType}
                    />
                    {errors?.taxTypeErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.taxTypeErr}
                        </span>
                    }
                </div>

                <div>
                    <label
                        htmlFor="cgst"
                        className="employeeMaster__label required-label"
                    >
                        CGST (%)
                    </label>
                    <InputField
                        id="cgst"
                        className="rateContractAddJHK__input"
                        type="text"
                        name={"cgst"}
                        placeholder="Enter value"
                        value={formState?.cgst}
                        onChange={handleChange}
                    />
                    {errors?.cgstErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.cgstErr}
                        </span>
                    }
                </div>

                <div>
                    <label
                        htmlFor="sgst"
                        className="employeeMaster__label required-label"
                    >
                        SGST (%)
                    </label>
                    <InputField
                        id="sgst"
                        className="rateContractAddJHK__input"
                        type="text"
                        name={"sgst"}
                        placeholder="Enter value"
                        value={formState?.sgst}
                        onChange={handleChange}
                    />
                    {errors?.sgstErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.sgstErr}
                        </span>
                    }
                </div>
                <div>
                    <label
                        htmlFor="rate"
                        className="employeeMaster__label required-label"
                    >
                        Rate/Unit
                    </label>
                    <div className="row">
                        <div className="col-4">
                            <InputField
                                id="rate"
                                className="rateContractAddJHK__input"
                                type="text"
                                name={"rate"}
                                placeholder="Enter value"
                                value={formState?.rate}
                                onChange={handleChange}
                            />
                        </div>
                        <ComboDropDown
                            options={unitDrpDt}
                            onChange={handleChange}
                            name={"unit"}
                            value={formState?.unit}
                            addOnClass="col-8"
                        />
                    </div>
                    {errors?.rateUnitErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.rateUnitErr}
                        </span>
                    }
                </div>

                <div>
                    <label
                        htmlFor="deliveryDay"
                        className="employeeMaster__label required-label"
                    >
                        Delivery Day(s)
                    </label>
                    <InputField
                        id="deliveryDay"
                        className="rateContractAddJHK__input"
                        type="text"
                        name={"deliveryDay"}
                        placeholder="Enter days"
                        value={formState?.deliveryDay}
                        onChange={handleChange}
                    />
                    {errors?.deliveryDayErr &&
                        <span className="text-sm text-[#9b0000] mt-1 ms-1">
                            {errors?.deliveryDayErr
                            }
                        </span>
                    }
                </div>
                <div>
                    <label htmlFor="discount" className="employeeMaster__label">
                        Discount (%)
                    </label>
                    <InputField
                        id="discount"
                        className="rateContractAddJHK__input"
                        type="text"
                        name={"discount"}
                        placeholder="Enter discount"
                        value={formState?.discount}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="rateContractAddJHK__container">
                <h4 className="rateContractAddJHK__container-heading">
                    Specification Upload
                </h4>

                <div>
                    <label htmlFor="file" className="employeeMaster__label">
                        Specification (pdf) :
                    </label>
                    <input
                        className="rateContractAddJHK__fileUpload"
                        type="file"
                        placeholder='Choose file...'
                        onChange={onFileChange}
                    />
                    {/* <button
            className="bankmaster__container-controls-btn"
            // onClick={handleFileUpload}
          >
            Upload File
          </button> */}
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
            </div>

            <div className="">
                <h4 className="bg-[#097080] text-white p-2 rounded">EMD Details</h4>

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

            <div className="bankmaster__container-controls">
                <button className="bankmaster__container-controls-btn" onClick={handleSave}>Save</button>
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
        </section>
    )
}

export default RcModifyViewFormHP

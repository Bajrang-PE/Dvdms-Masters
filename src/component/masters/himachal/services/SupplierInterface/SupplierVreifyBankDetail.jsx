import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../../../../features/commons/popupSlice';
import { supplierbankdtl } from '../../../../../api/Himachal/services/suppInterfaceAPI_HP';
import BottomButtons from '../../../../commons/BottomButtons';
import { ToastAlert } from '../../../../../utils/Toast';

const SupplierVreifyBankDetail = ({ rowData, selectedSupplier }) => {
    const dispatch = useDispatch();

    const [bankData, setBankData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        dispatch(hidePopup());
    };

    const getValue = (value) => {
        if (value === undefined || value === null || String(value).trim() === "") {
            return "-";
        }
        return value;
    };

    const loadBankDetails = async () => {
        try {
            const suppId =
                rowData?.numSupplierId ||
                rowData?.supplierId ||
                selectedSupplier?.value;

            if (!suppId) {
                ToastAlert("Supplier Id not found", "warning");
                return;
            }

            setLoading(true);

            const res = await supplierbankdtl({
                hospCode: 998,
                suppId: suppId,
            });

            console.log("Supplier Bank Detail Response => ", res);

            if (res?.status === 1) {
                setBankData(res?.data || {});
            } else {
                setBankData({});
                ToastAlert(res?.msg || "Bank detail not found", "error");
            }
        } catch (error) {
            console.error("Bank detail API error:", error);
            setBankData({});
            ToastAlert("Failed to fetch bank detail", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBankDetails();
    }, []);

    const details = [
        {
            label: "Bank Name",
            value: getValue(bankData?.bank_name),
        },
        {
            label: "Bank Branch Name",
            value: getValue(bankData?.branch_id),
        },
        {
            label: "Bank IFSC Code",
            value: getValue(bankData?.ifsc_code),
        },
        {
            label: "Account Number",
            value: getValue(bankData?.account_no),
        },
        {
            label: "Bank Address",
            value: getValue(bankData?.bank_address),
        },
    ];

    return (
        <section className="unified-wrapper">
            <h3 className="unified-wrapper__heading">
                Verify Bank Detail
            </h3>

            <div
                style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #d8e3e7",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    marginBottom: "18px",
                }}
            >
                <div
                    style={{
                        background: "linear-gradient(90deg, #087381, #20a67a)",
                        color: "#ffffff",
                        padding: "12px 18px",
                        fontWeight: "700",
                        fontSize: "16px",
                    }}
                >
                    {getValue(selectedSupplier?.label)} Bank Detail
                </div>

                {loading ? (
                    <div
                        style={{
                            padding: "25px",
                            textAlign: "center",
                            fontWeight: "600",
                        }}
                    >
                        Loading bank details...
                    </div>
                ) : (
                    <div style={{ padding: "18px" }}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                gap: "14px",
                            }}
                        >
                            {details.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "10px",
                                        padding: "12px 14px",
                                        background: "#f8fafc",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#64748b",
                                            fontWeight: "700",
                                            marginBottom: "5px",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {index + 1}. {item.label}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "15px",
                                            color: "#0f172a",
                                            fontWeight: "600",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <BottomButtons
                isDraft={false}
                isSave={false}
                isReset={false}
                isClose={true}
                onClose={handleClose}
            />
        </section>
    );
};

export default SupplierVreifyBankDetail;
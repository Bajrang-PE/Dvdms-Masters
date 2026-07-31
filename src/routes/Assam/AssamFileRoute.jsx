import { lazy } from "react";
import { Route } from "react-router-dom";
const RateContract = lazy(() => import("../../component/masters/assam/services/RateContract"));
const RateContractAddAssam = lazy(() => import("../../component/masters/assam/services/RateContract/RateContractAdd"));
const BankMasterList = lazy(() => import("../../component/masters/assam/admin/lists/BankMasterList"));
const CentralPurchaseOrder = lazy(() => import("../../component/masters/assam/services/CentralPurchaseOrder/CentralPurchaseOrder"));

export const AssamFileRoute = (
    <>
        {/* -------------------SERVICES------------------------------------------------------------------- */}
        <Route path="/rate-contract" element={<RateContract />} />
        <Route path="/bank-master" element={<BankMasterList />} />
        {/* <Route path="/rate-contract/add" element={<RateContractAddAssam />} /> */}

        <Route path="/central-purchase-order" element={<CentralPurchaseOrder />} />

        {/* -------------------MASTERS-------------------------------------------------------------------- */}

    </>
);

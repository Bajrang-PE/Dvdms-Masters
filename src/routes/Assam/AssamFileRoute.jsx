import { lazy } from "react";
import { Route } from "react-router-dom";
import CentralPurchaseOrder from "../../component/masters/assam/services/CentralPurchaseOrder/CentralPurchaseOrder.JSX";
const RateContract = lazy(() => import("../../component/masters/assam/services/RateContract"));
const RateContractAddAssam = lazy(() => import("../../component/masters/assam/services/RateContract/RateContractAdd"));
const BankMasterList = lazy(() => import("../../component/masters/assam/admin/lists/BankMasterList"));

export const AssamFileRoute = (
    <>
        {/* -------------------SERVICES------------------------------------------------------------------- */}
        <Route path="/rate-contract" element={<RateContract />} />
        <Route path="/bank-master" element={<BankMasterList />} />
        <Route path="/rate-contract/add" element={<RateContractAddAssam />} />


         <Route path="/central-purchase-order" element={<CentralPurchaseOrder />} />

        {/* -------------------MASTERS-------------------------------------------------------------------- */}

    </>
);

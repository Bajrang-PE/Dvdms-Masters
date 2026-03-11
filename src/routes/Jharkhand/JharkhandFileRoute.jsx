import { lazy } from "react";
import { Route } from "react-router-dom";
import DccUploadJH from "../../component/masters/jharkhand/services/DccUpload/DccUploadJH";
import ChallanProcessJh from "../../component/masters/jharkhand/services/ChallanProcess/ChallanProcessJh";
const RateContractJH = lazy(() => import("../../component/masters/jharkhand/services/RateContract"));
const BankMasterJH = lazy(() => import("../../component/masters/jharkhand/admin/lists/BankMasterJH"));
const SingleProgPoDeskJH = lazy(() => import("../../component/masters/jharkhand/services/SingleProgPoDeskJH"));
const BankBranchMasterJH = lazy(() => import("../../component/masters/jharkhand/admin/lists/BankBranchMasterJH"));
const SupplierInterfaceDeskJH = lazy(() => import("../../component/masters/jharkhand/services/SupplierInterfaceDeskJH"));

export const JharkhandFileRoute = (
    <>
        {/* -------------------SERVICES------------------------------------------------------------------- */}
        <Route path="/rate-contract" element={<RateContractJH />} />
        <Route path="/single-prog-po-desk" element={<SingleProgPoDeskJH />} />
        <Route path="/supplier-interface-desk" element={<SupplierInterfaceDeskJH />} />
        <Route path="/dcc-upload" element={<DccUploadJH />} />
        <Route path="/challan-process" element={<ChallanProcessJh />} />

        {/* -------------------MASTERS-------------------------------------------------------------------- */}
        <Route path="/bank-master" element={<BankMasterJH />} />
        <Route path="/bank-branch-master" element={<BankBranchMasterJH />} />
    </>
);

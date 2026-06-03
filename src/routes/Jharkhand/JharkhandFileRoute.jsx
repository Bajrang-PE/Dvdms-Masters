import { lazy } from "react";
import { Route } from "react-router-dom";
const DccUploadJH = lazy(() => import("../../component/masters/jharkhand/services/DccUpload/DccUploadJH"));
const ChallanProcessJh = lazy(() => import("../../component/masters/jharkhand/services/ChallanProcess/ChallanProcessJH"));
const SinglePoApprovalListJH = lazy(() => import("../../component/masters/jharkhand/services/SingleProgPoApprovalJH/SinglePoApprovalListJH"));
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
        <Route path="/single-prog-po-approval" element={<SinglePoApprovalListJH />} />

        {/* -------------------MASTERS-------------------------------------------------------------------- */}
        <Route path="/bank-master" element={<BankMasterJH />} />
        <Route path="/bank-branch-master" element={<BankBranchMasterJH />} />
    </>
);

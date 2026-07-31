import { lazy } from "react";
import { Route } from "react-router-dom";

const RateContractHP = lazy(() => import("../../component/masters/himachal/services/RateContractHP"));
const PoGenerationHP = lazy(() => import("../../component/masters/himachal/services/PoGenerationHP"));
const PoApprovalListHP = lazy(() => import("../../component/masters/himachal/services/poApproval/poApprovalListHP"));
const PoCancelationHP = lazy(() => import("../../component/masters/himachal/services/poCancelation/PoCancelationHP"));
const SupplierInterfaceList = lazy(() => import("../../component/masters/himachal/services/SupplierInterface/SupplierInterfaceList"));

export const HimachalFileRoute = (
    <>
        {/* -------------------SERVICES------------------------------------------------------------------- */}
        <Route path="/rate-contract" element={<RateContractHP />} />
        <Route path="/po-generation" element={<PoGenerationHP />} />
        <Route path="/po-approval" element={<PoApprovalListHP />} />
        <Route path="/po-cancelation" element={<PoCancelationHP />} />
        <Route path="/supplier-interface-desk" element={<SupplierInterfaceList />} />


        {/* -------------------MASTERS-------------------------------------------------------------------- */}

    </>
);
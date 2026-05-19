import { lazy } from "react";
import { Route } from "react-router-dom";
import RateContractHP from "../../component/masters/himachal/services/RateContractHP";
import PoGenerationHP from "../../component/masters/himachal/services/PoGenerationHP";
import PoApprovalListHP from "../../component/masters/himachal/services/poApproval/poApprovalListHP";
import PoCancelationHP from "../../component/masters/himachal/services/poCancelation/PoCancelationHP";
import SupplierInterfaceList from "../../component/masters/himachal/services/SupplierInterface/SupplierInterfaceList";
// const RateContractJH = lazy(() => import("../../component/masters/jharkhand/services/RateContract"));

export const HimachalFileRoute = (
    <>
        {/* -------------------SERVICES------------------------------------------------------------------- */}
        <Route path="/rate-contract" element={<RateContractHP />} />
        <Route path="/po-generation" element={<PoGenerationHP />} />
        <Route path="/po-approval" element={<PoApprovalListHP />} />
        <Route path="/po-cancelation" element={<PoCancelationHP />} />
        <Route path="/supplier-interface-desk" element={<SupplierInterfaceList  />} />


        {/* -------------------MASTERS-------------------------------------------------------------------- */}

    </>
);
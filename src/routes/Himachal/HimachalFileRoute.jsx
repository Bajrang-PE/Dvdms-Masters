import { lazy } from "react";
import { Route } from "react-router-dom";
import RateContractHP from "../../component/masters/himachal/services/RateContractHP";
import PoGenerationHP from "../../component/masters/himachal/services/PoGenerationHP";
// const RateContractJH = lazy(() => import("../../component/masters/jharkhand/services/RateContract"));

export const HimachalFileRoute = (
    <>
        {/* -------------------SERVICES------------------------------------------------------------------- */}
        <Route path="/rate-contract" element={<RateContractHP />} />
        <Route path="/po-generation" element={<PoGenerationHP />} />


        {/* -------------------MASTERS-------------------------------------------------------------------- */}

    </>
);
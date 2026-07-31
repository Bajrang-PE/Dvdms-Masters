import { lazy } from "react";
import { Route } from "react-router-dom";

const RateContract = lazy(()=>import("../../component/masters/UP/services/RateContract/RateContract"))


export const UPFileRoute = (
    <>
        {/* -------------------SERVICES------------------------------------------------------------------- */}
        <Route path="/rate-contract" element={<RateContract />} />
 

        {/* -------------------MASTERS-------------------------------------------------------------------- */}

    </>
);

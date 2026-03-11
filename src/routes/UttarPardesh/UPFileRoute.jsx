import { lazy } from "react";
import { Route } from "react-router-dom";
import RateContract from "../../component/masters/UP/services/RateContract/RateContract";


export const UPFileRoute = (
    <>
        {/* -------------------SERVICES------------------------------------------------------------------- */}
        <Route path="/rate-contract" element={<RateContract />} />
 

        {/* -------------------MASTERS-------------------------------------------------------------------- */}

    </>
);

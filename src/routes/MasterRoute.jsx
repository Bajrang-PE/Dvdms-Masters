import React from "react";
import { Route, Routes, useParams } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";
import RateContract from "../component/masters/assam/services/RateContract";
import AssamPrivateRoute from "./AssamPrivateRoute";
import JharkhandPrivateRoute from "./JharkhandPrivateRoute";
import RateContractJH from "../component/masters/jharkhand/services/RateContract";
// import RateContractAddForm from '../component/masters/jharkhand/services/RateContract/RateContractAdd'
import MenuTopBar from "../component/headers/MenuTopBar";
import BankMasterJH from "../component/masters/jharkhand/admin/lists/BankMasterJH";
import BankBranchMasterJH from "../component/masters/jharkhand/admin/lists/BankBranchMasterJH";
// import CommitteeTypeList from "../component/masters/assam/admin/lists/CommiteeTypeMasterList";
import RateContractAddAssam from "../component/masters/assam/services/RateContract/RateContractAdd";
import BankMasterList from "../component/masters/assam/admin/lists/BankMasterList";
import MenuTabBar from "../component/headers/MenuTabBar";
import MenuPage from "../pages/MenuPage";
import SingleProgPoDeskJH from "../component/masters/jharkhand/services/SingleProgPoDeskJH";
import SupplierInterfaceDeskJH from "../component/masters/jharkhand/services/SupplierInterfaceDeskJH";

const MasterRoute = () => {
  const { stateCode } = useParams();
  return (
    <>
      {stateCode && stateCode === "AS" && (
        <MenuTopBar
          title={"AMSCL, Govt. of Assam"}
          subtitle={"DVDMS (e-Aushadhi)"}
          logoUrl={"/logo.png"}
          isEmail={true}
          isLocation={true}
          bg={"#00000073"}
        />
      )}
      {stateCode && stateCode === "JH" && (
        <MenuTopBar
          title={"JMHIDPCL i-MCS"}
          subtitle={
            "Jharkhand Medical & Health Infrastructure Development & Procurement Corporation Ltd."
          }
          logoUrl={"/JH_Logo.png"}
          isEmail={true}
          isLocation={true}
          bg={"#00000073"}
        />
      )}
      <MenuTabBar />
      <Routes>
        <Route path="/" element={<MenuPage />} />

        {/* ASSAM */}
        {stateCode === "AS" && (
          <Route element={<AssamPrivateRoute />}>
            {/*Services*/}
            <Route path="/rate-contract" element={<RateContract />} />
            <Route path="/bank-master" element={<BankMasterList />} />
            <Route
              path="/rate-contract/add"
              element={<RateContractAddAssam />}
            />
          </Route>
        )}

        {/* JHARKHAND */}
        {stateCode === "JH" && (
          <Route element={<JharkhandPrivateRoute />}>
            {/* SERVICES */}
            <Route path="/rate-contract" element={<RateContractJH />} />
            <Route path="/single-prog-po-desk" element={<SingleProgPoDeskJH />} />
            <Route path="/supplier-interface-desk" element={<SupplierInterfaceDeskJH />} />

            {/* ADMIN */}
            <Route path="/bank-master" element={<BankMasterJH />} />
            <Route path="/bank-branch-master" element={<BankBranchMasterJH />} />
          </Route>
        )}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default MasterRoute;

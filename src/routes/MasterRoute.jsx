import React, { lazy, Suspense } from "react";
import { Route, Routes, useParams } from "react-router-dom";
const LoadingSpinner = lazy(() => import("../component/commons/LoadingSpinner"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const RateContract = lazy(() => import("../component/masters/assam/services/RateContract"));
const AssamPrivateRoute = lazy(() => import("./AssamPrivateRoute"));
const JharkhandPrivateRoute = lazy(() => import("./JharkhandPrivateRoute"));
const RateContractJH = lazy(() => import("../component/masters/jharkhand/services/RateContract"));
const MenuTopBar = lazy(() => import("../component/headers/MenuTopBar"));
const BankMasterJH = lazy(() => import("../component/masters/jharkhand/admin/lists/BankMasterJH"));
const BankBranchMasterJH = lazy(() => import("../component/masters/jharkhand/admin/lists/BankBranchMasterJH"));
const RateContractAddAssam = lazy(() => import("../component/masters/assam/services/RateContract/RateContractAdd"));
const BankMasterList = lazy(() => import("../component/masters/assam/admin/lists/BankMasterList"));
const MenuTabBar = lazy(() => import("../component/headers/MenuTabBar"));
const MenuPage = lazy(() => import("../pages/MenuPage"));
const SingleProgPoDeskJH = lazy(() => import("../component/masters/jharkhand/services/SingleProgPoDeskJH"));
const SupplierInterfaceDeskJH = lazy(() => import("../component/masters/jharkhand/services/SupplierInterfaceDeskJH"));

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
      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </>
  );
};

export default MasterRoute;

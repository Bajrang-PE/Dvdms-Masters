import React, { lazy, Suspense } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import { JharkhandFileRoute } from "./Jharkhand/JharkhandFileRoute";
import { AssamFileRoute } from "./Assam/AssamFileRoute";

const LoadingSpinner = lazy(() => import("../component/commons/LoadingSpinner"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const AssamPrivateRoute = lazy(() => import("./Assam/AssamPrivateRoute"));
const JharkhandPrivateRoute = lazy(() => import("./Jharkhand/JharkhandPrivateRoute"));
const MenuTopBar = lazy(() => import("../component/headers/MenuTopBar"));
const MenuTabBar = lazy(() => import("../component/headers/MenuTabBar"));
const MenuPage = lazy(() => import("../pages/MenuPage"));

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
          <Route index element={<MenuPage />} />

          {/* ASSAM */}
          {stateCode === "AS" && (
            <Route element={<AssamPrivateRoute />}>
              {/*Services*/}
              {AssamFileRoute}
            </Route>
          )}

          {/* JHARKHAND */}
          {stateCode === "JH" && (
            <Route element={<JharkhandPrivateRoute />}>
              {JharkhandFileRoute}
            </Route>
          )}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default MasterRoute;

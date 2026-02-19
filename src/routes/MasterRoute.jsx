import React, { lazy, Suspense } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import { JharkhandFileRoute } from "./Jharkhand/JharkhandFileRoute";
import { AssamFileRoute } from "./Assam/AssamFileRoute";
import HimachalPrivateRoute from "./Himachal/HimachalPrivateRoute";
import { HimachalFileRoute } from "./Himachal/HimachalFileRoute";
import { STATE_CONFIG } from "../utils/StateConfig";

const LoadingSpinner = lazy(() => import("../component/commons/LoadingSpinner"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const AssamPrivateRoute = lazy(() => import("./Assam/AssamPrivateRoute"));
const JharkhandPrivateRoute = lazy(() => import("./Jharkhand/JharkhandPrivateRoute"));
const MenuTopBar = lazy(() => import("../component/headers/MenuTopBar"));
const MenuTabBar = lazy(() => import("../component/headers/MenuTabBar"));
const MenuPage = lazy(() => import("../pages/MenuPage"));

const MasterRoute = () => {
  const { stateCode } = useParams();
  const stateConfig = STATE_CONFIG[stateCode];

  const PRIVATE_ROUTE_MAP = {
    AS: <Route element={<AssamPrivateRoute />}>{AssamFileRoute}</Route>,
    JH: <Route element={<JharkhandPrivateRoute />}>{JharkhandFileRoute}</Route>,
    HP: <Route element={<HimachalPrivateRoute />}>{HimachalFileRoute}</Route>,
  };


  return (
    <>
      {/* {stateCode && stateCode === "AS" && (
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
      )} */}

      {stateConfig && (
        <MenuTopBar {...stateConfig.topBar} />
      )}

      <Suspense fallback={<LoadingSpinner />}>
        <MenuTabBar />
        <Routes>
          <Route index element={<MenuPage />} />

          {/* ASSAM */}
          {/* {stateCode === "AS" && (
            <Route element={<AssamPrivateRoute />}>
              {AssamFileRoute}
            </Route>
          )} */}

          {/* JHARKHAND */}
          {/* {stateCode === "JH" && (
            <Route element={<JharkhandPrivateRoute />}>
              {JharkhandFileRoute}
            </Route>
          )} */}

          {/* {stateCode === "HP" && (
            <Route element={<HimachalPrivateRoute />}>
              {HimachalFileRoute}
            </Route>
          )} */}

          <Route>
            {PRIVATE_ROUTE_MAP[stateCode]}
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default MasterRoute;

import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./component/commons/LoadingSpinner";
import "./sass/main.scss";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import HomeWrapper from "./pages/HomeWrapper";
import MainPage from "./pages/MainPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import MenuPage from "./pages/MenuPage";
import PrivateRoute from "./routes/PrivateRoute";
import MasterRoute from "./routes/MasterRoute";

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/home" element={<MainPage />} />
          <Route path="/home/:stateCode" element={<HomeWrapper />} />

          {/* Example protected route */}
          <Route element={<PrivateRoute />}>
            <Route path="/home/:stateCode/menus" element={<MenuPage />} />
            <Route path="/home/:stateCode/menus/*" element={<MasterRoute />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

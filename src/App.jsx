import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "./component/commons/LoadingSpinner";
import "./sass/main.scss";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Toaster } from "react-hot-toast";

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const HomeWrapper = lazy(() => import("./pages/HomeWrapper"));
const PrivateRoute = lazy(() => import("./routes/PrivateRoute"));
const MasterRoute = lazy(() => import("./routes/MasterRoute"));
const MainPage2 = lazy(() => import("./pages/MainPage2"));

function App() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<MainPage2 />} />
          <Route path="/home" element={<MainPage2 />} />

          {/* Example protected route */}
          <Route element={<PrivateRoute />}>
            <Route path="/home/:stateCode" element={<HomeWrapper />} />
            <Route path="/home/:stateCode/menus/*" element={<MasterRoute />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />

    </>
  );
}

export default App;

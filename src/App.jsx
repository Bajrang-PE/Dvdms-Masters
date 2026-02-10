import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "./component/commons/LoadingSpinner";
import "./sass/main.scss";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '@fortawesome/fontawesome-free/css/all.min.css';

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const HomeWrapper = lazy(() => import("./pages/HomeWrapper"));
const PrivateRoute = lazy(() => import("./routes/PrivateRoute"));
const MasterRoute = lazy(() => import("./routes/MasterRoute"));
const MainPage2 = lazy(() => import("./pages/MainPage2"));

function App() {
  return (
    // <BrowserRouter>
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
    // </BrowserRouter>
  );
}

export default App;

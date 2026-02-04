import { Navigate, Outlet, useParams } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";

export default function AssamPrivateRoute() {
  // const token = localStorage.getItem("userToken");
  const user = localStorage.getItem("data");
  const userDt = JSON.parse(user);
  const { stateCode } = useParams();

  const hasStateAccess = (stateCode) => {
    return userDt?.state === "AS" && stateCode === "AS";
  };

  // if (!token) return <Navigate to="/" replace />;

  if (!hasStateAccess(stateCode)) return <NotFoundPage />;

  return <Outlet />;
}

import { lazy } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
const NotFoundPage = lazy(() => import("../../pages/NotFoundPage"));

export default function AssamPrivateRoute() {
  const user = localStorage.getItem("data");
  const userDt = JSON.parse(user);
  const { stateCode } = useParams();

  const hasStateAccess = (stateCode) => {
    return userDt?.state === "AS" && stateCode === "AS";
  };

  if (!hasStateAccess(stateCode)) return <NotFoundPage />;

  return <Outlet />;
}

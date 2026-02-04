import { lazy } from "react";
import { Outlet, useParams } from "react-router-dom";
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export default function PrivateRoute() {
  
  const user = localStorage.getItem("data");
  const userDt = JSON.parse(user);
  const { stateCode } = useParams();
  const hasStateAccess = (stateCode) => {
    return userDt?.state === stateCode && userDt?.isLogin === "true";
  };


  if (!hasStateAccess(stateCode)) return <NotFoundPage />;

  return (
    <>
      <Outlet />
    </>

  )
}

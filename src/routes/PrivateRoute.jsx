import { Navigate, Outlet, useParams } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";
// import MenuTabBar from "../component/headers/MenuTabBar";

export default function PrivateRoute() {
  // const token = localStorage.getItem("userToken");
  const user = localStorage.getItem("data");
  const userDt = JSON.parse(user);
  const { stateCode } = useParams();
  const hasStateAccess = (stateCode) => {
    return userDt?.state === stateCode && userDt?.isLogin === "true";
  };

  // if (!token) return <Navigate to="/" replace />;

  if (!hasStateAccess(stateCode)) return <NotFoundPage />;

  return (
    <>
      {/* <MenuTabBar /> */}
      <Outlet />
    </>

  )
}

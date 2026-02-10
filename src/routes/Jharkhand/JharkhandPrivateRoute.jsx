import { lazy } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
const NotFoundPage = lazy(() => import("../../pages/NotFoundPage"));

export default function JharkhandPrivateRoute() {
    const user = localStorage.getItem("data");
    const userDt = JSON.parse(user);
    const { stateCode } = useParams();

    const hasStateAccess = (stateCode) => {
        return userDt?.state === "JH" && stateCode === "JH";
    };

    if (!hasStateAccess(stateCode)) return <NotFoundPage />;

    return <Outlet />;
}

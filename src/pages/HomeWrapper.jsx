import { lazy, Suspense } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../component/commons/LoadingSpinner";

const AssamHomePage = lazy(() => import("./statePages/AssamHomePage"));
const JharkhandHomePage = lazy(() => import("./statePages/JharkhandHomePage"));
const HimachalHomePage = lazy(() => import("./statePages/HimachalHomePage"));
const UPHomePage = lazy(() => import("./statePages/UPHomePage"));

export default function HomeWrapper() {
  const { stateCode } = useParams();

  const statePages = {
    AS: <AssamHomePage />,
    JH: <JharkhandHomePage />,
    HP: <HimachalHomePage />,
    UP: <UPHomePage />,
  };

  // return statePages[stateCode] || <div>Invalid State</div>;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {statePages[stateCode] || <div>Invalid State</div>}
    </Suspense>
  );
}

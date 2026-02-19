import { useParams, useLocation, useNavigate } from "react-router-dom";
import AssamHomePage from "./statePages/AssamHomePage";
import JharkhandHomePage from "./statePages/JharkhandHomePage";
import HimachalHomePage from "./statePages/HimachalHomePage";
import UPHomePage from "./statePages/UPHomePage";

export default function HomeWrapper() {
  const { stateCode } = useParams();

  const statePages = {
    AS: <AssamHomePage />,
    JH: <JharkhandHomePage />,
    HP: <HimachalHomePage />,
    UP: <UPHomePage />,
  };

  return statePages[stateCode] || <div>Invalid State</div>;
}

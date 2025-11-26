import { useParams, useLocation, useNavigate } from "react-router-dom";
import AssamHomePage from "./statePages/AssamHomePage";
import JharkhandHomePage from "./statePages/JharkhandHomePage";

export default function HomeWrapper() {
  const { stateCode } = useParams();

  const statePages = {
    AS: <AssamHomePage  />,
    JH: <JharkhandHomePage />,
  };

  return statePages[stateCode] || <div>Invalid State</div>;
}

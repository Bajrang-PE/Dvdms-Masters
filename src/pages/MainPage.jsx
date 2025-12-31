import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../component/mainpage/Header";
import HomeSlider from "../component/mainpage/HomeSlider";
import CmsLogin from "../component/mainpage/CmsLogin";
import StateUts from "../component/mainpage/StateUts";
import Footer from "../component/mainpage/Footer";
import { fetchData, fetchPostData } from "../utils/ApiHook";

export default function MainPage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [showCmsLogin, setShowCmsLogin] = useState(false);

  const handleSubmit = async () => {
    try {
      const val = { gstrLoginId: username };
      fetchPostData("/auth/login-by-userName", val).then((data) => {
        const { data: response } = data;

        if (response?.status === 1) {
          const stateName = response?.data?.gstrStateshort || "";
          const userId = response?.data?.gnumUserid || "";
          if (stateName) {
            const data = {
              state: stateName,
              userId: userId,
              username: username,
            };
            navigate(`/home/${stateName}`, { state: { username, userId } });
            localStorage.setItem("data", JSON.stringify(data));
          } else {
            console.log("state code not return");
          }
        } else {
          console.log("object");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onCloseModal = () => {
    setShowCmsLogin(false);
  };

  return (
    <div>
      <Header setShowCmsLogin={setShowCmsLogin} />
      <HomeSlider />
      <div className="container py-4" style={{ maxWidth: "100%" }}>
        <StateUts />
      </div>
      <Footer />
      {showCmsLogin && (
        <CmsLogin
          isShow={showCmsLogin}
          onClose={onCloseModal}
          setUsername={setUsername}
          username={username}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

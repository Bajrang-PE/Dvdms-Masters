import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../component/mainpage/Header";
import HomeSlider from "../component/mainpage/HomeSlider";
import CmsLogin from "../component/mainpage/CmsLogin";
import StateUts from "../component/mainpage/StateUts";
import Footer from "../component/mainpage/Footer";
import { fetchData, fetchPostData } from "../utils/ApiHook";
// import { getUserState } from "../../utils/api";

export default function MainPage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [showCmsLogin, setShowCmsLogin] = useState(false);


  const handleSubmit = async () => {
    
    try {
      const val = { "gstrLoginId": username }
      fetchPostData("/auth/login-by-userName", val).then((data) => {
        if (data?.status === 1) {
          console.log(data, 'data');
          const stateName = data?.data?.gstrStateshort || ''
          if (stateName) {
            navigate(`/home/${stateName}`, { state: { username } });
          } else {
            console.log('state code not return');
          }
        } else {
          console.log('object');
        }
      })
    } catch (error) {

    }
    // const stateCode = await getUserState(username); 
    // navigate(`/home/${'AS'}`, { state: { username } });
  };

  const onCloseModal = () => {
    setShowCmsLogin(false);
  }

  return (
    <div>
      <Header setShowCmsLogin={setShowCmsLogin} />
      <HomeSlider />
      <div className='container py-4' style={{ maxWidth: "100%" }}>
        <StateUts />
      </div>
      <Footer />
      {showCmsLogin &&
        <CmsLogin isShow={showCmsLogin} onClose={onCloseModal} setUsername={setUsername} username={username} handleSubmit={handleSubmit} />
      }
    </div>
  );
}

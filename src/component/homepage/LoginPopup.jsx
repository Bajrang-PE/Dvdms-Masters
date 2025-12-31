import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRedo,
  FaUndo,
  FaTimes,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchPostData } from "../../utils/ApiHook";

const LoginPopup = ({ showLogin, setShowLogin, logoUrl }) => {
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("F 3 6 k");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaText, setCaptchaText] = useState("");
  const [error, setError] = useState({
    usernameErr: "",
    passwordErr: "",
    captchaErr: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const user = localStorage.getItem("data");
  const userDt = JSON.parse(user);
  const { username, userId, state } = userDt || null;

  // const handleLogin = (password) => {
  //   // here you can validate password with API
  //   navigate("/dashboard", { state: { username, stateCode } });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      let isValid = true;

      if (!username?.trim() || username?.trim() === "") {
        setError((prev) => ({ ...prev, usernameErr: "username is missing!" }));
        isValid = false;
      }
      if (!password?.trim() || password?.trim() === "") {
        setError((prev) => ({ ...prev, passwordErr: "Please enter password" }));
        isValid = false;
      }
      if (!captchaText?.trim() || captchaText?.trim() === "") {
        setError((prev) => ({ ...prev, captchaErr: "Please enter captcha!" }));
        isValid = false;
      }
      if (isValid) {
        const val = {
          gnumUserid: userId || "",
          gstrLoginId: username || "",
          password: password || "", //"Assam!2019"
        };

        fetchPostData("/auth/login-by-password", val).then((resp) => {
          if (resp?.data?.status === 1) {
            const datas = {
              state: resp?.data?.data?.stateCode,
              userId: userId,
              username: username,
              isLogin: "true",
            };
            localStorage.setItem("data", JSON.stringify(datas));
            navigate(`/home/${datas.state}/menus`);
          } else {
            alert(resp?.message);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    setPassword("");
    setError({ usernameErr: "", passwordErr: "", captchaErr: "" });
    refreshCaptcha("");
  };

  const refreshCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let newCaptcha = "";
    for (let i = 0; i < 5; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i < 4) newCaptcha += " ";
    }
    setCaptcha(newCaptcha);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        showLogin ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ${
          showLogin ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex justify-between items-center border-b p-2">
          <div className="flex items-center">
            <img
              src={logoUrl}
              alt="Logo"
              className="h-10 mr-3 animate-spin-slow rounded rounded-lg"
            />
            <h2 className="text-2xl !text-indigo-800">Login</h2>
          </div>
          <button
            onClick={() => setShowLogin(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors text-lg cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        <div className="w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"></div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div className="space-y-2">
            <label className="block text-gray-700">User Id :</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-500" />
              </div>
              <input
                type="text"
                value={username}
                // onChange={(e) => setUserId(e.target.value)}
                className="w-full px-2 !pl-8 py-2 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-500"
                placeholder="Enter User Id"
                disabled
                readOnly
              />
            </div>
            {error?.usernameErr && (
              <div className="required">{error?.usernameErr}</div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700">Password :</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full px-2 !pl-8 py-2 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                placeholder="Enter Password"
              />
              <button
                type="button"
                className="!absolute !inset-y-0 !right-0 pr-3 !flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500 hover:text-gray-600 transition-colors cursor-pointer" />
                ) : (
                  <FaEye className="text-gray-500 hover:text-gray-600 transition-colors cursor-pointer" />
                )}
              </button>
            </div>
            {error?.passwordErr && (
              <div className="required">{error?.passwordErr}</div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700">Captcha Type Here</label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                  placeholder="Enter Captcha"
                  value={captchaText}
                  onChange={(e) => {
                    setCaptchaText(e.target.value);
                  }}
                />
              </div>

              <div className="flex items-center space-x-2">
                <div className="bg-gray-200 px-4 py-2 rounded-lg font-mono text-gray-700 select-none">
                  {captcha}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer !border border-yellow-800 rounded"
                  title="Refresh Captcha"
                >
                  <FaRedo className="animate-spin-on-hover" />
                </button>
              </div>
            </div>
            {error?.captchaErr && (
              <div className="required">{error?.captchaErr}</div>
            )}
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600  py-1 !rounded-lg  !transition-colors cursor-pointer animate-shake !hover:text-[#00d9dc] !text-lg !border !hover:border-yellow-900"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gradient-to-r from-yellow-600 to-red-300 text-gray-800 py-1 !rounded-lg  transition-colors flex items-center justify-center space-x-2 cursor-pointer hover:text-[#941714] text-lg border !border-yellow-600 !hover:border-yellow-900"
            >
              <FaUndo className="text-sm" />
              <span>Reset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;

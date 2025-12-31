import React, { useEffect, useRef, useState } from "react";
import {
  FaBell,
  FaCog,
  FaKey,
  FaSignOutAlt,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MenuTopBar = (props) => {
  const { title, subtitle, logoUrl, isLocation, isEmail, bg, isHelpDesk } =
    props;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const userMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target)
      ) {
        setShowNotificationMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage?.clear();
    navigate("/");
  };

  return (
    <>
      <header className={`Navbar__header`}>
        <div className="mx-auto flex flex-col md:flex-row justify-between items-center px-3 py-2 space-y-3 md:space-y-0">
          {/* Logo and text */}
          <div className="flex items-center space-x-3">
            <img
              src={logoUrl}
              alt="CGHS Logo"
              className="h-14 bg-white backdrop-blur-sm p-1 rounded-lg border border-white/10 flex-shrink-0"
            />
            <div className="Navbar__stateInfo">
              <h3 className="text-white font-bold text-lg relative inline-block drop-shadow-lg">
                <span className="text-white text-xl-start">{title}</span>
              </h3>
              <p className="text-xl text-[#00369f] font-semibold drop-shadow-md mb-0">
                {subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative" ref={notificationMenuRef}>
              <button
                className="flex items-center justify-center w-9 h-9 bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:bg-white/30 hover:scale-110 group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                style={{ borderRadius: "20%" }}
              >
                <FaBell className="text-white text-lg group-hover:text-yellow-200 transition-colors" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </button>

              {/* Notification Dropdown */}
              {showNotificationMenu && (
                <div className="absolute right-0 mt-1 w-80 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-top-5 duration-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">
                        Notifications
                      </h3>
                      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                        3 New
                      </span>
                    </div>
                  </div>

                  {/* <div className="max-h-60 overflow-y-auto">
                                        <div className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors">
                                            <p className="text-sm font-medium text-gray-800">New message received</p>
                                            <p className="text-xs text-gray-500">2 minutes ago</p>
                                        </div>
                                        <div className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors">
                                            <p className="text-sm font-medium text-gray-800">System update available</p>
                                            <p className="text-xs text-gray-500">1 hour ago</p>
                                        </div>
                                        <div className="p-3 hover:bg-blue-50 cursor-pointer transition-colors">
                                            <p className="text-sm font-medium text-gray-800">Welcome to the new dashboard</p>
                                            <p className="text-xs text-gray-500">2 hours ago</p>
                                        </div>
                                    </div> */}
                  {/* <div className="p-2 bg-gray-50 border-t border-gray-100">
                                        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-1">
                                            View All Notifications
                                        </button>
                                    </div> */}
                </div>
              )}
            </div>

            <div className="h-8 w-[2px] bg-white/40 mx-1"></div>

            <div className="relative" ref={userMenuRef} style={{ zIndex: 2 }}>
              <button
                className="flex items-center space-x-4 backdrop-blur-sm px-1 py-2  transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ borderRadius: "20%" }}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-cadetblue-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                  <FaUser className="text-white text-xl" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-top-5 duration-200 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <FaUserCircle className="text-white text-xl" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">
                          Bajrang Bali
                        </span>{" "}
                        <br />
                        <span className="text-sm text-gray-600">
                          bajrang@bali.com
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-blue-50 transition-all duration-200 group relative overflow-hidden">
                      <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-200 group-hover:shadow-md">
                        <FaCog className="text-blue-600 group-hover:text-white transition-colors duration-200" />
                      </div>
                      <span className="font-medium text-gray-800 group-hover:text-blue-600">
                        User Settings
                      </span>
                    </button>

                    <button className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-green-50 transition-all duration-200 group relative overflow-hidden">
                      <div className="absolute left-0 top-0 w-1 h-full bg-green-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors duration-200 group-hover:shadow-md">
                        <FaKey className="text-green-600 group-hover:text-white transition-colors duration-200" />
                      </div>
                      <span className="font-medium text-gray-800 group-hover:text-green-600">
                        Change Password
                      </span>
                    </button>

                    <div className="border-t border-gray-200 my-1" />

                    <button
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-red-50 transition-all duration-200 group relative overflow-hidden"
                      onClick={logout}
                    >
                      <div className="absolute left-0 top-0 w-1 h-full bg-red-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors duration-200 group-hover:shadow-md">
                        <FaSignOutAlt className="text-red-600 group-hover:text-white transition-colors duration-200" />
                      </div>
                      <span className="font-medium text-gray-800 group-hover:text-red-600">
                        Logout
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default MenuTopBar;

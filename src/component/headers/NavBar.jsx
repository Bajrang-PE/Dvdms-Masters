import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import LoginPopup from "../homepage/LoginPopup";

const NavBar = (props) => {
  const { logoUrl, menuItems } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowLogin(true);
    }, 1000)
  }, [])

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-[#1e1f90] text-white text-sm font-medium">
      <div className="mx-auto px-4 py-2 flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <FaBars size={20} />
          </button>
        </div>

        {/* Desktop Nav Links - Left side */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks onLinkClick={() => { }} menuItems={menuItems} />
        </div>

        {/* Login button - Right side for both mobile and desktop */}
        <div className="flex items-center">
          <button
            onClick={() => setShowLogin(true)}
            className="border border-white px-3 py-1 rounded text-sm hover:bg-white hover:text-[#1e1f90] transition-colors"
          >
            Login
          </button>
          <LoginPopup
            showLogin={showLogin}
            setShowLogin={setShowLogin}
            logoUrl={logoUrl}
          />
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <div className="h-px w-full bg-white my-1"></div>
          <NavLinks
            mobile
            onLinkClick={handleLinkClick}
            menuItems={menuItems}
          />
        </div>
      )}
    </nav>
  );
};

const NavLinks = ({ mobile = false, onLinkClick, menuItems }) => {
  const scrollToSection = (id) => {
    if (id && id !== "") {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const linkClasses = mobile
    ? "flex items-center space-x-2 py-1 nav-tab"
    : "flex items-center space-x-1 py-1 hover:underline nav-tab";

  // const menuItems = [
  //     { to: '', icon: <FaHome />, label: 'Home', id: '' },
  //     { to: '', icon: <FaInfoCircle />, label: 'About Us', id: 'aboutus' },
  //     { to: '', icon: <FaSuitcase />, label: 'Services', id: 'services' },
  //     { to: '', icon: <FaPhoneAlt />, label: 'Contact', id: 'contacts' },
  //     { to: '', icon: <FaThLarge />, label: 'Dashboard', id: '' },
  //     { to: '', icon: <FaBookOpen />, label: 'Tutorials', id: '' },
  // ];

  return (
    <>
      {menuItems?.map(({ to, icon, label, id }) => (
        <Link
          to={to}
          key={label}
          className={linkClasses}
          onClick={() => {
            onLinkClick();
            scrollToSection(id ? id : "");
          }}
        >
          {icon} <span className="text-sm font-normal">{label}</span>
        </Link>
      ))}
    </>
  );
};

export default NavBar;

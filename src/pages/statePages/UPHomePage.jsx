import React from "react";
import NavBar from "../../component/headers/NavBar";
import TopBar from "../../component/headers/TopBar";
import MasterSlider from "../../component/homepage/MasterSlider";
import AboutAmscl from "../../component/homepage/AboutAmscl";
import Services from "../../component/homepage/Services";
import ContactSection from "../../component/homepage/ContactSection";
import Footer from "../../component/footer/Footer";
import {
  FaHome,
  FaInfoCircle,
  FaSuitcase,
  FaPhoneAlt,
  FaThLarge,
  FaBookOpen,
} from "react-icons/fa";

const UPHomePage = () => {
  const menuItems = [
    { to: "", icon: <FaHome />, label: "Home", id: "" },
    { to: "", icon: <FaInfoCircle />, label: "About Us", id: "aboutus" },
    { to: "", icon: <FaSuitcase />, label: "Services", id: "services" },
    { to: "", icon: <FaPhoneAlt />, label: "Contact", id: "contacts" },
    { to: "", icon: <FaThLarge />, label: "Dashboard", id: "" },
    { to: "", icon: <FaBookOpen />, label: "Tutorials", id: "" },
  ];

  return (
    <section className="page home-page">
      <TopBar
        title={"AMSCL, Govt. of Assam"}
        subtitle={"DVDMS (e-Aushadhi)"}
        logoUrl={"/logo.png"}
        isEmail={true}
        isLocation={true}
        bg={"#34211973"}
      />
      <NavBar logoUrl={"/logo.png"} menuItems={menuItems} />
      <MasterSlider />
      <AboutAmscl />
      <Services />
      <ContactSection />
      <Footer />
    </section>
  );
};

export default UPHomePage;

import React, { useState } from "react";
import { FaBars, FaChartLine } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { BsChevronDown } from "react-icons/bs";
import "../css/MenuPage.css";
import MenuTopBar from "../component/headers/MenuTopBar";
import { Link, useParams } from "react-router-dom";

const MenuCard = ({ icon, title, menu, borderClr }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (i) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  return (
    <div className="menu-card shadow mb-4" style={{ borderTop: `5px solid ${borderClr ? borderClr : '#2c71f0'}` }}>
      <div className="d-flex align-items-center mb-3 px-3 pt-3">
        <span className="menu-icon" style={{
          color: `${borderClr ? borderClr
            : "#2c71f0"
            }`
        }}>{icon}</span>
        <h5 className="m-0 ms-2">{title}</h5>
      </div>

      <div className="px-3 pb-3 menu-scroll">
        {menu.map((item, i) => (
          <div key={i} className="menu-item">
            <div
              className="d-flex justify-content-between align-items-center menu-title"
              onClick={() => toggle(i)}
            >

              {item.sub ?
                (<>
                  {item.title}
                  <BsChevronDown className={activeIndex === i ? "rotate" : ""} />
                </>)
                :
                <Link className="acrmenu w-100" to={item?.link ? item?.link : ''}> {item.title}</Link>
              }
            </div>

            {item.sub && (
              <div className={`submenu ${activeIndex === i ? "open" : ""}`}>
                {item.sub.map((s, j) => (
                  <div key={j} className="submenu-item">
                    <Link className="acrmenu w-100 d-block" to={s?.link ? s?.link : ''}>{s?.title}</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MenuPage = () => {
  const { stateCode } = useParams();

  const services = [
    { title: "Rate Contract", link: "rate-contract" },
    { title: "Pm darpan service" },
    {
      title: "Issue Management",
      sub: [
        { title: "Issue To Non Web Connected Store", link: "" },
        { title: "Issue to Web-Connected Store", link: "" },
        { title: "Ehospital issue desk", link: "" },
      ],
    },
    {
      title: "Receive",
      sub: [
        { title: "Issue To Non Web Connected Store", link: "" },
        { title: "Issue to Web-Connected Store", link: "" }
      ],
    },
  ];

  const admin = [
    { title: "Bank Master", link: "bank-master" },
    { title: "Bank Branch Master", link: "bank-branch-master" },
    { title: "Drug warehouse master" }
  ];

  const reports = [
    { title: "Inventory Management" },
    { title: "MIS Report" },
    {
      title: "Financial Management",
      sub: [
        { title: "Issue To Non Web Connected Store", link: "" },
        { title: "Issue to Web-Connected Store", link: "" }
      ],
    },
    { title: "Purchase Order Management" },
  ];

  return (
    <>
      {(stateCode && stateCode === "AS") &&
        <MenuTopBar title={"AMSCL, Govt. of Assam"} subtitle={"DVDMS (e-Aushadhi)"} logoUrl={"/logo.png"} isEmail={true} isLocation={true} bg={"#00000073"} />
      }
      {(stateCode && stateCode === "JH") &&
        <MenuTopBar title={"JMHIDPCL i-MCS"} subtitle={"Jharkhand Medical & Health Infrastructure Development & Procurement Corporation Ltd."} logoUrl={"/JH_Logo.png"} isEmail={true} isLocation={true} bg={"#00000073"} />
      }

      <div className="main-menu-body">
        <div className="container py-5">
          <div className="row g-6 justify-content-center">
            <div className="col-md-4">
              <MenuCard icon={<FaBars />} title="Services" menu={services} borderClr={'#2c71f0'} />
            </div>

            <div className="col-md-4">
              <MenuCard icon={<RiAdminLine />} title="Admin" menu={admin} borderClr={'#e56c1a'} />
            </div>

            <div className="col-md-4">
              <MenuCard icon={<FaChartLine />} title="Reports" menu={reports} borderClr={'#a548f0'} />
            </div>
          </div>
        </div>
      </div>
      <div className="text-center bg-black text-gray-200 border-t border-gray-700 p-2">
        <span>© 2025 CDAC Noida. All rights reserved CDAC</span><br />
      </div>
    </>
  );
};

export default MenuPage;

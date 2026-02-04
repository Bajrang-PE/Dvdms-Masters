import React, { useEffect, useState } from "react";
import { FaBars, FaChartLine } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { BsChevronDown } from "react-icons/bs";
import "../css/MenuPage.css";
import MenuTopBar from "../component/headers/MenuTopBar";
import { Link, useParams } from "react-router-dom";
import { getMenuList } from "../api/Assam/services/rateContractAPI";

const services = [
  { title: "Rate Contract", link: "rate-contract" },
  {
    title: "Purchase Order Management",
    sub: [
      { title: "Local Purchase Order Generation", link: "" },
      { title: "Central Purchase Order Generation", link: "" },
    ],
  },
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
      { title: "Issue to Web-Connected Store", link: "" },
    ],
  },
];

const admin = [
  { title: "Bank Master", link: "bank-master" },
  { title: "Bank Branch Master", link: "bank-branch-master" },
  { title: "Committee Type Master", link: "committee-type-master" }, //as
];

const reports = [
  { title: "Inventory Management" },
  { title: "MIS Report" },
  {
    title: "Financial Management",
    sub: [
      { title: "Issue To Non Web Connected Store", link: "" },
      { title: "Issue to Web-Connected Store", link: "" },
    ],
  },
  { title: "Purchase Order Management" },
];

const serviceReplacements = [
  {
    targetLink: "Rate Contract Management",
    targetSublink: "Rate Contract",
    newUrl: "rate-contract",
  },

    {
    targetLink: "Purchase Order Management",
    targetSublink: "Central Purchase Order Generation",
    newUrl: "central-purchase-order",
  },
];

const mastersReplacements = [
  {
    targetLink: "Bank Management",
    targetSublink: "Bank Master",
    newUrl: "bank-master",
  },
  {
    targetLink: "Bank Management",
    targetSublink: "Bank Branch Master",
    newUrl: "bank-master",
  },
];

const MenuCard = ({ icon, title, menu, borderClr }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (i) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  return (
    <div
      className="menu-card mb-4"
      style={{ borderTop: `5px solid ${borderClr ? borderClr : "#2c71f0"}` }}
    >
      <div className="d-flex align-items-center px-3 pt-3">
        <span
          className="menu-icon"
          style={{
            color: `${borderClr ? borderClr : "#2c71f0"}`,
          }}
        >
          {icon}
        </span>
        <h5 className="m-0 ms-2 menu-heading">{title}</h5>
      </div>

      <div className="px-3 pb-3 menu-scroll">
        {menu.map((item, i) => (
          <div key={i} className="menu-item">
            <div
              className="d-flex justify-content-between align-items-center menu-title"
              onClick={() => toggle(i)}
            >
              {item.sub ? (
                <>
                  {item.title}
                  <BsChevronDown
                    className={activeIndex === i ? "rotate" : ""}
                  />
                </>
              ) : (
                <Link
                  className="acrmenu w-100"
                  to={item?.link ? item?.link : ""}
                >
                  {" "}
                  {item.title}
                </Link>
              )}
            </div>

            {item.sub && (
              <div className={`submenu ${activeIndex === i ? "open" : ""}`}>
                {item.sub.map((s, j) => (
                  <div key={j} className="submenu-item">
                    <Link
                      className="acrmenu w-100 d-block"
                      to={s?.link ? s?.link : ""}
                    >
                      {s?.title}
                    </Link>
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
  const [serviceList, setServiceList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [reportsList, setReportsList] = useState([]);

  useEffect(() => {
    async function getMenus() {
      const response = await getMenuList();
      const servicesList = response.Services["E Aushadhi"];
      const adminsList = response.Admin["E Aushadhi"];
      const reports = response.Reports["E Aushadhi"];
      console.log("Services : ",servicesList);
      const mappedServices = buildMenus(servicesList);
      const mappedMasters = buildMenus(adminsList);
      const reportsList = buildMenus(reports);

      setServiceList(urlReplacer(mappedServices, serviceReplacements));
      setAdminList(urlReplacer(mappedMasters, mastersReplacements));
      setReportsList(reportsList);
    }
    getMenus();
  }, [stateCode]);

  return (
    <>
      {stateCode && stateCode === "AS" && (
        <MenuTopBar
          title={"AMSCL, Govt. of Assam"}
          subtitle={"DVDMS (e-Aushadhi)"}
          logoUrl={"/logo.png"}
          isEmail={true}
          isLocation={true}
          bg={"#00000073"}
        />
      )}
      {stateCode && stateCode === "JH" && (
        <MenuTopBar
          title={"JMHIDPCL i-MCS"}
          subtitle={
            "Jharkhand Medical & Health Infrastructure Development & Procurement Corporation Ltd."
          }
          logoUrl={"/JH_Logo.png"}
          isEmail={true}
          isLocation={true}
          bg={"#00000073"}
        />
      )}

      <div className="main-menu-body">
        <div className="container py-5">
          <div className="row g-6 justify-content-center">
            <div className="col-md-4">
              <MenuCard
                icon={<FaBars />}
                title="Services"
                menu={serviceList}
                borderClr={"#2c71f0"}
              />
            </div>

            <div className="col-md-4">
              <MenuCard
                icon={<RiAdminLine />}
                title="Admin"
                menu={adminList}
                borderClr={"#e56c1a"}
              />
            </div>

            <div className="col-md-4">
              <MenuCard
                icon={<FaChartLine />}
                title="Reports"
                menu={reportsList}
                borderClr={"#a548f0"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="text-center bg-black text-gray-200 border-t border-gray-700 p-2">
        <span>&copy; 2025 CDAC Noida. All rights reserved CDAC</span>
        <br />
      </div>
    </>
  );
};

//recursive call
function buildMenus(object, result = [], prevKey = "") {
  Object.keys(object).forEach((key) => {
    if (object[key] && typeof object[key] === "object") {
      prevKey = key;
      // console.log("Reassigning key", key);
      return buildMenus(object[key], result, prevKey);
    }

    const submenu = { title: key, link: object[key] || "" };
    const menu = { title: prevKey, sub: [submenu] };
    const keyAlreadyExists = result.some(
      (service) => service.title === prevKey
    );
    if (keyAlreadyExists && prevKey !== "") {
      const existingMenu = result.find((service) => service.title === prevKey);
      existingMenu.sub = [...existingMenu.sub, submenu];
      result.pop(existingMenu);
      result.push(existingMenu);
      return;
    }
    prevKey === "" ? result.push(submenu) : result.push(menu);
    return;
  });

  return result;
}

//temporary function to replace url mapping for testing
function urlReplacer(searchData, replacements) {
  const ruleMap = new Map();

  for (const r of replacements) {
    const key = `${r.targetLink}::${r.targetSublink || "__PARENT__"}`;
    ruleMap.set(key, r.newUrl);
  }

  return searchData.map((item) => {
    const parentKey = `${item.title}::__PARENT__`;
    const parentUrl = ruleMap.get(parentKey);

    let updated = parentUrl ? { ...item, link: parentUrl } : item;

    if (!item.sub) return updated;

    const subUpdated = item.sub.map((subItem) => {
      const subKey = `${item.title}::${subItem.title}`;
      const newUrl = ruleMap.get(subKey);

      return newUrl ? { ...subItem, link: newUrl } : subItem;
    });

    return updated === item
      ? { ...item, sub: subUpdated }
      : { ...updated, sub: subUpdated };
  });
}

export default MenuPage;

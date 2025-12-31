import React, { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import GlobalModal from "../commons/GlobalModal";

const TopBar = (props) => {
  const { title, subtitle, logoUrl, isLocation, isEmail, bg, isHelpDesk } =
    props;

  const [showModal, setShowModal] = useState(false);

  const onClose = () => {
    setShowModal(false);
  };

  const HelpDesk = () => {
    const helpDeskData = [
      {
        name: "1. Priyanandan Prasad",
        designation: "Implementaion Manager",
        mobileNo: "+91 7992372001",
      },
      {
        name: "2. Swet Kamal",
        designation: "Implementation Engineer",
        mobileNo: "+91 8002365555",
      },
      {
        name: "3. Prakash Jaiswal",
        designation: "It-Cell Executive",
        mobileNo: "+91 8860289500",
      },
      {
        name: "4.Goury Datta Sharma",
        designation: "Data Entry Operator",
        mobileNo: "+91 9534848052",
      },
      {
        name: "5. Ganga Sharma",
        designation: "Data Entry Operator",
        mobileNo: "+91 8210744091",
      },
    ];

    return (
      <>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 text-center">
          HELP DESK
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr className="border-bottom">
                <th className="px-2 py-3 text-left text-l text-gray-700 ">
                  Name
                </th>
                <th className="px-2 py-3 text-left text-l text-gray-700">
                  Designation
                </th>
                <th className="px-2 py-3 text-left text-l text-gray-700">
                  Mobile No
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {helpDeskData.map((person, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer border-bottom"
                >
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-700">
                    {person.name}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-700">
                    {person.designation}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-700">
                    {person.mobileNo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <>
      <header
        className={`shadow-md border-b border-gray-200`}
        style={{ backgroundColor: bg ? bg : "#34211973" }}
      >
        <div className="mx-auto flex flex-col md:flex-row justify-between items-center px-3 py-2 space-y-3 md:space-y-0">
          {/* Logo and text */}
          <div className="flex items-center space-x-3">
            <img
              src={logoUrl}
              alt="CGHS Logo"
              className="h-14 animate-spin-slow bg-white backdrop-blur-sm p-1 rounded-lg border border-white/10 flex-shrink-0"
            />
            <div className="leading-tight overflow-hidden">
              <h5 className="text-[#0081ad] font-bold text-lg relative inline-block">
                <span className="animate-color-flow">{title}</span>
              </h5>
              <p className="text-sm text-green-700 font-bold toplinebg">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Icon actions */}
          <div className="flex flex-col sm:flex-row items-center text-sm gap-4">
            {isLocation && (
              <div className="flex flex-col items-center text-center">
                {/* location */}
                <FaMapMarkerAlt size={20} color="#1e1f90" />
                <span className="mt-1">AMSCL, Guwahati, Govt. of Assam</span>
              </div>
            )}
            {isEmail && (
              <div className="flex flex-col items-center text-center sm:border-l sm:px-4">
                {/* mail */}
                <FaEnvelope size={20} color="#1e1f90" />
                <Link
                  to="mailto:mis.nhm-as@gov.in"
                  className="text-decoration-none text-reset"
                >
                  <span className="mt-1">mail</span>
                  mis.nhm-as@gov.in
                </Link>
              </div>
            )}
            {isHelpDesk && (
              <div className="flex flex-col items-center text-center bg-white rounded-2">
                <img
                  className="cursor-pointer"
                  src="/phone_jh.gif"
                  alt="Help Desk"
                  height="46"
                  width="46"
                  onClick={() => setShowModal(true)}
                ></img>
                {/* <span>Help Desk</span> */}
              </div>
            )}
          </div>
        </div>
      </header>
      {showModal && <GlobalModal Data={HelpDesk} size={""} onClose={onClose} />}
    </>
  );
};

export default TopBar;

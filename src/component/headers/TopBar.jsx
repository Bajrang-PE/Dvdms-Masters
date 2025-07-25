import React from 'react'
import { FaIdCard, FaHospitalSymbol, FaCalendarCheck, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const TopBar = () => {
    return (
        <header className="bg-[#34211973] shadow-md border-b border-gray-200">
            <div className="mx-auto flex flex-col md:flex-row justify-between items-center px-4 py-3 space-y-3 md:space-y-0">
                {/* Logo and text */}
                <div className="flex items-center space-x-3">
                    <img
                        src="http://10.10.11.155:8081/HIS/hisglobal/mod/assets/img/assamlogonew.png"
                        alt="CGHS Logo"
                        className="h-10"
                    />
                    <div className="leading-tight">
                        <h1 className="text-[#0081ad] font-bold text-lg">AMSCL, Govt. of Assam</h1>
                        <p className="text-sm text-green-700 font-bold toplinebg">DVDMS (e-Aushadhi)</p>
                    </div>
                </div>

                {/* Icon actions */}
                <div className="flex flex-col sm:flex-row items-center text-sm gap-4">
                    <div className="flex flex-col items-center text-center">
                        {/* location */}
                        <FaMapMarkerAlt size={20} color='#1e1f90'/>
                        <span className="mt-1">AMSCL, Guwahati, Govt. of Assam</span>
                    </div>
                    <div className="flex flex-col items-center text-center sm:border-l sm:px-4">
                        {/* mail */}
                        <FaEnvelope size={20} color='#1e1f90'/>
                        <a href="mailto:mis.nhm-as@gov.in" className="">
                            <span className="mt-1">mail</span>
                            mis.nhm-as@gov.in</a>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default TopBar

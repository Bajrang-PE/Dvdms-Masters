import React from "react";
import { FaEnvelope } from "react-icons/fa";

const FooterJH = () => {

    const menus = [
        { title: "Home", link: "#" },
        { title: "About", link: "#aboutus" },
        { title: "Features", link: "#featuresjh" },
        { title: "Link", link: "#linkjh" },
        { title: "Gallery", link: "#galleryjh" },
        { title: "Patient Complaint", link: "#pateintcompjh" },
        { title: "Contact", link: "#contactjh" },
    ]

    const ourLinks = [
        { title: "Dashboard", link: "#" },
        { title: "Video Tutorials", link: "#" },
        { title: "User Manuals", link: "#" },
        { title: "Stock Status", link: "#" },
    ]

    return (
        <>
            <footer className="bg-gray-900 text-gray-300 pt-8 pb-2 px-8 md:px-16" id="contactjh">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                        <h4 className="text-white text-xl font-semibold mb-4">CONTACT</h4>
                        <span>Shashi Prakash Jha, IAS</span> <br />
                        <span>Mission Director</span> <br />
                        <span>National Health Mission.</span> <br />
                        <br />
                        <span>Abu Imran, IAS</span> <br />
                        <span>Managing Director</span> <br />
                        <span>JMHIDPCL Jharkhand</span> <br />
                        <a href="mailto:jmhidpc2014@gmail.com" className="!text-blue-100 !hover:text-white !transition-colors text-sm flex items-center" >
                            <FaEnvelope className="text-white-600 text-sm mr-2" />
                            jmhidpc2014@gmail.com
                        </a>
                        <br />
                        <span>'____'</span> <br />
                        <span>(OSD)</span> <br />
                        <span>JMHIDPCL</span> <br />
                        <a href="mailto:imhidpc2014@gmail.com" className="!text-blue-100 !hover:text-white !transition-colors text-sm flex items-center" >
                            <FaEnvelope className="text-white-600 text-sm mr-2" />
                            imhidpc2014@gmail.com
                        </a>
                    </div>

                    <div>
                        <h4 className="text-white text-xl font-semibold mb-4">ADDRESS</h4>
                        <span>MCH Building,</span> <br />
                        <span>RCH Campus, Namkum,</span> <br />
                        <span>Ranchi - 834010</span> <br />
                        <a href="mailto:jmhidpc2014@gmail.com" className="!text-blue-100 !hover:text-white !transition-colors text-sm flex items-center" >
                            <FaEnvelope className="text-white-600 text-sm mr-2" />
                            jmhidpc2014@gmail.com
                        </a>
                    </div>

                    <div>
                        <h4 className="text-white text-xl font-semibold mb-4">MENU</h4>
                        <ul className="space-y-1" style={{paddingLeft:"0px"}}>
                            {menus?.map((menu, index) => (
                                <li key={index}>
                                    <a href={menu?.link} className="text-decoration-none">
                                        <span className="text-gray-300 hover:text-[#daa005]">{menu?.title}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-xl font-semibold mb-4">OUR LINKS</h4>
                        <ul className="space-y-1" style={{paddingLeft:"0px"}}>
                            {ourLinks?.map((menu, index) => (
                                <li key={index}>
                                    <a href={menu?.link} className="text-decoration-none">
                                        <span className="text-gray-300 hover:text-[#daa005]">{menu?.title}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </footer>
            <div className="text-center bg-black text-gray-200 border-t border-gray-700 pt-2">
                <span>© 2025 CDAC Noida. All rights reserved CDAC</span><br />
                <a href="https://drive.google.com/drive/folders/1lRjM6siI8F4tYu_9aYcEmvyxpHIO8bbY?usp=sharing" className="mt-1 text-decoration-none"> <span className="text-gray-300 hover:text-[#daa005]"> Download Mobile APK </span></a>
            </div>
        </>
    );
}

export default FooterJH;

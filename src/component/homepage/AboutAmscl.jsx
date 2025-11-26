import React from 'react';
import { FaBell, FaChartLine, FaSignature, FaFileAlt, FaCheck, FaClock, FaArrowRight } from 'react-icons/fa';

const features = [
    {
        title: 'Alert Management',
        description:
            'A utility purposed to broadcast information, managing event based and job based alerts and governing the pending tasks as soon as user login into system.',
        icon: <FaBell className="text-red-500 text-xl" />,
        bg: 'bg-white',
        text: 'text-gray-800',
        border: 'border-gray-200',
    },
    {
        title: 'Data Analysis',
        description:
            'A utility purposed to broadcast information, managing event based and job based alerts and governing the pending tasks as soon as user login into system.',
        icon: <FaChartLine className="text-white text-xl" />,
        bg: 'bg-purple-700',
        text: 'text-white',
    },
    {
        title: 'Digital Signature',
        description:
            'A utility purposed to broadcast information, managing event based and job based alerts and governing the pending tasks as soon as user login into system.',
        icon: <FaSignature className="text-white text-xl" />,
        bg: 'bg-blue-900',
        text: 'text-white',
    },
    {
        title: 'Dynamic Reports',
        description:
            'A utility purposed to broadcast information, managing event based and job based alerts and governing the pending tasks as soon as user login into system.',
        icon: <FaFileAlt className="text-blue-600 text-xl" />,
        bg: 'bg-white',
        text: 'text-gray-800',
        border: 'border-gray-200',
    },
];

const AboutAmscl = () => {
    return (
        <>
            {/* About AMSCL section */}
            <div className="bg-gray-50 py-12 px-6 md:px-12" id='aboutus'>
                <div className="mx-auto">
                    <div className="grid md:grid-cols-3 gap-12 mb-4">
                        <div className="md:col-span-1">
                            <h2 className="text-3xl font-semibold text-blue-900 mb-4">About AMSCL</h2>
                            <h3 className="text-xl font-medium text-gray-800 mb-4 leading-snug">
                                Ensuring Quality in Services and Providing affordable Healthcare Services in the State of Assam
                            </h3>
                            <p className="text-gray-600 text-justify text-sm">
                                We support to provide healthcare to rural population throughout the State with special focus on districts which have weak public health indicators and for weak infrastructure to bring about reduction in child and maternal mortality. We support to improve universal access to public services for food and nutrition, sanitation and hygiene and universal access to public health care services with emphasis on services addressing women and children’s health and universal immunization. We support to improve access to integrated comprehensive primary health care to bring about population stabilization. We support to promote healthy life styles.
                            </p>
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                            {features.map((f, idx) => (
                                <div
                                    key={idx}
                                    className={`rounded-lg shadow-md p-4 flex items-start gap-4 transition-transform hover:scale-[1.02] ${f.bg
                                        } ${f.text} ${f.border ?? ''}`}
                                >
                                    <div className="flex-shrink-0">{f.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{f.title}</h4>
                                        <p className="text-sm leading-relaxed">{f.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hours and About NHM & AMSCL section */}
            <section className="py-10 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="mx-auto px-8">
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* About Section */}
                        <div className="overflow-hidden">
                            <div className="p-4 md:p-2">
                                <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-4">
                                    About NHM & AMSCL
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    NHM & AMSCL, Guwahati, Assam are desirous of implementing the complete Supply Chain
                                    Management System for Medicines, Surgical items and Sutures (DVDMS) across the State of Assam.
                                </p>

                                <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                                    NHM & AMSCL office consists of the following sections:
                                </h3>

                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                    {[
                                        "Account / Budget Cell",
                                        "Purchase Cell",
                                        "MIS Cell",
                                        "Inventory Management Cell",
                                        "District Store",
                                        "Drug Controller (Quality Assurance through D & C Act)",
                                        "Administrative Cell",
                                        "Legal Cell"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <FaCheck className="w-3 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Opening Hours Section */}

                        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-xl overflow-hidden border border-indigo-500/30 mt-4">
                            <div className="p-6 text-white">
                                <div className="flex items-center mb-4">
                                    <div className="bg-white/20 p-3 rounded-lg mr-4 backdrop-blur-sm">
                                        <FaClock className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold">Opening Hours</h3>
                                </div>

                                <div className="space-y-5 mb-8">
                                    {[
                                        { day: "Monday - Friday", hours: "9.00 - 19.00" },
                                        { day: "Saturday", hours: "9.30 - 20.00" },
                                        { day: "Sunday", hours: "8.00 - 18.00" }
                                    ].map((item, index) => (
                                        <div key={index} className="flex justify-between items-center pb-2 border-b border-white/20 my-2">
                                            <span className="font-medium">{item.day}</span>
                                            <span className="px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/10 hover:bg-white/20 transition-all">
                                                {item.hours}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                    <h4 className="text-lg font-semibold mb-2">NHM & AMSCL Timetable</h4>
                                    <p className="text-white/80 mb-4">Explore operational hours and department-wise details.</p>
                                    <button className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-white text-indigo-600 hover:bg-gray-200 font-medium rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg cursor-pointer">
                                        More Details
                                        <FaArrowRight className="w-5 h-3 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutAmscl;

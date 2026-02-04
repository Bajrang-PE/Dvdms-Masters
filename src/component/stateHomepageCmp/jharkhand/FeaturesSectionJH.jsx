import React from 'react'
import { FaIndianRupeeSign } from 'react-icons/fa6'
import { FaFlask, FaBarcode, FaChartBar, FaFileAlt, FaBell } from "react-icons/fa";

const FeaturesSectionJH = () => {

    const features = [
        {
            icon: <FaIndianRupeeSign className="w-8 h-8 text-[#ffb900]" />,
            title: "Payment Online",
            description: "The Online Payment facility allows you to pay from your account to your suppliers online, real-time."
        },
        {
            icon: <FaFlask className="w-8 h-8 text-[#ffb900]" />,
            title: "Quality Process",
            description:
                "Quality Process plays a crucial role in the manufacturing value stream for drugs standard measurement."
        },
        {
            icon: <FaBarcode className="w-8 h-8 text-[#ffb900]" />,
            title: "Barcode & Digital Signature",
            description:
                "Barcode provides inventory and pricing information and Digital Signature provides security of the document."
        },
        {
            icon: <FaChartBar className="w-8 h-8 text-[#ffb900]" />,
            title: "Dashboard",
            description:
                "Dashboard works in real-time management information system, visual presentation. e-Aushadhi provides such features."
        },
        {
            icon: <FaFileAlt className="w-8 h-8 text-[#ffb900]" />,
            title: "Dynamic Report",
            description:
                "Dynamic Report provides facility to generate reports due to intermittent transactions and frequent updates."
        },
        {
            icon: <FaBell className="w-8 h-8 text-[#ffb900]" />,
            title: "Alert Management",
            description:
                "A utility purposed to broadcast information, managing event-based and job-based alerts as soon as users log in to the system."
        },
    ];

    return (
        <>
            <section className="py-8 bg-white" id='featuresjh'>
                <div className="mx-auto px-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-stretch">

                        <div className="lg">
                            <div className="text-left mb-8">
                                <h2 className="text-3xl font-bold text-blue-900 mb-2">Features</h2>
                                <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4">
                                {features?.map((fet, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col border-2 border-dashed border-[#3aa5dc]">
                                        <div className="flex items-center mb-3">
                                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                                {fet?.icon}
                                                <i className="fa fa-inr" aria-hidden="true"></i>
                                            </div>
                                            <h4 className="text-md font-semibold text-gray-800">{fet?.title}</h4>
                                        </div>
                                        <p className="text-gray-600 text-xs leading-5 flex-grow">
                                            {fet?.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default FeaturesSectionJH

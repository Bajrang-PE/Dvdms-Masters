import React from 'react';
import { FaChartPie, FaMedkit, FaSearchPlus, FaVideo } from 'react-icons/fa';

const UsefulLinksJH = () => {
    const links = [
        {
            title: 'E-AUSHADHI DASHBOARD',
            href: '#',
            icon: <FaChartPie className="w-8 h-8" />,
        },
        {
            title: 'VIDEO TUTORIALS',
            href: '#',
            icon: <FaVideo className="w-8 h-8" />,
        },
        {
            title: 'USER MANUALS',
            href: '#',
            icon: <FaSearchPlus className="w-8 h-8" />,
        },
        {
            title: 'STOCK STATUS',
            href: '#',
            icon: <FaMedkit className="w-8 h-8" />,
        }
    ];

    return (
        <>
            <div
                className="bg-[url('/jh_usefulLinks.jpg')] bg-cover bg-center h-32 flex items-center justify-center relative my-4" id='linkjh'
            >
                <span className="text-3xl font-bold text-white text-center relative">
                    e-Aushadhi
                </span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-dashed pb-2">
                    Useful Links
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                        >
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg mr-4">
                                {link.icon}
                            </div>
                            <span className="text-lg font-semibold text-[#daa005]">
                                {link.title}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
};

export default UsefulLinksJH;
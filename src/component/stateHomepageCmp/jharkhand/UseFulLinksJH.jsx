import React, { useState } from 'react';
import { FaChartPie, FaMedkit, FaSearchPlus, FaVideo } from 'react-icons/fa';
import GlobalModal from '../../commons/GlobalModal';

const UsefulLinksJH = () => {

    const [showModal, setShowModal] = useState(false);

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

    const vidoeTuts = () => {
        const videos = [
            { sno: "1", processName: "ANNUAL DEMAND COMPILATION", videoFile: "ANNUAL_DEMAND_COMPILATION.MP4", downloadCount: "302" },
            { sno: "2", processName: "ANNUAL PURCHASE DEMAND", videoFile: "ANNUAL_PURCHASE_DEMAND.MP4", downloadCount: "304" }
        ];

        return (
            <>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 text-center">Video Tutorial</h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-50">
                            <tr className='border-bottom'>
                                <th className="px-2 py-3 text-left text-l text-gray-700 ">
                                    S.No.
                                </th>
                                <th className="px-2 py-3 text-left text-l text-gray-700 ">
                                    Process Name
                                </th>
                                <th className="px-2 py-3 text-left text-l text-gray-700" >
                                    Video File
                                </th>
                                <th className="px-2 py-3 text-left text-l text-gray-700">
                                    Download Count
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {videos.map((vid, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 transition-colors duration-150 border-bottom"
                                >
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-700">
                                        {vid.sno}
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-700">
                                        {vid.processName}
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-700">
                                        <a href="#">{vid.videoFile}</a>
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-700">
                                        {vid.downloadCount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };

    const onClose = () => {
        setShowModal(false);
    }

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
                            onClick={() => { index === 1 && setShowModal(true) }}
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
            {showModal &&
                <GlobalModal Data={vidoeTuts} size={''} onClose={onClose} />
            }
        </>
    );
};

export default UsefulLinksJH;
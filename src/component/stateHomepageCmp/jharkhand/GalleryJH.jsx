import React, { useState } from 'react';
import { FaCalendarDays } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import GlobalModal from '../../commons/GlobalModal';

const GalleryJH = () => {

    const [showModal, setShowModal] = useState(false);
    const [item, setItem] = useState({});

    const galleryItems = [
        {
            title: "MP-AUSHADHI",
            image: "/gallery1_jh.jpg",
            dates: "21/2/2017"
        },
        {
            title: "RMSC",
            image: "/gallery2_jh.jpg",
            dates: "20/2/2012"
        },
        {
            title: "MAHARASHTRA PHD",
            image: "/gallery3_jh.jpg",
            dates: "19/2/2014"
        }
    ];

    const GalleryModal = () => {
        return (
            <div className="relative">
                <img
                    src={item?.image}
                    alt={item.title}
                    className="w-full"
                />
            </div>
        )
    }

    const onClose = () => {
        setShowModal(false);
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6" id='galleryjh'>
                <div className="text-left mb-8">
                    <h2 className="text-3xl font-bold text-blue-900 mb-2">Gallery</h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleryItems.map((item, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                        >
                            <div className="relative overflow-hidden">
                                <Link to="#" onClick={() => { setShowModal(true); setItem(item); }}>
                                    <img
                                        src={item?.image}
                                        alt={item.title}
                                        className=""
                                    />
                                </Link>
                            </div>

                            <div className="p-2">
                                <h4 className="mb-2">
                                    <a href="#" className='text-decoration-none'>
                                        <span className="text-lg text-gray-800 hover:text-[#daa005]">
                                            {item.title}
                                        </span>
                                    </a>
                                </h4>

                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <FaCalendarDays className="text-blue-500" />
                                    <span>{item?.dates}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showModal &&
                <GlobalModal Data={GalleryModal} size={''} onClose={onClose} />
            }
        </>

    );
};

export default GalleryJH;
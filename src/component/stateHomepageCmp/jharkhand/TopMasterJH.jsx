import React, { useState, useEffect } from 'react';

const TopMasterJH = () => {

    const [animateAMSCL, setAnimateAMSCL] = useState(false);

    useEffect(() => {
        const timer2 = setTimeout(() => setAnimateAMSCL(true), 400);

        return () => {
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div className="relative w-full h-[80vh] overflow-hidden justify-items-center content-center">
            <div
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out`}
                style={{
                    backgroundImage: `url(${'/banner_map_jh.jpg'})`,
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    animation: 'zoom-out 8s ease-in-out infinite'
                }}
            />

            <div
                className={`h-75 w-50 bg-[#33384ad6] text-white p-4 z-[10] transition-all duration-1000 ease-out translate-y-0 ${animateAMSCL ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
            >
                <h2 className="text-2xl font-bold mb-3 text-center">CIRCULARS</h2>
                <small className="px-2 py-1 rounded">No Circulars</small>
            </div>
        </div>
    );
};

export default TopMasterJH;
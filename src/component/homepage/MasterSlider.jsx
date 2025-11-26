import React, { useState, useEffect } from 'react';

const MasterSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [animateText, setAnimateText] = useState(false);
    const [animateAMSCL, setAnimateAMSCL] = useState(false);

    const slides = [
        { image: "/slider1.jpg" },
        { image: "/slider2.jpg" },
    ];

    // Initialize animations on first load
    useEffect(() => {
        const timer1 = setTimeout(() => setAnimateText(true), 100);
        const timer2 = setTimeout(() => setAnimateAMSCL(true), 300);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    // Auto slide background images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="relative w-full h-[80vh] overflow-hidden">
            {/* Background Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        backgroundImage: `url(${slide.image})`,
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        animation: 'zoom-out 8s ease-in-out infinite'
                    }}
                />
            ))}

            {/* Drug and Vaccine Text - Slides up */}
            <div
                className={`absolute top-[30%] left-[5%] text-white w-[600px] transition-all duration-1000 ease-out ${animateText ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                <h1 className="text-4xl font-bold mb-2">
                    Drug and Vaccine<br />
                    <span className="text-3xl font-semibold">Supply Chain Management</span>
                </h1>
                <p className="text-sm font-light mt-4">
                    e-Aushadhi Assam is a web based supply chain management application deals with
                    Indenting-based procurement, Inventory Management & Distribution of various drugs,
                    sutures and surgical items to various CDS of States, Hospitals, Diagnostic Centre
                    (DC) and Dispensary (DS) the final consumer of the supply chain.
                </p>
            </div>

            {/* AMSCL Section - Slides down */}
            <div
                className={`absolute top-[30%] right-0 bg-[#11277cd6] text-white p-4 z-[10] transition-all duration-1000 ease-out ${animateAMSCL ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
            >
                <h2 className="text-2xl font-bold mb-3">THE AMSCL</h2>
                <small className="text-white bg-blue-600 px-2 py-1 rounded">envisages attainment of universal access</small>
                <div className="mt-3 text-lg">
                    to equitable, affordable and quality health care services in the
                </div>
                <img
                    src="/state-of-assam.png"
                    className="mt-3 max-h-[4rem]"
                    alt="State of Assam"
                />
            </div>
        </div>
    );
};

export default MasterSlider;
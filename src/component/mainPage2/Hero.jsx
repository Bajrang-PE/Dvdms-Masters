import React, { useState, useEffect } from 'react';

const Hero = ({ openLoginModal }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            image: '/customs-warehouse.png',
            alt: 'Warehouse Management System',
            caption: 'Centralized WareHouse Management'
        },
        {
            id: 2,
            image: '/quality-control.jpg',
            alt: 'Quality Control',
            caption: 'Quality Assurance & Control'
        },
        {
            id: 3,
            image: 'supply-chain-management.webp',
            alt: 'Supply Chain Management',
            caption: 'Supply Chain Management'
        },
        {
            id: 4,
            image: '/inventory-management.png',
            alt: 'Inventory Management',
            caption: 'Inventory Management System'
        },
        {
            id: 5,
            image: 'Supplier-Management.webp',
            alt: 'Supplier Management',
            caption: 'Supplier Management System'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 5000); 

        return () => clearInterval(interval);
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
    };

    return (
        <section id="home" className="hero-section">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-5">
                        <h1 className="hero-title"> Unified Drugs and Vaccine Distribution Management System</h1>
                        <p className="hero-subtitle">
                            A unified platform for all states to manage drug procurement, storage, distribution,
                            and quality assurance with real-time tracking and reporting.
                        </p>
                        <button className="btn btn-light btn-lg hero-btn" onClick={openLoginModal}>
                            <i className="fas fa-sign-in-alt me-2"></i>Login
                        </button>
                    </div>

                    <div className="col-lg-7">
                        <div className="hero-slider-container">
                            <div className="hero-slider-wrapper">
                                {/* Slides */}
                                {slides.map((slide, index) => (
                                    <div
                                        key={slide.id}
                                        className={`hero-slide ${index === currentSlide
                                                ? 'active'
                                                : index === (currentSlide - 1 + slides.length) % slides.length
                                                    ? 'prev'
                                                    : index === (currentSlide + 1) % slides.length
                                                        ? 'next'
                                                        : ''
                                            }`}

                                    >
                                        <div className="hero-slide-image-wrapper">
                                            <img
                                                src={slide.image}
                                                className="img-fluid rounded shadow-lg hero-slide-image"
                                                alt={slide.alt}
                                            />
                                            <div className="hero-slide-caption">
                                                <h5>{slide.caption}</h5>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Slider Controls */}
                                <button
                                    className="hero-slider-control prev-control"
                                    onClick={prevSlide}
                                    aria-label="Previous slide"
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button
                                    className="hero-slider-control next-control"
                                    onClick={nextSlide}
                                    aria-label="Next slide"
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>

                                {/* Slider Indicators */}
                                <div className="hero-slider-indicators">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                            onClick={() => goToSlide(index)}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Slide Counter */}
                            {/* <div className="slide-counter">
                                <span className="current-slide">{currentSlide + 1}</span>
                                <span className="divider">/</span>
                                <span className="total-slides">{slides.length}</span>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
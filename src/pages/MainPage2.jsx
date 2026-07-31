import React, { useState, useEffect, Suspense, lazy } from 'react';
const Header = lazy(() => import("../component/mainPage2/Header"));
const Hero = lazy(() => import("../component/mainPage2/Hero"));
const About = lazy(() => import("../component/mainPage2/About"));
const Services = lazy(() => import("../component/mainPage2/Services"));
const Features = lazy(() => import("../component/mainPage2/Features"));
const States = lazy(() => import("../component/mainPage2/States"));
const Footer = lazy(() => import("../component/mainPage2/Footer"));
import { fetchPostData } from '../utils/ApiHook';
import '../css/mainPage.css';
import LoadingSpinner from '../component/commons/LoadingSpinner';
import LoginModal from "../component/mainPage2/LoginModal";

function MainPage2() {
    const [showLoginModal, setShowLoginModal] = useState(false);

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);

    // Add scroll animations
    useEffect(() => {
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.animate-on-scroll');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, { threshold: 0.1 });

            elements.forEach(element => {
                observer.observe(element);
            });
        };

        animateOnScroll();
    }, []);

    return (
        <div className="App">
            {/* <Suspense fallback={<LoadingSpinner />}> */}
            <Header openLoginModal={openLoginModal} />
            <Hero openLoginModal={openLoginModal} />
            <About />
            <Services />
            <Features />
            <States openLoginModal={openLoginModal} />
            <Footer />

            {showLoginModal &&
                <LoginModal
                    show={showLoginModal}
                    onClose={closeLoginModal}
                />
            }
            {/* </Suspense> */}
        </div>
    );
}

export default MainPage2;
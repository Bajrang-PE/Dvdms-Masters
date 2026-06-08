import React, { useState, useEffect } from 'react';
import Header from '../component/mainPage2/Header';
import Hero from '../component/mainPage2/Hero';
import About from '../component/mainPage2/About';
import Services from '../component/mainPage2/Services';
import Features from '../component/mainPage2/Features';
import States from '../component/mainPage2/States';
import Footer from '../component/mainPage2/Footer';
import LoginModal from '../component/mainPage2/LoginModal';
import '../css/mainPage.css';
import { fetchPostData } from '../utils/ApiHook';

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
        </div>
    );
}

export default MainPage2;
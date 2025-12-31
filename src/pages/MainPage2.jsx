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
import { useNavigate } from 'react-router-dom';
import { fetchPostData } from '../utils/ApiHook';

function MainPage2() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);

    const handleSubmit = async () => {
        try {
            const val = { gstrLoginId: username };
            fetchPostData("/auth/login-by-userName", val).then((data) => {
                const { data: response } = data; 

                if (response?.status === 1) {
                    const stateName = response?.data?.gstrStateshort || "";
                    const userId = response?.data?.gnumUserid || "";
                    if (stateName) {
                        const data = {
                            state: stateName,
                            userId: userId,
                            username: username,
                        };
                        navigate(`/home/${stateName}`, { state: { username, userId } });
                        localStorage.setItem("data", JSON.stringify(data));
                    } else {
                        console.log("state code not return");
                    }
                } else {
                    console.log("object");
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

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
                    onLogin={handleSubmit}
                    setUsername={setUsername}
                    username={username}
                />
            }
        </div>
    );
}

export default MainPage2;
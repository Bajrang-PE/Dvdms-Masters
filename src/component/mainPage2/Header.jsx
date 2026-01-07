import React, { useState } from 'react';

const Header = ({ openLoginModal }) => {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

    return (
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <i className="fas fa-pills me-2"></i>Unified<span className="fw-bold ms-2">DVDMS</span>
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={handleNavCollapse}
                    aria-expanded={!isNavCollapsed}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/*  MOBILE*/}
                {!isNavCollapsed &&
                    <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
                        <ul className="navbar-nav mx-auto">
                            {['Home', 'About', 'Services', 'Features', 'States']?.map((item, index) => (

                                <li className="nav-item" key={index}>
                                    <a className="nav-link" href={`#${item?.toLowerCase()}`}>{item}</a>
                                </li>
                            ))}

                        </ul>
                        <div className="d-flex align-items-center">
                            {/* Logo on right side */}
                            <div className="logo-container me-4 d-none d-lg-flex">
                                <div className="d-flex align-items-center">
                                    <div className="logo-icon me-2">
                                        <i className="fas fa-shield-alt text-primary fa-lg"></i>
                                    </div>
                                    <div className="logo-text">
                                        <span className="fw-bold text-primary">Govt.</span>
                                        <span className="text-secondary">Certified</span>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="vr d-none d-lg-flex me-4" style={{ height: '30px' }}></div>

                            {/* State Login Button */}
                            <button
                                className="btn btn-primary btn-login"
                                onClick={openLoginModal}
                            >
                                <i className="fas fa-sign-in-alt me-2"></i>
                                <span className="d-none d-md-inline">Login</span>
                                <span className="d-inline d-md-none">Login</span>
                            </button>
                        </div>
                    </div>
                }

                {/* DESKTOP */}
                {isNavCollapsed &&
                    <div className='d-none d-lg-flex align-items-center ms-auto'>
                        {/* State Login Button */}
                        <button
                            className="btn btn-primary btn-login me-4"
                            onClick={openLoginModal}
                        >
                            <i className="fas fa-sign-in-alt me-2"></i>
                            <span className="d-none d-md-inline">Login</span>
                            <span className="d-inline d-md-none">Login</span>
                        </button>

                        {/* Divider */}
                        <div className="vr d-none d-lg-flex me-4" style={{ height: '50px' }}></div>

                        <div className="d-flex align-items-center">

                            <div className="d-none d-lg-flex">
                                <div className="d-flex align-items-center">
                                    <div className="me-1">
                                        <img className='header-right-logo' src="/fav.png" alt="image" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </nav>
    );
};

export default Header;
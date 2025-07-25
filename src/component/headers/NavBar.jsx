import React, { useState } from 'react';
import {
    FaHome,
    FaInfoCircle,
    FaSuitcase,
    FaPhoneAlt,
    FaThLarge,
    FaBookOpen,
    FaBars,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <nav className="bg-[#1e1f90] text-white text-sm font-medium">
            <div className="mx-auto px-4 py-2 flex items-center justify-between">
                {/* Mobile menu button */}
                <div className="flex items-center md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)}>
                        <FaBars size={20} />
                    </button>
                </div>

                {/* Desktop Nav Links - Left side */}
                <div className="hidden md:flex items-center space-x-6">
                    <NavLinks onLinkClick={() => { }} />
                </div>

                {/* Login button - Right side for both mobile and desktop */}
                <div className="flex items-center">
                    <Link
                        to="/login"
                        className="text-white border border-white px-3 py-1 rounded text-sm hover:bg-white hover:text-[#1e1f90] transition-colors"
                    >
                        Login
                    </Link>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="md:hidden px-4 pb-4 space-y-3">
                    <div className="h-px w-full bg-white my-1"></div>
                    <NavLinks mobile onLinkClick={handleLinkClick} />
                </div>
            )}
        </nav>
    );
};

const NavLinks = ({ mobile = false, onLinkClick }) => {
    const linkClasses = mobile
        ? 'flex items-center space-x-2 py-1'
        : 'flex items-center space-x-1 hover:underline py-1';

    const menuItems = [
        { to: '/', icon: <FaHome />, label: 'Home' },
        { to: '/', icon: <FaInfoCircle />, label: 'About Us' },
        { to: '/', icon: <FaSuitcase />, label: 'Services' },
        { to: '/', icon: <FaPhoneAlt />, label: 'Contact' },
        { to: '/', icon: <FaThLarge />, label: 'Dashboard' },
        { to: '/', icon: <FaBookOpen />, label: 'Tutorials' },
    ];

    return (
        <>
            {menuItems?.map(({ to, icon, label }) => (
                <Link
                    to={to}
                    key={label}
                    className={linkClasses}
                    onClick={onLinkClick}
                >
                    {icon} <span className='text-sm font-normal'>{label}</span>
                </Link>
            ))}
        </>
    );
};

export default NavBar;
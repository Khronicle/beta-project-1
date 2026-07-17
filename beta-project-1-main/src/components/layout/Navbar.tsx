import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
    title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title = 'Weather Dashboard' }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <div>
                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="flex items-center gap-2 text-xl font-bold hover:text-teal-400 transition-colors"
                    >
                        <span className="text-2xl">🌤️</span>
                        {title}
                    </Link>
                </div>

                <button
                    className="md:hidden flex flex-col gap-1.5 cursor-pointer"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <span className={`block w-6 h-0.5 bg-white transition-transform ${isOpen ? 'rotate-45 translate-y-2.5' : ''
                        }`}></span>
                    <span className={`block w-6 h-0.5 bg-white transition-opacity ${isOpen ? 'opacity-0' : ''
                        }`}></span>
                    <span className={`block w-6 h-0.5 bg-white transition-transform ${isOpen ? '-rotate-45 -translate-y-2.5' : ''
                        }`}></span>
                </button>

                <ul className={`${isOpen ? 'flex flex-col' : 'hidden'
                    } md:flex md:flex-row md:gap-8 md:items-center absolute md:relative top-16 md:top-0 left-0 right-0 bg-slate-900 md:bg-transparent p-4 md:p-0 gap-4 md:gap-8`}>
                    <li>
                        <Link
                            to="/"
                            className="block text-white hover:text-teal-400 transition-colors relative group"
                            onClick={closeMenu}
                        >
                            Home
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 group-hover:w-full transition-all"></span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/forecast"
                            className="block text-white hover:text-teal-400 transition-colors relative group"
                            onClick={closeMenu}
                        >
                            Forecast
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 group-hover:w-full transition-all"></span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/about"
                            className="block text-white hover:text-teal-400 transition-colors relative group"
                            onClick={closeMenu}
                        >
                            About
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 group-hover:w-full transition-all"></span>
                        </Link>
                    </li>
                    <li>
                        <button
                            className="w-full md:w-auto bg-teal-500 text-slate-900 px-4 py-2 rounded font-bold hover:bg-teal-400 transition-colors"
                            onClick={closeMenu}
                        >
                            Settings
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface NavbarProps {
    title?: string;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block text-white transition-colors relative group ${isActive ? 'text-emerald-300' : 'hover:text-emerald-300'
    }`;

const navUnderlineClass = (isActive: boolean) =>
    `absolute bottom-0 left-0 h-0.5 bg-emerald-400 transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
    }`;

const Navbar: React.FC<NavbarProps> = ({ title = 'Weather Guard' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, isAdmin, logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeMenu();
        showToast('Logged out successfully.', 'success');
        navigate('/');
    };

    return (
        <nav className="glass-nav sticky top-0 z-50 border-b text-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <div>
                    <NavLink
                        to="/"
                        end
                        onClick={closeMenu}
                        className="flex items-center gap-2 text-xl font-bold text-white hover:text-emerald-300 transition-colors"
                    >
                        <span className="text-2xl">🌤️</span>
                        {title}
                    </NavLink>
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
                    } md:flex md:flex-row md:gap-8 md:items-center absolute md:relative top-16 md:top-0 left-0 right-0 glass-nav border-b md:border-none md:bg-transparent md:backdrop-blur-none p-4 md:p-0 gap-4 md:gap-8`}>
                    <li>
                        <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
                            {({ isActive }) => (
                                <>
                                    Home
                                    <span className={navUnderlineClass(isActive)}></span>
                                </>
                            )}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" className={navLinkClass} onClick={closeMenu}>
                            {({ isActive }) => (
                                <>
                                    About
                                    <span className={navUnderlineClass(isActive)}></span>
                                </>
                            )}
                        </NavLink>
                    </li>

                    {currentUser && (
                        <>
                            <li>
                                <NavLink to="/forecast" className={navLinkClass} onClick={closeMenu}>
                                    {({ isActive }) => (
                                        <>
                                            Forecast
                                            <span className={navUnderlineClass(isActive)}></span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard" className={navLinkClass} onClick={closeMenu}>
                                    {({ isActive }) => (
                                        <>
                                            Dashboard
                                            <span className={navUnderlineClass(isActive)}></span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        </>
                    )}

                    {isAdmin && (
                        <li>
                            <NavLink to="/admin" className={navLinkClass} onClick={closeMenu}>
                                {({ isActive }) => (
                                    <>
                                        Admin
                                        <span className={navUnderlineClass(isActive)}></span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    )}

                    {currentUser ? (
                        <>
                            <li className="text-sm text-slate-300">
                                Hi, {currentUser.firstName}
                            </li>
                            <li>
                                <NavLink
                                    to="/settings"
                                    onClick={closeMenu}
                                    aria-label="Settings"
                                    className={({ isActive }) =>
                                        `flex items-center justify-center rounded-lg p-2 transition-colors ${isActive ? 'bg-white/20 text-emerald-300' : 'text-white hover:bg-white/10 hover:text-emerald-300'
                                        }`
                                    }
                                >
                                    <SettingsIcon className="h-5 w-5" />
                                </NavLink>
                            </li>
                            <li>
                                <button
                                    className="w-full md:w-auto bg-emerald-800/70 text-white px-4 py-2 rounded font-bold hover:bg-emerald-700 transition-colors"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink
                                    to="/login"
                                    onClick={closeMenu}
                                    className="block w-full md:w-auto text-center bg-emerald-800/70 text-white px-4 py-2 rounded font-bold hover:bg-emerald-700 transition-colors"
                                >
                                    Login
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/signup"
                                    onClick={closeMenu}
                                    className="block w-full md:w-auto text-center bg-emerald-500 text-slate-900 px-4 py-2 rounded font-bold hover:bg-emerald-400 transition-colors"
                                >
                                    Sign Up
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;

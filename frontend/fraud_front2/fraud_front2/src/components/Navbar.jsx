"use client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'

const Navbar = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const [openNavbar, setOpenNavbar] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleNavbar = () => {
    setOpenNavbar(openNavbar => !openNavbar);
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20' 
        : 'bg-transparent'
    }`}>
      <div className="mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 h-20 flex items-center">
        <nav className="flex justify-between items-center w-full">
          {/* Logo */}
          <div className="flex min-w-max items-center">
            <Link to="/" className="group flex items-center gap-x-3 text-xl font-bold text-white">
              <div className="relative flex items-center -space-x-2">
                <span className="h-5 w-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/50 group-hover:shadow-emerald-400/70 transition-all duration-300 group-hover:scale-110" />
                <span className="h-5 w-5 bg-gradient-to-br from-gray-200 to-white rounded-full group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-white transition-all duration-300">
                LocalHost8000
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {/* <div className={`
            flex flex-col space-y-10 inset-0 fixed top-0 h-screen bg-gray-900/95 backdrop-blur-xl lg:backdrop-blur-none lg:bg-transparent py-24 px-8 sm:px-10
            transition-all duration-500 ease-out lg:flex-row lg:flex-1 lg:py-0 lg:px-0 lg:space-y-0 lg:gap-x-10 lg:relative lg:top-0 lg:h-full lg:items-center lg:justify-between
            ${openNavbar ? "visible opacity-100 translate-x-0" : "-translate-x-full opacity-0 lg:translate-x-0 lg:visible lg:opacity-100"}
          `}> */}
            {/* <ul className="flex flex-col gap-y-6 text-gray-300 lg:items-center lg:flex-row lg:gap-x-8 lg:h-full lg:justify-end lg:flex-1">
              <li>
                <Link 
                  to="/login" 
                  className="group relative inline-block py-2 transition-colors duration-300 hover:text-white"
                  onClick={() => setOpenNavbar(false)}
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link 
                    to="/register" 
                    className="group relative inline-block py-2 transition-colors duration-300 hover:text-white"
                    onClick={() => setOpenNavbar(false)}
                  >
                    Register
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              )}
            </ul> */}

            {/* CTA Button */}
            <div className="w-full flex sm:w-max lg:min-w-max lg:items-center">
              <Link 
                to={!isAuthenticated ? '/register' : '/form'} 
                className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30"
                onClick={() => setOpenNavbar(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                <span className="relative">Check T-Score</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300">
                  <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          {/* </div> */}

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button 
              onClick={toggleNavbar}
              className="relative p-3 w-12 h-12 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-white/10 hover:bg-gray-700/50 transition-all duration-300 flex flex-col justify-center items-center gap-1.5"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 rounded-full bg-emerald-400 transition-all duration-300 ${openNavbar ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 rounded-full bg-emerald-400 transition-all duration-300 ${openNavbar ? "opacity-0 scale-0" : ""}`} />
              <span className={`block w-5 h-0.5 rounded-full bg-emerald-400 transition-all duration-300 ${openNavbar ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
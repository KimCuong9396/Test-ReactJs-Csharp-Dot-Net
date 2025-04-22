import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { token, isPremium, handleLogout } = useContext(AuthContext);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  let username = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.name;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const linkStyles = (path) =>
    `text-sm md:text-base lg:text-base font-semibold px-2 md:px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
      scrolled
        ? activeLink === path
          ? "text-blue-700 bg-blue-50"
          : "text-gray-600 hover:bg-gray-100 hover:text-blue-700"
        : activeLink === path
        ? "text-white bg-blue-800"
        : "text-white hover:bg-blue-800 hover:bg-opacity-70"
    }`;

  const mobileLinkStyles = (path) =>
    `text-sm md:text-base font-semibold px-4 py-2 md:py-3 w-full text-center rounded-lg transition-all duration-300 ${
      activeLink === path
        ? "text-blue-700 bg-blue-50"
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-700"
    }`;

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-2"
          : "bg-blue-700 shadow-sm py-2 md:py-3"
      }`}
    >
      <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-screen-xl">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${
              scrolled ? "text-blue-700" : "text-white"
            }`}
            onClick={() => handleLinkClick("/")}
          >
            VocabMaster
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 md:space-x-2">
            <Link
              to="/"
              className={linkStyles("/")}
              onClick={() => handleLinkClick("/")}
            >
              Home
            </Link>
            {token && (
              <>
                <Link
                  to="/courses"
                  className={linkStyles("/courses")}
                  onClick={() => handleLinkClick("/courses")}
                >
                  Courses
                </Link>
                <Link
                  to="/revise"
                  className={linkStyles("/revise")}
                  onClick={() => handleLinkClick("/revise")}
                >
                  Revise
                </Link>
                <Link
                  to="/statistics"
                  className={linkStyles("/statistics")}
                  onClick={() => handleLinkClick("/statistics")}
                >
                  Statistics
                </Link>
                <Link
                  to="/search"
                  className={linkStyles("/search")}
                  onClick={() => handleLinkClick("/search")}
                >
                  Search
                </Link>
                {isPremium && (
                  <Link
                    to="/admin"
                    className={linkStyles("/admin")}
                    onClick={() => handleLinkClick("/admin")}
                  >
                    Admin
                  </Link>
                )}
                <NotificationBell scrolled={scrolled} />
                <div className="relative">
                  <button
                    className={`flex items-center font-semibold px-2 md:px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                      scrolled
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-white hover:bg-blue-800 hover:bg-opacity-70"
                    }`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="text-sm md:text-base">{username}</span>
                    <svg
                      className="w-4 h-4 ml-1 md:ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 md:w-40 lg:w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-slide-in">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm md:text-base text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => handleLinkClick("/profile")}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm md:text-base text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            {!token && (
              <>
                <Link
                  to="/login"
                  className={`text-sm md:text-base font-semibold px-2 md:px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                    scrolled
                      ? "text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                      : "text-white hover:bg-blue-800 hover:bg-opacity-70"
                  }`}
                  onClick={() => handleLinkClick("/login")}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`text-sm md:text-base font-semibold px-2 md:px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                    scrolled
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                  onClick={() => handleLinkClick("/register")}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden focus:outline-none ${
              scrolled ? "text-gray-600" : "text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6 md:w-7 md:h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 md:w-7 md:h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 md:mt-3 py-2 md:py-3 flex flex-col space-y-1 md:space-y-2 bg-white rounded-lg shadow-md animate-slide-in">
            <Link
              to="/"
              className={mobileLinkStyles("/")}
              onClick={() => handleLinkClick("/")}
            >
              Home
            </Link>
            {token && (
              <>
                <Link
                  to="/courses"
                  className={mobileLinkStyles("/courses")}
                  onClick={() => handleLinkClick("/courses")}
                >
                  Courses
                </Link>
                <Link
                  to="/revise"
                  className={mobileLinkStyles("/revise")}
                  onClick={() => handleLinkClick("/revise")}
                >
                  Revise
                </Link>
                <Link
                  to="/statistics"
                  className={mobileLinkStyles("/statistics")}
                  onClick={() => handleLinkClick("/statistics")}
                >
                  Statistics
                </Link>
                <Link
                  to="/search"
                  className={mobileLinkStyles("/search")}
                  onClick={() => handleLinkClick("/search")}
                >
                  Search
                </Link>
                {isPremium && (
                  <Link
                    to="/admin"
                    className={mobileLinkStyles("/admin")}
                    onClick={() => handleLinkClick("/admin")}
                  >
                    Admin
                  </Link>
                )}
                <div className="px-4 py-2 md:py-3">
                  <NotificationBell scrolled={true} />
                </div>
                <div className="relative">
                  <button
                    className="text-sm md:text-base font-semibold px-4 py-2 md:py-3 w-full text-center text-gray-600 hover:bg-gray-100 hover:text-blue-700 rounded-lg"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {username}
                    <svg
                      className="w-4 h-4 ml-2 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="bg-white rounded-lg py-2 mt-1 shadow-md">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm md:text-base text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => handleLinkClick("/profile")}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm md:text-base text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            {!token && (
              <>
                <Link
                  to="/login"
                  className={mobileLinkStyles("/login")}
                  onClick={() => handleLinkClick("/login")}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm md:text-base font-semibold px-4 py-2 md:py-3 w-full text-center bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-all duration-300"
                  onClick={() => handleLinkClick("/register")}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(-10%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

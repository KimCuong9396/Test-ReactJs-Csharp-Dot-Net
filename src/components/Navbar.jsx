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

  // Update active link when location changes
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const linkStyles = (path) => {
    const baseStyle =
      "text-white font-semibold px-4 py-2 rounded-full transition-all duration-300";
    const activeStyle =
      activeLink === path
        ? {
            "/": "bg-indigo-600",
            "/courses": "bg-indigo-700",
            "/revise": "bg-indigo-800",
            "/statistics": "bg-indigo-600",
            "/search": "bg-indigo-700",
            "/profile": "bg-indigo-800",
            "/admin": "bg-yellow-600 text-indigo-900",
            "/login": "bg-indigo-600",
            "/register": "bg-yellow-500 text-indigo-900",
          }[path] || "bg-indigo-600"
        : "bg-transparent hover:bg-indigo-700 hover:bg-opacity-70";
    return `${baseStyle} ${activeStyle}`;
  };

  const mobileLinkStyles = (path) => {
    const baseStyle =
      "text-white font-semibold px-4 py-3 w-full text-center rounded-lg transition-all duration-300";
    const activeStyle =
      activeLink === path
        ? {
            "/": "bg-indigo-600",
            "/courses": "bg-indigo-700",
            "/revise": "bg-indigo-800",
            "/statistics": "bg-indigo-600",
            "/search": "bg-indigo-700",
            "/profile": "bg-indigo-800",
            "/admin": "bg-yellow-600 text-indigo-900",
            "/login": "bg-indigo-600",
            "/register": "bg-yellow-500 text-indigo-900",
          }[path] || "bg-indigo-600"
        : "bg-transparent hover:bg-indigo-700 hover:bg-opacity-70";
    return `${baseStyle} ${activeStyle}`;
  };

  return (
    <nav
      className={`${
        scrolled ? "py-2 bg-opacity-95" : "py-3 bg-opacity-90"
      } bg-blue-800 shadow-lg fixed w-full top-0 z-50 transition-all duration-300 border-b border-indigo-400`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-white drop-shadow-md"
            onClick={() => handleLinkClick("/")}
          >
            VocabMaster
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-4 items-center">
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
                  Statistic
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
                <NotificationBell />
                {/* Dropdown for Welcome, Profile, and Logout */}
                <div className="relative">
                  <span
                    className="text-yellow-300 font-semibold px-4 py-2 cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    Welcome, {username}
                  </span>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-blue-900 rounded-lg shadow-lg py-2 z-50 animate-fade-in-down">
                      <Link
                        to="/profile"
                        className="block w-full text-left text-white px-4 py-2 hover:bg-yellow-500 hover:text-indigo-900 transition-all duration-300"
                        onClick={() => handleLinkClick("/profile")}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left text-white px-4 py-2 hover:bg-yellow-500 hover:text-indigo-900 transition-all duration-300"
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
                  className={linkStyles("/login")}
                  onClick={() => handleLinkClick("/login")}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={linkStyles("/register")}
                  onClick={() => handleLinkClick("/register")}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
          <div className="md:hidden mt-4 py-2 flex flex-col space-y-2 animate-fade-in-down">
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
                  Statistic
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
                <NotificationBell />
                <div className="relative">
                  <span
                    className="text-yellow-300 font-semibold px-4 py-3 w-full text-center block"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    Welcome, {username}
                  </span>
                  {isDropdownOpen && (
                    <div className="bg-blue-900 rounded-lg py-2 mt-1">
                      <Link
                        to="/profile"
                        className="block w-full text-left text-white px-4 py-2 hover:bg-yellow-500 hover:text-indigo-900 transition-all duration-300"
                        onClick={() => handleLinkClick("/profile")}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left text-white px-4 py-2 hover:bg-yellow-500 hover:text-indigo-900 transition-all duration-300"
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
                  className={mobileLinkStyles("/register")}
                  onClick={() => handleLinkClick("/register")}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

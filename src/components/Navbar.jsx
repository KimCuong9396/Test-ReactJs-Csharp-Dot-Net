import React from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = ({ token, onLogout }) => {
  let username = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.name;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  return (
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Vocabulary App
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-secondary">
            Home
          </Link>
          {token && (
            <>
              <Link to="/courses" className="hover:text-secondary">
                Courses
              </Link>
              <Link to="/dashboard" className="hover:text-secondary">
                Dashboard
              </Link>
              <Link to="/profile" className="hover:text-secondary">
                Profile
              </Link>
              <span className="text-gray-200">Welcome, {username}</span>
              <button
                onClick={onLogout}
                className="bg-secondary text-primary px-3 py-1 rounded hover:bg-yellow-400"
              >
                Logout
              </button>
            </>
          )}
          {!token && (
            <>
              <Link to="/login" className="hover:text-secondary">
                Login
              </Link>
              <Link to="/register" className="hover:text-secondary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

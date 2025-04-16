import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token, isPremium, handleLogout } = useContext(AuthContext);

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
              <Link to="/revise" className="hover:text-secondary">
                Revise
              </Link>
              <Link to="/statistics" className="hover:text-secondary">
                Statistic
              </Link>
              <Link to="/search" className="hover:text-secondary">
                Search
              </Link>
              <Link to="/profile" className="hover:text-secondary">
                Profile
              </Link>
              {isPremium && (
                <Link to="/admin" className="hover:text-secondary">
                  Admin
                </Link>
              )}
              <span className="text-cyan-500">Welcome, {username}</span>
              <button
                onClick={handleLogout}
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

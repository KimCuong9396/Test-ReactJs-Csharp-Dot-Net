import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login({ username, password });
      handleLogin(response.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-0 m-0 box-border pt-16">
      <div className="w-full max-w-sm mx-4 bg-white bg-opacity-90 rounded-xl shadow-xl p-4">
        <h2 className="text-2xl font-extrabold text-indigo-600 mb-2 text-center">
          Sign In
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded-lg mb-2 text-center text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <label className="block text-gray-700 text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 text-sm"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 text-sm"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-yellow-400 text-indigo-900 p-2 rounded-lg font-bold text-base hover:bg-yellow-500 hover:scale-105 transition-all duration-300 shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-2 text-center text-gray-600 text-sm">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

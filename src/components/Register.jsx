import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    preferredLanguage: "en",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await register(formData);
      console.log("Register response:", response.data);

      if (response.status === 200) {
        const { userId, username } = response.data;
        console.log(
          `Registration successful: User ${username} (ID: ${userId})`
        );
        navigate("/login");
      } else {
        setError("Unexpected response status: " + response.status);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-0 m-0 box-border pt-16">
      <div className="w-full max-w-sm mx-4 bg-white bg-opacity-90 rounded-xl shadow-xl p-4">
        <h2 className="text-2xl font-extrabold text-indigo-600 mb-0 text-center">
          Create Your Account
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded-lg mb-1 text-center text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <label className="block text-gray-700 text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 text-sm"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-1">
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 text-sm"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-1">
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 text-sm"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-1">
            <label className="block text-gray-700 text-sm mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 text-sm"
              disabled={loading}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm mb-1">
              Preferred Language
            </label>
            <select
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 text-sm"
              disabled={loading}
            >
              <option value="en">English</option>
              <option value="vi">Vietnamese</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
          <button
            type="submit"
            className={`w-full bg-yellow-400 text-indigo-900 p-2 rounded-lg font-bold text-base hover:bg-yellow-500 hover:scale-105 transition-all duration-300 shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-2 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

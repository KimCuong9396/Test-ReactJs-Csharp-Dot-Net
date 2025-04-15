import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    preferredLanguage: "en",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        //console.log("check profile", response);
        setProfile(response.data);
        setFormData({
          fullName: response.data.fullName || "",
          preferredLanguage: response.data.preferredLanguage,
        });
      } catch (err) {
        setError("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      alert("Profile updated");
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!profile) return null;

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-6">Profile</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {profile.username}
        </h3>
        <p className="text-gray-600 mt-2">Email: {profile.email}</p>
        <p className="text-gray-600">
          Full Name: {profile.fullName || "Not set"}
        </p>
        <p className="text-gray-600">Language: {profile.preferredLanguage}</p>
        <p className="text-gray-600">
          Premium: {profile.isPremium ? "Yes" : "No"}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Preferred Language</label>
          <select
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
            <option value="ja">Japanese</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-indigo-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;

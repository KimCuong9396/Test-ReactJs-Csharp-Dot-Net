import React, { useState, useEffect } from "react";
import { getProfile, updateProfile, changePassword } from "../services/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    preferredLanguage: "en",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      alert("Profile updated successfully");
      setIsProfileModalOpen(false);

      // Refresh profile data
      const response = await getProfile();
      setProfile(response.data);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("New password must be at least 8 characters long");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert("Password changed successfully. Please log in again.");
      localStorage.removeItem("token"); // Remove token to force re-login
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data.message || "Current password is incorrect");
      } else {
        alert("Failed to change password");
      }
    }
  };

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setFormData({
      fullName: profile.fullName || "",
      preferredLanguage: profile.preferredLanguage,
    });
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
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

      <div className="flex">
        <button
          type="button"
          onClick={openProfileModal}
          className="bg-blue-700 text-white p-2 rounded hover:bg-blue-800 w-20% mx-10"
        >
          Update Profile
        </button>
        <button
          type="button"
          onClick={openPasswordModal}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 w-20%"
        >
          Change Password
        </button>
      </div>

      {/* Profile Update Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Update Profile</h3>
            <form onSubmit={handleProfileSubmit}>
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
                <label className="block text-gray-700 mb-1">
                  Preferred Language
                </label>
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
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeProfileModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength="8"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

import React, { createContext, useState, useEffect } from "react";
import { getProfile } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isPremium, setIsPremium] = useState(false);

  // Lấy thông tin người dùng khi token thay đổi
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const response = await getProfile();
          setIsPremium(response.data.isPremium || false);
        } catch (err) {
          console.error("Failed to fetch profile:", err);
          setIsPremium(false);
        }
      } else {
        setIsPremium(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Hàm xử lý đăng nhập
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setToken(null);
    setIsPremium(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ token, isPremium, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

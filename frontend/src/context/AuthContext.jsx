import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("shubhdeep_admin_token"));
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem("shubhdeep_admin_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getMe()
        .then((user) => {
          setAdminUser(user);
          localStorage.setItem("shubhdeep_admin_user", JSON.stringify(user));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setToken(data.access_token);
    setAdminUser(data.user);
    localStorage.setItem("shubhdeep_admin_token", data.access_token);
    localStorage.setItem("shubhdeep_admin_user", JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem("shubhdeep_admin_token");
    localStorage.removeItem("shubhdeep_admin_user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        adminUser,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

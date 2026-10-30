import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const CustomerAuthContext = createContext(null);

export const CustomerAuthProvider = ({ children }) => {
  const [customerToken, setCustomerToken] = useState(() =>
    localStorage.getItem("shubhdeep_customer_token")
  );
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem("shubhdeep_customer_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [customerLoading, setCustomerLoading] = useState(true);

  useEffect(() => {
    if (customerToken) {
      api.getCustomerMe()
        .then((user) => {
          setCustomer(user);
          localStorage.setItem("shubhdeep_customer_user", JSON.stringify(user));
        })
        .catch(() => {
          customerLogout();
        })
        .finally(() => setCustomerLoading(false));
    } else {
      setCustomerLoading(false);
    }
  }, [customerToken]);

  const customerLogin = async (email_or_phone, password) => {
    const data = await api.customerLogin(email_or_phone, password);
    setCustomerToken(data.access_token);
    setCustomer(data.user);
    localStorage.setItem("shubhdeep_customer_token", data.access_token);
    localStorage.setItem("shubhdeep_customer_user", JSON.stringify(data.user));
    return data;
  };

  const customerRegister = async (registerData) => {
    const data = await api.customerRegister(registerData);
    setCustomerToken(data.access_token);
    setCustomer(data.user);
    localStorage.setItem("shubhdeep_customer_token", data.access_token);
    localStorage.setItem("shubhdeep_customer_user", JSON.stringify(data.user));
    return data;
  };

  const customerLogout = () => {
    setCustomerToken(null);
    setCustomer(null);
    localStorage.removeItem("shubhdeep_customer_token");
    localStorage.removeItem("shubhdeep_customer_user");
  };

  const updateProfile = async (profileData) => {
    const updated = await api.updateCustomerProfile(profileData);
    setCustomer(updated);
    localStorage.setItem("shubhdeep_customer_user", JSON.stringify(updated));
    return updated;
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        customerToken,
        isCustomerAuthenticated: !!customerToken,
        customerLoading,
        customerLogin,
        customerRegister,
        customerLogout,
        updateProfile,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  return ctx;
};

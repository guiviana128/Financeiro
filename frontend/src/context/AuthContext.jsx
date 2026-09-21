import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, setAuthToken } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("finflow_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("finflow_auth_token") || null;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sync token to API client
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // Check current session on startup
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem("finflow_auth_token");
      if (storedToken) {
        setAuthToken(storedToken);
        try {
          const me = await api.auth.getMe();
          setUser(me);
          localStorage.setItem("finflow_user", JSON.stringify(me));
        } catch (err) {
          console.warn("Sessão expirada ou inválida:", err);
          logout();
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await api.auth.login({ email, password });
      setToken(res.access_token);
      setUser(res.user);
      setAuthToken(res.access_token);
      localStorage.setItem("finflow_auth_token", res.access_token);
      localStorage.setItem("finflow_user", JSON.stringify(res.user));
      return res.user;
    } catch (err) {
      setAuthError(err.message || "Erro ao realizar login.");
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const res = await api.auth.register({ name, email, password });
      setToken(res.access_token);
      setUser(res.user);
      setAuthToken(res.access_token);
      localStorage.setItem("finflow_auth_token", res.access_token);
      localStorage.setItem("finflow_user", JSON.stringify(res.user));
      return res.user;
    } catch (err) {
      setAuthError(err.message || "Erro ao criar conta.");
      throw err;
    }
  };

  const demoLogin = async () => {
    return await login("demo@finflow.com", "demo123");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("finflow_auth_token");
    localStorage.removeItem("finflow_user");
  };

  const updateProfile = async (data) => {
    try {
      const updated = await api.auth.updateProfile(data);
      setUser(updated);
      localStorage.setItem("finflow_user", JSON.stringify(updated));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        authError,
        setAuthError,
        login,
        register,
        demoLogin,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

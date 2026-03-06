import { createContext, useState, useContext, useCallback } from "react";
import api from "../lib/api";

export const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const persist = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const register = useCallback(async (name, email, password) => {
    try {
      await api.post("/auth/register", { name, email, password });
      const res = await api.post("/auth/login", { email, password });
      persist(res.data.token, res.data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed.";
      return { success: false, message };
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      persist(res.data.token, res.data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Invalid email or password.";
      return { success: false, message };
    }
  }, []);

  const googleLogin = useCallback(async (token) => {
    try {
      const res = await api.post("/auth/google", { token });
      persist(res.data.token, res.data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Google login failed.";
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated: Boolean(token), register, login, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

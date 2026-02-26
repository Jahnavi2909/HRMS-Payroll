
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const logout = useCallback(() => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const isTokenExpired = useCallback((token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    let timer;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (!payload.exp) return;

      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();

      if (expiryTime <= currentTime) {
        logout();
        return;
      }

      const timeout = expiryTime - currentTime;

      timer = setTimeout(() => {
        logout();
      }, timeout);

    } catch (err) {
      console.error("Invalid token format");
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [token, logout]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceLogin = params.get("forceLogin");

    const isPayrollLogin =
      window.location.pathname === "/login";

    if (isPayrollLogin && forceLogin === "true") {
      Cookies.remove("token");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    const savedUser = localStorage.getItem("user");
    const savedToken = Cookies.get("token");

    if (savedUser && savedToken) {
      if (isTokenExpired(savedToken)) {
        localStorage.removeItem("user");
        Cookies.remove("token");
      } else {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        } catch {
          Cookies.remove("user");
          Cookies.remove("token");
        }
      }
    }
    setLoading(false);
  }, [isTokenExpired]);

  const login = async (email, password) => {
    try {
      setError("");
      const res = await authApi.login(email, password);

      const { token, ...userData } = res?.data;
      const finalUser = {
        ...userData,
        role: userData.role || "ROLE_EMPLOYEE",
      };

      Cookies.set("token", token, { expires: 7 });
      localStorage.setItem("user", JSON.stringify(finalUser));

      setUser(finalUser);
      setToken(token);

      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed";
      setError(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        logout
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};

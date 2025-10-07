import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type AuthContextProps = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) setIsAuthenticated(true);
  }, []);

  const login = (username: string, password: string) => {
    {
      if (username.trim() && password.trim()) {
        const fakeToken = btoa(`${username}:${password}`);
        localStorage.setItem("auth_token", fakeToken);
        setIsAuthenticated(true);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

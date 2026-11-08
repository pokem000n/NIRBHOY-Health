import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user from localStorage or API
    const initAuth = async () => {
      try {
        const user = await ApiService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        } else {
          // Pre-populate with sample logged in user if desired or allow sign in
          const savedUser = localStorage.getItem('nirbhoy_user');
          if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await ApiService.login(email, password);
    if (res.token) {
      localStorage.setItem('nirbhoy_token', res.token);
      localStorage.setItem('nirbhoy_user', JSON.stringify(res.user));
      setCurrentUser(res.user);
    }
    return res;
  };

  const signup = async (userData) => {
    const res = await ApiService.signup(userData);
    if (res.token) {
      localStorage.setItem('nirbhoy_token', res.token);
      localStorage.setItem('nirbhoy_user', JSON.stringify(res.user));
      setCurrentUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('nirbhoy_token');
    localStorage.removeItem('nirbhoy_user');
    setCurrentUser(null);
  };

  const updateSubscription = (sub) => {
    if (currentUser) {
      const updated = { ...currentUser, subscription: sub };
      setCurrentUser(updated);
      localStorage.setItem('nirbhoy_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, signup, logout, updateSubscription }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Mock logged-in user state. LocalStorage integration included.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cng_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    // Role simulation based on credentials
    let role = 'ADMIN';
    let name = 'Station Admin';

    if (email.includes('super') || email === 'superadmin@cnghub.com') {
      role = 'SUPER_ADMIN';
      name = 'Super Admin';
    }

    const userData = {
      id: '1',
      email,
      name,
      role, // 'SUPER_ADMIN' or 'ADMIN'
      avatar: 'https://i.pravatar.cc/150?img=12'
    };

    setUser(userData);
    localStorage.setItem('cng_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cng_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
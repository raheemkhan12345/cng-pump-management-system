import { createContext, useContext, useState } from 'react';

// Export AuthContext for direct useContext(AuthContext) usage
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // LocalStorage integration with initial state
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('cng_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    let role = 'ADMIN';
    let name = 'Muhammad Bilal';
    let pumpName = 'CNG Pump 01';
    let pumpAddress = 'Mingora, Swat';

    // Mock credential check for Super Admin
    if (email.includes('super') || email === 'superadmin@cnghub.com' || password === 'superadmin') {
      role = 'SUPER_ADMIN';
      name = 'Super Admin';
      pumpName = '';
      pumpAddress = '';
    }

    const userData = {
      id: role === 'SUPER_ADMIN' ? 'super_1' : 'admin_1',
      email,
      name,
      role, // 'SUPER_ADMIN' or 'ADMIN'
      pumpName,
      pumpAddress,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    };

    setUser(userData);
    localStorage.setItem('cng_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cng_user');
  };

  // Helper function to update user data dynamically (e.g., Profile Page update)
  const updateUser = (updatedFields) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedFields };
      localStorage.setItem('cng_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
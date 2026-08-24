import { createContext, useContext, useState } from 'react';
import { superAdminLogin } from '../services/authApi';

// Export AuthContext for direct useContext(AuthContext) usage
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  // ==========================================
  // LocalStorage User
  // ==========================================

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('cng_user');

      return savedUser
        ? JSON.parse(savedUser)
        : null;

    } catch {
      return null;
    }
  });

  // ==========================================
  // Login
  // ==========================================

  const login = async (email, password) => {

    // ==========================================
    // SUPER ADMIN LOGIN
    // ==========================================

    const isSuperAdmin =
      email.trim().toLowerCase() === 'superadmin@gmail.com';

    if (isSuperAdmin) {

      try {

        console.log('Calling Super Admin API...');

        const response = await superAdminLogin(
          email,
          password
        );

        console.log(
          'Super Admin Login Response:',
          response
        );

        // ==========================================
        // Check API Success
        // ==========================================

        if (!response?.success) {
          throw new Error(
            response?.message ||
            'Super Admin login failed.'
          );
        }

        // ==========================================
        // Get Token
        // ==========================================

        const token =
          response.token ||
          response.accessToken ||
          response.data?.token ||
          response.data?.accessToken ||
          null;

        if (!token) {
          throw new Error(
            'Login successful but token was not received.'
          );
        }

        // ==========================================
        // Backend Currently Doesn't Return User
        // ==========================================
        // So we create the frontend user object.

        const userData = {
          id: 'super_1',
          email: email,
          name: 'Super Admin',
          role: 'SUPER_ADMIN',
          pumpName: '',
          pumpAddress: '',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
        };

        // ==========================================
        // Save Token
        // ==========================================

        localStorage.setItem(
          'cng_token',
          token
        );

        // ==========================================
        // Save User
        // ==========================================

        localStorage.setItem(
          'cng_user',
          JSON.stringify(userData)
        );

        // ==========================================
        // Update State
        // ==========================================

        setUser(userData);

        console.log(
          'Super Admin Logged In:',
          userData
        );

        return userData;

      } catch (error) {

        console.error(
          'Super Admin Login Error:',
          error
        );

        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Super Admin login failed.';

        throw new Error(message);
      }
    }

    // ==========================================
    // ADMIN DUMMY LOGIN
    // ==========================================

    const adminUser = {
      id: 'admin_1',
      email,
      name: 'Muhammad Bilal',
      role: 'ADMIN',
      pumpName: 'CNG Pump 01',
      pumpAddress: 'Mingora, Swat',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    };

    setUser(adminUser);

    localStorage.setItem(
      'cng_user',
      JSON.stringify(adminUser)
    );

    return adminUser;
  };

  // ==========================================
  // Logout
  // ==========================================

  const logout = () => {

    setUser(null);

    localStorage.removeItem(
      'cng_user'
    );

    localStorage.removeItem(
      'cng_token'
    );
  };

  // ==========================================
  // Update User
  // ==========================================

  const updateUser = (updatedFields) => {

    setUser((prevUser) => {

      if (!prevUser) {
        return null;
      }

      const newUser = {
        ...prevUser,
        ...updatedFields
      };

      localStorage.setItem(
        'cng_user',
        JSON.stringify(newUser)
      );

      return newUser;
    });
  };

  // ==========================================
  // Context
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// Custom Hook
// ==========================================

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};
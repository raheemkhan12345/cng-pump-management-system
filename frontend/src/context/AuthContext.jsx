import { createContext, useContext, useState } from "react";

import { superAdminLogin, adminLogin } from "../services/authApi";

// Export AuthContext
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // =========================================================
  // LOCAL STORAGE USER
  // =========================================================

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("cng_user");

      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to load saved user:", error);
      return null;
    }
  });

  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    // =======================================================
    // SUPER ADMIN LOGIN
    // =======================================================

    const isSuperAdmin = normalizedEmail === "superadmin@gmail.com";

    try {
      let response;

      // =====================================================
      // CALL CORRESPONDING API
      // =====================================================

      if (isSuperAdmin) {
        console.log("Calling Super Admin Login API...");

        response = await superAdminLogin(email.trim(), password);
      } else {
        console.log("Calling Admin Login API...");

        response = await adminLogin(email.trim(), password);
      }

      console.log("Login API Response:", response);

      // =====================================================
      // CHECK API SUCCESS
      // =====================================================

      if (!response?.success) {
        throw new Error(
          response?.message || response?.error || "Login failed.",
        );
      }

      // =====================================================
      // GET TOKEN
      // =====================================================

      const token =
        response?.token ||
        response?.accessToken ||
        response?.data?.token ||
        response?.data?.accessToken ||
        response?.data?.data?.token ||
        null;

      if (!token) {
        throw new Error(
          "Login successful but authentication token was not received.",
        );
      }

      // =====================================================
      // GET USER DATA
      // =====================================================

      /*
        Backend response different structures ko handle
        karne ke liye multiple possibilities check kar rahe hain.
      */

      const apiUser =
        response?.user ||
        response?.admin ||
        response?.data?.user ||
        response?.data?.admin ||
        response?.data?.data ||
        null;

      // =====================================================
      // SUPER ADMIN USER
      // =====================================================

      if (isSuperAdmin) {
        const userData = {
          id: apiUser?._id || apiUser?.id || "super_1",

          email: apiUser?.email || email.trim(),

          name: apiUser?.name || apiUser?.fullName || "Super Admin",

          role: apiUser?.role || "SUPER_ADMIN",

          pumpName: apiUser?.pumpName || "",

          pumpAddress: apiUser?.pumpAddress || "",

          
        };

        // ===================================================
        // VALIDATE ROLE
        // ===================================================

        if (userData.role !== "SUPER_ADMIN") {
          throw new Error("This account is not authorized as Super Admin.");
        }

        // ===================================================
        // SAVE TOKEN
        // ===================================================

        localStorage.setItem("cng_token", token);

        // ===================================================
        // SAVE USER
        // ===================================================

        localStorage.setItem("cng_user", JSON.stringify(userData));

        // ===================================================
        // UPDATE STATE
        // ===================================================

        setUser(userData);

        console.log("Super Admin Logged In:", userData);

        return userData;
      }

      // =====================================================
      // ADMIN USER
      // =====================================================

      const userData = {
        id: apiUser?._id || apiUser?.id || "admin_1",

        email: apiUser?.email || email.trim(),

        name: apiUser?.name || apiUser?.fullName || "Admin",

        role: apiUser?.role || "ADMIN",

        pumpName:
          apiUser?.pumpName ||
          apiUser?.stationName ||
          apiUser?.pump?.name ||
          "",

        pumpAddress:
          apiUser?.pumpAddress ||
          apiUser?.stationAddress ||
          apiUser?.pump?.address ||
          "",


      };

      // =====================================================
      // VALIDATE ADMIN ROLE
      // =====================================================

      if (userData.role !== "ADMIN") {
        throw new Error("This account is not authorized as Admin.");
      }

      // =====================================================
      // SAVE TOKEN
      // =====================================================

      localStorage.setItem("cng_token", token);

      // =====================================================
      // SAVE USER
      // =====================================================

      localStorage.setItem("cng_user", JSON.stringify(userData));

      // =====================================================
      // UPDATE STATE
      // =====================================================

      setUser(userData);

      console.log("Admin Logged In:", userData);

      return userData;
    } catch (error) {
      // =====================================================
      // API ERROR HANDLING
      // =====================================================

      console.error("Login Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.errors?.[0]?.message ||
        error?.message ||
        "Invalid email or password.";

      throw new Error(message);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    setUser(null);

    localStorage.removeItem("cng_user");
    localStorage.removeItem("cng_token");
  };

  // =========================================================
  // UPDATE USER
  // =========================================================

  const updateUser = (updatedFields) => {
    setUser((prevUser) => {
      if (!prevUser) {
        return null;
      }

      const newUser = {
        ...prevUser,
        ...updatedFields,
      };

      localStorage.setItem("cng_user", JSON.stringify(newUser));

      return newUser;
    });
  };

  // =========================================================
  // CONTEXT
  // =========================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =========================================================
// CUSTOM HOOK
// =========================================================

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

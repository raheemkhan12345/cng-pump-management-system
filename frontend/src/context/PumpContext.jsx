import React, { createContext, useContext, useState } from "react";

import { createAdmin } from "../services/superAdminDash";

const PumpContext = createContext(null);

/* ==========================================
   PUMP PROVIDER
========================================== */

export const PumpProvider = ({ children }) => {
  // ==========================================
  // Pumps State
  // ==========================================

  const [pumps, setPumps] = useState([]);

  // ==========================================
  // Loading State
  // ==========================================

  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // Error State
  // ==========================================

  const [error, setError] = useState(null);

  /* ==========================================
     CREATE NEW PUMP / ADMIN
  ========================================== */

  const addNewPump = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Creating new pump:", formData);

      // ==========================================
      // API Request
      // ==========================================

      const response = await createAdmin({
        pumpName: formData.pumpName,

        pumpAddress: formData.pumpAddress,

        adminName: formData.adminName,

        email: formData.email,

        password: formData.password,
      });

      console.log("Create Admin API Response:", response);

      // ==========================================
      // Validate API Response
      // ==========================================

      if (!response) {
        throw new Error("No response received from server.");
      }

      if (response.success === false) {
        throw new Error(response.message || "Failed to create pump.");
      }

      // ==========================================
      // Get Created Pump/Admin
      // ==========================================

      const createdData =
        response.data || response.admin || response.pump || null;

      /*
       * Backend agar created record return karta hai
       * to dashboard mein immediately show karenge.
       */

      if (createdData) {
        const normalizedPump = normalizePump(createdData);

        setPumps((prevPumps) => [normalizedPump, ...prevPumps]);
      }

      return response;
    } catch (error) {
      console.error("Add Pump Error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create pump.";

      setError(message);

      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================
     REMOVE PUMP
     
     NOTE:
     Abhi remove API available nahi hai,
     isliye is function ko sirf frontend
     state removal ke liye rakha gaya hai.
     
     Jab backend DELETE API milegi,
     isko API based kar denge.
  ========================================== */

  const removePump = (id) => {
    setPumps((prevPumps) =>
      prevPumps.filter((pump) => pump.id !== id && pump._id !== id),
    );
  };

  /* ==========================================
     CLEAR ERROR
  ========================================== */

  const clearError = () => {
    setError(null);
  };

  /* ==========================================
     CONTEXT
  ========================================== */

  return (
    <PumpContext.Provider
      value={{
        pumps,

        addNewPump,

        removePump,

        isLoading,

        error,

        clearError,
      }}
    >
      {children}
    </PumpContext.Provider>
  );
};

/* ==========================================
   NORMALIZE PUMP DATA

   Backend response ka exact structure
   abhi confirm nahi hai.

   Isliye common field names handle
   kar rahe hain.
========================================== */

const normalizePump = (data) => {
  const admin = data.admin || data.user || data.adminData || {};

  const adminName =
    admin.name || admin.fullName || data.adminName || "Unassigned";

  const initials =
    admin.initials ||
    adminName
      .split(/\s+/)
      .filter(Boolean)
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return {
    // Backend ID
    id: data.id || data._id,

    _id: data._id || data.id,

    // Pump Number
    pumpNo: data.pumpNo || data.pumpNumber || data.stationNumber || "N/A",

    // Pump Name
    name: data.name || data.pumpName || data.stationName || "Unnamed Pump",

    // Location
    location: data.location || data.pumpAddress || data.address || "N/A",

    // Status
    status: data.status || "Active",

    // Admin
    admin: {
      name: adminName,

      email: admin.email || data.email || "",

      initials,

      assigned: Boolean(admin.name || admin.fullName || data.adminName),

      lastLogin: admin.lastLogin || "Never",
    },

    // Commission Date
    dateCommissioned: data.dateCommissioned || data.createdAt || "N/A",
  };
};

/* ==========================================
   CUSTOM HOOK
========================================== */

// eslint-disable-next-line react-refresh/only-export-components
export const usePumps = () => {
  const context = useContext(PumpContext);

  if (!context) {
    throw new Error("usePumps must be used within a PumpProvider");
  }

  return context;
};

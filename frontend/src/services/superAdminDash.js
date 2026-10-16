
import axiosInstance from "./axiosInstance";

/* ==========================================
   CREATE NEW ADMIN / PUMP
========================================== */

export const createAdmin = async (adminData) => {
  try {
    const response = await axiosInstance.post(
      "/admins/createAdmin",
      adminData
    );

    return response.data;
  } catch (error) {
    console.error("Create Admin API Error:", error);
    throw error;
  }
};

/* ==========================================
   GET ALL ADMINS / PUMPS
========================================== */

export const getAllAdmins = async () => {
  try {
    const response = await axiosInstance.get(
      "/admins/getAllAdmins"
    );

    return response.data;
  } catch (error) {
    console.error("Get All Admins API Error:", error);
    throw error;
  }
};

/* ==========================================
   UPDATE ADMIN / PUMP
========================================== */

export const updateAdmin = async (adminId, updateData) => {
  try {
    if (!adminId) {
      throw new Error("Admin ID is required.");
    }

    const response = await axiosInstance.put(
      `/admins/updateAdmin/${adminId}`,
      updateData
    );

    return response.data;
  } catch (error) {
    console.error("Update Admin API Error:", error);
    throw error;
  }
};

/* ==========================================
   DELETE ADMIN / PUMP
========================================== */

export const deleteAdmin = async (adminId) => {
  try {
    if (!adminId) {
      throw new Error("Admin ID is required.");
    }

    const response = await axiosInstance.delete(
      `/admins/deleteAdmin/${adminId}`
    );

    return response.data;
  } catch (error) {
    console.error("Delete Admin API Error:", error);
    throw error;
  }
};
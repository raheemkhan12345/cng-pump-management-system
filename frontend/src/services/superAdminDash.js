import axiosInstance from "./axiosInstance";

/* ==========================================
   CREATE NEW ADMIN / PUMP
========================================== */

export const createAdmin = async (adminData) => {
  try {
    const response = await axiosInstance.post("/admins/createAdmin", adminData);

    console.log("Create Admin API Response:", response.data);

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
    const response = await axiosInstance.get("/admins/getAllAdmins");

    console.log("Get All Admins API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Get All Admins API Error:", error);

    throw error;
  }
};

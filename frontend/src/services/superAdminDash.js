import axiosInstance from "./axiosInstance";

/* ==========================================
   CREATE NEW ADMIN / PUMP
========================================== */

export const createAdmin = async (adminData) => {
  try {
    console.log("========================================");
    console.log("CREATE ADMIN API");
    console.log("========================================");

    console.log("Create Admin Data:", adminData);

    const response = await axiosInstance.post(
      "/admins/createAdmin",
      adminData,
    );

    console.log("Create Admin API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("========================================");
    console.error("CREATE ADMIN API ERROR");
    console.error("========================================");

    console.error("Full Error:", error);
    console.error("Response:", error?.response);
    console.error("Response Data:", error?.response?.data);
    console.error("Status:", error?.response?.status);

    throw error;
  }
};

/* ==========================================
   GET ALL ADMINS / PUMPS
========================================== */

export const getAllAdmins = async () => {
  try {
    console.log("========================================");
    console.log("GET ALL ADMINS API");
    console.log("========================================");

    const response = await axiosInstance.get("/admins/getAllAdmins");

    console.log("Get All Admins API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("========================================");
    console.error("GET ALL ADMINS API ERROR");
    console.error("========================================");

    console.error("Full Error:", error);
    console.error("Response:", error?.response);
    console.error("Response Data:", error?.response?.data);
    console.error("Status:", error?.response?.status);

    throw error;
  }
};

/* ==========================================
   UPDATE ADMIN / PUMP
========================================== */

/*
 * Backend Route:
 *
 * PUT /api/v1/admins/updateAdmin/:id
 *
 * Example:
 *
 * updateAdmin(
 *   "6a8c1e1bd831a01677895860",
 *   {
 *     pumpName: "New Pump Name"
 *   }
 * )
 */

export const updateAdmin = async (adminId, updateData) => {
  try {
    if (!adminId) {
      throw new Error("Admin ID is required.");
    }

    console.log("========================================");
    console.log("UPDATE ADMIN API");
    console.log("========================================");

    console.log("Admin ID:", adminId);

    console.log("Update Data:", {
      ...updateData,

      ...(updateData?.password
        ? {
            password: "[HIDDEN]",
          }
        : {}),
    });

    const response = await axiosInstance.put(
      `/admins/updateAdmin/${adminId}`,
      updateData,
    );

    console.log("========================================");
    console.log("UPDATE ADMIN API RESPONSE");
    console.log("========================================");

    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("========================================");
    console.error("UPDATE ADMIN API ERROR");
    console.error("========================================");

    console.error("Full Error:", error);
    console.error("Response:", error?.response);
    console.error("Response Data:", error?.response?.data);
    console.error("Status:", error?.response?.status);
    console.error("Status Text:", error?.response?.statusText);
    console.error("Request URL:", error?.config?.url);
    console.error("Request Method:", error?.config?.method);

    throw error;
  }
};

/* ==========================================
   DELETE ADMIN / PUMP
========================================== */

/*
 * Backend Route:
 *
 * DELETE /api/v1/admins/deleteAdmin/:id
 *
 * Example:
 *
 * deleteAdmin("6a8c1e1bd831a01677895860")
 *
 * Final URL:
 *
 * /api/v1/admins/deleteAdmin/6a8c1e1bd831a01677895860
 */

export const deleteAdmin = async (adminId) => {
  try {
    if (!adminId) {
      throw new Error("Admin ID is required.");
    }

    console.log("========================================");
    console.log("DELETE ADMIN API");
    console.log("========================================");

    console.log("Admin ID:", adminId);

    const response = await axiosInstance.delete(
      `/admins/deleteAdmin/${adminId}`,
    );

    console.log("========================================");
    console.log("DELETE ADMIN API RESPONSE");
    console.log("========================================");

    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("========================================");
    console.error("DELETE ADMIN API ERROR");
    console.error("========================================");

    console.error("Full Error:", error);
    console.error("Response:", error?.response);
    console.error("Response Data:", error?.response?.data);
    console.error("Status:", error?.response?.status);
    console.error("Status Text:", error?.response?.statusText);
    console.error("Request URL:", error?.config?.url);
    console.error("Request Method:", error?.config?.method);

    throw error;
  }
};
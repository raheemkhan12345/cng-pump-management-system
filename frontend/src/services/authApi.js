import axiosInstance from "./axiosInstance";

export const superAdminLogin = async (email, password) => {
  const response = await axiosInstance.post("/auth/superadminlogin", {
    email,
    password,
  });

  return response.data;
};

export const adminLogin = async (email, password) => {
  const response = await axiosInstance.post("/auth/adminlogin", {
    email,
    password,
  });

  return response.data;
};

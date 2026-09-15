import axiosInstance from "../axiosInstance";

export const getAdminProfile = async () => {
  const response = await axiosInstance.get("/profile/adminProfile");

  return response.data;
};
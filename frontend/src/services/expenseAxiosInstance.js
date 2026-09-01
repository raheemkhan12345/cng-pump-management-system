import axios from "axios";

const expenseAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_EXPENSE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

expenseAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cng_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default expenseAxiosInstance;

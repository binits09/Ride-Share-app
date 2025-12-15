import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:6200/api",
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// get driver status
export const getDriverStatus = () =>
  API.get("/drivers/status");

// update driver status
export const updateDriverStatus = (isOnline) =>
  API.patch("/drivers/status", { isOnline });

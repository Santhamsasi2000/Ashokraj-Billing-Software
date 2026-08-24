import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getMenuItems = (period) => API.get(`/menu?period=${period}`);
export const addMenuItem = (data) => API.post("/menu", data);
export const updateMenuItem = (id, data) => API.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => API.delete(`/menu/${id}`);

export const createBill = (billData) => API.post("/bills", billData);
export const getDailyReport = (date) => API.get(`/reports/daily?date=${date}`);

export default API;
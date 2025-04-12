import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Нужно для работы с куками (refreshToken)
});

export default API;

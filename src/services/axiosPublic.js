import axios from "axios";
import baseURL from "./getBaseUrl";

const BASE_URL = baseURL();

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

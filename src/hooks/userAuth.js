import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const API_URL = "api/users/";

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(API_URL + "login", userData);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    return error;
  }
};

// Refresh user
const refresh = async (id) => {
  const response = await axios.get(API_URL + id);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  }
};

// Logout User
const logout = () => {
  localStorage.removeItem("user");
};

const userAuth = {
  register,
  logout,
  login,
  refresh,
};

export default userAuth;

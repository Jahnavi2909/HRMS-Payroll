
import Cookies from "js-cookie";
import apiClient from "./apiCient";

export const authApi = {
  login: async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });

    Cookies.set("token", res.data.token);
    Cookies.set("user", JSON.stringify(res.data.user));

    return res.data;
  },

  logout: () => {
    Cookies.remove("token");
    Cookies.remove("user");
    window.location.href = "/login";
  },
};



export const userApi = {
  updateProfile: (data) =>
    apiClient.put(`/api/users/update-profile`, data),

  changePassword: (data) =>
    apiClient.put(`/api/users/change-password`, data),
};

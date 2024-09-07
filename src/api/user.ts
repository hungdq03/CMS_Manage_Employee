import axiosInstance from "../hooks/axiosInstance";

export const getCurrentUserAPI = () => {
  return axiosInstance.get(`/api/users/getCurrentUser`, {
    headers: {

    },
  });
}
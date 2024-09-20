import axiosInstance from "../hooks/axiosInstance";
import { Leader } from "../types/leader";

export const getAllLeaders = () => {
  return axiosInstance.get('/leader');
}

export const createLeader = (data: Leader) => {
  return axiosInstance.post('/leader', data);
}

export const updateLeader = (data: Leader) => {
  return axiosInstance.put(`/leader/${data.id}`, data);
}

export const getLeaderById = (id: number) => {
  return axiosInstance.get(`/leader/${id}`);
}

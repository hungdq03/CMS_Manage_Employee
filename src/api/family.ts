import axiosInstance from "../hooks/axiosInstance";
import { Family } from "../types/family";

export const getFamiliesByEmployeeId = (employeeId: number) => {
  return axiosInstance.get(`/employee-family`, { params: { employeeId } });
};

export const createFamily = (employeeId: number, data: Family[]) => {
  return axiosInstance.post(`/employee-family?employeeId=${employeeId}`, data);
};

export const updateFamily = (data: Family) => {
  return axiosInstance.put(`/employee-family/${data.id}`, data);
};

export const deleteFamily = (id: number) => {
  return axiosInstance.delete(`/employee-family/${id}`);
};

export const getFamilyById = (id: number) => {
  return axiosInstance.get(`/employee-family/${id}`);
};

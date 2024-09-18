import axiosInstance from '../hooks/axiosInstance';
import { Process } from '../types/process';

export const createProcess = (data: Process[], employeeId: number) => {
  return axiosInstance.post(`/process?employeeId=${employeeId}`, data);
};

export const updateProcess = (data: Process) => {
  return axiosInstance.put(`/process/${data.id}`, data);
};

export const getProcessesByEmployeeId = (employeeId: number) => {
  return axiosInstance.get(`/process?employeeId=${employeeId}`);
};

export const getProcessById = (id: number) => {
  return axiosInstance.get(`/process/${id}`);
};

export const deleteProcessById = (id: number) => {
  return axiosInstance.delete(`/process/${id}`);
};

export const getProcessesByCurrentLeader = () => {
  return axiosInstance.get('/process/current-leader');
};

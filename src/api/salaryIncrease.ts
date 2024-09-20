import axiosInstance from '../hooks/axiosInstance';
import { SalaryIncrease } from '../types/salaryIncrease';

export const createSalaryIncrease = (data: SalaryIncrease[], employeeId: number) => {
  return axiosInstance.post(`/salary-increase?employeeId=${employeeId}`, data);
};

export const updateSalaryIncrease = (data: SalaryIncrease) => {
  return axiosInstance.put(`/salary-increase/${data.id}`, data);
};

export const getSalaryIncreasesByEmployeeId = (employeeId: number) => {
  return axiosInstance.get(`/salary-increase?employeeId=${employeeId}`);
};

export const getSalaryIncreaseById = (id: number) => {
  return axiosInstance.get(`/salary-increase/${id}`);
};

export const deleteSalaryIncreaseById = (id: number) => {
  return axiosInstance.delete(`/salary-increase/${id}`);
};

export const getSalaryIncreasesByCurrentLeader = () => {
  return axiosInstance.get('/salary-increase/current-leader');
};

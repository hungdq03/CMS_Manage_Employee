import axiosInstance from "../hooks/axiosInstance";
import { Employee, paramsSearchEmployees } from "../types/employee";

export const getEmployeesSearch = (data: paramsSearchEmployees) => {
  return axiosInstance.get('/employee/search', { params: data })
}

export const createEmployee = (data: Employee) => {
  return axiosInstance.post('/employee', data)
}

export const updateEmployee = (data: Employee) => {
  return axiosInstance.put(`/employee/${data.id}`, data)
}

export const deleteEmployee = (id: number) => {
  return axiosInstance.delete(`/employee/${id}`)
}

export const uploadImage = (data: FormData) => {
  return axiosInstance.post('/employee/upload-image', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

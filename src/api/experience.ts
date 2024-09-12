import axiosInstance from "../hooks/axiosInstance";
import { Experience } from "../types/experience";

// Fetch experiences by employee ID
export const getExperiencesByEmployeeId = (employeeId: number) => {
  return axiosInstance.get('/experience', { params: { employeeId } });
};

// Create new experiences for an employee
export const createExperience = (employeeId: number, experiences: Experience[]) => {
  return axiosInstance.post(`/experience?employeeId=${employeeId}`, experiences);
};

// Update an existing experience by its ID
export const updateExperience = (experienceData: Experience) => {
  return axiosInstance.put(`/experience/${experienceData.id}`, experienceData);
};

// Fetch a single experience by its ID
export const getExperienceById = (experienceId: number) => {
  return axiosInstance.get(`/experience/${experienceId}`);
};

// Delete an experience by its ID
export const deleteExperience = (experienceId: number) => {
  return axiosInstance.delete(`/experience/${experienceId}`);
};

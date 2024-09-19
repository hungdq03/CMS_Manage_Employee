import axiosInstance from '../hooks/axiosInstance';
import { RegisteredDocument } from '../types/registeredDocument';

export const createRegisteredDocument = (data: RegisteredDocument[], employeeId: number) => {
  return axiosInstance.post(`/document-registered?employeeId=${employeeId}`, data);
};

export const updateRegisteredDocument = (data: RegisteredDocument) => {
  return axiosInstance.put(`/document-registered/${data.id}`, data);
};

export const getRegisteredDocumentById = (id: number) => {
  return axiosInstance.get(`/document-registered/${id}`);
};

export const deleteRegisteredDocumentById = (id: number) => {
  return axiosInstance.delete(`/document-registered/${id}`);
};

export const getRegisteredDocumentsByEmployeeId = (employeeId: number) => {
  return axiosInstance.get(`/document-registered`, {
    params: { employeeId },
  });
};

export const getRegisteredDocumentsByCurrentLeader = () => {
  return axiosInstance.get('/document-registered/current-leader');
};

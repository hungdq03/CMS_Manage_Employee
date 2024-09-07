import axiosInstance from "../hooks/axiosInstance";
import { Certificate } from "../types/certificate";

export const createCertificate = (employeeId: number, certificate: Certificate[]) => {
  return axiosInstance.post(`/certificate?employeeId=${employeeId}`, certificate);
}

export const updateCertificate = (certificateData: Certificate) => {
  return axiosInstance.put(`/certificate/${certificateData.id}`, certificateData);
}

export const deleteCertificate = (certificateId: number) => {
  return axiosInstance.delete(`/certificate/${certificateId}`);
}

export const getCertificatesByEmployee = (employeeId: number) => {
  return axiosInstance.get(`/certificate`, {
    params: {
      employeeId,
    },
  });
}

export const getCertificateById = (certificateId: number) => {
  return axiosInstance.get(`/certificate/${certificateId}`);
}

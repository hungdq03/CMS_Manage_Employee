import axiosInstance from '../hooks/axiosInstance';
import { Proposal } from '../types/proposal';

export const createProposal = (data: Proposal[], employeeId: number) => {
  return axiosInstance.post(`/proposal?employeeId=${employeeId}`, data);
};

export const updateProposal = (data: Proposal) => {
  return axiosInstance.put(`/proposal/${data.id}`, data);
};

export const getProposalById = (id: number) => {
  return axiosInstance.get(`/proposal/${id}`);
};

export const deleteProposalById = (id: number) => {
  return axiosInstance.delete(`/proposal/${id}`);
};

export const getProposalsByEmployeeId = (employeeId: number) => {
  return axiosInstance.get(`/proposal?employeeId=${employeeId}`);
};

export const getProposalsByCurrentLeader = () => {
  return axiosInstance.get('/proposal/current-leader');
};

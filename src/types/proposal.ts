export interface Proposal {
  id: number;
  proposalDate: number,
  content?: string,
  note?: string,
  type: number,
  detailedDescription?: string,
  proposalStatus: number,
  acceptanceDate: number,
  additionalRequest: string,
  reasonForRefusal: string,
  rejectionDate: number,
  leaderId: number,
  employeeId: number
}
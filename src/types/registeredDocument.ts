export interface RegisteredDocument {
  id: number,
  registerDate: number,
  typesOfRecords: string,
  content?: string,
  note?: string,
  documentStatus: number,
  acceptanceDate?: number,
  additionalRequest?: number,
  reasonForRefusal?: string,
  rejectionDate: number,
  leaderId: number,
  employeeId: number
}
export interface SalaryIncrease {
  id?: number;
  startDate: number;
  times: number;
  reason?: string;
  note?: string;
  oldSalary: number;
  newSalary: number;
  salaryIncreaseStatus?: number;
  acceptanceDate?: string;
  additionalRequest?: string;
  reasonForRefusal?: string;
  rejectionDate?: string;
  leaderId?: number;
  currentPosition?: number
  employeeId: number;
}
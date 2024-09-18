export interface Process {
  id: number;
  promotionDay?: number;
  times?: number;
  currentPosition?: number;
  newPosition?: number;
  note?: string;
  processStatus?: number;
  acceptanceDate?: number;
  additionalRequest?: string;
  reasonForRefusal?: string;
  rejectionDate?: number;
  employeeId: number;
  leaderId: number;
}

export const ACTION_PROCESS = {
  VIEW: "2,3,4,5",
  EDIT: "1,4,5",
  DELETE: "1",
  NOTIFY: "4,5",
  MANAGE: "2,3",
  SAVE: "1",
};

export const STATUS_PROCESS: Record<number, string> = {
  0: "Lưu mới",
  1: "Chờ duyệt",
  2: "Đã duyệt",
  3: "Yêu cầu bổ sung",
  4: "Từ chối",
}
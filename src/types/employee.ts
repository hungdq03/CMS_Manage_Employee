import { Certificate } from "./certificate";
import { Family } from "./family";

export type Employee = {
  id: number;
  name: string;
  code: string;
  gender: number;
  dateOfBirth: number;
  address: string;
  team: number;
  email: string;
  image?: string | null;
  phone: string;
  citizenIdentificationNumber: string;
  dateOfIssuanceCard: number;
  placeOfIssueCard: string;
  submitDay?: number | null;
  leaderName?: string | null;
  leaderPosition?: number | null;
  submitContent?: string | null;
  knowledge?: string | null;
  activity?: string | null;
  skill?: string | null;
  submitProfileStatus: number;
  currentPosition?: number | null;
  employeeFamilyDtos?: Family[] | null;
  certificatesDto?: Certificate[] | null;
  ethnic?: string | null;
  religion?: string | null;
  appointmentDate?: number | null;
  additionalRequest?: string | null;
  rejectionDate?: number | null;
  reasonForRejection?: string | null;
  additionalRequestTermination?: string | null;
  terminationAppointmentDate?: number | null;
  refuseEndProfileDay?: number | null;
  reasonForRefuseEndProfile?: string | null;
  endDay?: number | null;
  reasonForEnding?: string | null;
  numberSaved?: string | null;
  decisionDay?: number | null;
  leaderId?: number | null;
};


export type paramsSearchEmployees = {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
  listStatus: string
}

export const TEAM_CATEGORY: Record<number, string> = {
  0: "BA",
  1: "Frontend",
  2: "Backend",
  3: "Mobile",
  4: "Tester",
};

export const GENDER: Record<number, string> = {
  0: "Khác",
  1: "Nam",
  2: "Nữ",
};

export const STATUS_EMPLOYEE = {
  ADD: "1,2,4,5",
  MANAGE: "3,6,8,9",
  END: "0,7",
  PENDING: "2,6",
  APPROVED: "0,3,7",
};

export const RELATIONSHIP: Record<number, string> = {
  0: "Ông",
  1: "Bà",
  2: "Bố",
  3: "Mẹ",
  4: "Vợ/chồng",
  5: "Anh trai",
  6: "Em trai",
  7: "Chị gái",
  8: "Em gái",
  9: "Khác",
};

export const POSITIONS: Record<number, string> = {
  1: "Giám đốc",
  2: "Phó giám đốc",
  3: "Trưởng phòng",
  4: "Phó phòng",
  5: "Trưởng nhóm Fontend",
  6: "Trưởng nhóm Backend",
  7: "Trưởng nhóm BA",
  8: "Trưởng nhóm Tester",
  9: "Nhân viên",
};

export const PROPOSAL: Record<number, string> = {
  1: "Đào tạo",
  2: "Quy trình",
  3: "Thời gian",
  4: "Kế hoạch",
};

export const LEADER_POSITION: Record<number, string> = {
  0: "Trưởng nhóm BA",
  1: "Trưởng nhóm Tester",
  2: "Trưởng nhóm Front-End",
  3: "Trưởng nhóm Back-End",
  4: "Trưởng nhóm PHP",
  5: "Trưởng nhóm Android",
};

export const PROPOSAL_TYPE: Record<number, string> = {
  1: "Đề xuất tăng lương",
  2: "Đề xuất giảm giờ làm",
  3: "Đề xuất chế độ nghỉ",
  4: "Đề xuất tăng giờ làm",
};

export const STATUS_PROFILE: Record<string, string> = {
  0: "Nộp lưu",
  1: "Lưu mới",
  2: "Chờ xử lý",
  3: "Đã duyệt",
  4: "Yêu cầu bổ sung",
  5: "Từ chối",
  6: "Chờ duyệt kết thúc",
  7: "Đã duyệt kết thúc",
  8: "Yêu cầu bổ sung kết thúc",
  9: "Từ chối kết thúc",
};

export const ACTION_EMPLOYEE = {
  VIEW: "2, 3,6,8,9",
  EDIT: "1,4,5,3,8,9",
  DELETE: "1",
  NOTIFY: "4,5, 8,9",
  END: "7",
  PENDING_END: "6",
  PENDING: "2",
};

export const TAB_EMPLOYEE = 0;
export const TAB_CERTIFICATE = 1;
export const TAB_FAMILY = 2;

export const TAB_PROFILE_CV = 0;
export const TAB_PROFILE_INFORMATION = 1;
export const TAB_PROFILE_CERTIFICATE = 2;

export const TAB_SARALY = 0;
export const TAB_PROMOTED = 1;
export const TAB_PROPOSAL = 2;

export const TAB_PENDING_REGISTER = 0;
export const TAB_PENDING_PROMOTED = 1;
export const TAB_PENDING_SARALY = 2;
export const TAB_PENDING_PROPOSAL = 3;




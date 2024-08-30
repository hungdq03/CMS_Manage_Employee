/* eslint-disable @typescript-eslint/no-explicit-any */
// Define type for nested Person object
export interface Person {
  createDate: [number, number, number, number, number, number, number];
  createdBy: string;
  modifyDate: [number, number, number, number, number, number, number];
  modifiedBy: string | null;
  id: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  shortName: string | null;
  birthDate: string | null;
  birthPlace: string | null;
  gender: 'M' | 'F' | null;
  startDate: string | null;
  endDate: string | null;
  phoneNumber: string | null;
  idNumber: string | null;
  idNumberIssueBy: string | null;
  idNumberIssueDate: string | null;
  email: string | null;
  nationality: string | null;
  nativeVillage: string | null;
  ethnics: string | null;
  religion: string | null;
  photo: string | null;
  photoCropped: string | null;
  imagePath: string | null;
  addresses: any[];
  userId: number;
  communistYouthUnionJoinDate: string | null;
  communistPartyJoinDate: string | null;
  carrer: string | null;
  maritalStatus: string | null;
  address: any[];
}

// Define type for Role object
export interface Role {
  id: number;
  name: string;
  description: string | null;
  authority: string;
}

// Define type for User object
export interface User {
  createDate: [number, number, number, number, number, number, number];
  createdBy: string;
  modifyDate: [number, number, number, number, number, number, number];
  modifiedBy: string | null;
  id: number;
  displayName: string;
  username: string;
  password: string | null;
  oldPassword: string | null;
  confirmPassword: string | null;
  changePass: boolean;
  active: boolean;
  lastName: string | null;
  firstName: string | null;
  dob: string | null;
  birthPlace: string | null;
  email: string;
  person: Person;
  hasPhoto: boolean;
  roles: Role[];
  groups: any[];
  org: any | null;
  imagePath: string | null;
  setPassword: boolean;
}

import constantList from './appConfig';

export const paths = {
  home: constantList.ROOT_PATH,
  auth: {
    signIn: `${constantList.ROOT_PATH}sign-in`,
    signOut: `${constantList.ROOT_PATH}sign-out`,
  },
  dashboard: {
    home: constantList.ROOT_PATH,
    employees: {
      add: `${constantList.ROOT_PATH}employees/add`,
      manage: `${constantList.ROOT_PATH}employees/manageEmployees`,
      fired: `${constantList.ROOT_PATH}employees/fired`,
    },
    leader: {
      pendingApproval: `${constantList.ROOT_PATH}leader/pendingApproval`,
      approved: `${constantList.ROOT_PATH}leader/approved`,
    },
  },
} as const;

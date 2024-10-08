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
      manage: `${constantList.ROOT_PATH}employees/manage`,
      end: `${constantList.ROOT_PATH}employees/end`,
    },
    leader: {
      pendingApproval: `${constantList.ROOT_PATH}leader/pending-approval`,
      approved: `${constantList.ROOT_PATH}leader/approved`,
    },
  },
  errors: { forbidden: '/errors/forbidden' },
} as const;

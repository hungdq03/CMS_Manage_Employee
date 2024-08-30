export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    home: '/',
    employees: {
      add: '',
      manage: '/employees/manageEmployees',
      fired: ''
    },
    leader: {
      pendingApproval: '',
      approved: ''
    }

  },
} as const;

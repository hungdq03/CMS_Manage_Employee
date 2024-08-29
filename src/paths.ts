export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    home: '/home',
    manager: {
      add: '',
      manage: '',
      fired: ''
    },
    leader: {
      pendingApproval: '',
      approved: ''
    }
    
  },
  errors: { notFound: '/errors/not-found' },
} as const;

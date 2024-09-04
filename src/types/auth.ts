export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  expiresIn: number | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
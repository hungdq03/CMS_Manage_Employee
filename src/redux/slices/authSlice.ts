/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signInAPI } from '../../api/auth';
import { RootState } from '../store';
import { AuthState } from '../../types/auth';
import { fetchCurrentUser } from './userSlice';
import Cookies from 'js-cookie';

// Define interfaces for API responses and state
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  organization: string;
}

// Initial state for auth
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  expiresIn: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Thunk for signIn
export const signIn = createAsyncThunk<AuthResponse, { username: string; password: string }>(
  'auth/sign-in',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await signInAPI(credentials.username, credentials.password);

      // Save tokens in cookie
      Cookies.set('token', response.data.access_token,
        {
          expires: response.data.expires_in / 86400,
          secure: true,
          sameSite: 'Strict'
        });

      // Fetch user info
      dispatch(fetchCurrentUser());

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

// Create auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenType = null;
      state.expiresIn = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      Cookies.remove('token');
      // localStorage.removeItem('token_expire_time');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.tokenType = action.payload.token_type;
        state.expiresIn = action.payload.expires_in;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload?.error_description || 'Sign in failed'; // Handle error message
      })
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;



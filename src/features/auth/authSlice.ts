import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../hooks/store'

interface AuthState {
  authenticated: boolean;
  token?: string;
}

const initialState: AuthState = {
  authenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn(state, action: PayloadAction<{ token: string }>) {
      state.authenticated = true;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    userLoggedOut(state) {
      state.authenticated = false;
      state.token = undefined;
      localStorage.removeItem('token');
    },
  },
})

export const { userLoggedIn, userLoggedOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUserToken = (state: RootState) => state.auth.token
export const selectCurrentUserAuthenticated = (state: RootState) => state.auth.authenticated

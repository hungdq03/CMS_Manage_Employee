import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCurrentUserAPI } from '../../api/user';
import { User } from '../../types/user';
import { RootState } from '../store';

// Define a type for the slice state
interface UserState {
  user: User | null;
  userStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  userError: string | null;
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  userStatus: 'idle',
  userError: null,
};

// Create an async thunk for fetching the current user
export const fetchCurrentUser = createAsyncThunk<User, void>(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserAPI();
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.userStatus = 'loading';
        state.userError = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.userStatus = 'succeeded';
        state.userError = null;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.userStatus = 'failed';
        state.userError = action.payload as string || 'Failed to fetch user';
      });
  },
});

// Export the reducer
export default userSlice.reducer;

// Selector to get user state
export const selectCurrentUser = (state: RootState) => state.user;

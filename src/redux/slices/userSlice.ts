import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCurrentUserAPI } from '../../api/user';
import { RootState } from '../store';
import { User } from '../../types/user';

// Define a type for the slice state
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Create an async thunk for fetching the current user
export const fetchCurrentUser = createAsyncThunk<User, void>(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserAPI()
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(fetchCurrentUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user';
      });
  },
});

// Export the reducer
export default userSlice.reducer;
export const selectCurrentUser = (state: RootState) => state.user
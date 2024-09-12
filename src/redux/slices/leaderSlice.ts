// src/slices/leaderSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Leader } from '../../types/leader';
import { getAllLeaders, createLeader, updateLeader, getLeaderById } from '../../api/leader';
import { RootState } from '../store';

interface LeaderState {
  leaders: {
    code: number;
    data: Leader[];
    message: string;
    totalElements: number;
  };
  leader: {
    code: number;
    message: string;
    data: Leader | null;
  };
  leaderStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  leaderError: string | null;
}

// Define initial state
const initialState: LeaderState = {
  leaders: {
    code: 0,
    data: [],
    message: '',
    totalElements: 0,
  },
  leader: {
    code: 0,
    message: '',
    data: null,
  },
  leaderStatus: 'idle',
  leaderError: null,
};

// Define async thunks
export const getAllLeadersThunk = createAsyncThunk(
  'leaders/getAllLeadersThunk',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllLeaders();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch leaders');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const getLeaderByIdThunk = createAsyncThunk(
  'leaders/getLeaderByIdThunk',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getLeaderById(id);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch leader');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const craeteLeaderThunk = createAsyncThunk(
  'leaders/craeteLeaderThunk',
  async (leader: Leader, { rejectWithValue }) => {
    try {
      const response = await createLeader(leader);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to add leader');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const updateLeaderThunk = createAsyncThunk(
  'leaders/updateLeaderThunk',
  async (leader: Leader, { rejectWithValue }) => {
    try {
      const response = await updateLeader(leader);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to update leader');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Create the slice
const leaderSlice = createSlice({
  name: 'leaders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllLeadersThunk.pending, (state) => {
        state.leaderStatus = 'loading';
      })
      .addCase(getAllLeadersThunk.fulfilled, (state, action: PayloadAction<{ code: number, data: Leader[], message: string, totalElements: number }>) => {
        state.leaderStatus = 'succeeded';
        state.leaders = action.payload;
      })
      .addCase(getAllLeadersThunk.rejected, (state, action) => {
        state.leaderStatus = 'failed';
        state.leaderError = action.payload as string;
      })
      .addCase(getLeaderByIdThunk.pending, (state) => {
        state.leaderStatus = 'loading';
      })
      .addCase(getLeaderByIdThunk.fulfilled, (state, action: PayloadAction<{ code: number, message: string, data: Leader | null }>) => {
        state.leaderStatus = 'succeeded';
        state.leader = action.payload;
      })
      .addCase(getLeaderByIdThunk.rejected, (state, action) => {
        state.leaderStatus = 'failed';
        state.leaderError = action.payload as string;
      })
      .addCase(craeteLeaderThunk.pending, (state) => {
        state.leaderStatus = 'loading';
      })
      .addCase(craeteLeaderThunk.fulfilled, (state, action: PayloadAction<{ code: number, message: string, data: Leader }>) => {
        state.leaderStatus = 'succeeded';
        if (action.payload.code === 200) {
          state.leaders.data.push(action.payload.data);
        }
      })
      .addCase(craeteLeaderThunk.rejected, (state, action) => {
        state.leaderStatus = 'failed';
        state.leaderError = action.payload as string;
      })
      .addCase(updateLeaderThunk.pending, (state) => {
        state.leaderStatus = 'loading';
      })
      .addCase(updateLeaderThunk.fulfilled, (state, action: PayloadAction<{ code: number, message: string, data: Leader }>) => {
        state.leaderStatus = 'succeeded';
        if (action.payload.code === 200) {
          const index = state.leaders.data.findIndex(leader => leader.id === action.payload.data.id);
          if (index !== -1) {
            state.leaders.data[index] = action.payload.data;
          }
        }
      })
      .addCase(updateLeaderThunk.rejected, (state, action) => {
        state.leaderStatus = 'failed';
        state.leaderError = action.payload as string;
      })
  },
});

// Export the reducer
export default leaderSlice.reducer;
export const selectLeadersState = (state: RootState) => state.leaders;



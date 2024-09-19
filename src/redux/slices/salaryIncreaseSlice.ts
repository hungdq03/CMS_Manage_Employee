import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createSalaryIncrease,
  updateSalaryIncrease,
  getSalaryIncreasesByEmployeeId,
  getSalaryIncreaseById,
  deleteSalaryIncreaseById,
  getSalaryIncreasesByCurrentLeader
} from '../../api/salaryIncrease';
import { SalaryIncrease } from '../../types/salaryIncrease';
import axios from 'axios';
import { RootState } from '../store';

// Async Thunks for handling API requests
export const createSalaryThunk = createAsyncThunk(
  'salaryIncrease/createSalary',
  async ({ data, employeeId }: { data: SalaryIncrease[]; employeeId: number }, { rejectWithValue }) => {
    try {
      const response = await createSalaryIncrease(data, employeeId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const updateSalaryThunk = createAsyncThunk(
  'salaryIncrease/updateSalary',
  async (data: SalaryIncrease, { rejectWithValue }) => {
    try {
      const response = await updateSalaryIncrease(data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const getSalaryIncreasesByEmployeeIdThunk = createAsyncThunk(
  'salaryIncrease/getByEmployeeId',
  async (employeeId: number, { rejectWithValue }) => {
    try {
      const response = await getSalaryIncreasesByEmployeeId(employeeId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const getSalaryIncreaseByIdThunk = createAsyncThunk(
  'salaryIncrease/getById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getSalaryIncreaseById(id);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const deleteSalaryIncreaseThunk = createAsyncThunk(
  'salaryIncrease/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteSalaryIncreaseById(id);
      return {
        ...response.data,
        id
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const fetchSalaryIncreasesByLeaderThunk = createAsyncThunk(
  'salaryIncrease/fetchByCurrentLeader',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSalaryIncreasesByCurrentLeader();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Initial State
interface SalaryIncreaseState {
  salaryIncreases: {
    code: number;
    message: string;
    data: SalaryIncrease[]
  };
  selectedSalaryIncrease?: {
    code: number;
    message: string;
    data: SalaryIncrease
  };
  salaryStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  salaryError: string | null;
}

const initialState: SalaryIncreaseState = {
  salaryIncreases: {
    code: 0,
    message: '',
    data: []
  },
  selectedSalaryIncrease: undefined,
  salaryStatus: 'idle',
  salaryError: null
};

// Slice
const salaryIncreaseSlice = createSlice({
  name: 'salaryIncrease',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Salary Increase
      .addCase(createSalaryThunk.pending, (state) => {
        state.salaryStatus = 'loading';
      })
      .addCase(createSalaryThunk.fulfilled, (state, action) => {
        state.salaryStatus = 'succeeded';
        action.payload.data.map((salary: SalaryIncrease) => state.salaryIncreases.data.unshift(salary));
      })
      .addCase(createSalaryThunk.rejected, (state, action) => {
        state.salaryStatus = 'failed';
        state.salaryError = action.payload as string;
      })

      // Update Salary Increase
      .addCase(updateSalaryThunk.pending, (state) => {
        state.salaryStatus = 'loading';
      })
      .addCase(updateSalaryThunk.fulfilled, (state, action) => {
        state.salaryStatus = 'succeeded';
        const index = state.salaryIncreases.data.findIndex((s) => s.id === action.payload.data.id);
        if (index !== -1) {
          state.salaryIncreases.data[index] = action.payload.data;
        }
      })
      .addCase(updateSalaryThunk.rejected, (state, action) => {
        state.salaryStatus = 'failed';
        state.salaryError = action.payload as string;
      })
      // Fetch Salary Increases by EmployeeId
      .addCase(getSalaryIncreasesByEmployeeIdThunk.pending, (state) => {
        state.salaryStatus = 'loading';
      })
      .addCase(getSalaryIncreasesByEmployeeIdThunk.fulfilled, (state, action) => {
        state.salaryStatus = 'succeeded';
        state.salaryIncreases = action.payload;
      })
      .addCase(getSalaryIncreasesByEmployeeIdThunk.rejected, (state, action) => {
        state.salaryStatus = 'failed';
        state.salaryError = action.payload as string;
      })
      // Fetch Salary Increase by Id
      .addCase(getSalaryIncreaseByIdThunk.pending, (state) => {
        state.salaryStatus = 'loading';
      })
      .addCase(getSalaryIncreaseByIdThunk.fulfilled, (state, action) => {
        state.salaryStatus = 'succeeded';
        state.selectedSalaryIncrease = action.payload;
      })
      .addCase(getSalaryIncreaseByIdThunk.rejected, (state, action) => {
        state.salaryStatus = 'failed';
        state.salaryError = action.payload as string;
      })
      // Delete Salary Increase
      .addCase(deleteSalaryIncreaseThunk.pending, (state) => {
        state.salaryStatus = 'loading';
      })
      .addCase(deleteSalaryIncreaseThunk.fulfilled, (state, action) => {
        state.salaryStatus = 'succeeded';
        state.salaryIncreases.data = state.salaryIncreases.data.filter((s) => s.id !== action.payload.id);
      })
      .addCase(deleteSalaryIncreaseThunk.rejected, (state, action) => {
        state.salaryStatus = 'failed';
        state.salaryError = action.payload as string;
      })
      // Fetch Salary Increases by Current Leader
      .addCase(fetchSalaryIncreasesByLeaderThunk.pending, (state) => {
        state.salaryStatus = 'loading';
      })
      .addCase(fetchSalaryIncreasesByLeaderThunk.fulfilled, (state, action) => {
        state.salaryStatus = 'succeeded';
        state.salaryIncreases = action.payload;
      })
      .addCase(fetchSalaryIncreasesByLeaderThunk.rejected, (state, action) => {
        state.salaryStatus = 'failed';
        state.salaryError = action.payload as string;
      });
  }
});

// Export reducer
export default salaryIncreaseSlice.reducer;
export const selectSalaryIncreasesState = (state: RootState) => state.salaryIncreases;
export const selectSalaryIncreaseById = (state: RootState, salaryIncreaseId: number) =>
  state.salaryIncreases.salaryIncreases.data?.find((salaryIncrease) => salaryIncrease.id === salaryIncreaseId);
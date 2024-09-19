import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createProcess,
  updateProcess,
  getProcessesByEmployeeId,
  getProcessById,
  deleteProcessById,
  getProcessesByCurrentLeader,
} from '../../api/process'; // Import các API tương ứng
import { Process } from '../../types/process';
import axios from 'axios';
import { RootState } from '../store';

// Define initial state
interface ProcessState {
  processes: {
    code: number;
    message: string;
    data: Process[]
  };
  process?: {
    code: number;
    message: string;
    data: Process
  };
  processStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  processError: string | null;
}

const initialState: ProcessState = {
  processes: {
    code: 0,
    message: '',
    data: []
  },
  process: {
    code: 0,
    message: '',
    data: {} as Process
  },
  processStatus: 'idle',
  processError: null,
};

// Async thunks
export const getProcessesByEmployeeIdThunk = createAsyncThunk(
  'process/getByEmployeeId',
  async (employeeId: number, { rejectWithValue }) => {
    try {
      const response = await getProcessesByEmployeeId(employeeId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const getProcessByIdThunk = createAsyncThunk(
  'process/getById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getProcessById(id);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const createProcessThunk = createAsyncThunk(
  'process/create',
  async ({ data, employeeId }: { data: Process[]; employeeId: number }, { rejectWithValue }) => {
    try {
      const response = await createProcess(data, employeeId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const updateProcessThunk = createAsyncThunk(
  'process/update',
  async (data: Process, { rejectWithValue }) => {
    try {
      const response = await updateProcess(data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const deleteProcessThunk = createAsyncThunk(
  'process/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteProcessById(id);
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

export const getProcessesByCurrentLeaderThunk = createAsyncThunk(
  'process/fetchByCurrentLeader',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProcessesByCurrentLeader();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Create slice
const processSlice = createSlice({
  name: 'process',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch processes by employeeId
    builder.addCase(getProcessesByEmployeeIdThunk.pending, (state) => {
      state.processStatus = 'loading';
      state.processError = null;
    });
    builder.addCase(getProcessesByEmployeeIdThunk.fulfilled, (state, action) => {
      state.processStatus = 'succeeded';
      state.processes = action.payload;
    });
    builder.addCase(getProcessesByEmployeeIdThunk.rejected, (state, action) => {
      state.processStatus = 'failed';
      state.processError = action.payload as string;
    });

    // Fetch process by id
    builder.addCase(getProcessByIdThunk.pending, (state) => {
      state.processStatus = 'loading';
      state.processError = null;
    });
    builder.addCase(getProcessByIdThunk.fulfilled, (state, action) => {
      state.processStatus = 'succeeded';
      state.process = action.payload;
    });
    builder.addCase(getProcessByIdThunk.rejected, (state, action) => {
      state.processStatus = 'failed';
      state.processError = action.payload as string;
    });

    // Create process
    builder.addCase(createProcessThunk.pending, (state) => {
      state.processStatus = 'loading';
      state.processError = null;
    });
    builder.addCase(createProcessThunk.fulfilled, (state, action) => {
      state.processStatus = 'succeeded';
      action.payload.data.map((process: Process) => state.processes.data.unshift(process));
    });
    builder.addCase(createProcessThunk.rejected, (state, action) => {
      state.processStatus = 'failed';
      state.processError = action.payload as string;
    });

    // Update process
    builder.addCase(updateProcessThunk.pending, (state) => {
      state.processStatus = 'loading';
      state.processError = null;
    });
    builder.addCase(updateProcessThunk.fulfilled, (state, action) => {
      state.processStatus = 'succeeded';
      const index = state.processes.data.findIndex((process) => process.id === action.payload.data.id);
      if (index !== -1) {
        state.processes.data[index] = action.payload.data;
      }
    });
    builder.addCase(updateProcessThunk.rejected, (state, action) => {
      state.processStatus = 'failed';
      state.processError = action.payload as string;
    });

    // Delete process
    builder.addCase(deleteProcessThunk.pending, (state) => {
      state.processStatus = 'loading';
      state.processError = null;
    });
    builder.addCase(deleteProcessThunk.fulfilled, (state, action) => {
      state.processStatus = 'succeeded';
      state.processes.data = state.processes.data.filter((process) => process.id !== action.payload.id);
    });
    builder.addCase(deleteProcessThunk.rejected, (state, action) => {
      state.processStatus = 'failed';
      state.processError = action.payload as string;
    });

    // Fetch processes by current leader
    builder.addCase(getProcessesByCurrentLeaderThunk.pending, (state) => {
      state.processStatus = 'loading';
      state.processError = null;
    });
    builder.addCase(getProcessesByCurrentLeaderThunk.fulfilled, (state, action) => {
      state.processStatus = 'succeeded';
      state.processes = action.payload;
    });
    builder.addCase(getProcessesByCurrentLeaderThunk.rejected, (state, action) => {
      state.processStatus = 'failed';
      state.processError = action.payload as string;
    });
  },
});

// Export
export default processSlice.reducer;
export const selectProcessesState = (state: RootState) => state.processes;
export const selectProcessById = (state: RootState, processId: number) =>
  state.processes.processes.data.find((process) => process.id === processId);
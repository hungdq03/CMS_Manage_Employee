import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createProposal,
  updateProposal,
  getProposalById,
  deleteProposalById,
  getProposalsByEmployeeId,
  getProposalsByCurrentLeader
} from '../../api/proposal'; // Import các API tương ứng
import { Proposal } from '../../types/proposal'; // Đảm bảo bạn đã định nghĩa loại Proposal trong types/proposal.ts
import axios from 'axios';
import { RootState } from '../store';

// Define initial state
interface ProposalState {
  proposals: {
    code: number;
    message: string;
    data: Proposal[];
  };
  proposal?: {
    code: number;
    message: string;
    data: Proposal;
  };
  proposalStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  proposalError: string | null;
}

const initialState: ProposalState = {
  proposals: {
    code: 0,
    message: '',
    data: []
  },
  proposal: undefined,
  proposalStatus: 'idle',
  proposalError: null,
};

// Async thunks
export const getProposalsByEmployeeIdThunk = createAsyncThunk(
  'proposal/getByEmployeeId',
  async (employeeId: number, { rejectWithValue }) => {
    try {
      const response = await getProposalsByEmployeeId(employeeId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const getProposalByIdThunk = createAsyncThunk(
  'proposal/getById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getProposalById(id);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const createNewProposalThunk = createAsyncThunk(
  'proposal/create',
  async ({ data, employeeId }: { data: Proposal[]; employeeId: number }, { rejectWithValue }) => {
    try {
      const response = await createProposal(data, employeeId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const updateProposalThunk = createAsyncThunk(
  'proposal/update',
  async (data: Proposal, { rejectWithValue }) => {
    try {
      const response = await updateProposal(data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const deleteProposalThunk = createAsyncThunk(
  'proposal/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteProposalById(id);
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

export const getProposalsByCurrentLeaderThunk = createAsyncThunk(
  'proposal/getByCurrentLeader',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProposalsByCurrentLeader();
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
const proposalSlice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch proposals by employeeId
    builder.addCase(getProposalsByEmployeeIdThunk.pending, (state) => {
      state.proposalStatus = 'loading';
      state.proposalError = null;
    });
    builder.addCase(getProposalsByEmployeeIdThunk.fulfilled, (state, action) => {
      state.proposalStatus = 'succeeded';
      state.proposals = action.payload;
    });
    builder.addCase(getProposalsByEmployeeIdThunk.rejected, (state, action) => {
      state.proposalStatus = 'failed';
      state.proposalError = action.payload as string;
    });

    // Fetch proposal by id
    builder.addCase(getProposalByIdThunk.pending, (state) => {
      state.proposalStatus = 'loading';
      state.proposalError = null;
    });
    builder.addCase(getProposalByIdThunk.fulfilled, (state, action) => {
      state.proposalStatus = 'succeeded';
      state.proposal = action.payload;
    });
    builder.addCase(getProposalByIdThunk.rejected, (state, action) => {
      state.proposalStatus = 'failed';
      state.proposalError = action.payload as string;
    });

    // Create proposal
    builder.addCase(createNewProposalThunk.pending, (state) => {
      state.proposalStatus = 'loading';
      state.proposalError = null;
    });
    builder.addCase(createNewProposalThunk.fulfilled, (state, action) => {
      state.proposalStatus = 'succeeded';
      state.proposals.data.push(action.payload);
    });
    builder.addCase(createNewProposalThunk.rejected, (state, action) => {
      state.proposalStatus = 'failed';
      state.proposalError = action.payload as string;
    });

    // Update proposal
    builder.addCase(updateProposalThunk.pending, (state) => {
      state.proposalStatus = 'loading';
      state.proposalError = null;
    });
    builder.addCase(updateProposalThunk.fulfilled, (state, action) => {
      state.proposalStatus = 'succeeded';
      const index = state.proposals.data.findIndex((proposal) => proposal.id === action.payload.data.id);
      if (index !== -1) {
        state.proposals.data[index] = action.payload;
      }
    });
    builder.addCase(updateProposalThunk.rejected, (state, action) => {
      state.proposalStatus = 'failed';
      state.proposalError = action.payload as string;
    });

    // Delete proposal
    builder.addCase(deleteProposalThunk.pending, (state) => {
      state.proposalStatus = 'loading';
      state.proposalError = null;
    });
    builder.addCase(deleteProposalThunk.fulfilled, (state, action) => {
      state.proposalStatus = 'succeeded';
      state.proposals.data = state.proposals.data.filter((proposal) => proposal.id !== action.payload.id);
    });
    builder.addCase(deleteProposalThunk.rejected, (state, action) => {
      state.proposalStatus = 'failed';
      state.proposalError = action.payload as string;
    });

    // Fetch proposals by current leader
    builder.addCase(getProposalsByCurrentLeaderThunk.pending, (state) => {
      state.proposalStatus = 'loading';
      state.proposalError = null;
    });
    builder.addCase(getProposalsByCurrentLeaderThunk.fulfilled, (state, action) => {
      state.proposalStatus = 'succeeded';
      state.proposals = action.payload;
    });
    builder.addCase(getProposalsByCurrentLeaderThunk.rejected, (state, action) => {
      state.proposalStatus = 'failed';
      state.proposalError = action.payload as string;
    });
  },
});

// Export the reducer
export default proposalSlice.reducer;
export const selectProposalsState = (state: RootState) => state.proposals;
export const selectProposalById = (state: RootState, proposalId: number) =>
  state.proposals.proposals.data.find((proposal) => proposal.id === proposalId);
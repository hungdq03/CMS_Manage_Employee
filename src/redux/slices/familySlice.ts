import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Family } from '../../types/family';
import {
  createFamily,
  updateFamily,
  deleteFamily,
  getFamiliesByEmployeeId,
  getFamilyById,
} from '../../api/family';
import axios from 'axios';
import { RootState } from '../store';

export const createFamilyThunk = createAsyncThunk(
  'family/create',
  async ({ employeeId, families }: { employeeId: number; families: Family[] }, ThunkAPI) => {
    try {
      const response = await createFamily(employeeId, families);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to create family');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const updateFamilyThunk = createAsyncThunk(
  'family/update',
  async (familyData: Family, ThunkAPI) => {
    try {
      const response = await updateFamily(familyData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to update family');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const deleteFamilyThunk = createAsyncThunk(
  'family/delete',
  async (familyId: number, ThunkAPI) => {
    try {
      const response = await deleteFamily(familyId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to delete family');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const getFamiliesByEmployeeThunk = createAsyncThunk(
  'family/getByEmployee',
  async (employeeId: number, ThunkAPI) => {
    try {
      const response = await getFamiliesByEmployeeId(employeeId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch families');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const getFamilyByIdThunk = createAsyncThunk(
  'family/getById',
  async (familyId: number, ThunkAPI) => {
    try {
      const response = await getFamilyById(familyId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch family');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

interface FamilyState {
  families: {
    code: number,
    data: Family[],
    message: string,
  };
  familyStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  familyError: string | null;
}

const initialState: FamilyState = {
  families: {
    code: 0,
    data: [],
    message: '',
  },
  familyStatus: 'idle',
  familyError: null,
};

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // createFamilyThunk
    builder.addCase(createFamilyThunk.pending, (state) => {
      state.familyStatus = 'loading';
      state.familyError = null;
    });
    builder.addCase(createFamilyThunk.fulfilled, (state, action) => {
      state.families.data.unshift(action.payload.data[0]);
      state.familyStatus = 'succeeded';
    });
    builder.addCase(createFamilyThunk.rejected, (state, action) => {
      state.familyStatus = 'failed';
      state.familyError = action.payload as string;
    });

    // updateFamilyThunk
    builder.addCase(updateFamilyThunk.pending, (state) => {
      state.familyStatus = 'loading';
      state.familyError = null;
    });
    builder.addCase(updateFamilyThunk.fulfilled, (state, action) => {
      const index = state.families.data.findIndex((family) => family.id === action.payload.data.id);
      if (index !== -1) {
        state.families.data[index] = action.payload.data;
      }
      state.familyStatus = 'succeeded';
    });
    builder.addCase(updateFamilyThunk.rejected, (state, action) => {
      state.familyStatus = 'failed';
      state.familyError = action.payload as string;
    });

    // deleteFamilyThunk
    builder.addCase(deleteFamilyThunk.pending, (state) => {
      state.familyStatus = 'loading';
      state.familyError = null;
    });
    builder.addCase(deleteFamilyThunk.fulfilled, (state, action) => {
      state.families.data = state.families.data.filter((family) => family.id !== action.payload);
      state.familyStatus = 'succeeded';
    });
    builder.addCase(deleteFamilyThunk.rejected, (state, action) => {
      state.familyStatus = 'failed';
      state.familyError = action.payload as string;
    });

    // getFamiliesByEmployeeThunk
    builder.addCase(getFamiliesByEmployeeThunk.pending, (state) => {
      state.familyStatus = 'loading';
      state.familyError = null;
    });
    builder.addCase(getFamiliesByEmployeeThunk.fulfilled, (state, action) => {
      state.families = action.payload;
      state.familyStatus = 'succeeded';
    });
    builder.addCase(getFamiliesByEmployeeThunk.rejected, (state, action) => {
      state.familyStatus = 'failed';
      state.familyError = action.payload as string;
    });

    // getFamilyByIdThunk
    builder.addCase(getFamilyByIdThunk.pending, (state) => {
      state.familyStatus = 'loading';
      state.familyError = null;
    });
    builder.addCase(getFamilyByIdThunk.fulfilled, (state, action) => {
      const index = state.families.data.findIndex((family) => family.id === action.payload.data.id);
      if (index === -1) {
        state.families.data.push(action.payload);
      }
      state.familyStatus = 'succeeded';
    });
    builder.addCase(getFamilyByIdThunk.rejected, (state, action) => {
      state.familyStatus = 'failed';
      state.familyError = action.payload as string;
    });
  },
});

export default familySlice.reducer;
export const selectFamilyState = (state: RootState) => state.family;

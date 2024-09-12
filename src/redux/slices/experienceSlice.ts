import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createExperience, deleteExperience, getExperienceById, getExperiencesByEmployeeId, updateExperience } from '../../api/experience';
import { RootState } from '../store';
import { Experience } from '../../types/experience';

interface ExperiencesState {
  experiences: {
    code: number,
    data: Experience[],
    message: string,
    totalElements: number
  };
  experience: {
    code: number,
    message: string,
    data: Experience | null,
  };
  experienceStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  experienceError: string | null;
}

const initialState: ExperiencesState = {
  experiences: {
    code: 0,
    data: [],
    message: '',
    totalElements: 0
  },
  experience: {
    code: 0,
    message: '',
    data: null,
  },
  experienceStatus: 'idle',
  experienceError: null,
};

// get experience by employee
export const getExperiencesByEmployeeThunk = createAsyncThunk(
  'experience/fetchByEmployeeId',
  async (employeeId: number, ThunkAPI) => {
    try {
      const response = await getExperiencesByEmployeeId(employeeId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to create experience');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

// Thunk for creating a new experience
export const createExperienceThunk = createAsyncThunk(
  'experiences/createExperience',
  async ({ employeeId, experiences }: { employeeId: number; experiences: Experience[] }, ThunkAPI) => {
    try {
      const response = await createExperience(employeeId, experiences);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to create experience');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

// Thunk for updating an existing experience
export const updateExperienceThunk = createAsyncThunk(
  'experiences/updateExperience',
  async (data: Experience, ThunkAPI) => {
    try {
      const response = await updateExperience(data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to update experience');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

// Thunk for deleting an experience
export const deleteExperienceThunk = createAsyncThunk(
  'experiences/deleteExperience',
  async (id: number, ThunkAPI) => {
    try {
      const response = await deleteExperience(id);
      return {
        ...response.data,
        id
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to delete experience');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

// Thunk for get experience by id
export const getExperienceByIdThunk = createAsyncThunk(
  'experiences/getExperienceById',
  async (id: number, ThunkAPI) => {
    try {
      const response = await getExperienceById(id);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to get experience by id');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

// Experience Slice
const experienceSlice = createSlice({
  name: 'experiences',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get experience by employee
      .addCase(getExperiencesByEmployeeThunk.pending, (state) => {
        state.experienceStatus = 'loading';
        state.experienceError = null;
      })
      .addCase(getExperiencesByEmployeeThunk.fulfilled, (state, action) => {
        state.experienceStatus = 'succeeded';
        state.experiences = action.payload;
      })
      .addCase(getExperiencesByEmployeeThunk.rejected, (state, action) => {
        state.experienceStatus = 'failed';
        state.experienceError = action.payload as string;
      })

      // Create experience
      .addCase(createExperienceThunk.pending, (state) => {
        state.experienceStatus = 'loading';
      })
      .addCase(createExperienceThunk.fulfilled, (state, action) => {
        state.experienceStatus = 'succeeded';
        action.payload.data.map((res: Experience) => state.experiences.data.unshift(res));
      })
      .addCase(createExperienceThunk.rejected, (state, action) => {
        state.experienceStatus = 'failed';
        state.experienceError = action.error.message || null;
      })
      // Update experience
      .addCase(updateExperienceThunk.pending, (state) => {
        state.experienceStatus = 'loading';
      })
      .addCase(updateExperienceThunk.fulfilled, (state, action) => {
        state.experienceStatus = 'succeeded';
        const index = state.experiences.data.findIndex(experience => experience.id === action.payload.data.id);
        if (index !== -1) {
          state.experiences.data[index] = action.payload.data;
        }
      })
      .addCase(updateExperienceThunk.rejected, (state, action) => {
        state.experienceStatus = 'failed';
        state.experienceError = action.error.message || null;
      })
      // Delete experience
      .addCase(deleteExperienceThunk.pending, (state) => {
        state.experienceStatus = 'loading';
      })
      .addCase(deleteExperienceThunk.fulfilled, (state, action) => {
        state.experienceStatus = 'succeeded';
        state.experiences.data = state.experiences.data.filter(experience => experience.id !== Number(action.payload.id));
      })
      .addCase(deleteExperienceThunk.rejected, (state, action) => {
        state.experienceStatus = 'failed';
        state.experienceError = action.error.message || null;
      })
      // Get experience by id
      .addCase(getExperienceByIdThunk.pending, (state) => {
        state.experienceStatus = 'loading';
      })
      .addCase(getExperienceByIdThunk.fulfilled, (state, action) => {
        state.experienceStatus = 'succeeded';
        state.experience = action.payload;
      })
      .addCase(getExperienceByIdThunk.rejected, (state, action) => {
        state.experienceStatus = 'failed';
        state.experienceError = action.error.message || null;
      });
  },
});

export default experienceSlice.reducer;

// Selectors
export const selectExperienceState = (state: RootState) => state.experiences;
export const selectExperienceById = (state: RootState, experienceId: number) =>
  state.experiences.experiences.data.find((experience) => experience.id === experienceId);

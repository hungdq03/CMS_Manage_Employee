import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Certificate } from '../../types/certificate';
import {
  createCertificate,
  updateCertificate,
  deleteCertificate,
  getCertificatesByEmployee,
  getCertificateById,
} from '../../api/certificate';
import axios from 'axios';
import { RootState } from '../store';

export const createCertificateThunk = createAsyncThunk(
  'certificate/create',
  async ({ employeeId, certificate }: { employeeId: number; certificate: Certificate[] }, ThunkAPI) => {
    try {
      const response = await createCertificate(employeeId, certificate);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const updateCertificateThunk = createAsyncThunk(
  'certificate/update',
  async (certificateData: Certificate, ThunkAPI) => {
    try {
      const response = await updateCertificate(certificateData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const deleteCertificateThunk = createAsyncThunk(
  'certificate/delete',
  async (certificateId: number, ThunkAPI) => {
    try {
      const response = await deleteCertificate(certificateId);
      return {
        ...response.data,
        id: certificateId
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const getCertificatesByEmployeeThunk = createAsyncThunk(
  'certificate/getByEmployee',
  async (employeeId: number, ThunkAPI) => {
    try {
      const response = await getCertificatesByEmployee(employeeId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const getCertificateByIdThunk = createAsyncThunk(
  'certificate/getById',
  async (certificateId: number, ThunkAPI) => {
    try {
      const response = await getCertificateById(certificateId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

interface CertificateState {
  certificates: {
    code: number,
    message: string,
    data: Certificate[],
  };
  certificateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  certificateError: string | null;
}

const initialState: CertificateState = {
  certificates: {
    code: 0,
    message: '',
    data: []
  },
  certificateStatus: 'idle',
  certificateError: null,
};

// Tạo slice
const certificateSlice = createSlice({
  name: 'certificate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // createCertificateThunk
    builder.addCase(createCertificateThunk.pending, (state) => {
      state.certificateStatus = 'loading';
      state.certificateError = null;
    });
    builder.addCase(createCertificateThunk.fulfilled, (state, action) => {
      state.certificates.data.unshift(action.payload.data[0]);
      state.certificateStatus = 'succeeded';
    });
    builder.addCase(createCertificateThunk.rejected, (state, action) => {
      state.certificateStatus = 'failed';
      state.certificateError = action.payload as string;
    });

    builder.addCase(updateCertificateThunk.pending, (state) => {
      state.certificateStatus = 'loading';
      state.certificateError = null;
    });
    builder.addCase(updateCertificateThunk.fulfilled, (state, action) => {
      const index = state.certificates.data.findIndex((cert) => cert.id === action.payload.data.id);
      if (index !== -1) {
        state.certificates.data[index] = action.payload.data;
      }
      state.certificateStatus = 'succeeded';
    });
    builder.addCase(updateCertificateThunk.rejected, (state, action) => {
      state.certificateStatus = 'failed';
      state.certificateError = action.payload as string;
    });

    // deleteCertificateThunk
    builder.addCase(deleteCertificateThunk.pending, (state) => {
      state.certificateStatus = 'loading';
      state.certificateError = null;
    });
    builder.addCase(deleteCertificateThunk.fulfilled, (state, action) => {
      state.certificates.data = state.certificates.data.filter((cert) => cert.id !== action.payload.id);
      state.certificateStatus = 'succeeded';
    });
    builder.addCase(deleteCertificateThunk.rejected, (state, action) => {
      state.certificateStatus = 'failed';
      state.certificateError = action.payload as string;
    });

    // getCertificatesByEmployeeThunk
    builder.addCase(getCertificatesByEmployeeThunk.pending, (state) => {
      state.certificateStatus = 'loading';
      state.certificateError = null;
    });
    builder.addCase(getCertificatesByEmployeeThunk.fulfilled, (state, action) => {
      state.certificates = action.payload;
      state.certificateStatus = 'succeeded';
    });
    builder.addCase(getCertificatesByEmployeeThunk.rejected, (state, action) => {
      state.certificateStatus = 'failed';
      state.certificateError = action.payload as string;
    });

    // getCertificateByIdThunk
    builder.addCase(getCertificateByIdThunk.pending, (state) => {
      state.certificateStatus = 'loading';
      state.certificateError = null;
    });
    builder.addCase(getCertificateByIdThunk.fulfilled, (state, action) => {
      const index = state.certificates.data.findIndex((cert) => cert.id === action.payload.id);
      if (index === -1) {
        state.certificates.data.push(action.payload);
      }
      state.certificateStatus = 'succeeded';
    });
    builder.addCase(getCertificateByIdThunk.rejected, (state, action) => {
      state.certificateStatus = 'failed';
      state.certificateError = action.payload as string;
    });
  },
});

export default certificateSlice.reducer;
export const selectCertificateState = (state: RootState) => state.certificates

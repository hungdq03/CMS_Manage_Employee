import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  createRegisteredDocument,
  deleteRegisteredDocumentById,
  getRegisteredDocumentById,
  getRegisteredDocumentsByCurrentLeader,
  getRegisteredDocumentsByEmployeeId,
  updateRegisteredDocument,
} from '../../api/registeredDocument';
import { RegisteredDocument } from '../../types/registeredDocument';
import { RootState } from '../store';

// Define a type for the slice state
interface RegisteredDocumentState {
  documents: {
    code: number;
    message: string;
    data: RegisteredDocument[];
  };
  selectedDocument?: {
    code: number;
    message: string;
    data: RegisteredDocument;
  };
  documentStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  documentError: string | null;
}

const initialState: RegisteredDocumentState = {
  documents: {
    code: 0,
    message: '',
    data: [],
  },
  selectedDocument: undefined,
  documentStatus: 'idle',
  documentError: null,
};

// Async thunks for API calls
export const getDocumentsByEmployeeIdThunk = createAsyncThunk(
  'registeredDocuments/getByEmployeeId',
  async (employeeId: number, { rejectWithValue }) => {
    try {
      const response = await getRegisteredDocumentsByEmployeeId(employeeId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch documents');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const getDocumentByIdThunk = createAsyncThunk(
  'registeredDocuments/getById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getRegisteredDocumentById(id);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch document');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const createRegisteredDocumentThunk = createAsyncThunk(
  'registeredDocuments/create',
  async ({ data, employeeId }: { data: RegisteredDocument[]; employeeId: number }, { rejectWithValue }) => {
    try {
      const response = await createRegisteredDocument(data, employeeId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to add document');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const updateDocumentThunk = createAsyncThunk(
  'registeredDocuments/update',
  async (document: RegisteredDocument, { rejectWithValue }) => {
    try {
      const response = await updateRegisteredDocument(document);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to update document');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const deleteRegisteredDocumentThunk = createAsyncThunk(
  'registeredDocuments/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteRegisteredDocumentById(id);
      return {
        ...response.data,
        id
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to remove document');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const getDocumentsByCurrentLeaderThunk = createAsyncThunk(
  'registeredDocuments/getByCurrentLeader',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRegisteredDocumentsByCurrentLeader();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch documents');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Create the slice
const registeredDocumentSlice = createSlice({
  name: 'registeredDocuments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //getDocumentsByEmployeeIdThunk
      .addCase(getDocumentsByEmployeeIdThunk.pending, (state) => {
        state.documentStatus = 'loading';
      })
      .addCase(getDocumentsByEmployeeIdThunk.fulfilled, (state, action) => {
        state.documentStatus = 'succeeded';
        state.documents = action.payload;
        state.documentError = null;
      })
      .addCase(getDocumentsByEmployeeIdThunk.rejected, (state, action) => {
        state.documentStatus = 'failed';
        state.documentError = action.payload as string;
      })

      //getDocumentByIdThunk
      .addCase(getDocumentByIdThunk.pending, (state) => {
        state.documentStatus = 'loading';
      })
      .addCase(getDocumentByIdThunk.fulfilled, (state, action) => {
        state.documentStatus = 'succeeded';
        state.selectedDocument = action.payload;
        state.documentError = null;
      })
      .addCase(getDocumentByIdThunk.rejected, (state, action) => {
        state.documentStatus = 'failed';
        state.documentError = action.payload as string;
      })

      //createRegisteredDocumentThunk
      .addCase(createRegisteredDocumentThunk.pending, (state) => {
        state.documentStatus = 'loading';
      })
      .addCase(createRegisteredDocumentThunk.fulfilled, (state, action) => {
        state.documentStatus = 'succeeded';
        state.documents.data.push(action.payload.data);
        state.documentError = null;
      })
      .addCase(createRegisteredDocumentThunk.rejected, (state, action) => {
        state.documentStatus = 'failed';
        state.documentError = action.payload as string;
      })

      //updateDocumentThunk
      .addCase(updateDocumentThunk.pending, (state) => {
        state.documentStatus = 'loading';
      })
      .addCase(updateDocumentThunk.fulfilled, (state, action) => {
        state.documentStatus = 'succeeded';
        const index = state.documents.data.findIndex(doc => doc.id === action.payload.data.id);
        if (index !== -1) {
          state.documents.data[index] = action.payload.data;
        }
        state.documentError = null;
      })
      .addCase(updateDocumentThunk.rejected, (state, action) => {
        state.documentStatus = 'failed';
        state.documentError = action.payload as string;
      })

      //deleteRegisteredDocumentThunk
      .addCase(deleteRegisteredDocumentThunk.pending, (state) => {
        state.documentStatus = 'loading';
      })
      .addCase(deleteRegisteredDocumentThunk.fulfilled, (state, action) => {
        state.documentStatus = 'succeeded';
        state.documents.data = state.documents.data.filter(doc => doc.id !== action.payload.id);
        state.documentError = null;
      })
      .addCase(deleteRegisteredDocumentThunk.rejected, (state, action) => {
        state.documentStatus = 'failed';
        state.documentError = action.payload as string;
      })

      //getDocumentsByCurrentLeaderThunk
      .addCase(getDocumentsByCurrentLeaderThunk.pending, (state) => {
        state.documentStatus = 'loading';
      })
      .addCase(getDocumentsByCurrentLeaderThunk.fulfilled, (state, action) => {
        state.documentStatus = 'succeeded';
        state.documents = action.payload;
        state.documentError = null;
      })
      .addCase(getDocumentsByCurrentLeaderThunk.rejected, (state, action) => {
        state.documentStatus = 'failed';
        state.documentError = action.payload as string;
      });
  },
});

export default registeredDocumentSlice.reducer;
export const selectRegisteredDocumentsState = (state: RootState) => state.registeredDocuments;
export const selectRegisteredDocumentById = (state: RootState, registeredDocumentId: number) =>
  state.registeredDocuments.documents.data.find((registeredDocument) => registeredDocument.id === registeredDocumentId);
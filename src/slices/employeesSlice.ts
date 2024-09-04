import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import ConstantList from "../appConfig";
import { RootState } from '../hooks/store';
import { Employee } from '../types/employees';
import axiosInstance from '../hooks/axiosInstance';

interface EmployeesState {
  employees: {
    code: number,
    data: Employee[],
    message: string,
    totalElements: number
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EmployeesState = {
  employees: {
    code: 0,
    data: [],
    message: '',
    totalElements: 0
  },
  status: 'idle',
  error: null,
};

// thunk for get all employees
export const fetchEmployeesAll = createAsyncThunk(
  'employees/fetchEmployees',
  async () => {
    const response = await axios.get(`${ConstantList.API_ENDPOINT}/employees/all`);
    return response.data;
  }
);

// thunk for get employees page
export const fetchEmployeesPage = createAsyncThunk(
  'employees/fetchEmployeesPage',
  async (params: { pageIndex: number; pageSize: number; keyword?: string; listStatus: string }, AppThunk) => {
    try {
      const response = await axiosInstance.get('/employee/search', {
        params: {
          pageIndex: params.pageIndex,
          pageSize: params.pageSize,
          keyword: params.keyword,
          listStatus: params.listStatus,
        },
      })
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return AppThunk.rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return AppThunk.rejectWithValue('An unexpected error occurred');
    }
  }
);


// create Slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //case for employees all
      // .addCase(fetchEmployeesAll.pending, (state) => {
      //   state.status = 'loading'; 
      // })
      // .addCase(fetchEmployeesAll.fulfilled, (state, action) => {
      //   state.status = 'succeeded';
      //   state.employees = action.payload;
      // })
      // .addCase(fetchEmployeesAll.rejected, (state, action) => {
      //   state.status = 'failed';
      //   state.error = action.error.message || 'Failed to fetch employees';
      // })
      //case for employees page
      .addCase(fetchEmployeesPage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployeesPage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchEmployeesPage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default employeeSlice.reducer;
export const selectEmployeesPage = (state: RootState) => state.employees
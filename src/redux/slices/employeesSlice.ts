import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { createEmployee, deleteEmployee, getEmployeesSearch, updateEmployee } from '../../api/employee';
import { RootState } from '../store';
import { Employee } from '../../types/employee';

interface EmployeesState {
  employees: {
    code: number,
    data: Employee[],
    message: string,
    totalElements: number
  };
  employeeStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  employeeError: string | null;
}

const initialState: EmployeesState = {
  employees: {
    code: 0,
    data: [],
    message: '',
    totalElements: 0
  },
  employeeStatus: 'idle',
  employeeError: null,
};

// Thunk for fetching employees with pagination
export const fetchEmployeesPage = createAsyncThunk(
  'employees/fetchEmployeesPage',
  async (params: { pageIndex: number; pageSize: number; keyword?: string; listStatus: string }, ThunkAPI) => {
    try {
      const response = await getEmployeesSearch(params);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

// Thunk for creating a new employee
export const createEmployeeThunk = createAsyncThunk(
  'employees/createEmployee',
  async (data: Employee, ThunkAPI) => {
    try {
      const response = await createEmployee(data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to create employee');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

// Thunk for updating an existing employee
export const updateEmployeeThunk = createAsyncThunk(
  'employees/updateEmployee',
  async (data: Employee, ThunkAPI) => {
    try {
      const response = await updateEmployee(data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to update employee');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

// Thunk for deleting an employee
export const deleteEmployeeThunk = createAsyncThunk(
  'employees/deleteEmployee',
  async (id: number, ThunkAPI) => {
    try {
      await deleteEmployee(id);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return ThunkAPI.rejectWithValue(error.response.data.message || 'Failed to delete employee');
      }
      return ThunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

// Employee Slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    employeeUpdated(state, action: PayloadAction<Employee>) {

      let existingEmployee = state.employees.data.find((employee) => employee.id === action.payload.id)
      if (existingEmployee) {
        existingEmployee = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees page
      .addCase(fetchEmployeesPage.pending, (state) => {
        state.employeeStatus = 'loading';
      })
      .addCase(fetchEmployeesPage.fulfilled, (state, action) => {
        state.employeeStatus = 'succeeded';
        state.employees = action.payload
      })
      .addCase(fetchEmployeesPage.rejected, (state, action) => {
        state.employeeStatus = 'failed';
        state.employeeError = action.error.message || null;
      })
      // Create employee
      .addCase(createEmployeeThunk.pending, (state) => {
        state.employeeStatus = 'loading';
      })
      .addCase(createEmployeeThunk.fulfilled, (state, action) => {
        state.employeeStatus = 'succeeded';
        state.employees.data.push(action.payload);
      })
      .addCase(createEmployeeThunk.rejected, (state, action) => {
        state.employeeStatus = 'failed';
        state.employeeError = action.error.message || null;
      })
      // Update employee
      .addCase(updateEmployeeThunk.pending, (state) => {
        state.employeeStatus = 'loading';
      })
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        state.employeeStatus = 'succeeded';
        const index = state.employees.data.findIndex(employee => employee.id === action.payload.data.id);

        if (index !== -1) {
          state.employees.data[index] = action.payload.data;
        }
      })
      .addCase(updateEmployeeThunk.rejected, (state, action) => {
        state.employeeStatus = 'failed';
        state.employeeError = action.error.message || null;
      })
      // Delete employee
      .addCase(deleteEmployeeThunk.pending, (state) => {
        state.employeeStatus = 'loading';
      })
      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        state.employeeStatus = 'succeeded';
        state.employees.data = state.employees.data.filter(employee => employee.id !== Number(action.payload));
      })
      .addCase(deleteEmployeeThunk.rejected, (state, action) => {
        state.employeeStatus = 'failed';
        state.employeeError = action.error.message || null;
      });
  },
});

export default employeeSlice.reducer;

// Selectors
export const selectEmployeesState = (state: RootState) => state.employees;
export const selectEmployeeById = (state: RootState, employeeId: number) =>
  state.employees.employees.data.find((employee) => employee.id === employeeId);

import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeesSlice';
import userReducer from './slices/userSlice';
import certificateReducer from './slices/certificateSlice';
import familyReducer from './slices/familySlice';
import experienceReducer from './slices/experienceSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    employees: employeeReducer,
    certificates: certificateReducer,
    families: familyReducer,
    experiences: experienceReducer,
  },
});

// Export type
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;

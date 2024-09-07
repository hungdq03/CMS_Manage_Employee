import MuiAlert from '@mui/material/Alert';
import Slide, { SlideProps } from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import Loader from '../components/core/Loader';
import { useAppSelector } from '../redux/hook';
import { selectEmployeesState } from '../redux/slices/employeesSlice';
import { selectCertificateState } from '../redux/slices/certificateSlice';
import { selectFamilyState } from '../redux/slices/familySlice';

type SnackbarMessage = {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
};

type AppContextType = {
  showMessage: (message: SnackbarMessage) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

// Function to define the Slide transition direction
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { employeeStatus, } = useAppSelector(selectEmployeesState);
  const { certificateStatus } = useAppSelector(selectCertificateState);
  const { familyStatus } = useAppSelector(selectFamilyState);

  const showMessage = (message: SnackbarMessage) => {
    setSnackbar(message);
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const setLoadingState = (loading: boolean) => {
    setLoading(loading);
  };

  return (
    <AppContext.Provider value={{ showMessage, setLoading: setLoadingState, loading }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={1200}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert onClose={handleClose} severity={snackbar?.severity} sx={{ width: '100%' }}>
          {snackbar?.message}
        </MuiAlert>
      </Snackbar>
      {/* Loading indicator */}
      {loading
        || employeeStatus === 'loading'
        || certificateStatus === 'loading'
        || familyStatus === 'loading'
        && (
          <Loader />
        )}
    </AppContext.Provider>
  );
};

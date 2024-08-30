import React from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthGuard from './features/auth/AuthGuard';
import { ThemeProvider } from './components/core/themeProvider/ThemeProvider';
import MainLayout from './components/layouts/MainLayout';
import { SignInPage } from './features/auth/SignInPage';
import ManageEmployeesPage from './features/employees/manageEmployees/ManageEmployeesPage';
import { store } from './hooks/store';
import { AppContextProvider } from './context/AppContext';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContextProvider>
        <ThemeProvider>
          <Router>
            <AuthGuard>
              <Routes>
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/" element={<MainLayout />}>
                  <Route path="/employees/manageEmployees" element={<ManageEmployeesPage />} />
                </Route>
              </Routes>
            </AuthGuard>
          </Router>
        </ThemeProvider>
      </AppContextProvider>
    </Provider>
  );
};

export default App;

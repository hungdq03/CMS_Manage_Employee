import React from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/core/themeProvider/ThemeProvider';
import MainLayout from './components/layouts/MainLayout';
import { AppContextProvider } from './context/AppContext';
import AuthGuard from './features/auth/AuthGuard';
import { SignInPage } from './features/auth/SignInPage';
import AddEmployeePage from './features/employees/addEmployee/AddEmployeePage';
import ManageEmployeesPage from './features/employees/manageEmployees/ManageEmployeesPage';
import { store } from './redux/store';
import { paths } from './paths';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContextProvider>
        <ThemeProvider>
          <Router>
            <AuthGuard>
              <Routes>
                <Route path={paths.auth.signIn} element={<SignInPage />} />
                <Route path={paths.home} element={<MainLayout />}>
                  <Route path={paths.dashboard.employees.add} element={<AddEmployeePage />} />
                  <Route path={paths.dashboard.employees.manage} element={<ManageEmployeesPage />} />
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

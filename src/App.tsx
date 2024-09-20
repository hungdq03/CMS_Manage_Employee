import React from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/core/themeProvider/ThemeProvider';
import MainLayout from './components/layouts/MainLayout';
import { AppContextProvider } from './context/AppContext';
import AuthGuard from './app/auth/AuthGuard';
import { SignInPage } from './app/auth/SignInPage';
import AddEmployeePage from './app/employees/AddEmployeePage';
import ManageEmployeesPage from './app/employees/ManageEmployeesPage';
import { store } from './redux/store';
import { paths } from './paths';
import NotFoundPage from './app/errors/NotFoundPage';
import { AuthRole } from './types/user';
import { ForbiddenPage } from './app/errors/ForbiddenPage';
import { PendingApprovalPage } from './app/leader/PendingApprovalPage';
import EndEmployeePage from './app/employees/EndEmployeePage';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContextProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path={paths.auth.signIn}
                element={
                  <AuthGuard>
                    <SignInPage />
                  </AuthGuard>
                } />
              <Route path={paths.home}
                element={
                  <AuthGuard>
                    <MainLayout />
                  </AuthGuard>
                }>
                <Route
                  path={paths.dashboard.employees.add}
                  element={
                    <AuthGuard allowedRoles={AuthRole.user}>
                      <AddEmployeePage />
                    </AuthGuard>
                  }
                />
                <Route
                  path={paths.dashboard.employees.manage}
                  element={
                    <AuthGuard allowedRoles={AuthRole.user}>
                      <ManageEmployeesPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path={paths.dashboard.employees.end}
                  element={
                    <AuthGuard allowedRoles={AuthRole.user}>
                      <EndEmployeePage />
                    </AuthGuard>
                  }
                />
                <Route
                  path={paths.dashboard.leader.pendingApproval}
                  element={
                    <AuthGuard allowedRoles={AuthRole.admin}>
                      <PendingApprovalPage />
                    </AuthGuard>
                  }
                />
              </Route>
              <Route path={paths.errors.forbidden} element={<ForbiddenPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AppContextProvider>
    </Provider>
  );
};

export default App;

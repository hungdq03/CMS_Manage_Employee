import React from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthProvider from './auth/Auth';
import { ThemeProvider } from './components/core/themeProvider/ThemeProvider';
import MainLayout from './components/layouts/MainLayout';
import { LoginPage } from './features/auth/LoginPage';
import { store } from './hooks/store';

const App: React.FC = () => {
  return (
      <Provider store={store}>
        <AuthProvider>
          <ThemeProvider>
            <Router>
              {/* <AuthGuard> */}
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<MainLayout />}>
                  </Route>
                </Routes>
              {/* </AuthGuard> */}
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </Provider>
  );
};

export default App;

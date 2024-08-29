import React, { useEffect } from 'react';
import { userLoggedIn, userLoggedOut } from '../features/auth/authSlice';
import { useAppDispatch } from '../hooks/hook';

const Auth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    // Kiểm tra và cập nhật trạng thái xác thực khi component mount
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(userLoggedIn({ token }));
    } else {
      dispatch(userLoggedOut());
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default Auth;

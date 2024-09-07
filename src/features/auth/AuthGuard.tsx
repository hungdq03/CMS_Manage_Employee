/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hook';
import { signOut } from '../../redux/slices/authSlice';
import { fetchCurrentUser } from '../../redux/slices/userSlice';
import Cookies from 'js-cookie';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = Cookies.get('token');

  useEffect(() => {
    if (!token) {
      dispatch(signOut());
      navigate('/sign-in');
    } else {
      dispatch(fetchCurrentUser());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, dispatch, token]);

  return <>{children}</>;
};

export default AuthGuard;

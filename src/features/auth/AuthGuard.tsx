/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/hook';
import { signOut } from '../../slices/authSlice';
import { fetchCurrentUser } from '../../slices/userSlice';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const tokenExpireTime = localStorage.getItem('token_expire_time');

  useEffect(() => {
    if (!token || (tokenExpireTime && Date.now() > parseInt(tokenExpireTime, 10))) {
      dispatch(signOut());
      navigate('/sign-in');
    } else {
      dispatch(fetchCurrentUser());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, dispatch, token, tokenExpireTime]);

  return <>{children}</>;
};

export default AuthGuard;

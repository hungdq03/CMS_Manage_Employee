/* eslint-disable @typescript-eslint/no-unused-vars */
import { unwrapResult } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../paths';
import { useAppDispatch } from '../../redux/hook';
import { signOut } from '../../redux/slices/authSlice';
import { fetchCurrentUser } from '../../redux/slices/userSlice';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = Cookies.get('token');

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser())
        .then(unwrapResult)
        .then((user) => {
          const hasAccess = allowedRoles && user.roles
            ? allowedRoles.some(role => user.roles.map(role => role.name).includes(role))
            : true;

          if (!hasAccess) {
            navigate(paths.errors.forbidden);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch user:', error);
          dispatch(signOut());
          navigate(paths.auth.signIn);
        });
    } else {
      dispatch(signOut());
      navigate(paths.auth.signIn);
    }
  }, [navigate, dispatch, token, allowedRoles]);


  return <>{children}</>;
};

export default AuthGuard;

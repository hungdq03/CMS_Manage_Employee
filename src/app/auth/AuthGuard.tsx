/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { signOut } from '../../redux/slices/authSlice';
import { fetchCurrentUser, selectCurrentUser } from '../../redux/slices/userSlice';
import Cookies from 'js-cookie';
import { paths } from '../../paths';
import { unwrapResult } from '@reduxjs/toolkit';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser)
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

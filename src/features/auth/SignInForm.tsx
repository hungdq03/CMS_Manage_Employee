/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, FormControl, FormHelperText, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z as zod } from 'zod';
import { useAppContext } from '../../context/AppContext';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { selectAuth, signIn } from '../../redux/slices/authSlice'; // Đảm bảo import đúng slice và action

const schema = zod.object({
  username: zod.string().min(1, { message: 'Hãy nhập tên đăng nhập' }),
  password: zod.string().min(1, { message: 'Hãy nhập mật khẩu.' }),
});

type Values = zod.infer<typeof schema>;

export const SignInForm = () => {
  const dispatch = useAppDispatch();
  const authStore = useAppSelector(selectAuth)
  const navigate = useNavigate();
  const { showMessage, setLoading } = useAppContext();
  const [showPassword, setShowPassword] = React.useState<boolean>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      // Dispatch login action with username and password 
      setLoading(true)
      dispatch(signIn({ username: values.username, password: values.password }))
        .unwrap()
        .then(() => {
          navigate('/');
        })
        .catch((error: any) => {
          showMessage({ message: error.error_description, severity: 'error' })
          console.error('Login failed', error);
        });
      setLoading(false)
    },
    [dispatch, navigate, showMessage]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Đăng nhập</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <FormControl error={Boolean(errors.username)}>
                <InputLabel>Tài khoản</InputLabel>
                <OutlinedInput {...field} label="Tài khoản" />
                {errors.username ? <FormHelperText>{errors.username.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Mật khẩu</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={authStore.loading} type="submit" variant="contained">
            Đăng nhập
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

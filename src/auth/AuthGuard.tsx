import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../paths';

export interface AuthGuardProps {
  children: React.ReactNode;
}

const user = {
  username: 'admin',
  password: 'admin'
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const navigate = useNavigate();
  // const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    // if (isLoading) {
    //   return;
    // }

    // if (error) {
    //   setIsChecking(false);
    //   return;
    // }

    if (!user) {
      navigate(paths.auth.signIn);
      return;
    }

    setIsChecking(false);
  };

  // React.useEffect(() => {
  //   checkPermissions().catch(() => {
  //     // noop
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  // }, [user, error, isLoading]);

  if (isChecking) {
    return null;
  }

  // if (error) {
  //   return <Alert color="error">{error}</Alert>;
  // }

  return <React.Fragment>{children}</React.Fragment>;
}

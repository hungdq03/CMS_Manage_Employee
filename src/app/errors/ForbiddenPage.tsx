import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

import { paths } from '../../paths';

export const ForbiddenPage = () => {
  return (
    <Box
      component="main"
      sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '100vh', }}
    >
      <Stack spacing={3} sx={{ alignItems: 'center', maxWidth: 'md' }}>
        <Box>
          <Box
            component="img"
            alt="Under development"
            src="/assets/error-401.png"
            sx={{ display: 'inline-block', height: 'auto', maxWidth: '100%', width: '400px' }}
          />
        </Box>
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          403: Truy cập bị từ chối
        </Typography>
        <Typography color="text.secondary" variant="body1" sx={{ textAlign: 'center' }}>
          Bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra quyền truy cập của bạn.
        </Typography>
        <Button
          component={Link}
          to={paths.home}
          startIcon={<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
        >
          Quay lại trang chủ
        </Button>
      </Stack>
    </Box>
  )
}

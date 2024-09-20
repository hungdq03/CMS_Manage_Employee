import { Box, Card, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { PencilSimple } from '@phosphor-icons/react';
import React, { ChangeEvent, MouseEvent } from 'react';
import { useAppDispatch } from '../../../redux/hook';
import { deleteCertificateThunk } from '../../../redux/slices/certificateSlice';
import { Certificate } from '../../../types/certificate';
import { formatDate, statusCode } from '../../../utils';
import ConfirmationDialog from '../../core/ConfirmationDialog';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppContext } from '../../../context/AppContext';

interface Props {
  count?: number;
  page?: number;
  rows: Certificate[];
  rowsPerPage?: number;
  handleChangePage: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  setCertificateSelected: (certificate: Certificate | undefined) => void;
}

export function CertificatesTable({
  count = 0,
  rows = [],
  page = 1,
  rowsPerPage = 0,
  handleChangePage,
  handleChangeRowsPerPage,
  setCertificateSelected
}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const rowPerPageOptions = (maxNumber: number): number[] =>
    Array.from({ length: Math.floor(maxNumber / 2) }, (_, i) => i * 2 + 1);

  const handleUpdateCertificate = (certificateSelected: Certificate) => {
    setCertificateSelected(certificateSelected)
  }

  const handleDeleteCertificate = async (certificateId: number) => {
    const resultAction = await dispatch(deleteCertificateThunk(certificateId));
    const response = unwrapResult(resultAction);

    if (response.code === statusCode.SUCCESS) {
      showMessage({
        message: 'Xóa văn bằng thành công.',
        severity: 'success',
      });
    } else {
      showMessage({
        message: response.message || 'Xóa văn bằng thất bại.',
        severity: 'error',
      });
    }
  };
  return (
    <Card>
      <Box sx={{ overflow: 'auto', maxHeight: '250px' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Thao tác</TableCell>
              <TableCell>STT</TableCell>
              <TableCell>Tên văn bằng</TableCell>
              <TableCell>Ngày cấp</TableCell>
              <TableCell>Lĩnh vực</TableCell>
              <TableCell>Nội dung</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell align='center'>
                  <ConfirmationDialog
                    onYesClick={() => handleDeleteCertificate(row.id)}
                    title="Xác nhận"
                    text={`Bạn có chắc chắn muốn xóa chứng chỉ: ${row.certificateName}`}
                    Yes="Xác nhận"
                    No="Hủy"
                    btnColor='error'
                    iconName='Trash'
                  />

                  <IconButton
                    color="primary"
                    onClick={() => handleUpdateCertificate(row)}
                    size="small"
                  >
                    <PencilSimple style={{ fontSize: 'var(--icon-fontSize-md)' }} />
                  </IconButton>
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.certificateName}</TableCell>
                <TableCell>{formatDate(row.issueDate)}</TableCell>
                <TableCell>{row.field}</TableCell>
                <TableCell>{row.content}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        page={page - 1}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowPerPageOptions(count)}
        labelRowsPerPage={"Số hàng mỗi trang"}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trong ${count}`
        }
      />
    </Card>
  )
}

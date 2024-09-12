import { Box, Card, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { PencilSimple } from '@phosphor-icons/react';
import React, { ChangeEvent, MouseEvent } from 'react';
import { useAppDispatch } from '../../../redux/hook';
import { deleteFamilyThunk } from '../../../redux/slices/familySlice';
import { GENDER } from '../../../types/employee';
import { Family } from '../../../types/family';
import { formatDate, statusCode } from '../../../utils';
import ConfirmationDialog from '../../core/ConfirmationDialog';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppContext } from '../../../context/AppContext';

interface Props {
  count?: number;
  page?: number;
  rows: Family[];
  rowsPerPage?: number;
  handleChangePage: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  setFamilySelected: (family: Family | undefined) => void;
}

export function FamiliesTable({
  count = 0,
  rows = [],
  page = 1,
  rowsPerPage = 0,
  handleChangePage,
  handleChangeRowsPerPage,
  setFamilySelected
}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const rowPerPageOptions = (maxNumber: number): number[] =>
    Array.from({ length: Math.floor(maxNumber / 2) }, (_, i) => i * 2 + 1);

  const handleUpdateFamily = (familySelected: Family) => {
    setFamilySelected(familySelected)
  }

  const handleDeleteFamily = async (familyId: number | null) => {
    if (!familyId) {
      return;
    }
    const resultAction = await dispatch(deleteFamilyThunk(familyId));
    const response = unwrapResult(resultAction);

    if (response.code === statusCode.SUCCESS) {
      showMessage({
        message: 'Xóa thông tin gia đình thành công.',
        severity: 'success',
      });
    } else {
      showMessage({
        message: response.message || 'Xóa thông tin gia đình thất bại.',
        severity: 'error',
      });
    }
  };
  return (
    <Card>
      <Box sx={{ overflow: 'auto', maxHeight: '250px' }}>
        <Table sx={{ minWidth: '800px' }} >
          <TableHead >
            <TableRow>
              <TableCell>Thao tác</TableCell>
              <TableCell>STT</TableCell>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Quan hệ</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Địa chỉ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell align='center'>
                  <ConfirmationDialog
                    onYesClick={() => handleDeleteFamily(row.id)}
                    title="Xác nhận"
                    text={`Bạn có chắc chắn muốn xóa thông tin gia đình: ${row.name}`}
                    Yes="Xác nhận"
                    No="Hủy"
                    btnColor='error'
                    iconName='Trash'
                  />

                  <IconButton
                    color="primary"
                    onClick={() => handleUpdateFamily(row)}
                    size="small"
                  >
                    <PencilSimple style={{ fontSize: 'var(--icon-fontSize-md)' }} />
                  </IconButton>
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.dateOfBirth ? formatDate(row.dateOfBirth) : ''}</TableCell>
                <TableCell>{row.gender ? Object.values(GENDER)[row.gender] : ''}</TableCell>
                <TableCell>{row.relationShip}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.address}</TableCell>
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

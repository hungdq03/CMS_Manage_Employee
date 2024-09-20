import { Box, Card, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { Bell, Eye, PencilSimple } from '@phosphor-icons/react';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { ChangeEvent, MouseEvent, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useAppDispatch } from '../../../redux/hook';
import { deleteSalaryIncreaseThunk } from "../../../redux/slices/salaryIncreaseSlice";
import { STATUS_PROFILE } from '../../../types/employee';
import { SalaryIncrease } from "../../../types/salaryIncrease";
import { formatDate, statusCode } from '../../../utils';
import ConfirmationDialog from '../../core/ConfirmationDialog';
import { ACTION_PROCESS } from '../../../types/process';
import { SalaryLetter } from '../SalaryLetter';
import ShowDialog from '../../core/ShowDialog';

interface Props {
  employeeId: number;
  count: number;
  page: number;
  rows: SalaryIncrease[];
  rowsPerPage: number;
  handleChangePage: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  setSalarySelected: (salary: SalaryIncrease | undefined) => void;
}

export const SalaryTable: React.FC<Props> = ({ employeeId, count, page, rows, rowsPerPage, handleChangePage, handleChangeRowsPerPage, setSalarySelected }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const [openSalaryLetter, setOpenSalaryLetter] = useState<{
    salaryId: number;
    isOpen: boolean;
  }>();
  const [openNotify, setOpenNotify] = useState<{
    salary: SalaryIncrease | undefined;
    isOpen: boolean;
  }>();


  const handleSelectSalary = (salarySelected: SalaryIncrease) => {
    setSalarySelected(salarySelected)
  }

  const handleDeleteSalary = async (salaryId: number) => {
    if (!salaryId) {
      return;
    }
    const resultAction = await dispatch(deleteSalaryIncreaseThunk(salaryId));
    const response = unwrapResult(resultAction);

    if (response.code === statusCode.SUCCESS) {
      showMessage({
        message: 'Xóa thông tin tăng lương thành công.',
        severity: 'success',
      });
    } else {
      showMessage({
        message: response.message || 'Xóa thông tin tăng lương thất bại.',
        severity: 'error',
      });
    }
  };

  const handleOpenSalaryLetter = (salaryId?: number) => {
    if (!salaryId) {
      return;
    }

    setOpenSalaryLetter({
      salaryId: salaryId,
      isOpen: true,
    });
  }

  const handleCloseSalaryLetter = () => {
    setOpenSalaryLetter({
      salaryId: 0,
      isOpen: false,
    });
  }

  const handleOpenNotify = (salary: SalaryIncrease) => {
    setOpenNotify({
      isOpen: true,
      salary,
    });
  }

  const handleCloseNotify = () => {
    setOpenNotify({
      isOpen: false,
      salary: undefined,
    });
  }

  return (
    <>
      <Card>
        <Box sx={{ overflow: 'auto', maxHeight: '250px' }}>
          <Table sx={{ minWidth: '800px' }} >
            <TableHead >
              <TableRow>
                <TableCell>Thao tác</TableCell>
                <TableCell>STT</TableCell>
                <TableCell>Ngày tăng lương</TableCell>
                <TableCell>Mức lương cũ</TableCell>
                <TableCell>Mức lương mới</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell align='center'>
                    {ACTION_PROCESS.DELETE.includes(row.salaryIncreaseStatus?.toString() ?? '') && (
                      <ConfirmationDialog
                        onYesClick={() => row.id && handleDeleteSalary(row.id)}
                        title="Xác nhận"
                        text={`Bạn có chắc chắn muốn xóa thông tin tăng lương`}
                        Yes="Xác nhận"
                        No="Hủy"
                        btnColor='error'
                        iconName='Trash'
                      />
                    )}

                    {ACTION_PROCESS.EDIT.includes(row.salaryIncreaseStatus?.toString() ?? '') && (
                      <IconButton
                        color="primary"
                        onClick={() => handleSelectSalary(row)}
                        size="small"
                      >
                        <PencilSimple style={{ fontSize: 'var(--icon-fontSize-md)' }} />
                      </IconButton>
                    )}

                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleOpenSalaryLetter(row.id)}
                    >
                      <Eye color='green' />
                    </IconButton>

                    {ACTION_PROCESS.NOTIFY.includes(row.salaryIncreaseStatus?.toString() ?? '') && (
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleOpenNotify(row)}
                      >
                        <Bell color='#ddb903' />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.startDate ? formatDate(row.startDate) : ''}</TableCell>
                  <TableCell>{row.oldSalary}</TableCell>
                  <TableCell>{row.newSalary}</TableCell>
                  <TableCell>{row.note}</TableCell>
                  <TableCell>{row.salaryIncreaseStatus ? STATUS_PROFILE[row.salaryIncreaseStatus] : ''}</TableCell>
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

      {openSalaryLetter &&
        <SalaryLetter
          open={openSalaryLetter?.isOpen}
          onClose={handleCloseSalaryLetter}
          employeeId={employeeId}
          salaryId={openSalaryLetter?.salaryId}
        />
      }

      {openNotify && (
        <ShowDialog
          onConfirmDialogClose={handleCloseNotify}
          open={openNotify.isOpen}
          text={
            openNotify.salary?.salaryIncreaseStatus === 4
              ? openNotify.salary?.additionalRequest || "Không có"
              : openNotify.salary?.reasonForRefusal || "Không có"
          }
          title={
            openNotify.salary?.salaryIncreaseStatus === 4
              ? "Nội dung yêu cầu bổ sung"
              : "Lý do từ chối"
          }
          cancel='Hủy'
        />
      )}
    </>
  )
}

const rowPerPageOptions = (maxNumber: number): number[] =>
  Array.from({ length: Math.floor(maxNumber / 2) }, (_, i) => i * 2 + 1);


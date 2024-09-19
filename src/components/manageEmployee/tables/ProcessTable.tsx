import { Box, Card, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { Bell, Eye, PencilSimple } from '@phosphor-icons/react';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { ChangeEvent, MouseEvent, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useAppDispatch } from '../../../redux/hook';
import { deleteProcessThunk } from '../../../redux/slices/processSlice';
import { STATUS_PROFILE } from '../../../types/employee';
import { ACTION_PROCESS, Process } from '../../../types/process';
import { formatDate, statusCode } from '../../../utils';
import ConfirmationDialog from '../../core/ConfirmationDialog';
import ShowDialog from '../../core/ShowDialog';
import { ProcessLetter } from '../ProcessLetter';

interface Props {
  employeeId: number;
  count: number;
  page: number;
  rows: Process[];
  rowsPerPage: number;
  handleChangePage: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  setProcessSelected: (process: Process | undefined) => void;
}

export const ProcessTable: React.FC<Props> = ({ employeeId, count, page, rows, rowsPerPage, handleChangePage, handleChangeRowsPerPage, setProcessSelected }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const [openProcessLetter, setOpenProcessLetter] = useState<{
    processId: number;
    isOpen: boolean;
  }>();
  const [showNotify, setShowNotify] = useState<{
    process: Process | undefined;
    isOpen: boolean;
  }>();


  const handleSelectProcess = (process: Process) => {
    setProcessSelected(process)
  }

  const handleDeleteProcess = async (processId: number) => {
    if (!processId) {
      return;
    }
    dispatch(deleteProcessThunk(processId))
      .then(unwrapResult)
      .then((res) => {
        if (res.code === statusCode.SUCCESS) {
          showMessage({
            message: 'Xóa thông tin thăng chức thành công.',
            severity: 'success',
          });
        } else {
          showMessage({
            message: res.message || 'Xóa thông tin thăng chức thất bại.',
            severity: 'error',
          });
        }
      });
  };

  const handleOpenProcessLetter = (processId?: number) => {
    if (!processId) {
      return;
    }

    setOpenProcessLetter({
      processId: processId,
      isOpen: true,
    });
  }

  const handleCloseProcessLetter = () => {
    setOpenProcessLetter({
      processId: 0,
      isOpen: false,
    });
  }

  const handleOpenNotify = (process: Process) => {
    setShowNotify({
      isOpen: true,
      process,
    });
  }

  const handleCloseNotify = () => {
    setShowNotify({
      isOpen: false,
      process: undefined,
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
                <TableCell>Ngày thăng chức</TableCell>
                <TableCell>Vị trí cũ</TableCell>
                <TableCell>Vị trí mới</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row, index) => (
                <TableRow key={row?.id}>
                  <TableCell align='center'>
                    {ACTION_PROCESS.DELETE.includes(row?.processStatus?.toString() ?? '') && (
                      <ConfirmationDialog
                        onYesClick={() => row.id && handleDeleteProcess(row.id)}
                        title="Xác nhận"
                        text={`Bạn có chắc chắn muốn xóa thông tin thăng chức`}
                        Yes="Xác nhận"
                        No="Hủy"
                        btnColor='error'
                        iconName='Trash'
                      />
                    )}

                    {ACTION_PROCESS.EDIT.includes(row?.processStatus?.toString() ?? '') && (
                      <IconButton
                        color="primary"
                        onClick={() => handleSelectProcess(row)}
                        size="small"
                      >
                        <PencilSimple style={{ fontSize: 'var(--icon-fontSize-md)' }} />
                      </IconButton>
                    )}

                    {ACTION_PROCESS.VIEW.includes(row?.processStatus?.toString() ?? '') && (
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleOpenProcessLetter(row.id)}
                      >
                        <Eye color='green' />
                      </IconButton>
                    )}

                    {ACTION_PROCESS.NOTIFY.includes(row?.processStatus?.toString() ?? '') && (
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
                  <TableCell>{row?.promotionDay ? formatDate(row?.promotionDay) : ''}</TableCell>
                  <TableCell>{row?.currentPosition}</TableCell>
                  <TableCell>{row?.newPosition}</TableCell>
                  <TableCell>{row?.note}</TableCell>
                  <TableCell>{row?.processStatus ? STATUS_PROFILE[row?.processStatus] : ''}</TableCell>
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

      {openProcessLetter &&
        <ProcessLetter
          open={openProcessLetter?.isOpen}
          onClose={handleCloseProcessLetter}
          employeeId={employeeId}
          processId={openProcessLetter?.processId}
        />
      }

      {showNotify && (
        <ShowDialog
          onConfirmDialogClose={handleCloseNotify}
          open={showNotify.isOpen}
          text={
            showNotify.process?.processStatus === 4
              ? showNotify.process?.additionalRequest || "Không có"
              : showNotify.process?.reasonForRefusal || "Không có"
          }
          title={
            showNotify.process?.processStatus === 4
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


import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Bell, Eye, Files, PencilSimple } from '@phosphor-icons/react';
import * as React from 'react';
import { useAppDispatch } from '../../../redux/hook';
import { deleteEmployeeThunk } from '../../../redux/slices/employeesSlice';
import { ACTION_EMPLOYEE, Employee, GENDER, paramsSearchEmployees, STATUS_PROFILE, TEAM_CATEGORY } from '../../../types/employee';
import { formatDate, statusCode } from '../../../utils';
import ConfirmationDialog from '../../core/ConfirmationDialog';
import EmployeeDialog from '../dialogs/EmployeeDialog';
import { useState } from 'react';
import ProfileEmployeeDialog from '../../employeeProfile/dialogs/ProfileEmployeeDialog';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppContext } from '../../../context/AppContext';
import { ResignationLetter } from '../../pendingApproval/ResignationLetter';
import { ManageEmployeeDialog } from '../../manageEmployee/dialogs/ManageEmployeeDialog';
import ShowDialog from '../../core/ShowDialog';

interface Props {
  count?: number;
  page?: number;
  rows?: Employee[];
  rowsPerPage?: number;
  onChangeParams: (state: Partial<paramsSearchEmployees>) => void;
  isEnd?: boolean;
  isManage?: boolean;
  isAdmin?: boolean;
}

export function EmployeesTable({
  count = 0,
  rows = [],
  page = 1,
  rowsPerPage = 0,
  onChangeParams,
  isEnd,
  isManage,
  isAdmin
}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const [openProfile, setOpenProfile] = useState<{
    isOpen: boolean;
    employeeId: number;
  }>();
  const [openRegisnationDialog, setOpenRegisnationDialog] = useState<{
    isOpen: boolean;
    employeeId: number;
  }>();
  const [openManageEmployeeDialog, setOpenManageEmployeeDialog] = useState<{
    isOpen: boolean;
    employeeId: number;
  }>();
  const [openNotify, setOpenNotify] = useState<{
    employee: Employee | undefined;
    isOpen: boolean;
  }>();

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    if (event) {
      onChangeParams({ pageIndex: newPage + 1 });
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeParams({ pageSize: +event.target.value, pageIndex: 1 });
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    const resultAction = await dispatch(deleteEmployeeThunk(employeeId));

    const response = unwrapResult(resultAction)

    if (response.code === statusCode.SUCCESS) {
      showMessage({
        message: 'Xóa nhân viên thành công.',
        severity: 'success',
      });
    } else {
      showMessage({
        message: response.message || 'Xóa nhân viên thất bại.',
        severity: 'error'
      });
    }
  }

  const handleOpenProfile = (employeeId: number) => {
    setOpenProfile({
      employeeId,
      isOpen: true
    })
  }

  const handleCloseProfile = () => {
    setOpenProfile({
      employeeId: 0,
      isOpen: false
    })
  }

  const handleOpenRegisnationDialog = (employeeId: number) => {
    setOpenRegisnationDialog({
      employeeId,
      isOpen: true
    })
  }

  const handleCloseRegisnationDialog = () => {
    setOpenRegisnationDialog({
      employeeId: 0,
      isOpen: false
    })
  }

  const handleOpenManageEmployeeDialog = (employeeId: number) => {
    setOpenManageEmployeeDialog({
      employeeId,
      isOpen: true
    })
  }

  const handleCloseManageEmployeeDialog = () => {
    setOpenManageEmployeeDialog({
      employeeId: 0,
      isOpen: false
    })
  }

  const handleOpenNotify = (employee: Employee) => {
    setOpenNotify({
      employee,
      isOpen: true
    })
  }

  const handleCloseNotify = () => {
    setOpenNotify({
      employee: undefined,
      isOpen: false
    })
  }

  return (
    <>
      <Card>
        <Box sx={{ overflow: 'auto', maxHeight: '500px' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell>Thao tác</TableCell>
                <TableCell>STT</TableCell>
                <TableCell>Mã nhân viên</TableCell>
                <TableCell>Tên nhân viên</TableCell>
                <TableCell>Ngày sinh</TableCell>
                <TableCell>Giới tính</TableCell>
                <TableCell>Nhóm</TableCell>
                <TableCell>SĐT</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id}>
                  {isAdmin ?
                    <TableCell>
                      {ACTION_EMPLOYEE.END.includes(row.submitProfileStatus.toString() ?? '') &&
                        <IconButton
                          color="secondary"
                          size='small'
                          onClick={() => handleOpenProfile(row.id)}
                        >
                          <Eye color='green' />
                        </IconButton>
                      }
                      <IconButton
                        color="secondary"
                        size='small'
                        onClick={() => ACTION_EMPLOYEE.PENDING_END.includes(row.submitProfileStatus.toString() ?? '') ? handleOpenRegisnationDialog(row.id) :
                          handleOpenProfile(row.id)
                        }
                      >
                        <Files color='blue' />
                      </IconButton>
                    </TableCell>
                    : <TableCell align='center'>
                      {ACTION_EMPLOYEE.EDIT.includes(row.submitProfileStatus?.toString() ?? '') && (
                        isManage ? (
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenManageEmployeeDialog(row.id)}
                            size="small"
                          >
                            <PencilSimple />
                          </IconButton>
                        ) : (
                          <EmployeeDialog type="UPDATE" employeeId={row.id} />
                        )
                      )}

                      {ACTION_EMPLOYEE.DELETE.includes(row.submitProfileStatus.toString() ?? '') && (
                        <ConfirmationDialog
                          onYesClick={() => handleDeleteEmployee(row.id)}
                          title="Xác nhận"
                          text={`Bạn có chắc chắn muốn xóa nhân viên: ${row.name}`}
                          Yes="Xác nhận"
                          No="Hủy"
                          btnColor='error'
                          iconName='Trash'
                        />
                      )}

                      {ACTION_EMPLOYEE.VIEW.includes(row.submitProfileStatus.toString() ?? '') && (
                        <IconButton
                          color="secondary"
                          size='small'
                          onClick={() => handleOpenProfile(row.id)}
                        >
                          <Eye color='green' />
                        </IconButton>
                      )}

                      {ACTION_EMPLOYEE.NOTIFY.includes(row.submitProfileStatus.toString() ?? '') && (
                        <IconButton
                          color="secondary"
                          size='small'
                          onClick={() => handleOpenNotify(row)}
                        >
                          <Bell color='#ddb903' />
                        </IconButton>
                      )}
                    </TableCell>}


                  <TableCell>{page !== 1 ? (page - 1) * rowsPerPage + index + 1 : index + 1}</TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{formatDate(row.dateOfBirth)}</TableCell>
                  <TableCell>{GENDER[row.gender]}</TableCell>
                  <TableCell>{TEAM_CATEGORY[row.team]}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{STATUS_PROFILE[row.submitProfileStatus]}</TableCell>
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
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage={"Số hàng mỗi trang"}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trong ${count}`
          }
        />
      </Card>

      {openProfile?.isOpen &&
        <ProfileEmployeeDialog
          employeeId={openProfile?.employeeId}
          isOpenDialog={openProfile?.isOpen}
          handleCloseDialog={handleCloseProfile}
          isManage={isManage}
          isEnd={isEnd}
        />}
      {
        openRegisnationDialog &&
        <ResignationLetter
          employeeId={openRegisnationDialog?.employeeId}
          open={openRegisnationDialog?.isOpen}
          onClose={handleCloseRegisnationDialog}
          isManage
        />
      }

      {
        openManageEmployeeDialog &&
        <ManageEmployeeDialog
          open={openManageEmployeeDialog?.isOpen}
          onClose={handleCloseManageEmployeeDialog}
          employeeId={openManageEmployeeDialog?.employeeId} />
      }

      {openNotify && (
        <ShowDialog
          onConfirmDialogClose={handleCloseNotify}
          open={openNotify.isOpen}
          text={
            openNotify.employee?.submitProfileStatus.toString() === "4"
              ? openNotify.employee?.additionalRequest || "Không có"
              : openNotify.employee?.reasonForRejection || "Không có"
          }
          title={
            openNotify.employee?.submitProfileStatus.toString() === "4"
              ? "Nội dung yêu cầu bổ sung"
              : "Lý do từ chối"
          }
          cancel='Hủy'
        />
      )}
    </>
  );
}

import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tab, Tabs } from '@mui/material';
import React, { SyntheticEvent, useLayoutEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { selectEmployeeById } from '../../../redux/slices/employeesSlice';
import { getProcessesByEmployeeIdThunk } from '../../../redux/slices/processSlice';
import { getProposalsByEmployeeIdThunk } from '../../../redux/slices/proposalSlice';
import { getSalaryIncreasesByEmployeeIdThunk } from '../../../redux/slices/salaryIncreaseSlice';
import { RootState } from '../../../redux/store';
import { TabPanel } from '../../../styles/theme/components/TabPanel';
import { ACTION_EMPLOYEE, GENDER, TAB_PROMOTED, TAB_PROPOSAL, TAB_SARALY } from '../../../types/employee';
import { formatDate } from '../../../utils';
import ProfileEmployeeDialog from '../../employeeProfile/dialogs/ProfileEmployeeDialog';
import { ResignationLetter } from '../../pendingApproval/ResignationLetter';
import { ProcessTab } from '../tabs/ProcessTab';
import { ProposalTab } from '../tabs/ProposalTab';
import { SalaryTab } from '../tabs/SalaryTab';

interface Props {
  employeeId: number;
  open: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  isEnd?: boolean;
}

export const ManageEmployeeDialog: React.FC<Props> = ({ open, onClose, isAdmin, isEnd, employeeId }) => {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [openProfileDialog, setOpenProfileDialog] = useState<boolean>(false);
  const [openResignationLetter, setOpenResignationLetter] = useState<boolean>(false);
  const employee = useAppSelector((state: RootState) => selectEmployeeById(state, employeeId));

  useLayoutEffect(() => {
    dispatch(getSalaryIncreasesByEmployeeIdThunk(employeeId));
    dispatch(getProcessesByEmployeeIdThunk(employeeId));
    dispatch(getProposalsByEmployeeIdThunk(employeeId));
  }, [dispatch, employeeId])

  const handleChangeTab = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  }

  const handleOpenProfileDialog = () => {
    setOpenProfileDialog(true);
  }

  const handleCloseProfileDialog = () => {
    setOpenProfileDialog(false);
  }

  const handleOpenResignationLetter = () => {
    setOpenResignationLetter(true);
  }

  const handleCloseResignationLetter = () => {
    setOpenResignationLetter(false);
  }

  const handleSubmit = () => {
    // TODO: Implement submit logic
  }

  return (
    <>
      <Dialog
        onClose={onClose}
        open={open}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <DialogTitle>
          Cập nhật diễn biến
        </DialogTitle>

        <DialogContent dividers>
          <ValidatorForm onSubmit={handleSubmit}>
            <Grid container sx={{ marginBottom: '16px' }}>
              <Grid item xs={12} lg={12} md={12} sm={12}>
                <Grid container spacing={2}>
                  <Grid item xs className="flex flex-center" >
                    <Avatar
                      src={
                        employee?.image
                          ? employee?.image
                          : "/assets/avatar.png"
                      }
                      sx={{
                        width: '150px',
                        height: '150px',
                        marginX: 'auto',
                      }}
                    />
                  </Grid>
                  <Grid item xs >
                    <Box className="flex-grow-1 flex-column">
                      <TextValidator
                        fullWidth
                        label={<span>Mã nhân viên</span>}
                        value={employee?.code || ""}
                        variant="outlined"
                        name="code"
                        sx={{
                          marginBottom: '16px',
                          '& .MuiInputBase-root': {
                            pointerEvents: 'none',
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      />
                      <TextValidator
                        fullWidth
                        label={<span>Tên nhân viên</span>}
                        value={employee?.name || ""}
                        variant="outlined"
                        name="name"
                        sx={{
                          marginBottom: '16px',
                          '& .MuiInputBase-root': {
                            pointerEvents: 'none',
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs>
                    <Box className="flex-grow-1 flex-column">
                      <TextValidator
                        fullWidth
                        label={<span>Ngày sinh</span>}
                        value={employee?.dateOfBirth ? formatDate(employee?.dateOfBirth) : ""}
                        variant="outlined"
                        name="dateOfBirth"
                        sx={{
                          marginBottom: '16px',
                          '& .MuiInputBase-root': {
                            pointerEvents: 'none',
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      />
                      <TextValidator
                        fullWidth
                        label={<span>Giới tính</span>}
                        value={
                          employee?.gender ? Object.values(GENDER)[employee?.gender] : ''
                        }
                        variant="outlined"
                        name="gender"
                        sx={{
                          marginBottom: '16px',
                          '& .MuiInputBase-root': {
                            pointerEvents: 'none',
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs>
                    <Box className="flex-grow-1 flex-column">
                      <TextValidator
                        fullWidth
                        label={<span>Số điện thoại</span>}
                        value={employee?.phone || ""}
                        variant="outlined"
                        name="phone"
                        sx={{
                          marginBottom: '16px',
                          '& .MuiInputBase-root': {
                            pointerEvents: 'none',
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      />
                      <TextValidator
                        fullWidth
                        label={<span>Email</span>}
                        value={employee?.email || ""}
                        variant="outlined"
                        name="email"
                        sx={{
                          marginBottom: '16px',
                          '& .MuiInputBase-root': {
                            pointerEvents: 'none',
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </ValidatorForm>
          <div>
            <Tabs
              value={tab}
              onChange={handleChangeTab}
            >
              <Tab label="Tăng lương" />
              <Tab label="Thăng chức" />
              <Tab label="Đề xuất" />
            </Tabs>
            <TabPanel value={tab} index={TAB_SARALY}>
              <SalaryTab
                employeeId={employeeId}
                isAdmin={isAdmin}
                isEnd={isEnd}
              />
            </TabPanel>
            <TabPanel value={tab} index={TAB_PROMOTED}>
              <ProcessTab
                employeeId={employeeId}
                isAdmin={isAdmin}
                isEnd={isEnd}
              />
            </TabPanel>
            <TabPanel value={tab} index={TAB_PROPOSAL}>
              <ProposalTab
                employeeId={employeeId}
                isAdmin={isAdmin}
                isEnd={isEnd}
              />
            </TabPanel>
          </div>
        </DialogContent>

        <DialogActions>
          <div className="text-center space-x-2 flex justify-center w-full">
            <Button
              variant="contained"
              color="primary"
              type="button"
              className="mr-12"
              onClick={handleOpenProfileDialog}
            >
              Xem hồ sơ
            </Button>

            {!isEnd && ACTION_EMPLOYEE.EDIT.includes(employee?.submitProfileStatus.toString() ?? '') && (
              <Button
                variant="contained"
                color="primary"
                className="mr-12"
                onClick={handleOpenResignationLetter}
              >
                Kết thúc
              </Button>
            )}

            <Button
              variant="contained"
              color="error"
              type="button"
              onClick={onClose}
            >
              Hủy
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      <ResignationLetter
        open={openResignationLetter}
        onClose={handleCloseResignationLetter}
        employeeId={employeeId}
        isEnd
      />

      <ProfileEmployeeDialog
        isOpenDialog={openProfileDialog}
        isEnd={isEnd}
        handleCloseDialog={handleCloseProfileDialog}
        employeeId={employeeId}
      />
    </>
  )
}

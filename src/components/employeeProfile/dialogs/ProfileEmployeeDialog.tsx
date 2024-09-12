import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material';
import React, { SyntheticEvent, useLayoutEffect, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getCertificatesByEmployeeThunk } from '../../../redux/slices/certificateSlice';
import { selectEmployeeById } from '../../../redux/slices/employeesSlice';
import { getExperiencesByEmployeeThunk } from '../../../redux/slices/experienceSlice';
import { getFamiliesByEmployeeThunk } from '../../../redux/slices/familySlice';
import { RootState } from '../../../redux/store';
import { TabPanel } from '../../../styles/theme/components/TabPanel';
import { ACTION_EMPLOYEE, STATUS_EMPLOYEE, TAB_PROFILE_CERTIFICATE, TAB_PROFILE_CV, TAB_PROFILE_INFORMATION } from '../../../types/employee';
import { CertificateProfileTab } from '../tabs/CertificateProfileTab';
import CvTab from '../tabs/CvTab';
import { ProfileTab } from '../tabs/ProfileTab';
import { SubmitLeaderDialog } from './SubmitLeaderDialog';

interface Props {
  employeeId: number;
  isOpenDialog: boolean;
  handleCloseDialog: () => void;
  isManage?: boolean;
  isEnd?: boolean
}

const ProfileEmployeeDialog: React.FC<Props> = ({ employeeId, isOpenDialog, handleCloseDialog, isManage, isEnd }) => {
  const [tab, setTab] = useState(0);
  const dispatch = useAppDispatch();
  const employee = useAppSelector((state: RootState) => selectEmployeeById(state, employeeId))
  const { isMobile } = useAppContext();
  const [isSubmitLeader, setIsSubmitLeader] = useState(false);

  useLayoutEffect(() => {
    dispatch(getFamiliesByEmployeeThunk(employeeId))
    dispatch(getCertificatesByEmployeeThunk(employeeId))
    dispatch(getExperiencesByEmployeeThunk(employeeId))
  }, [dispatch, employeeId])

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  }

  const handleOpenSubmitLeader = () => {
    setIsSubmitLeader(true)
  }

  const handleCloseSubmitLeader = () => {
    setIsSubmitLeader(false)
  }

  return (
    <>
      <Dialog
        maxWidth={"lg"}
        fullWidth={true}
        onClose={handleCloseDialog}
        open={isOpenDialog}
      >
        <DialogTitle>Hồ sơ nhân viên</DialogTitle>


        <DialogContent dividers>
          <div className={isMobile ? 'flex-col' : 'flex'}>
            <Tabs
              orientation={isMobile ? "horizontal" : "vertical"}
              value={tab}
              onChange={handleChangeTab}
              sx={{
                borderRight: isMobile ? 'none' : '1px solid #ddd',
                width: isMobile ? '100%' : 'auto',
                display: 'flex'
              }}
            >
              <Tab label="Hồ sơ ứng tuyển"
                sx={{
                  textAlign: 'left',
                  width: !isMobile ? '150px' : 'auto',
                }} />

              <Tab label="Sơ yếu lý lịch"
                sx={{
                  textAlign: 'left',
                  width: !isMobile ? '150px' : 'auto',
                  paddingX: isMobile ? '12px' : '0px',
                }} />

              <Tab label="Văn bằng"
                sx={{
                  textAlign: 'left',
                  width: !isMobile ? '150px' : 'auto',
                }} />

              {isEnd &&
                <Tab label="Đơn xin nghỉ việc"
                  sx={{
                    textAlign: 'left',
                    width: !isMobile ? '150px' : 'auto',
                  }} />}
            </Tabs>

            <div className='max-w-[1000px] min-h-[700px] flex-1'>
              <TabPanel value={tab} index={TAB_PROFILE_CV} >
                <CvTab
                  employeeId={employeeId}
                />
              </TabPanel>
              <TabPanel value={tab} index={TAB_PROFILE_INFORMATION} >
                <ProfileTab employeeId={employeeId} />
              </TabPanel>
              <TabPanel value={tab} index={TAB_PROFILE_CERTIFICATE} >
                <CertificateProfileTab employeeId={employeeId} />
              </TabPanel>
              {/* {isEnd &&
              <TabPanel value={tab} index={3} className="tabPanel">
                <ResignationLetter
                  t={t}
                  open={open}
                  handleClose={handleClose}
                  employee={employee}
                  isManage={isManage}
                  handleDialogEmployeeClose={handleDialogEmployeeClose}
                  isEnd={isEnd}
                />
              </TabPanel>
              } */}
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          {ACTION_EMPLOYEE.EDIT.includes(employee?.submitProfileStatus.toString() ?? '') &&
            STATUS_EMPLOYEE.ADD.includes(employee?.submitProfileStatus.toString() ?? '') && (
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  onClick={handleOpenSubmitLeader}
                >
                  Gửi lãnh đạo
                </Button>
              </div>
            )}
          {isManage &&
            (ACTION_EMPLOYEE.PENDING_END.includes(
              employee?.submitProfileStatus.toString() ?? ''
            ) ||
              STATUS_EMPLOYEE.APPROVED.includes(
                employee?.submitProfileStatus.toString() ?? ''
              )) && (
              <Button
                variant="contained"
                color="primary"
                type="button"
              >
                Lịch sử cập nhật
              </Button>
            )}
          {isManage &&
            ACTION_EMPLOYEE.PENDING.includes(employee?.submitProfileStatus.toString() ?? '') && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Phê duyệt
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Yêu cầu bổ sung
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Từ chối
                </Button>
              </>
            )}
          <Button
            variant="contained"
            color="secondary"
            type="button"
            onClick={handleCloseDialog}
          >
            Hủy
          </Button>
        </DialogActions>
      </Dialog>

      <SubmitLeaderDialog
        employeeId={employeeId}
        onClose={handleCloseSubmitLeader}
        open={isSubmitLeader}
      />
    </>
  )
}

export default ProfileEmployeeDialog
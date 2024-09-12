/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tab, Tabs, Tooltip } from '@mui/material';
import { PencilSimple, Plus } from '@phosphor-icons/react';
import React, { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getCertificatesByEmployeeThunk } from '../../../redux/slices/certificateSlice';
import { selectEmployeeById } from '../../../redux/slices/employeesSlice';
import { getFamiliesByEmployeeThunk } from '../../../redux/slices/familySlice';
import { RootState } from '../../../redux/store';
import { TabPanel } from '../../../styles/theme/components/TabPanel';
import { Employee, TAB_CERTIFICATE, TAB_EMPLOYEE, TAB_FAMILY } from '../../../types/employee';
import CertificateTab from '../tabs/CertificateTab';
import EmployeeTab from '../tabs/EmployeeTab';
import FamilyTab from '../tabs/FamilyTab';
import ProfileEmployeeDialog from '../../employeeProfile/dialogs/ProfileEmployeeDialog';

interface Props {
  employeeId?: number;
  type: 'ADD' | 'UPDATE';
}

const EmployeeDialog: React.FC<Props> = ({ employeeId, type }) => {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [isOpenDialog, setOpenDialog] = useState<boolean>(false);
  const employeeFormRef = useRef<any>(null);
  const { showMessage } = useAppContext();
  const [showProfile, setShowProfile] = useState(false)
  const employeeSelected = useAppSelector((state: RootState) =>
    isOpenDialog && employeeId && type === 'UPDATE' ?
      selectEmployeeById(state, employeeId) : undefined
  )
  const [employee, setEmployee] = useState<Employee>();

  useEffect(() => {
    if (employeeId && isOpenDialog) {
      dispatch(getCertificatesByEmployeeThunk(employeeId));
      dispatch(getFamiliesByEmployeeThunk(employeeId))
    }
  }, [isOpenDialog])

  useEffect(() => {
    if (employeeSelected) {
      setEmployee(employeeSelected)
    }
  }, [employeeSelected])

  const handleChangeInput = (partialEmployee: Partial<Employee>) => {
    setEmployee((prev: Employee | undefined) => ({
      ...prev,
      ...partialEmployee,
    } as Employee));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEmployee(undefined)
    setTab(0);
  };

  const handleCancel = () => {
    setOpenDialog(false)
    setEmployee(undefined)
    setTab(0);
  }
  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    if (newValue !== TAB_EMPLOYEE) {
      if (employee?.id) {
        setTab(newValue);
      } else {
        showMessage({
          message: "Vui lòng điền đầy đủ thông tin nhân viên",
          severity: "error"
        });
      }
    } else {
      setTab(TAB_EMPLOYEE);
    }
  }

  const handleSubmit = () => {
    if (tab === TAB_EMPLOYEE) {
      employeeFormRef.current?.submit();
    } else {
      handleCancel();
    }
  };

  const handleRegister = () => {
    if (tab === TAB_EMPLOYEE) {
      employeeFormRef.current?.submit();
    }
    setShowProfile(true);
  };

  const button = useMemo(() => {
    switch (type) {
      case 'ADD':
        return (
          <Tooltip arrow={false} title="Thêm mới">
            <Button
              startIcon={<Plus />}
              variant="contained"
              onClick={() => setOpenDialog(true)}
            >
              Thêm mới
            </Button>
          </Tooltip>
        );
      case 'UPDATE':
        return (
          <Tooltip arrow={false} title="Cập nhật thông tin">
            <IconButton
              color="primary"
              onClick={() => setOpenDialog(true)}
              size="small"
            >
              <PencilSimple />
            </IconButton>
          </Tooltip>
        );
      default:
        return null;
    }
  }, [type]);

  return (
    <>
      {button}
      <Dialog
        maxWidth="lg"
        fullWidth
        open={isOpenDialog}
        onClose={handleCloseDialog}
      >
        <div>
          <DialogContent>
            <DialogTitle id="customized-dialog-title">
              {employee?.id ? "Cập nhật nhân viên" : " Thêm mới nhân viên"}
            </DialogTitle>
          </DialogContent>
        </div>

        <DialogContent dividers>
          <div>
            <AppBar position="static" color="default">
              <Tabs
                value={tab}
                onChange={handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Thông tin nhân viên" />
                <Tab
                  label="Thông tin văn bằng"
                />
                <Tab label="Thông tin gia đình" />
              </Tabs>
            </AppBar>
            <TabPanel value={tab} index={TAB_EMPLOYEE}>
              <EmployeeTab
                employeeData={employee}
                onChangeInput={handleChangeInput}
                ref={employeeFormRef}
              />
            </TabPanel>
            {
              employeeId &&
              (
                <>
                  <TabPanel value={tab} index={TAB_CERTIFICATE}>
                    <CertificateTab
                      employeeId={employeeId}
                    />
                  </TabPanel>
                  <TabPanel value={tab} index={TAB_FAMILY}>
                    <FamilyTab employeeId={employeeId} />
                  </TabPanel>
                </>
              )
            }
          </div>
        </DialogContent>

        <DialogActions sx={{
          display: 'flex',
          justifyContent: 'center',
          margin: '16px',
        }}>
          <div className='flex justify-center'>
            {employee?.id && (
              <Button
                variant="contained"
                color="primary"
                type="button"
                sx={{
                  marginRight: '10px'
                }}
                onClick={() => handleRegister()}
              >
                Đăng ký
              </Button>
            )}

            {tab === 0 && (
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    marginRight: '10px'
                  }}
                  onClick={() => handleSubmit()}
                >
                  Lưu
                </Button>
              </div>
            )}

            <Button
              variant="contained"
              color="error"
              type="button"
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      {showProfile && employeeId && (
        <ProfileEmployeeDialog
          employeeId={employeeId}
          isOpenDialog={showProfile}
          handleCloseDialog={handleCloseProfile}
        />
      )}
    </>
  );
};

export default EmployeeDialog;

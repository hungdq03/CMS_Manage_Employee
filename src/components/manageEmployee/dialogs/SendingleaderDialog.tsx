import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { ChangeEvent, useEffect, useLayoutEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useAppContext } from '../../../context/AppContext';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getAllLeadersThunk, selectLeadersState } from '../../../redux/slices/leaderSlice';
import { getProcessByIdThunk, updateProcessThunk } from '../../../redux/slices/processSlice';
import { getProposalByIdThunk, updateProposalThunk } from '../../../redux/slices/proposalSlice';
import { getSalaryIncreaseByIdThunk, updateSalaryThunk } from '../../../redux/slices/salaryIncreaseSlice';
import { RootState } from '../../../redux/store';
import { Employee, LEADER_POSITION } from '../../../types/employee';
import { Process } from '../../../types/process';
import { Proposal } from '../../../types/proposal';
import { SalaryIncrease } from '../../../types/salaryIncrease';
import { statusCode } from '../../../utils';
import { getEmployeeByIdThunk, updateEmployeeThunk } from '../../../redux/slices/employeesSlice';

interface Props {
  open: boolean;
  onClose: () => void;
  isEnd?: boolean;
  id: number;
  type: 'SALARY' | 'PROPOSAL' | 'PROCESS' | 'EMPLOYEE'
  content?: Employee;
}
export const SendingleaderDialog: React.FC<Props> = ({ open, onClose, isEnd, id, type, content }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const { leaders } = useAppSelector((state: RootState) => selectLeadersState(state))
  const [leaderId, setLeaderId] = useState<number>();
  const [leaderPositionValue, setLeaderPositionValue] = useState<string>("");

  useLayoutEffect(() => {
    dispatch(getAllLeadersThunk())
  }, [dispatch])

  useEffect(() => {
    const leader = leaders.data.find(leader => leader.id === leaderId);
    setLeaderPositionValue(leader ? Object.values(LEADER_POSITION)[leader.leaderPosition] : "");
  }, [leaders, leaderId]);

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setLeaderId(parseInt(event.target.value));
  }

  const handleSubmit = () => {
    switch (type) {
      case 'SALARY':
        dispatch(getSalaryIncreaseByIdThunk(id))
          .then(unwrapResult)
          .then((res) => {
            const data: SalaryIncrease = {
              ...res.data,
              leaderId: leaderId,
              salaryIncreaseStatus: 2
            }

            dispatch(updateSalaryThunk(data))
              .then(unwrapResult)
              .then((res) => {
                if (res.code === statusCode.SUCCESS) {
                  showMessage({
                    message: 'Gửi lãnh đạo thành công',
                    severity: "success",
                  })
                } else {
                  showMessage({
                    message: res.message || 'Đã xảy ra lỗi trong quá trình thực hiện',
                    severity: "error",
                  })
                }
              })
          })
        break;
      case 'PROPOSAL':
        dispatch(getProposalByIdThunk(id))
          .then(unwrapResult)
          .then((res) => {
            const data: Proposal = {
              ...res.data,
              leaderId: leaderId,
              proposalStatus: 2
            }

            dispatch(updateProposalThunk(data))
              .then(unwrapResult)
              .then((res) => {
                if (res.code === statusCode.SUCCESS) {
                  showMessage({
                    message: 'Gửi lãnh đạo thành công',
                    severity: "success",
                  })
                } else {
                  showMessage({
                    message: res.message || 'Đã xảy ra lỗi trong quá trình thực hiện',
                    severity: "error",
                  })
                }
              })
          })
        break;
      case 'PROCESS':
        dispatch(getProcessByIdThunk(id))
          .then(unwrapResult)
          .then((res) => {
            const data: Process = {
              ...res.data,
              leaderId: leaderId,
              processStatus: 2
            }

            dispatch(updateProcessThunk(data))
              .then(unwrapResult)
              .then((res) => {
                if (res.code === statusCode.SUCCESS) {
                  showMessage({
                    message: 'Gửi lãnh đạo thành công',
                    severity: "success",
                  })
                } else {
                  showMessage({
                    message: res.message || 'Đã xảy ra lỗi trong quá trình thực hiện',
                    severity: "error",
                  })
                }
              })
          })
        break;
      case 'EMPLOYEE':
        dispatch(getEmployeeByIdThunk(id))
          .then(unwrapResult)
          .then((res) => {
            const data: Employee = {
              ...res.data,
              ...content,
              leaderId: leaderId,
              submitProfileStatus: 6
            }

            dispatch(updateEmployeeThunk(data))
              .then(unwrapResult)
              .then((res) => {
                if (res.code === statusCode.SUCCESS) {
                  showMessage({
                    message: 'Gửi lãnh đạo thành công',
                    severity: "success",
                  })
                } else {
                  showMessage({
                    message: res.message || 'Đã xảy ra lỗi trong quá trình thực hiện',
                    severity: "error",
                  })
                }
              })
          })
        break;
      default:
        break;
    }
    onClose();
  }

  return (
    <Dialog
      maxWidth={"sm"}
      fullWidth={true}
      onClose={onClose}
      open={open}
    >
      <DialogTitle>
        {isEnd ? "Kết thúc hồ sơ" : "Trình lãnh đạo"}
      </DialogTitle>
      <ValidatorForm onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Tên lãnh đạo
                  </span>
                }
                select
                value={leaderId || ""}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100 pr-12"
                name="leaderId"
                validators={["required"]}
                errorMessages="Hãy nhập trường thông tin này"
              >
                {leaders.data?.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item?.id}>
                      {item.leaderName}
                    </MenuItem>
                  );
                })}
              </TextValidator>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500 ">*</span>
                    Chức vụ
                  </span>
                }
                value={leaderPositionValue ?? ''}
                variant="outlined"
                name="leaderPosition"
                className="w-100"
                validators={["required"]}
                errorMessages="Hãy nhập trường thông tin này"
                sx={{
                  marginBottom: '16px',
                  '& .MuiInputBase-root': {
                    pointerEvents: 'none',
                    backgroundColor: '#f5f5f5',
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
            Gửi lãnh đạo
          </Button>
          <Button
            variant="contained"
            color="error"
            type="button"
            onClick={onClose}
          >
            Hủy
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField } from '@mui/material';
import moment from 'moment';
import React, { ChangeEvent, useEffect, useLayoutEffect, useState } from 'react';
import { SelectValidator, TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { selectEmployeeById, updateEmployeeThunk } from '../../../redux/slices/employeesSlice';
import { getAllLeadersThunk, selectLeadersState } from '../../../redux/slices/leaderSlice';
import { RootState } from '../../../redux/store';
import { Employee, LEADER_POSITION } from '../../../types/employee';
import { convertTimeToDate, statusCode } from '../../../utils';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppContext } from '../../../context/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
  employeeId: number;
}

export const SubmitLeaderDialog: React.FC<Props> = ({ open, onClose, employeeId }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const { leaders } = useAppSelector((state: RootState) => selectLeadersState(state))
  const employee = useAppSelector((state: RootState) => selectEmployeeById(state, employeeId))
  const [submitLeader, setSubmitLeader] = useState<Employee>()
  const [leaderPositionValue, setLeaderPositionValue] = useState<string>("");

  useEffect(() => {
    const leader = leaders.data.find(leader => leader.id === submitLeader?.leaderId);
    setLeaderPositionValue(leader ? Object.values(LEADER_POSITION)[leader.leaderPosition] : "");
  }, [submitLeader, leaders]);

  useLayoutEffect(() => {
    dispatch(getAllLeadersThunk())
  }, [dispatch])

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSubmitLeader((prev: Employee | undefined) => (
      {
        ...prev,
        [e.target.name]: e.target.value
      } as Employee
    ));
  };

  const handleSubmit = async () => {
    if (employee?.id === undefined) {
      return;
    }

    const data = {
      ...employee,
      ...submitLeader,
      submitProfileStatus: 2,
    };
    const resultAction = await dispatch(updateEmployeeThunk(data));
    const response = unwrapResult(resultAction)
    if (response.code === statusCode.SUCCESS) {
      showMessage({
        message: 'Cập nhật thông tin trình lãnh đạo thành công.',
        severity: 'success',
      });
    } else {
      showMessage({
        message: response.message || 'Cập nhật thông tin trình lãnh đạo thất bại.',
        severity: 'error',
      });
    }
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth={"md"}
      fullWidth={true}
    >
      <DialogTitle>
        Trình lãnh đạo
      </DialogTitle>
      <ValidatorForm onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Ngày trình
                  </span>
                }
                type="date"
                value={typeof submitLeader?.submitDay === "string"
                  ? submitLeader?.submitDay
                  : convertTimeToDate(submitLeader?.submitDay) || ""}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100"
                InputLabelProps={{
                  shrink: true,
                }}
                name="submitDay"
                validators={["required"]}
                errorMessages="Hãy nhập thông tin trường này"
                inputProps={{
                  min: moment().format("YYYY-MM-DD")
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <SelectValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Tên lãnh đạo
                  </span>
                }
                select
                value={submitLeader?.leaderId || ""}
                variant="outlined"
                inputProps={{
                  readOnly: submitLeader?.leaderId && submitLeader?.submitProfileStatus === 4
                }}
                onChange={handleChangeInput}
                className="w-100"
                name="leaderId"
                validators={["required"]}
                errorMessages="Hãy nhập thông tin trường này"
              >
                {leaders.data?.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item?.id}>
                      {item.leaderName}
                    </MenuItem>
                  );
                })}
              </SelectValidator>
            </Grid>

            <Grid item xs={4}>
              <TextValidator
                fullWidth
                name="leaderPosition"
                label={
                  <span>
                    Chức vụ
                  </span>
                }
                value={leaderPositionValue}
                variant="outlined"
                onChange={handleChangeInput}
                inputProps={{
                  readOnly: true
                }}
                className="w-100"
                validators={["required"]}
                errorMessages="Hãy nhập thông tin trường này"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Nội dung
                  </span>
                }
                value={submitLeader?.submitContent || ""}
                placeholder="Nhập nội dung"
                multiline
                rows={4}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100"
                InputLabelProps={{
                  shrink: true,
                }}
                name="submitContent"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="primary" type="submit">
            Lưu
          </Button>
          <Button
            variant="contained"
            color="secondary"
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

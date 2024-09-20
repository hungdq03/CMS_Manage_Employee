import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import moment from 'moment';
import React, { ChangeEvent, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { useAppContext } from '../../context/AppContext';
import { selectEmployeeById, updateEmployeeThunk } from '../../redux/slices/employeesSlice';
import { RootState } from '../../redux/store';
import { unwrapResult } from '@reduxjs/toolkit';
import { statusCode } from '../../utils';

interface Props {
  open: boolean;
  onClose: () => void;
  employeeId: number;
}

export const EndEmployeeDialog: React.FC<Props> = ({ open, onClose, employeeId }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const employee = useAppSelector((state: RootState) => selectEmployeeById(state, employeeId));

  const formatEndCode = `NL${moment().format("MM")}${moment().format("YY")}/`;
  const [numberSaved, setNumberSaved] = useState<string>("");

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.startsWith(formatEndCode)) {
      setNumberSaved(value);
    }
  };


  const handleSubmit = () => {
    if (employee) {
      dispatch(
        updateEmployeeThunk({
          ...employee,
          decisionDay: new Date().toISOString().split("T")[0],
          numberSaved,
          submitProfileStatus: 0,
        })
      ).then(unwrapResult)
        .then(res => {
          if (res.code === statusCode.SUCCESS) {
            showMessage({
              message: 'Nộp lưu hồ sơ thành công',
              severity: 'success',
            })
          } else {
            showMessage({
              message: res.message ?? 'Nộp lưu hồ sơ thất bại',
              severity: 'error',
            })
          }
        })
    }

    setNumberSaved("");
    onClose();
  }
  return (
    <Dialog
      maxWidth={"sm"}
      fullWidth={true}
      onClose={onClose}
      open={open}
    >
      <DialogTitle >
        Nộp lưu hồ sơ
      </DialogTitle>
      <ValidatorForm onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    Ngày nộp lưu
                  </span>
                }
                disabled
                type="date"
                value={new Date().toISOString().split("T")[0]}
                variant="outlined"
                name="decisionDay"
                className="w-100 pr-12"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-error">*</span>
                    Mã nộp lưu
                  </span>
                }
                value={numberSaved || formatEndCode}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100"
                name="numberSaved"
                validators={["required", `matchRegexp:^${formatEndCode}\\d{3}$`]}
                errorMessages={[
                  "Hãy nhập trường thông tin này",
                  "Mã nộp lưu phải có dạng " + formatEndCode + "3 số bất kỳ",
                ]}
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

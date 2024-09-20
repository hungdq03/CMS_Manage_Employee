import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import moment from 'moment'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { Employee } from '../../../types/employee'
import { convertDateStringtoTime, statusCode } from '../../../utils'
import { selectEmployeeById, updateEmployeeThunk } from '../../../redux/slices/employeesSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { useAppContext } from '../../../context/AppContext'
import { RootState } from '../../../redux/store'

interface Props {
  open: boolean,
  onClose: () => void,
  isRegister?: boolean,
  isSalary?: boolean,
  isProposal?: boolean,
  isPromote?: boolean,
  isEnd?: boolean,
  employeeId: number,
}

export const ReasonRefusalDialog: React.FC<Props> = ({ open, onClose, isRegister, isSalary, isProposal, isPromote, isEnd, employeeId }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const employeeSelected = useAppSelector((state: RootState) => selectEmployeeById(state, employeeId))
  const [employee, setEmployee] = useState<Employee>();

  useEffect(() => {
    setEmployee(employeeSelected)
  }, [employeeSelected])

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const formatValue = type === 'date' ? convertDateStringtoTime(value) : value

    setEmployee((prev: Employee | undefined) => (
      {
        ...prev,
        [name]: formatValue
      }
    ) as Employee)
  }

  const handleSubmit = () => {
    if (employee) {
      const data: Employee = {
        ...employee,
        submitProfileStatus: isRegister
          ? 5
          : isEnd
            ? 9
            : isSalary || isProposal || isPromote
              ? 5 : 0
      };

      dispatch(updateEmployeeThunk(data)).then(unwrapResult)
        .then((res) => {
          if (res.code === statusCode.SUCCESS) {
            showMessage({
              message: `Cập nhật thông tin thành công`,
              severity: 'success'
            })
            onClose()
          } else {
            showMessage({
              message: res.message ?? `Cập nhật thông tin thất bại`,
              severity: 'error'
            })
          }
        })
    }
  };

  return (
    <Dialog
      maxWidth={"sm"}
      fullWidth={true}
      onClose={onClose}
      open={open}
    >
      <DialogTitle>
        Từ chối
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
                    Ngày từ chối
                  </span>
                }
                type="date"
                value={
                  isRegister
                    ? employee?.rejectionDate
                    : isEnd
                      ? employee?.refuseEndProfileDay
                      : isSalary
                        ? employee?.rejectionDate
                        : isProposal
                          ? employee?.rejectionDate
                          : isPromote
                            ? employee?.rejectionDate
                            : ""
                }
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100 pr-12"
                InputLabelProps={{
                  shrink: true,
                }}
                name={
                  isRegister
                    ? "rejectionDate"
                    : isEnd
                      ? "refuseEndProfileDay"
                      : isSalary
                        ? "rejectionDate"
                        : isProposal
                          ? "rejectionDate"
                          : isPromote
                            ? "rejectionDate"
                            : ""
                }
                validators={["required"]}
                errorMessages="Hãy nhập thông tin trường này"
                inputProps={{
                  min: moment().format("YYYY-MM-DD"),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Nội dung từ chối
                  </span>
                }
                value={
                  isRegister
                    ? employee?.refuseEndProfileDay
                    : isEnd
                      ? employee?.reasonForRefuseEndProfile
                      : isSalary
                        ? employee?.reasonForRefuseEndProfile
                        : isProposal
                          ? employee?.reasonForRefuseEndProfile
                          : isPromote
                            ? employee?.reasonForRefuseEndProfile
                            : ""
                }
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100"
                rows={2}
                rowsMax={10}
                name={
                  isRegister
                    ? "refuseEndProfileDay"
                    : isEnd
                      ? "reasonForRefuseEndProfile"
                      : isSalary
                        ? "reasonForRefuseEndProfile"
                        : isProposal
                          ? "reasonForRefuseEndProfile"
                          : isPromote
                            ? "reasonForRefuseEndProfile"
                            : ""
                }
                validators={["required"]}
                errorMessages="Hãy nhập thông tin trường này"
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

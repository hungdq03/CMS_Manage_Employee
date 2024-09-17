import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import moment from 'moment'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { RootState } from '../../../redux/store'
import { selectEmployeeById, updateEmployeeThunk } from '../../../redux/slices/employeesSlice'
import { convertDateStringtoTime, statusCode } from '../../../utils'
import { Employee } from '../../../types/employee'
import { useAppContext } from '../../../context/AppContext'
import { unwrapResult } from '@reduxjs/toolkit';


interface Props {
  open: boolean,
  onClose: () => void,
  isRegister?: boolean,
  isSalary?: boolean,
  isProposal?: boolean,
  isPromote?: boolean,
  employeeId: number,
}

export const ApprovalDialog: React.FC<Props> = ({ open, onClose, employeeId, isRegister, isPromote, isProposal, isSalary }) => {
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
        submitProfileStatus: 3
      }

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
        Phê duyệt
      </DialogTitle>
      <ValidatorForm onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container>
            <Grid item xs={12}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Ngày duyệt
                  </span>
                }
                type="date"
                value={new Date().toISOString().split("T")[0] || ""}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100"
                InputLabelProps={{
                  shrink: true,
                }}
                name={
                  isRegister
                    ? "appointmentDate"
                    : isSalary
                      ? "acceptanceDate"
                      : isProposal
                        ? "acceptanceDate"
                        : isPromote
                          ? "acceptanceDate"
                          : ""
                }
                validators={["required"]}
                errorMessages="Hãy nhập thông tin trường này"
                inputProps={{
                  min: moment().format("YYYY-MM-DD"),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="primary" type="submit">
            Duyệt
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

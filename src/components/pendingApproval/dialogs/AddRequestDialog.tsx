import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import { unwrapResult } from '@reduxjs/toolkit'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { useAppContext } from '../../../context/AppContext'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { selectEmployeeById, updateEmployeeThunk } from '../../../redux/slices/employeesSlice'
import { RootState } from '../../../redux/store'
import { Employee } from '../../../types/employee'
import { convertDateStringtoTime, statusCode } from '../../../utils'

interface Props {
  employeeId: number;
  open: boolean,
  onClose: () => void,
  isRegister?: boolean,
  isEnd?: boolean,
  isSalary?: boolean,
  isProposal?: boolean,
  isPromote?: boolean,
}

export const AddRequestDialog: React.FC<Props> = ({ employeeId, open, onClose, isRegister, isEnd, isSalary, isProposal, isPromote }) => {
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
          ? 3
          : isEnd
            ? 8
            : isSalary || isProposal
              ? 4
              : isPromote
                ? 4
                : 0
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
      <DialogTitle >
        Yêu cầu bổ sung
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
                    Nội dung yêu cầu bổ sung
                  </span>
                }
                value={
                  isRegister
                    ? employee?.additionalRequest
                    : isEnd
                      ? employee?.additionalRequestTermination
                      : isSalary
                        ? employee?.additionalRequestSalary
                        : isProposal
                          ? employee?.additionalRequestProposal
                          : isPromote
                            ? employee?.additionalRequestProcess
                            : ""
                }
                variant="outlined"
                multiline
                rows={2}
                maxRows={10}
                onChange={handleChangeInput}
                className="w-100"
                validators={["required"]}
                errorMessages="Hãy nhập thông tin trường này"
                name={
                  isRegister
                    ? "additionalRequest"
                    : isEnd
                      ? "additionalRequestTermination"
                      : isSalary
                        ? "additionalRequestSalary"
                        : isProposal
                          ? "additionalRequestProposal"
                          : isPromote
                            ? "additionalRequestProcess"
                            : ""
                }
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

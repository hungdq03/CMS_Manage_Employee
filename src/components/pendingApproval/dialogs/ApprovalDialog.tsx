/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { selectSalaryIncreaseById, updateSalaryThunk } from '../../../redux/slices/salaryIncreaseSlice'
import { selectProposalById, updateProposalThunk } from '../../../redux/slices/proposalSlice'
import { selectProcessById, updateProcessThunk } from '../../../redux/slices/processSlice'
import { SalaryIncrease } from '../../../types/salaryIncrease'
import { Proposal } from '../../../types/proposal'
import { Process } from '../../../types/process'


interface Props {
  open: boolean,
  onClose: () => void,
  isRegister?: boolean,
  salaryId?: number,
  proposalId?: number,
  processId?: number,
  employeeId?: number,
}

type ApprovalObjectType = Employee | SalaryIncrease | Proposal | Process | undefined;

export const ApprovalDialog: React.FC<Props> = ({ open, onClose, employeeId, isRegister, processId, proposalId, salaryId }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();

  let selectorFn: ((state: RootState) => ApprovalObjectType) | undefined;

  if (employeeId) {
    selectorFn = (state: RootState) => selectEmployeeById(state, employeeId);
  } else if (salaryId) {
    selectorFn = (state: RootState) => selectSalaryIncreaseById(state, salaryId);
  } else if (proposalId) {
    selectorFn = (state: RootState) => selectProposalById(state, proposalId);
  } else if (processId) {
    selectorFn = (state: RootState) => selectProcessById(state, processId);
  }

  const approvalObject: ApprovalObjectType = useAppSelector(selectorFn ?? (() => undefined));

  const [approvalState, setApprovalState] = useState<ApprovalObjectType>();

  useEffect(() => {
    setApprovalState(approvalObject)
  }, [approvalObject])

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const formatValue = type === 'date' ? convertDateStringtoTime(value) : value

    setApprovalState((prev: ApprovalObjectType) => (
      {
        ...prev,
        [name]: formatValue
      }
    ) as ApprovalObjectType)
  }

  const handleSubmit = () => {
    if (approvalObject) {
      let data: any;
      let updateThunk: any;

      if (employeeId) {
        data = {
          ...approvalState,
          submitProfileStatus: 3
        };
        updateThunk = updateEmployeeThunk;
      } else if (salaryId) {
        data = {
          ...approvalState,
          salaryIncreaseStatus: 3,
        };
        updateThunk = updateSalaryThunk;
      } else if (proposalId) {
        data = {
          ...approvalState,
          proposalStatus: 3,
        };
        updateThunk = updateProposalThunk;
      } else if (processId) {
        data = {
          ...approvalState,
          processStatus: 3,
        };
        updateThunk = updateProcessThunk;
      }

      if (updateThunk) {
        dispatch(updateThunk(data))
          .then(unwrapResult)
          .then((res: { code: number; message: string }) => {
            if (res.code === statusCode.SUCCESS) {
              showMessage({
                message: `Cập nhật thông tin thành công`,
                severity: 'success',
              });
              onClose();
            } else {
              showMessage({
                message: res.message ?? `Cập nhật thông tin thất bại`,
                severity: 'error',
              });
            }
          })
          .catch((error: { message: string }) => {
            showMessage({
              message: `Cập nhật thông tin thất bại: ${error.message}`,
              severity: 'error',
            });
          });
      }
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
                    : salaryId
                      ? "acceptanceDate"
                      : proposalId
                        ? "acceptanceDate"
                        : processId
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

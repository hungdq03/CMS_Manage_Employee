import { Button, Grid, MenuItem } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import moment from 'moment';
import React, { ChangeEvent, MouseEvent, useLayoutEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useAppContext } from '../../../context/AppContext';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { selectEmployeeById } from '../../../redux/slices/employeesSlice';
import { createProcessThunk, selectProcessesState, updateProcessThunk } from '../../../redux/slices/processSlice';
import { RootState } from '../../../redux/store';
import { POSITIONS } from '../../../types/employee';
import { Process } from '../../../types/process';
import { convertDateStringtoTime, statusCode } from '../../../utils';
import { ProcessTable } from '../tables/ProcessTable';
import { ProcessLetter } from '../ProcessLetter';

interface Props {
  employeeId: number;
  isAdmin?: boolean;
  isEnd?: boolean;
}

export const ProcessTab: React.FC<Props> = ({ employeeId, isAdmin, isEnd }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const [process, setProcess] = useState<Process>();
  const employee = useAppSelector((state: RootState) => selectEmployeeById(state, employeeId))
  const { processes } = useAppSelector(selectProcessesState)
  const [processesByPage, setProcessesByPage] = useState<Process[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 3,
    keyword: '',
  });
  const [openProcessLetter, setOpenProcessLetter] = useState<{
    processId: number | undefined;
    isOpen: boolean;
  }>({
    processId: undefined,
    isOpen: false,
  })

  useLayoutEffect(() => {
    const startOfPage = (pagination.pageIndex - 1) * pagination.pageSize;
    const endOfPage = pagination.pageIndex * pagination.pageSize;
    setProcessesByPage(processes.data?.slice(startOfPage, endOfPage));
  }, [pagination.pageIndex, pagination.pageSize, processes.data])

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPagination((prev) => {
      return {
        ...prev,
        pageSize: +event.target.value,
        pageIndex: 1,
      };
    })
  };

  const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPagination((prev) => {
      return {
        ...prev,
        pageIndex: newPage + 1,
      };
    })
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const formatValue = type === 'date' ? convertDateStringtoTime(value) : value

    setProcess((prev: Process | undefined) => (
      {
        ...prev,
        [name]: formatValue
      }
    ) as Process)
  }

  const handleSubmit = () => {
    if (process?.id) {
      dispatch(updateProcessThunk(process))
        .then(unwrapResult)
        .then((res) => {
          if (res.code === statusCode.SUCCESS) {
            setProcess(undefined);
            handleOpenProcessLetter(res.data.id)
            showMessage({
              message: 'Cập nhật thông tin thăng chức thành công.',
              severity: 'success',
            });
          } else {
            showMessage({
              message: res.message || 'Cập nhật thông tin thăng chức thất bại.',
              severity: 'error'
            });
          }
        });
    } else if (process) {
      dispatch(createProcessThunk({
        employeeId: employeeId, data: [{
          ...process,
          currentPosition: employee?.currentPosition
        }]
      }))
        .then(unwrapResult)
        .then((res) => {
          if (res.code === statusCode.SUCCESS) {
            setProcess(undefined);
            handleOpenProcessLetter(res.data[0].id)
            showMessage({
              message: 'Thêm mới thông tin thăng chức thành công.',
              severity: 'success',
            });
          } else {
            showMessage({
              message: res.message || 'Thêm mới thông tin thăng chức thất bại.',
              severity: 'error'
            });
          }
        });
    }
  }
  const handleCancel = () => {
    setProcess(undefined)
  }

  const handleOpenProcessLetter = (processId: number) => {
    setOpenProcessLetter({
      processId,
      isOpen: true,
    })
  }

  const handleCloseProcessLetter = () => {
    setOpenProcessLetter({
      processId: undefined,
      isOpen: false,
    })
  }

  return (
    <>
      {!isAdmin && (
        <ValidatorForm onSubmit={handleSubmit}>
          <Grid container spacing={2} xs={12}>
            <Grid item xs={4}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Ngày thăng chức
                  </span>
                }
                type="date"
                value={
                  process?.promotionDay
                    ? moment(process?.promotionDay).format("YYYY-MM-DD")
                    : ""
                }
                disabled={isEnd}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100"
                InputLabelProps={{
                  shrink: true,
                }}
                name="promotionDay"
                validators={["required"]}
                errorMessages="Hãy nhập trường thông tin này"
                InputProps={{
                  inputProps: {
                    min: moment().format("YYYY-MM-DD"),
                  },
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Vị trí hiện tại
                  </span>
                }
                value={
                  employee?.currentPosition ? Object.values(POSITIONS)[employee?.currentPosition] : ''
                }
                variant="outlined"
                disabled
                className="w-100 "
                name="currentPosition"
              />
            </Grid>
            <Grid item xs={4}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Vị trí mới
                  </span>
                }
                value={process?.newPosition || ""}
                disabled={isEnd}
                variant="outlined"
                select
                onChange={handleChangeInput}
                className="w-100 "
                name="newPosition"
                validators={["required"]}
                errorMessages="Hãy nhập trường thông tin này"
              >
                {Object.entries(POSITIONS)?.map(([key, value]) => {
                  return (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  );
                })}
              </TextValidator>
            </Grid>

            <Grid item xs={12}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Ghi chú
                  </span>
                }
                value={process?.note || ""}
                disabled={isEnd}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100 "
                name="note"
                validators={["required"]}
                errorMessages="Hãy nhập trường thông tin này"
                rows={2}
                rowsMax={10}
              />
            </Grid>
            <Grid item xs={12}>
              <div className='w-full flex justify-center items-center space-x-2'>
                <Button
                  variant="contained"
                  color="primary"
                  className="mr-10"
                  type="submit"
                  disabled={isEnd}
                >
                  Lưu
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  type="button"
                  disabled={isEnd}
                  onClick={() => handleCancel()}
                >
                  Hủy
                </Button>
              </div>
            </Grid>
          </Grid>
        </ValidatorForm>
      )}
      <div className="pt-20">
        <ProcessTable
          employeeId={employeeId}
          rows={processesByPage}
          count={processes.data?.length}
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          setProcessSelected={setProcess} />
      </div>
      {openProcessLetter && openProcessLetter.processId &&
        <ProcessLetter
          employeeId={employeeId}
          processId={openProcessLetter?.processId}
          open={openProcessLetter?.isOpen}
          onClose={handleCloseProcessLetter}
        />}
    </>
  )
}

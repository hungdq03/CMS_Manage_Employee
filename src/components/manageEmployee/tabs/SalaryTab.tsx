import { Button, Grid } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import moment from 'moment';
import React, { ChangeEvent, MouseEvent, useLayoutEffect, useMemo, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useSelector } from 'react-redux';
import { useAppContext } from '../../../context/AppContext';
import { useAppDispatch } from '../../../redux/hook';
import { createSalaryThunk, selectSalaryIncreasesState, updateSalaryThunk } from '../../../redux/slices/salaryIncreaseSlice';
import { SalaryIncrease } from '../../../types/salaryIncrease';
import { convertDateStringtoTime, statusCode } from '../../../utils';
import { SalaryTable } from '../tables/SalaryTable';
import { SalaryLetter } from '../SalaryLetter';

interface Props {
  employeeId: number;
  isManage?: boolean;
  isEnd?: boolean;
}

export const SalaryTab: React.FC<Props> = ({ employeeId, isManage, isEnd }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const [salary, setSalary] = useState<SalaryIncrease>();
  const [salariesByPage, setSalariesByPage] = useState<SalaryIncrease[]>([]);
  const { salaryIncreases } = useSelector(selectSalaryIncreasesState);
  const [openSalaryLetter, setOpenSalaryLetter] = useState<{
    salaryId: number;
    isOpen: boolean;
  }>();
  const [pagination, setPagination] = useState(
    {
      pageIndex: 1,
      pageSize: 3,
      keyword: '',
    }
  )

  useLayoutEffect(() => {
    const startOfPage = (pagination.pageIndex - 1) * pagination.pageSize;
    const endOfPage = pagination.pageIndex * pagination.pageSize;
    setSalariesByPage(salaryIncreases.data?.slice(startOfPage, endOfPage));
  }, [pagination, salaryIncreases])

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPagination((prev) => {
      return {
        ...prev,
        pageSize: +event.target.value,
        pageIndex: 1,
      };
    })
  };

  const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
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

    setSalary((prev: SalaryIncrease | undefined) => (
      {
        ...prev,
        [name]: formatValue
      }
    ) as SalaryIncrease)
  }

  const handleSubmit = () => {
    if (salary?.id) {
      dispatch(updateSalaryThunk(salary)).then(unwrapResult)
        .then((res) => {

          if (res.code === statusCode.SUCCESS) {
            setSalary(undefined);
            handleOpenSalaryLetter(res.data.id)
            showMessage({
              message: 'Cập nhật thông tin lương thành công.',
              severity: 'success',
            });
          } else {
            showMessage({
              message: res.message || 'Cập nhật thông tin lương thất bại.',
              severity: 'error'
            });
          }
        });
    } else if (salary) {
      dispatch(createSalaryThunk({
        employeeId: employeeId, data: [{
          ...salary,
          oldSalary
        }]
      }))
        .then(unwrapResult)
        .then((res) => {
          if (res.code === statusCode.SUCCESS) {
            setSalary(undefined);
            handleOpenSalaryLetter(res.data[0].id)
            showMessage({
              message: 'Thêm mới thông tin lương thành công.',
              severity: 'success',
            });
          } else {
            showMessage({
              message: res.message || 'Thêm mới thông tin lương thất bại.',
              severity: 'error'
            });
          }
        });
    }
  }

  const handleCancel = () => {
    setSalary(undefined)
  }

  const handleOpenSalaryLetter = (salaryId: number) => {
    setOpenSalaryLetter({
      salaryId: salaryId,
      isOpen: true,
    })
  }

  const handleCloseSalaryLetter = () => {
    setOpenSalaryLetter({
      isOpen: false,
      salaryId: 0
    })
  }

  const oldSalary = useMemo(() => {
    if (!salaryIncreases.data) {
      return 0;
    }

    return salaryIncreases.data
      .filter(obj => obj.salaryIncreaseStatus === 3 && obj.acceptanceDate)
      .sort((a, b) => new Date(a.acceptanceDate!).getTime() - new Date(b.acceptanceDate!).getTime())[0]?.newSalary || 0;
  }, [salaryIncreases.data]);

  return (
    <div>
      {!isManage && (
        <ValidatorForm onSubmit={handleSubmit}>
          <Grid container spacing={2} xs={12}>
            <Grid item xs={4} >
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Ngày tăng lương
                  </span>
                }
                type="date"
                value={
                  salary?.startDate
                    ? moment(salary?.startDate).format("YYYY-MM-DD")
                    : ""
                }
                variant="outlined"
                disabled={isEnd}
                onChange={handleChangeInput}
                InputLabelProps={{
                  shrink: true,
                }}
                name="startDate"
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
                    Mức lương cũ
                  </span>
                }
                value={
                  oldSalary || salary?.oldSalary || ""
                }
                inputProps={{
                  readOnly:
                    salary?.oldSalary && salary?.salaryIncreaseStatus === 4,
                }}
                variant="outlined"
                onChange={handleChangeInput}
                disabled
                name="oldSalary"
              />
            </Grid>
            <Grid item xs={4}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Mức lương mới
                  </span>
                }
                value={salary?.newSalary || ""}
                disabled={isEnd}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100 "
                name="newSalary"
                validators={[
                  "required",
                  "matchRegexp:^\\d*$",
                  `minNumber:${oldSalary}`,
                ]}
                errorMessages={[
                  "Hãy nhập trường thông tin này",
                  "Vui lòng nhập số",
                  "Lương mới phải lớn hơn lương cũ",
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Lý do
                  </span>
                }
                value={salary?.reason || ""}
                disabled={isEnd}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100 "
                name="reason"
                validators={["required"]}
                errorMessages="Hãy nhập trường thông tin này"
              />
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
                value={salary?.note || ""}
                disabled={isEnd}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100 "
                name="note"
                validators={["required"]}
                errorMessages="Hãy nhập trường thông tin này"
              />
            </Grid>
            <Grid item xs={12}>
              <div className='w-full h-full flex justify-center items-center space-x-2'>
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
      <div className="mt-8">
        <SalaryTable
          employeeId={employeeId}
          rows={salariesByPage}
          count={salaryIncreases.data?.length}
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          setSalarySelected={setSalary} />
      </div>

      {openSalaryLetter &&
        <SalaryLetter
          employeeId={employeeId}
          salaryId={openSalaryLetter?.salaryId}
          open={openSalaryLetter?.isOpen}
          onClose={handleCloseSalaryLetter}
        />}
    </div>
  )
}
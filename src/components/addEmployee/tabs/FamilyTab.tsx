import { Button, Grid, MenuItem } from '@mui/material';
import React, { ChangeEvent, useEffect, useLayoutEffect, useState, MouseEvent, useRef } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { GENDER, RELATIONSHIP } from '../../../types/employee';
import { convertDateStringtoTime, convertTimeToDate, statusCode } from '../../../utils';
import { useAppDispatch } from '../../../redux/hook';
import { Family } from '../../../types/family';
import moment from 'moment';
import { addAgeValidationRule, addEmailValidationRule, addIdentityCardValidationRule, addPhoneValidationRule, removeAgeValidationRule, removeEmailValidationRule, removeIdentityCardValidationRule, removePhoneValidationRule } from '../../../lib/employeeValidator';
import { useSelector } from 'react-redux';
import { createFamilyThunk, selectFamilyState, updateFamilyThunk } from '../../../redux/slices/familySlice';
import { FamiliesTable } from '../tables/FamiliesTable';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppContext } from '../../../context/AppContext';

interface Props {
  employeeId: number
}

const FamilyTab: React.FC<Props> = ({ employeeId }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const [family, setFamily] = useState<Family>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<any>(null);

  const [familiesByPage, setFamiliesByPage] = useState<Family[]>([])
  const [pagination, setPagination] = useState(
    {
      pageIndex: 1,
      pageSize: 3,
      keyword: '',
    }
  )

  const { families } = useSelector(selectFamilyState);

  useLayoutEffect(() => {
    const startOfPage = (pagination.pageIndex - 1) * pagination.pageSize;
    const endOfPage = pagination.pageIndex * pagination.pageSize;
    setFamiliesByPage(families.data.slice(startOfPage, endOfPage));
  }, [pagination, families])

  useEffect(() => {
    addPhoneValidationRule();
    addIdentityCardValidationRule();
    addAgeValidationRule();
    addEmailValidationRule();

    return () => {
      removePhoneValidationRule();
      removeIdentityCardValidationRule();
      removeAgeValidationRule();
      removeEmailValidationRule();
    };
  }, []);

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setFamily((prev: Family | undefined) => ({
      ...prev,
      [event.target.name]: event.target.type === 'date' ? convertDateStringtoTime(event.target.value) : event.target.value
    } as Family));
  };

  const handleCancel = () => {
    setFamily(undefined);
  };

  const handleSubmit = async () => {
    try {
      let resultAction;
      let successMessage;
      let errorMessage;

      if (family?.id) {
        // update employee
        resultAction = await dispatch(updateFamilyThunk(family));
        successMessage = 'Cập nhật thông tin gia đình thành công.';
        errorMessage = 'Cập nhật thông tin gia đình thất bại.';
      } else if (family) {
        // create employee
        resultAction = await dispatch(createFamilyThunk({ employeeId: employeeId, families: [family] }));
        successMessage = 'Thêm thông tin gia đình thành công.';
        errorMessage = 'Thêm thông tin gia đình thất bại.';
      }

      if (resultAction) {
        const response = unwrapResult(resultAction);

        if (response.code === statusCode.SUCCESS) {
          setFamily(undefined)
          if (formRef.current) {
            formRef.current.resetValidations();
          }
          showMessage({
            message: successMessage ?? '',
            severity: 'success',
          });
        } else {
          showMessage({
            message: response.message || errorMessage,
            severity: 'error',
          });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      showMessage({
        message: 'Đã xảy ra lỗi khi thực hiện thao tác.',
        severity: 'error'
      });
    }

  };

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

  return (
    <>
      <ValidatorForm onSubmit={handleSubmit} ref={formRef}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextValidator
              fullWidth
              label={
                <span>
                  <span className="text-red-500">*</span>
                  Họ tên
                </span>
              }
              value={family?.name || ""}
              variant="outlined"
              onChange={handleChangeInput}
              className="w-100"
              name="name"
              validators={["required"]}
              errorMessages="Hãy nhập thông tin trường này"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextValidator
              fullWidth
              label={
                <span>
                  <span className="text-red-500">*</span>
                  Ngày sinh
                </span>
              }
              type="date"
              value={
                typeof family?.dateOfBirth === "string"
                  ? family?.dateOfBirth
                  : convertTimeToDate(family?.dateOfBirth) || ""
              }
              variant="outlined"
              onChange={handleChangeInput}
              className="w-100"
              InputLabelProps={{
                shrink: true,
              }}
              name="dateOfBirth"
              validators={["required"]}
              errorMessages="Hãy nhập thông tin trường này"
              inputProps={{
                max: moment().format("YYYY-MM-DD"),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextValidator
              fullWidth
              label={
                <span>
                  <span className="text-red-500">*</span>
                  Giới tính
                </span>
              }
              select
              value={family?.gender ?? ''}
              variant="outlined"
              onChange={handleChangeInput}
              className="w-100"
              name="gender"
              validators={["required"]}
              errorMessages="Hãy nhập thông tin trường này"
            >
              {Object.entries(GENDER).map(([key, value]) => {
                return (
                  <MenuItem value={key} key={key}>
                    {value}
                  </MenuItem>
                );
              })}
            </TextValidator>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextValidator
              fullWidth
              label={
                <span>
                  <span className="text-red-500">*</span>
                  Số điện thoại
                </span>
              }
              value={family?.phoneNumber || ""}
              variant="outlined"
              onChange={handleChangeInput}
              className="w-100"
              name="phoneNumber"
              validators={["required", "isPhoneNumberValid"]}
              errorMessages={[
                "Hãy nhập thông tin trường này",
                "Số điện thoại phải bắt đầu từ chữ số 0 và có 10 chữ số",
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextValidator
              fullWidth
              label={
                <span>
                  <span className="text-red-500">*</span>
                  Căn cước công dân
                </span>
              }
              value={family?.citizenIdentificationNumber || ""}
              variant="outlined"
              onChange={handleChangeInput}
              className="w-100"
              name="citizenIdentificationNumber"
              validators={["required", "isIdentityCardValid"]}
              errorMessages={[
                "Hãy nhập thông tin trường này",
                "Căn cước công dân phải có 9 hoặc 12 chữ số",
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextValidator
              fullWidth
              label={
                <span>
                  <span className="text-red-500">*</span>
                  Quan hệ
                </span>
              }
              select
              value={family?.relationShip ?? ''}
              variant="outlined"
              onChange={handleChangeInput}
              className="w-100"
              name="relationShip"
              validators={["required"]}
              errorMessages="Hãy nhập thông tin trường này"
            >
              {Object.entries(RELATIONSHIP).map(([key, value]) => {
                return (
                  <MenuItem value={key} key={key}>
                    {value}
                  </MenuItem>
                );
              })}
            </TextValidator>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <TextValidator
              fullWidth
              label={
                <span>
                  <span className="text-red-500">*</span>
                  Email
                </span>
              }
              value={family?.email || ""}
              variant="outlined"
              onChange={handleChangeInput}
              className="w-100"
              name="email"
              validators={["required", "isEmailValid"]}
              errorMessages={["Hãy nhập thông tin trường này", "Email không hợp lệ"]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} >
            <TextValidator
              fullWidth
              label={
                <span>
                  <span className="text-red-500">*</span>
                  Địa chỉ
                </span>
              }
              value={family?.address || ""}
              variant="outlined"
              onChange={handleChangeInput}
              className="w-100"
              name="address"
              validators={["required"]}
              errorMessages="Hãy nhập thông tin trường này"
            />
          </Grid>

          <Grid item xs={12} className="text-center space-x-2 py-5">
            <Button variant="contained" color="primary" type="submit">
              Lưu
            </Button>
            <Button
              variant="contained"
              className="ml-12"
              color="error"
              type="button"
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </Grid>
        </Grid>
      </ValidatorForm>

      <FamiliesTable
        rows={familiesByPage}
        count={families.data.length}
        page={pagination.pageIndex}
        rowsPerPage={pagination.pageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        setFamilySelected={setFamily} />
    </>
  )
}

export default FamilyTab
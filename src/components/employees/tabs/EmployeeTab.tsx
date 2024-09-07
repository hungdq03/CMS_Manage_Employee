/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Grid, MenuItem } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { CameraPlus } from '@phosphor-icons/react';
import moment from 'moment';
import { ChangeEvent, forwardRef, useEffect } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { uploadImage } from '../../../api/employee';
import { useAppContext } from '../../../context/AppContext';

import { unwrapResult } from '@reduxjs/toolkit';
import ConstantList from '../../../appConfig';
import { useAppDispatch } from '../../../redux/hook';
import {
  addAddressValidationRule,
  addAgeValidationRule,
  addEmailValidationRule,
  addEmployeeIdValidationRule,
  addFullNameValidationRule,
  addIdentityCardValidationRule,
  addPhoneValidationRule,
  removeAddressValidationRule,
  removeAgeValidationRule,
  removeEmailValidationRule,
  removeEmployeeIdValidationRule,
  removeFullNameValidationRule,
  removeIdentityCardValidationRule,
  removePhoneValidationRule
} from '../../../lib/employeeValidator';
import { createEmployeeThunk, updateEmployeeThunk } from '../../../redux/slices/employeesSlice';
import { Employee, GENDER, TEAM_CATEGORY } from '../../../types/employee';
import { convertDateStringtoTime, convertTimeToDate, statusCode } from '../../../utils';

type Props = {
  employeeData?: Employee
  onChangeInput: (state: Partial<Employee>) => void
}

const EmployeeTab = forwardRef<any, Props>(({ employeeData, onChangeInput }, ref) => {
  const { showMessage } = useAppContext();
  const dispatch = useAppDispatch();

  useEffect(() => {
    addEmployeeIdValidationRule();
    addPhoneValidationRule();
    addIdentityCardValidationRule();
    addAgeValidationRule();
    addEmailValidationRule();
    addFullNameValidationRule();
    addAddressValidationRule();

    return () => {
      removeEmployeeIdValidationRule();
      removePhoneValidationRule();
      removeIdentityCardValidationRule();
      removeAgeValidationRule();
      removeEmailValidationRule();
      removeFullNameValidationRule();
      removeAddressValidationRule();
    };
  }, []);

  const handleChangeImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (file.size > 10 * 1024 * 1024) {
        showMessage({
          message: "Kích thước của tệp ảnh quá lớn. Vui lòng chọn một tệp ảnh nhỏ hơn 10MB.",
          severity: "error"
        })
        event.target.value = '';
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await uploadImage(formData);

        if (response?.status === statusCode.SUCCESS) {
          const imageUrl =
            response?.data &&
            `${ConstantList.API_ENDPOINT}/public/image/${response?.data?.name}`;
          onChangeInput({ image: imageUrl })
        } else {
          console.error("Upload failed");
        }
      } catch (error) {
        console.error("Error during upload:", error);
      }
    } else {
      showMessage({
        message: "Vui lòng chọn một tệp ảnh JPG hoặc PNG.",
        severity: "error"
      })
      event.target.value = '';
    }
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const formatValue = type === 'date' ? convertDateStringtoTime(value) : value

    onChangeInput({
      [name]: formatValue,
    });
  }

  const handleSubmit = async () => {
    if (!employeeData) return;

    try {
      let resultAction;
      let successMessage;
      let errorMessage;

      if (employeeData.id) {
        // update employee
        resultAction = await dispatch(updateEmployeeThunk(employeeData));
        successMessage = 'Cập nhật nhân viên thành công.';
        errorMessage = 'Cập nhật nhân viên thất bại.';
      } else {
        // create employee
        const data = {
          ...employeeData,
          employeeFamilyDtos: [],
          certificatesDto: [],
        };
        resultAction = await dispatch(createEmployeeThunk(data));
        successMessage = 'Thêm nhân viên thành công.';
        errorMessage = 'Thêm nhân viên thất bại.';
      }

      const response = unwrapResult(resultAction);

      if (response.code === statusCode.SUCCESS) {
        if (!employeeData.id) {
          onChangeInput({ id: response.data.id });
        }
        showMessage({
          message: successMessage,
          severity: 'success'
        });
      } else {
        showMessage({
          message: response.message || errorMessage,
          severity: 'error'
        });
      }
    } catch (_) {
      showMessage({
        message: 'Đã xảy ra lỗi khi thực hiện thao tác.',
        severity: 'error'
      });
    }
  };


  return (
    <>
      <ValidatorForm onSubmit={handleSubmit} ref={ref} >
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} className="text-center">
            <Avatar
              src={
                employeeData?.image
                  ? employeeData?.image
                  : "/assets/avatar.png"
              }
              sx={{
                width: '150px',
                height: '150px',
                marginX: 'auto',
              }}
            />
            <Button
              variant="contained"
              color="primary"
              component="label"
              sx={{
                marginTop: '10px'
              }}
            >
              <CameraPlus size={24} />
              <input
                hidden
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleChangeImage}
                className="display-none"
                name="image"
              />
            </Button>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={2} className="mb-20">
              <Grid item xs={12} md={6}>
                <TextValidator
                  fullWidth
                  label={
                    <span>
                      <span className="text-red-500">*</span>
                      Mã nhân viên
                    </span>
                  }
                  value={employeeData?.code || ""}
                  variant="outlined"
                  onChange={handleChangeInput}
                  className="w-100 "
                  name="code"
                  validators={["required", "isEmployeeIdValid"]}
                  errorMessages={[
                    "Hãy điền mã nhân viên",
                    "Mã nhân không đúng định dạng(NV+2 số cuối của năm+3 số)",
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextValidator
                  fullWidth
                  label={
                    <span>
                      <span className="text-red-500">*</span>
                      Tên nhân viên
                    </span>
                  }
                  value={employeeData?.name || ""}
                  variant="outlined"
                  onChange={handleChangeInput}
                  className="w-100"
                  name="name"
                  validators={["required", "isFullNameValid"]}
                  errorMessages={[
                    "Hãy điền tên nhân viên",
                    "Họ và tên không được chứa số và ký tự đặc biệt",
                  ]}
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
                  value={employeeData?.gender ?? ''}
                  variant="outlined"
                  onChange={handleChangeInput}
                  className="w-100"
                  name="gender"
                  validators={["required"]}
                  errorMessages="Hãy lựa chọn giới tính"
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
                      Ngày sinh
                    </span>
                  }
                  type="date"
                  value={
                    typeof employeeData?.dateOfBirth === "string"
                      ? employeeData?.dateOfBirth
                      : convertTimeToDate(employeeData?.dateOfBirth) || ""
                  }
                  variant="outlined"
                  onChange={handleChangeInput}
                  className="w-100"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="dateOfBirth"
                  validators={["required", "isAgeValid"]}
                  errorMessages={["Hãy điền ngày sinh", "Bạn chưa đủ 18 tuổi"]}
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
                      Số điện thoại
                    </span>
                  }
                  value={employeeData?.phone || ""}
                  variant="outlined"
                  onChange={handleChangeInput}
                  className="w-100"
                  name="phone"
                  validators={["required", "isPhoneNumberValid"]}
                  errorMessages={[
                    "Hãy điền số điện thoại",
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
                      Nhóm
                    </span>
                  }
                  select
                  value={employeeData?.team ?? ''}
                  variant="outlined"
                  onChange={handleChangeInput}
                  className="w-100"
                  name="team"
                  validators={["required"]}
                  errorMessages="Hãy lựa chọn nhóm"
                >
                  {Object.entries(TEAM_CATEGORY).map(([key, value]) => {
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
                      Số căn cước công dân
                    </span>
                  }
                  value={employeeData?.citizenIdentificationNumber || ""}
                  variant="outlined"
                  onChange={handleChangeInput}
                  className="w-100"
                  name="citizenIdentificationNumber"
                  validators={["required", "isIdentityCardValid"]}
                  errorMessages={[
                    "Hãy nhập số căn cước công dân",
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
                      Ngày cấp
                    </span>
                  }
                  type="date"
                  value={
                    typeof employeeData?.dateOfIssuanceCard === "string"
                      ? employeeData?.dateOfIssuanceCard
                      : convertTimeToDate(employeeData?.dateOfIssuanceCard) || ""
                  }
                  variant="outlined"
                  onChange={handleChangeInput}
                  className="w-100"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="dateOfIssuanceCard"
                  validators={["required"]}
                  errorMessages={"Hãy nhập ngày cấp"}
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
                      Nơi cấp
                    </span>
                  }
                  value={employeeData?.placeOfIssueCard || ""}
                  variant="outlined"
                  onChange={handleChangeInput}
                  className="w-100"
                  name="placeOfIssueCard"
                  validators={["required", "isAddressValid"]}
                  errorMessages={"Hãy nhập"}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextValidator
                  fullWidth
                  label={
                    <span>
                      <span className="text-red-500">*</span>
                      Email
                    </span>
                  }
                  value={employeeData?.email || ""}
                  variant="outlined"
                  onChange={handleChangeInput}
                  className="w-100"
                  name="email"
                  validators={["required", "isEmailValid"]}
                  errorMessages={["Hãy nhập email", "Email không hợp lệ"]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextValidator
                  fullWidth
                  label={
                    <span>
                      <span className="text-red-500">*</span>
                      Địa chỉ
                    </span>
                  }
                  value={employeeData?.address || ""}
                  variant="outlined"
                  onChange={handleChangeInput}
                  className="w-100"
                  name="address"
                  validators={["required", "isAddressValid"]}
                  errorMessages={[

                    "Vui lòng nhập địa chỉ hợp lệ",
                  ]}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ValidatorForm>
    </>

  )
})

export default EmployeeTab
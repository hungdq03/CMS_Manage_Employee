import { Button, Grid } from '@mui/material'
import { unwrapResult } from '@reduxjs/toolkit'
import moment from 'moment'
import React, { ChangeEvent, MouseEvent, useLayoutEffect, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { useAppContext } from '../../../context/AppContext'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { createCertificateThunk, selectCertificateState, updateCertificateThunk } from '../../../redux/slices/certificateSlice'
import { Certificate } from '../../../types/certificate'
import { convertDateStringtoTime, convertTimeToDate, statusCode } from '../../../utils'
import { CertificatesTable } from '../tables/CertificatesTable'

type Props = {
  employeeId: number
}

const CertificateTab: React.FC<Props> = ({ employeeId }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const [certificate, setCertificate] = useState<Certificate>();
  const [certificatesByPage, setCertificatesByPage] = useState<Certificate[]>([])
  const [pagination, setPagination] = useState(
    {
      pageIndex: 1,
      pageSize: 3,
      keyword: '',
    }
  )
  const { certificates } = useAppSelector(selectCertificateState);

  useLayoutEffect(() => {
    const startOfPage = (pagination.pageIndex - 1) * pagination.pageSize;
    const endOfPage = pagination.pageIndex * pagination.pageSize;
    setCertificatesByPage(certificates.data.slice(startOfPage, endOfPage));
  }, [pagination, certificates])

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setCertificate((prev: Certificate | undefined) => ({
      ...prev,
      [event.target.name]: event.target.type === 'date' ? convertDateStringtoTime(event.target.value) : event.target.value
    } as Certificate));
  };

  const handleSubmit = async () => {
    try {
      let resultAction;
      let successMessage;
      let errorMessage;

      if (certificate?.id) {
        // update employee
        resultAction = await dispatch(updateCertificateThunk(certificate));
        successMessage = 'Cập nhật văn bằng thành công.';
        errorMessage = 'Cập nhật văn bằng thất bại.';
      } else if (certificate) {
        // create employee
        resultAction = await dispatch(createCertificateThunk({ employeeId, certificate: [certificate] }));
        successMessage = 'Thêm văn bằng thành công.';
        errorMessage = 'Thêm văn bằng thất bại.';
      }

      if (resultAction) {
        const response = unwrapResult(resultAction);

        if (response.code === statusCode.SUCCESS) {
          setCertificate(undefined)
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

  const handleCancel = () => {
    setCertificate(undefined);
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

  const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPagination((prev) => {
      return {
        ...prev,
        pageIndex: newPage + 1,
      };
    })
  };
  return (
    <>
      <ValidatorForm onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextValidator
              fullWidth
              label={
                <span>
                  <span className="text-red-500">*</span>
                  Tên văn bằng
                </span>
              }
              value={certificate?.certificateName || ""}
              variant="outlined"
              onChange={handleChangeInput}
              className="w-100"
              name="certificateName"
              validators={["required"]}
              errorMessages="Hãy nhập thông tin trường này"
            />
          </Grid>

          <Grid item xs={12} md={4}>
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
                typeof certificate?.issueDate === "string"
                  ? certificate?.issueDate
                  : convertTimeToDate(certificate?.issueDate) || ""
              }
              variant="outlined"
              onChange={handleChangeInput}
              className="w-100"
              InputLabelProps={{
                shrink: true,
              }}
              name="issueDate"
              validators={["required"]}
              errorMessages="Hãy nhập thông tin trường này"
              inputProps={{
                max: moment().format("YYYY-MM-DD"),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextValidator
              fullWidth
              label={
                <span>
                  <span className="text-red-500">*</span>
                  Lĩnh vực
                </span>
              }
              value={certificate?.field || ""}
              variant="outlined"
              onChange={handleChangeInput}
              className="w-100"
              name="field"
              validators={["required"]}
              errorMessages="Hãy nhập thông tin trường này"
            />
          </Grid>

          <Grid item xs={12} md={12} className="mb-40">
            <TextValidator
              fullWidth
              label={
                <span>
                  <span className="text-red-500">*</span>
                  Nội dung văn bằng
                </span>
              }
              value={certificate?.content || ""}
              variant="outlined"
              onChange={handleChangeInput}
              className="w-100"
              name="content"
              validators={["required"]}
              errorMessages="Hãy nhập thông tin trường này"
            />
          </Grid>

          <Grid item xs={12} className="text-center space-x-2 py-5">
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Lưu
            </Button>
            <Button
              variant="contained"
              color="error"
              type="button"
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </Grid>
        </Grid>
      </ValidatorForm>
      <CertificatesTable
        rows={certificatesByPage}
        count={certificates.data.length}
        page={pagination.pageIndex}
        rowsPerPage={pagination.pageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        setCertificateSelected={setCertificate} />
    </>
  )
}

export default CertificateTab
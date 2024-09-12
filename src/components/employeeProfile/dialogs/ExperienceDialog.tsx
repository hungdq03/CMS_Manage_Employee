import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from '@mui/material';
import { PencilSimple, PlusCircle } from '@phosphor-icons/react';
import React, { ChangeEvent, useLayoutEffect, useMemo, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { createExperienceThunk, selectExperienceById, updateExperienceThunk } from '../../../redux/slices/experienceSlice';
import { RootState } from '../../../redux/store';
import { Experience } from '../../../types/experience';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppContext } from '../../../context/AppContext';
import { statusCode } from '../../../utils';

interface Props {
  employeeId: number;
  experienceId?: number;
  type: 'ADD' | 'UPDATE';
}

export const ExperienceDialog: React.FC<Props> = ({ employeeId, type, experienceId }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const [isOpenDialog, setOpenDialog] = useState<boolean>(false);
  const [experience, setExperience] = useState<Experience>()

  const experienceSelected = useAppSelector((state: RootState) =>
    isOpenDialog && experienceId && type === 'UPDATE' ?
      selectExperienceById(state, experienceId) : undefined
  )

  useLayoutEffect(() => {
    if (experienceSelected) {
      setExperience(experienceSelected)
    }
  }, [experienceSelected])

  const handleOpen = () => {
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setExperience((prev: Experience | undefined) => (
      {
        ...prev,
        [e.target.name]: e.target.value
      } as Experience
    ));
  };

  const handleSubmit = async () => {
    if (!experience) return;

    let resultAction;
    let successMessage;
    let errorMessage;

    if (experience?.id) {
      resultAction = await dispatch(updateExperienceThunk(experience));
      successMessage = 'Cập nhật kinh nghiệm làm việc thành công.';
      errorMessage = 'Cập nhật kinh nghiệm làm việc thất bại.';
    } else {
      resultAction = await dispatch(createExperienceThunk({ employeeId: employeeId, experiences: [experience] }));
      successMessage = 'Thêm kinh nghiệm làm việc thành công.';
      errorMessage = 'Thêm kinh nghiệm làm việc thất bại.';
    }

    const response = unwrapResult(resultAction);

    if (response.code === statusCode.SUCCESS) {
      handleClose();
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

  };

  const button = useMemo(() => {
    switch (type) {
      case 'ADD':
        return (
          <IconButton
            color="primary"
            onClick={handleOpen}
          >
            <PlusCircle size={20} />
          </IconButton>
        );
      case 'UPDATE':
        return (
          <IconButton
            color="primary"
            onClick={handleOpen}
            size="small"
          >
            <PencilSimple />
          </IconButton>
        );
      default:
        return null;
    }
  }, [type]);
  return (
    <>
      {button}
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isOpenDialog}
      >
        <DialogTitle id="customized-dialog-title">
          Kinh nghiệm làm việc
        </DialogTitle>

        <ValidatorForm onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextValidator
                  fullWidth
                  className="w-100"
                  label="Tên công ty"
                  name="companyName"
                  value={experience?.companyName}
                  variant="outlined"
                  onChange={handleChangeInput}
                  validators={["required"]}
                  errorMessages="Hãy nhập thông tin trường này"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextValidator
                  fullWidth
                  className="w-100"
                  label="Ngày bắt đầu"
                  type="date"
                  name="startDate"
                  value={experience?.startDate}
                  variant="outlined"
                  onChange={handleChangeInput}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  validators={["required"]}
                  errorMessages="Hãy nhập thông tin trường này"
                  inputProps={{
                    max: experience?.endDate,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextValidator
                  fullWidth
                  className="w-100"
                  label="Ngày kết thúc"
                  type="date"
                  name="endDate"
                  value={experience?.endDate}
                  variant="outlined"
                  onChange={handleChangeInput}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  validators={["required"]}
                  errorMessages="Hãy nhập thông tin trường này"
                  inputProps={{
                    min: experience?.startDate,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidator
                  fullWidth
                  className="w-100"
                  label="Địa chỉ công ty"
                  name="companyAddress"
                  value={experience?.companyAddress}
                  variant="outlined"
                  onChange={handleChangeInput}
                  validators={["required"]}
                  errorMessages="Hãy nhập thông tin trường này"

                />
              </Grid>
              <Grid item xs={12}>
                <TextValidator
                  fullWidth
                  className="w-100"
                  label="Lý do nghỉ việc"
                  name="leavingReason"
                  value={experience?.leavingReason}
                  variant="outlined"
                  onChange={handleChangeInput}
                  validators={["required"]}
                  errorMessages="Hãy nhập thông tin trường này"
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidator
                  fullWidth
                  className="w-100"
                  label="Mô tả công việc"
                  name="jobDescription"
                  value={experience?.jobDescription}
                  variant="outlined"
                  onChange={handleChangeInput}
                  validators={["required"]}
                  errorMessages="Hãy nhập thông tin trường này"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              className="mx-10"
              type="submit"
            >
              Lưu
            </Button>
            <Button
              variant="contained"
              color="secondary"
              type="button"
              onClick={handleClose}
            >
              Hủy
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </>
  )
}

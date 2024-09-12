import { Avatar, Button, Grid, IconButton } from '@mui/material';
import { Cake, Envelope, GenderIntersex, MapPin, PencilSimple, Phone } from '@phosphor-icons/react';
import { unwrapResult } from '@reduxjs/toolkit';
import moment from 'moment';
import React, { ChangeEvent, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useAppContext } from '../../../context/AppContext';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { selectEmployeeById, updateEmployeeThunk } from '../../../redux/slices/employeesSlice';
import { deleteExperienceThunk, selectExperienceState } from '../../../redux/slices/experienceSlice';
import { RootState } from '../../../redux/store';
import { ACTION_EMPLOYEE, Employee, GENDER, STATUS_EMPLOYEE, TEAM_CATEGORY } from '../../../types/employee';
import { splitString, statusCode } from '../../../utils';
import ConfirmationDialog from '../../core/ConfirmationDialog';
import { ExperienceDialog } from '../dialogs/ExperienceDialog';
interface Props {
  employeeId: number;
}

const CvTab: React.FC<Props> = ({ employeeId }) => {
  const { isMobile } = useAppContext();
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const employee = useAppSelector((state: RootState) => selectEmployeeById(state, employeeId))
  const { experiences } = useAppSelector((state: RootState) => selectExperienceState(state))

  const [skill, setSkill] = useState<string>(employee?.skill ?? '')
  const [activity, setActivity] = useState<string>(employee?.activity ?? '')
  const [knowledge, setKnowledge] = useState<string>(employee?.knowledge ?? '')

  const [isUpdateSkill, setIsUpdateSkill] = useState(false);
  const [isUpdateActivity, setIsUpdateActivity] = useState(false);
  const [isUpdateKnowledge, setIsUpdateKnowledge] = useState(false);

  //skill
  const handleSubmitSkill = async () => {
    if (employee) {
      const data: Employee = { ...employee, skill };
      const resultAction = await dispatch(updateEmployeeThunk(data));
      const response = unwrapResult(resultAction)

      if (response.code === statusCode.SUCCESS) {
        showMessage({
          message: 'Cập nhật thông tin kỹ năng thành công.',
          severity: 'success',
        });
      } else {
        showMessage({
          message: response.message || 'Cập nhật thông tin kỹ năng thất bại.',
          severity: 'error'
        });
      }

      handleUpdateSkillClose();
    }
  };

  const handleUpdateSkill = () => {
    setIsUpdateSkill(true);
  };

  const handleUpdateSkillClose = () => {
    setIsUpdateSkill(false);
  };

  const handleChangeSkill = (event: ChangeEvent<HTMLInputElement>) => {
    setSkill(event.target.value);
  }

  //activity
  const handleUpdateActivity = () => {
    setIsUpdateActivity(true)
  }

  const handleUpdateActivityClose = () => {
    setIsUpdateActivity(false)
  }

  const handleChangeActivity = (event: ChangeEvent<HTMLInputElement>) => {
    setActivity(event.target.value);
  }

  const handleSubmitActivity = async () => {
    if (employee) {
      const data: Employee = { ...employee, activity };
      const resultAction = await dispatch(updateEmployeeThunk(data));

      const response = unwrapResult(resultAction)

      if (response.code === statusCode.SUCCESS) {
        showMessage({
          message: 'Cập nhật thông tin hoạt động thành công.',
          severity: 'success',
        });
      } else {
        showMessage({
          message: response.message || 'Cập nhật thông tin hoạt động thất bại.',
          severity: 'error'
        });
      }
      handleUpdateActivityClose();
    }
  };

  //knowledge
  const handleUpdateKnowledge = () => {
    setIsUpdateKnowledge(true)
  }

  const handleUpdateKnowledgeClose = () => {
    setIsUpdateKnowledge(false)
  }

  const handleChangeKnowledge = (event: ChangeEvent<HTMLInputElement>) => {
    setKnowledge(event.target.value);
  }

  const handleSubmitKnowledge = async () => {
    if (employee) {
      const data: Employee = { ...employee, knowledge };
      const resultAction = await dispatch(updateEmployeeThunk(data));
      const response = unwrapResult(resultAction)

      if (response.code === statusCode.SUCCESS) {
        showMessage({
          message: 'Cập nhật thông tin kiến thức thành công.',
          severity: 'success',
        });
      } else {
        showMessage({
          message: response.message || 'Cập nhật thông tin kiến thức thất bại.',
          severity: 'error'
        });
      }

      handleUpdateKnowledgeClose();
    }
  };

  const handleDeleteExperience = async (experienceId: number) => {
    const resultAction = await dispatch(deleteExperienceThunk(experienceId))
    const response = unwrapResult(resultAction);
    if (response.code === statusCode.SUCCESS) {
      showMessage({
        message: 'Xóa thông tin kinh nghiệm thành công.',
        severity: 'success',
      });
    } else {
      showMessage({
        message: response.message || 'Xóa thông tin kinh nghiệm thất bại.',
        severity: 'error',
      });
    }
  }


  return (
    <Grid container spacing={2} sx={{
      width: isMobile ? '400px' : '950px',
    }}>
      <Grid item xs={12} md={5} >
        <div className="flex flex-col gap-4">
          <div className="w-[200px] h-[200px]">
            <Avatar
              src={
                employee?.image
                  ? employee?.image
                  : "/assets/avatar.png"
              }
              sx={{
                width: '100%',
                height: '100%',
                marginX: 'auto',
              }} />
          </div>
          <div>
            <div className="flex items-center gap-2 ">
              <Envelope size={24} />
              <span>{employee?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={24} />
              <span>{employee?.phone}</span>
            </div>
          </div>
        </div>

        {/* skill */}
        <div className="py-[20px] text-lg">
          <div className='flex items-center gap-2'>
            <h3 className="uppercase font-bold text-2xl">kỹ năng</h3>
            {ACTION_EMPLOYEE.EDIT.includes(employee?.submitProfileStatus.toString() ?? '') &&
              STATUS_EMPLOYEE.ADD.includes(employee?.submitProfileStatus.toString() ?? '') && (
                <IconButton
                  size="small"
                  onClick={() => {
                    handleUpdateSkill();
                  }}
                >
                  <PencilSimple />
                </IconButton>
              )}
          </div>
          <div>
            {isUpdateSkill ? (
              <>
                <ValidatorForm onSubmit={handleSubmitSkill}>
                  <TextValidator
                    multiline
                    rows={5}
                    fullWidth
                    className="mt-16 "
                    name="skill"
                    value={skill || ""}
                    onChange={handleChangeSkill}
                  />
                  <div className='w-full flex justify-end mt-4 pr-4 gap-2'>
                    <Button className="mt-12 mr-12" variant="contained" color="primary" onClick={handleSubmitSkill}>
                      Lưu
                    </Button>
                    <Button className="mt-12 color-error" variant="contained" onClick={handleUpdateSkillClose}>
                      Hủy
                    </Button>
                  </div>
                </ValidatorForm>
              </>
            )
              : (
                <ul className='list-disc ml-4'>
                  {splitString(skill)?.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              )
            }
          </div>
        </div>

        {/* knowledge */}
        <div className="py-[20px] text-lg">
          <div className='flex items-center gap-2'>
            <h3 className="uppercase font-bold text-2xl">kiến thức</h3>
            {ACTION_EMPLOYEE.EDIT.includes(employee?.submitProfileStatus.toString() ?? '') &&
              STATUS_EMPLOYEE.ADD.includes(employee?.submitProfileStatus.toString() ?? '') && (
                <IconButton
                  size="small"
                  onClick={() => {
                    handleUpdateKnowledge();
                  }}
                >
                  <PencilSimple />
                </IconButton>
              )}
          </div>
          <div>
            {isUpdateKnowledge && (
              <>
                <ValidatorForm onSubmit={handleSubmitKnowledge}>
                  <TextValidator
                    multiline
                    rows={5}
                    fullWidth
                    className="mt-16 "
                    name="skill"
                    value={knowledge || ""}
                    onChange={handleChangeKnowledge}
                    validators={["required"]}
                  />
                  <div className='w-full flex justify-end mt-4 pr-4 gap-2'>
                    <Button className="mt-12 mr-12" variant="contained" color="primary" onClick={handleSubmitKnowledge}>
                      Lưu
                    </Button>
                    <Button className="mt-12 color-error" variant="contained" onClick={handleUpdateKnowledgeClose}>
                      Hủy
                    </Button>
                  </div>
                </ValidatorForm>
              </>
            )}
          </div>
          <ul className="list-disc ml-4">
            {!isUpdateKnowledge &&
              knowledge &&
              splitString(knowledge) !== null &&
              splitString(knowledge)?.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>

        {/* activity */}
        <div className="text-lg">
          <div className='flex items-center gap-2'>
            <h3 className="uppercase font-bold text-2xl">hoạt động</h3>
            {ACTION_EMPLOYEE.EDIT.includes(employee?.submitProfileStatus.toString() ?? '') &&
              STATUS_EMPLOYEE.ADD.includes(employee?.submitProfileStatus.toString() ?? '') && (
                <IconButton
                  size="small"
                  onClick={handleUpdateActivity}
                >
                  <PencilSimple />
                </IconButton>
              )}
          </div>
          <div>
            {isUpdateActivity ? (
              <>
                <ValidatorForm onSubmit={handleSubmitActivity}>
                  <TextValidator
                    multiline
                    rows={5}
                    fullWidth
                    className="mt-16 "
                    name="activity"
                    value={activity || ""}
                    onChange={handleChangeActivity}
                  />
                  <div className='w-full flex justify-end mt-4 pr-4 gap-2'>
                    <Button
                      className="mt-12 mr-12"
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitActivity}
                    >
                      Lưu
                    </Button>
                    <Button className="mt-12 color-error" variant="contained" onClick={handleUpdateActivityClose}>
                      Hủy
                    </Button>
                  </div>
                </ValidatorForm>
              </>
            ) : <ul className="list-disc ml-4">
              {splitString(activity)?.map((item, index) => <li key={index}>{item}</li>)}
            </ul>}
          </div>

        </div>
      </Grid>
      <Grid item xs={12} md={7}>
        <div className="border-l-2 border-l-black pl-8 ml-3">
          <h1 className="uppercase font-bold text-4xl">{employee?.name}</h1>
          <h4 className="uppercase font-bold text-2xl">{employee?.team ? Object.values(TEAM_CATEGORY)[employee?.team] : ''}</h4>
        </div>
        <div className="flex flex-col gap-2 my-4">
          <div className="flex items-center gap-2">
            <GenderIntersex size={30} />
            <span>{employee?.gender ? Object.values(GENDER)[employee?.gender] : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cake size={30} />
            <span>{employee?.dateOfBirth ? moment(new Date(employee?.dateOfBirth)).format("MM/YYYY") : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={30} />
            <span>{employee?.address}</span>
          </div>
        </div>

        <div className="border-l-2 border-l-black pl-8 ml-3 mt-4">
          <div className='flex items-center'>
            <span className='font-bold uppercase text-2xl'>kinh nghiệm làm việc</span>
            {ACTION_EMPLOYEE.EDIT.includes(employee?.submitProfileStatus.toString() ?? '') &&
              STATUS_EMPLOYEE.ADD.includes(
                employee?.submitProfileStatus.toString() ?? ''
              ) &&
              <ExperienceDialog employeeId={employeeId} type='ADD' />
            }
          </div>
          {experiences != null &&
            experiences.data.map((experience) => (
              <div className='my-3'>
                <div className='font-bold text-xl flex items-center gap-2'>
                  <span className="tracking-wide">
                    {moment(experience?.startDate).format("MM/YYYY")} -{" "}
                    {moment(experience?.endDate).format("MM/YYYY")}
                  </span>
                  <span className="mx-6">&#x2022;</span>
                  <span className="uppercase">{experience?.companyName}</span>
                  {ACTION_EMPLOYEE.EDIT.includes(
                    employee?.submitProfileStatus.toString() ?? ''
                  ) &&
                    STATUS_EMPLOYEE.ADD.includes(
                      employee?.submitProfileStatus.toString() ?? ''
                    ) && (<div>
                      <ExperienceDialog employeeId={employeeId} experienceId={experience.id} type='UPDATE' />
                      <ConfirmationDialog
                        onYesClick={() => handleDeleteExperience(experience.id)}
                        title="Xác nhận"
                        text={`Bạn có chắc chắn muốn xóa kinh nghiệm làm việc: ${experience.companyName}`}
                        Yes="Xác nhận"
                        No="Hủy"
                        btnColor='error'
                        iconName='Trash'
                      />
                    </div>)}
                </div>

                <h5 className="uppercase font-bold text-xl">{experience?.companyAddress}</h5>
                <div className="ml-3 list-disc">
                  {splitString(experience?.jobDescription)?.map((item) => (
                    <li className="text-lg">{item}</li>
                  ))}
                </div>
              </div >
            ))}
        </div>
        <div className="border-l-2 border-l-black pl-8 ml-3 mt-4 text-lg">
          <h3 className="font-bold uppercase text-2xl">Chứng chỉ</h3>
          <div className='list-disc'>
            {employee?.certificatesDto?.map((employee) => (
              <li>
                {moment(employee?.issueDate)?.year()}: {employee?.content}.
              </li>
            ))}
          </div>
        </div>
      </Grid>
    </Grid >
  )
}

export default CvTab
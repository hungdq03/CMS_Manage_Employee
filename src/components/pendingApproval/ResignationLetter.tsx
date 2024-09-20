import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Input, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import moment from 'moment';
import React, { ChangeEvent, useEffect, useLayoutEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { selectEmployeeById, updateEmployeeThunk } from '../../redux/slices/employeesSlice';
import { selectCurrentUser } from '../../redux/slices/userSlice';
import { RootState } from '../../redux/store';
import { ACTION_EMPLOYEE, Employee, POSITIONS } from '../../types/employee';
import { convertDateStringtoTime, convertTimeToDate, statusCode } from '../../utils';
import { SendingleaderDialog } from '../manageEmployee/dialogs/SendingleaderDialog';

interface Props {
  open: boolean;
  onClose: () => void;
  employeeId: number;
  isAdmin?: boolean;
  isEnd?: boolean;
}
export const ResignationLetter: React.FC<Props> = ({ open, onClose, employeeId, isAdmin, isEnd }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const employee = useAppSelector((state: RootState) => selectEmployeeById(state, employeeId))
  const [content, setContent] = useState<Employee>();
  const currentUser = useAppSelector(selectCurrentUser)
  const [line, setLine] = useState<string[]>([]);
  const [openSendingLeaderDialog, setOpenSendingLeaderDialog] = useState<boolean>(false);

  useEffect(() => {
    setLine(content?.reasonForEnding ? content.reasonForEnding.split("\n") : []);
  }, [content]);

  useLayoutEffect(() => {
    setContent(employee)
  }, [employee])


  const handleChangeInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent((prev: Employee | undefined) => ({
      ...prev,
      [event.target.name]: event.target.type === 'date' ? convertDateStringtoTime(event.target.value) : event.target.value
    } as Employee));
  };

  const handleApproved = async () => {
    if (employee) {
      const data: Employee = {
        ...employee,
        ...content,
        submitProfileStatus: 7
      }

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
      onClose();
    }
  };

  const handleOpenSendingLeaderDialog = () => {
    if (!content?.endDay || !content.reasonForEnding) {
      showMessage({
        message: 'Vui lòng điền đầy đủ thông tin để gửi cho trình lãnh đạo.',
        severity: 'warning',
      })
      return;
    }
    setOpenSendingLeaderDialog(true)
  }

  const handleCloseSendingLeaderDialog = () => {
    setOpenSendingLeaderDialog(false)
  }

  return (
    <div className='font-times-serif' style={{ fontFamily: 'Times New Roman, serif' }}>
      <Dialog
        onClose={onClose}
        open={open}
        maxWidth="lg"
        fullWidth={true}
        sx={{ fontFamily: 'Times New Roman, serif' }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Grid container>
            <Grid item>Đơn xin nghỉ việc</Grid>
          </Grid>
        </DialogTitle>

        <DialogContent dividers>
          <DialogContent dividers className="bg-gray-100 p-4 sm:p-12 font-serif"
            sx={{ fontFamily: 'Times New Roman, serif' }}>
            <Box className="bg-white">
              <Box className="p-10 sm:p-12">
                <Typography className="flex justify-center "
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b>
                </Typography>
                <Typography className="flex justify-center underline font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Độc lập - Tự do - Hạnh phúc
                </Typography>
                <Typography className="flex justify-center mt-8 font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  ĐƠN XIN NGHỈ VIỆC
                </Typography>
                <Typography className="mt-8 font-bold text-center"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Kính gửi: Ban Giám đốc công ty <b>OCEANTECH</b>
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Tên tôi là: <b>{content?.name}</b>
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Hiện tại đang là{" "}
                  {
                    content?.currentPosition ? Object.values(POSITIONS)[content?.currentPosition] : ''
                  }{" "}
                  tại công ty OCEANTECH<b></b>
                </Typography>
                <Typography className="font-bold" sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Tôi làm đơn này, đề nghị Ban Giám đốc cho tôi xin nghỉ việc từ ngày{" "}
                  {
                    convertTimeToDate(content?.endDay)?.split("-")[2]
                  }{" "}
                  tháng{" "}
                  {
                    convertTimeToDate(content?.endDay)?.split("-")[1]
                  }{" "}
                  năm{" "}
                  {
                    convertTimeToDate(content?.endDay)?.split("-")[0]
                  }
                  .
                  {isEnd && ACTION_EMPLOYEE.EDIT.includes(content?.submitProfileStatus.toString() ?? '') && (
                    <>
                      <Input
                        id="icon-button-date"
                        className="mx-4 font-bold"
                        style={{ width: "20px" }}
                        type="date"
                        inputProps={{
                          min: moment().format("YYYY-MM-DD"),
                          width: "20",
                        }}
                        name="endDay"
                        value={content?.endDay || ""}
                        onChange={(e) => handleChangeInput(e)}
                      />
                      <span className="text-red-500"> * </span>
                    </>
                  )}
                  <br></br>
                  {!isEnd &&
                    `Nghỉ vì lý do : ${content?.reasonForEnding ?? ''}`}
                  {isEnd && (
                    <div className="relative font-bold">
                      <span
                        className="absolute top-0 bg-white z-10 transform -translate-y-4"
                      >
                        Lý do xin nghỉ:{" "}
                      </span>
                      <Input
                        name="reasonForEnding"
                        multiline
                        value={content?.reasonForEnding || ""}
                        onChange={(e) =>
                          handleChangeInput(e)
                        }
                        style={{
                          fontFamily: "Times New Roman",
                          fontSize: "16px",
                          display: "block",
                          position: "relative",
                          zIndex: "1000",
                          width: "100%",
                          outline: "unset",
                          marginTop: '12px'
                        }}
                        readOnly={!ACTION_EMPLOYEE.EDIT.includes(content?.submitProfileStatus.toString() ?? '')}
                      ></Input>
                      {line?.map((_, index) => (
                        <span
                          style={{
                            position: "absolute",
                            top: `${(1 / line.length) * 100 * index}%`,
                            right: "0",
                            left: "0",
                            width: "100%",
                            height: line
                              ? `${(1 / line.length) * 100}%`
                              : "100%",
                            borderBottom: "1px dashed",
                            transform: "translateY(-2px)",
                          }}
                        ></span>
                      ))}
                    </div>
                  )}
                </Typography>
                <Typography className="pb-3 font-bold" sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Trong thời gian chờ đợi sự chấp thuận của Ban Giám đốc Công ty, tôi sẽ tiếp tục làm việc nghiêm túc và tiến hành bàn giao công việc cũng như tài sản cho người quản lý trực tiếp của tôi là ông/bà{" "}
                  <b>{content?.leaderName}</b>
                  <br />
                  Tôi xin chân thành cảm ơn!
                </Typography>
                <Grid container className="mt-3 font-bold">
                  <Grid item xs={6}>
                    <div className="flex flex-col items-center text-center w-full font-times-serif mt-6">
                      <h4 className="font-bold uppercase text-[17px]">Người làm đơn</h4>
                      <span className="italic text-[17px] mb-5">(Ký tên, ghi rõ họ tên)</span>
                      <div className="mt-8 font-semibold text-[19px]">{content?.name}</div>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="flex flex-col items-center text-center w-full font-times-serif">
                      <div className="flex justify-center">
                        <Typography
                          className={`text-[18px] font-times-serif font-semibold line-height-25 italic truncate`}
                          sx={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          Hà Nội, Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                        </Typography>
                      </div>
                      <h4 className="font-bold uppercase text-[17px]">Giám đốc</h4>
                      <span className="italic text-[17px] mb-5">(Ký tên, đóng dấu)</span>
                      <div className="mt-8 font-semibold text-[19px]">
                        {currentUser.user?.displayName}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <div className="text-center m-auto space-x-4">
            {isAdmin ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  className="mr-3"
                  onClick={() => handleApproved()}
                >
                  Phê duyệt
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="mr-3"
                // onClick={() => handleDialogAddRequest()}
                >
                  Yêu cầu bổ sung
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="mr-3"
                // onClick={() => handleDialogReasonRefusalDialog()}
                >
                  Từ chối
                </Button>
              </>
            ) : (
              ACTION_EMPLOYEE.EDIT.includes(content?.submitProfileStatus.toString() ?? '') && (
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  className="mr-3"
                  onClick={() => handleOpenSendingLeaderDialog()}
                >
                  Gửi lãnh đạo
                </Button>
              )
            )}

            <Button
              variant="contained"
              color="error"
              type="button"
              onClick={onClose}
            >
              Hủy
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      <SendingleaderDialog
        id={employeeId}
        type='EMPLOYEE'
        content={content}
        open={openSendingLeaderDialog}
        onClose={handleCloseSendingLeaderDialog} />
    </div >
  )
}

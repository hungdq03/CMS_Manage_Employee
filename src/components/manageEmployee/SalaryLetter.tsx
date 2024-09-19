import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useAppSelector } from '../../redux/hook';
import { selectEmployeeById } from '../../redux/slices/employeesSlice';
import { selectSalaryIncreaseById } from '../../redux/slices/salaryIncreaseSlice';
import { RootState } from '../../redux/store';
import { ACTION_PROCESS } from '../../types/process';
import { SendingleaderDialog } from './dialogs/SendingleaderDialog';

interface Props {
  open: boolean;
  onClose: () => void;
  employeeId: number;
  salaryId: number;
  isManage?: boolean;
}

export const SalaryLetter: React.FC<Props> = ({ open, onClose, employeeId, isManage, salaryId }) => {
  const employee = useAppSelector((state: RootState) => selectEmployeeById(state, employeeId));
  const salary = useAppSelector((state: RootState) => selectSalaryIncreaseById(state, salaryId));
  const [openSendingLeaderDialog, setOpenSendingLeaderDialog] = useState<boolean>(false);

  const handleOpenSendingLeaderDialog = () => {
    setOpenSendingLeaderDialog(true)
  }

  const handleCloseSendingLeaderDialog = () => {
    setOpenSendingLeaderDialog(false)
  }

  return (
    <div className="flex justify-center mt-8">
      <Dialog
        onClose={onClose}
        open={open}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <DialogTitle>
          Đề xuất tăng lương
        </DialogTitle>

        <DialogContent dividers>
          <DialogContent dividers className="bg-gray-200 p-3 sm:p-12">
            <Box className="bg-white">
              <Box className="p-10 sm:p-20">
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <div className="flex justify-center">
                      <Typography className="truncate font-bold"
                        sx={{ fontFamily: 'Times New Roman, serif' }}>
                        CÔNG TY OCEANTECH
                      </Typography>
                    </div>
                    <Typography className="flex justify-center font-bold"
                      sx={{ fontFamily: 'Times New Roman, serif' }}>
                      <b> Số {employee?.id}/ QĐ - TL</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <div className="flex justify-center">
                      <Typography className="truncate font-bold"
                        sx={{ fontFamily: 'Times New Roman, serif' }}>
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                      </Typography>
                    </div>
                    <div className="flex justify-center">
                      <Typography className="underline decoration-solid pb-1 mb-8 font-bold"
                        sx={{ fontFamily: 'Times New Roman, serif' }}>
                        Độc lập - Tự do - Hạnh phúc
                      </Typography>
                    </div>
                    <div className="flex justify-center">
                      <Typography className="italic leading-10 mt-8 font-bold"
                        sx={{ fontFamily: 'Times New Roman, serif' }}>
                        Hà Nội, Ngày{" "}
                        {
                          salary?.startDate ?
                            moment(new Date(salary?.startDate))
                              .format("DD/MM/YYYY")
                              .split("/")[0] : ''
                        }{" "}
                        tháng{" "}
                        {
                          salary?.startDate ?
                            moment(new Date(salary?.startDate))
                              .format("DD/MM/YYYY")
                              .split("/")[1] : ''
                        }{" "}
                        năm{" "}
                        {
                          salary?.startDate ?
                            moment(new Date(salary?.startDate))
                              .format("DD/MM/YYYY")
                              .split("/")[2] : ''
                        }
                      </Typography>
                    </div>
                  </Grid>
                </Grid>

                <Typography className="flex justify-center mt-8 font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  QUYẾT ĐỊNH
                </Typography>
                <Typography className="flex justify-center pb-3 italic"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  V/v tăng lương cho người lao động
                </Typography>

                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Căn cứ vào Điều lệ, nội quy, quy chế của Công ty OCEANTECH;
                </Typography>

                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Căn cứ vào hợp đồng số <b>{employee?.code}</b> được ký giữa Công ty OCEANTECH và Ông/Bà <b>{employee?.name}</b>{" "}
                  ngày {moment(employee?.submitDay).format("DD")} tháng{" "}
                  {moment(employee?.submitDay).format("MM")} năm{" "}
                  {moment(employee?.submitDay).format("YYYY")};
                </Typography>

                <Typography className="pb-3 font-bold" sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Căn cứ vào sự đóng góp thực tế của Ông/Bà:{" "}
                  <b>{employee?.name}</b> đổi với sự phát triển của Công ty OCEANTECH.
                </Typography>

                <div className="flex justify-center font-bold">
                  <Typography className="truncate font-bold" sx={{ fontFamily: 'Times New Roman, serif' }}>
                    GIÁM ĐỐC CÔNG TY OCEANTECH
                  </Typography>
                </div>
                <Typography className="flex justify-center leading-10 font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  QUYẾT ĐỊNH
                </Typography>

                <Typography className="font-bold" sx={{ fontFamily: 'Times New Roman, serif' }}>
                  <b>- Điều 1:</b> Tăng lương cho Ông/Bà: <b>{employee?.name}</b> đang làm việc tại công ty kể từ ngày{" "}
                  {salary?.startDate ?
                    moment(new Date(salary?.startDate))
                      .format("DD/MM/YYYY")
                      .split("/")[0] : ''
                  }{" "}
                  tháng{" "}
                  {
                    salary?.startDate ?
                      moment(new Date(salary?.startDate))
                        .format("DD/MM/YYYY")
                        .split("/")[1] : ''
                  }{" "}
                  năm{" "}
                  {
                    salary?.startDate ?
                      moment(new Date(salary?.startDate))
                        .format("DD/MM/YYYY")
                        .split("/")[2] : ''
                  }, cụ thể như sau:
                </Typography>

                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Mức lương hiện tại: <b>{salary?.oldSalary?.toLocaleString()} VND</b>
                </Typography>

                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Mức lương sau điều chỉnh: <b>{salary?.newSalary?.toLocaleString()} VND</b>
                </Typography>

                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  <b>- Điều 2: </b>Các Ông/Bà Phòng nhân sự, Phòng tài chính kế toán và Ông/Bà:{" "}
                  <b>{employee?.leaderName}</b> căn cứ thi hành quyết định này.
                </Typography>

                <Box className="flex justify-between mt-8 font-bold">
                  <Box className="px-8 mt-3">
                    <Typography className="italic font-bold"
                      sx={{ fontFamily: 'Times New Roman, serif' }}>
                      Nơi Nhận:
                    </Typography>
                    <Typography className="font-bold"
                      sx={{ fontFamily: 'Times New Roman, serif' }}>
                      Ông/Bà:{" "}
                      <b>
                        {employee?.leaderName}
                      </b>
                    </Typography>
                    <Typography className="font-bold"
                      sx={{ fontFamily: 'Times New Roman, serif' }}>Như điều 2</Typography>
                    <Typography className="font-bold"
                      sx={{ fontFamily: 'Times New Roman, serif' }}>Lưu HS,VP</Typography>
                  </Box>
                  <Box className="px-8">
                    <div className="flex flex-col items-center text-center w-full font-times-serif">
                      <div className="flex justify-center">
                        <Typography
                          className={`text-[18px] font-times-serif font-semibold line-height-25 italic truncate`}
                          sx={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          Hà Nội, Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                        </Typography>
                      </div>
                      <h4 className="font-bold uppercase text-[17px] font-times">Giám đốc</h4>
                      <span className="font-times italic text-[17px] mb-5">(Ký tên, đóng dấu)</span>
                    </div>
                    {salary?.salaryIncreaseStatus === 3 && (
                      <div className="mt-3 flex justify-center font-bold">
                        <span className="sign-text font-bold">
                          {employee?.leaderName}
                        </span>
                      </div>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        </DialogContent>

        <DialogActions>
          <div className="text-center m-auto space-x-2">
            {isManage ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  className="mr-12"
                // onClick={() => handleDialogApproved()}
                >
                  Phê duyệt
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="mr-12"
                // onClick={() => handleDialogAddRequest()}
                >
                  Yêu cầu bổ sung
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="mr-12"
                // onClick={() => handleDialogReasonRefusalDialog()}
                >
                  Từ chối
                </Button>
              </>
            ) : (
              !ACTION_PROCESS.MANAGE.includes(salary?.salaryIncreaseStatus?.toString() ?? '') &&
              (
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  className="mr-12"
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

      {salary?.id &&
        <SendingleaderDialog
          id={salary?.id}
          type='SALARY'
          open={openSendingLeaderDialog}
          onClose={handleCloseSendingLeaderDialog} />}
    </div>
  )
}

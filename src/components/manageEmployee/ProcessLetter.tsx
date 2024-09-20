import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useAppSelector } from '../../redux/hook';
import { selectEmployeeById } from '../../redux/slices/employeesSlice';
import { selectProcessById } from '../../redux/slices/processSlice';
import { RootState } from '../../redux/store';
import { POSITIONS } from '../../types/employee';
import { ACTION_PROCESS } from '../../types/process';
import { SendingleaderDialog } from './dialogs/SendingleaderDialog';

interface Props {
  open: boolean;
  onClose: () => void;
  employeeId: number;
  processId: number;
  isAdmin?: boolean;
}

export const ProcessLetter: React.FC<Props> = ({ open, onClose, employeeId, processId, isAdmin }) => {
  const employee = useAppSelector((state: RootState) => selectEmployeeById(state, employeeId));
  const process = useAppSelector((state: RootState) => selectProcessById(state, processId));
  const [openSendingLeaderDialog, setOpenSendingLeaderDialog] = useState<boolean>(false);

  const handleOpenSendingLeaderDialog = () => {
    setOpenSendingLeaderDialog(true)
  }

  const handleCloseSendingLeaderDialog = () => {
    setOpenSendingLeaderDialog(false)
  }


  return (
    <div>
      <Dialog
        onClose={onClose}
        open={open}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>Đề xuất thăng chức</Grid>
          </Grid>
        </DialogTitle>

        <DialogContent dividers>
          <DialogContent dividers className="bg-gray-200 p-3 lg:px-10">
            <Box className="bg-white">
              <Box className="p-10 lg:px-10 lg:pb-20">
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
                      <b>Số {employee?.id}/ QĐ - BN</b>
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
                      <Typography className="truncate underline font-bold"
                        sx={{ fontFamily: 'Times New Roman, serif' }}>
                        Độc lập - Tự do - Hạnh phúc
                      </Typography>
                    </div>
                    <div className="flex justify-center mt-8 font-bold">
                      <Typography className="truncate italic"
                        sx={{ fontFamily: 'Times New Roman, serif' }}>
                        Hà Nội, Ngày{" "}
                        {process?.promotionDay ?
                          moment(new Date(process?.promotionDay)).format("DD") : ''}{" "}tháng{" "}
                        {process?.promotionDay ?
                          moment(new Date(process?.promotionDay)).format("MM") : ''}{" "}năm{" "}
                        {process?.promotionDay ?
                          moment(new Date(process?.promotionDay)).format("YYYY") : ''}
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
                  V/v thăng chức
                </Typography>
                <div className="flex justify-center">
                  <Typography className="truncate font-bold"
                    sx={{ fontFamily: 'Times New Roman, serif' }}>
                    HỘI ĐỒNG THÀNH VIÊN CÔNG TY OCEANTECH
                  </Typography>
                </div>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Căn cứ Luật Doanh nghiệp 2020 và các văn bản hướng dẫn thi hành;
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Căn cứ Điều lệ Công ty OCEANTECH;
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Căn cứ yêu cầu hoạt động sản xuất kinh doanh;
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Xét năng lực, phẩm chất và trình độ của Ông/Bà{" "}
                  <b>{employee?.name}</b>.
                </Typography>
                <Typography className="flex justify-center leading-relaxed font-bold mt-8"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  QUYẾT ĐỊNH
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  <b>Điều 1:</b> Bổ nhiệm chức danh{" "}
                  <b>
                    {
                      process?.newPosition ? Object.values(POSITIONS)[process?.newPosition] : ''
                    }
                  </b>{" "}
                  đối với:
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Ông/Bà: <b>{employee?.name}</b>. Giới tính:{" "}
                  {employee?.gender === 0 ? "Nữ" : "Nam"}
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Sinh ngày:{" "}
                  {employee?.dateOfBirth ?
                    moment(new Date(employee?.dateOfBirth)).format("DD/MM/YYYY") : ''
                  }
                  . Dân tộc: {employee?.religion}. Tôn giáo:{" "}
                  {employee?.ethnic}
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Số chứng minh nhân dân/Thẻ căn cước công dân:{" "}
                  {employee?.citizenIdentificationNumber}. Nơi cấp:{" "}
                  {employee?.placeOfIssueCard} Ngày cấp:{" "}
                  {employee?.dateOfIssuanceCard ?
                    moment(new Date(employee?.dateOfIssuanceCard))
                      .format("DD/MM/YYYY") : ''}
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Nơi đăng ký hộ khẩu thường trú: {employee?.address}
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Nơi ở hiện tại: {employee?.address}
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  <b>Điều 2:</b> Quyền và nghĩa vụ
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Thực hiện quyền và nghĩa vụ của cấp bậc được bổ nhiệm theo quy định của công ty.
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  <b>Điều 3:</b> Hiệu lực thi hành
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  - Ông/Bà có tên tại Điều 1 và các cơ quan, tổ chức, cá nhân liên quan chịu trách nhiệm thi hành quyết định này.
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Quyết định có hiệu lực kể từ ngày ký.
                </Typography>
                <Box className="flex justify-between mt-8 font-bold">
                  <Box>
                    <Typography className="font-bold italic"
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
                      sx={{ fontFamily: 'Times New Roman, serif' }}>
                      Cơ quan, tổ chức, cá nhân liên quan
                    </Typography>
                    <Typography className="font-bold"
                      sx={{ fontFamily: 'Times New Roman, serif' }}>Lưu HS,VP</Typography>
                  </Box>
                  <Box>
                    <Typography className="flex justify-center font-bold"
                      sx={{ fontFamily: 'Times New Roman, serif' }}>
                      TM. HỘI ĐỒNG THÀNH VIÊN
                    </Typography>
                    <Typography className="flex justify-center font-bold"
                      sx={{ fontFamily: 'Times New Roman, serif' }}>
                      Chủ tịch Hội đồng thành viên
                    </Typography>
                    <Typography className="flex justify-center italic"
                      sx={{ fontFamily: 'Times New Roman, serif' }}>
                      (Ký tên, đóng dấu)
                    </Typography>
                    {process?.processStatus?.toString() === "3" && (
                      <div className="mt-8 flex justify-center">
                        <span className="font-bold text-lg">
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
            {isAdmin ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  className="mr-3"
                // onClick={() => handleDialogApproved()}
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
              !ACTION_PROCESS.MANAGE.includes(process?.processStatus?.toString() ?? '') && (
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

      {process?.id &&
        <SendingleaderDialog
          id={process?.id}
          type='PROCESS'
          open={openSendingLeaderDialog}
          onClose={handleCloseSendingLeaderDialog} />}
    </div>
  )
}

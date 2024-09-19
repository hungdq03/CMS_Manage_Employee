import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useAppSelector } from '../../redux/hook';
import { selectEmployeeById } from '../../redux/slices/employeesSlice';
import { selectProposalById } from '../../redux/slices/proposalSlice';
import { RootState } from '../../redux/store';
import { PROPOSAL_TYPE } from '../../types/employee';
import { ACTION_PROCESS } from '../../types/process';
import { SendingleaderDialog } from './dialogs/SendingleaderDialog';

interface Props {
  open: boolean;
  onClose: () => void;
  employeeId: number;
  proposalId: number;
  isManage?: boolean;
}


export const ProposalLetter: React.FC<Props> = ({ open, onClose, employeeId, proposalId, isManage }) => {
  const employee = useAppSelector((state: RootState) => selectEmployeeById(state, employeeId));
  const proposal = useAppSelector((state: RootState) => selectProposalById(state, proposalId));
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
          <Grid container >
            <Grid item>Đề xuất tham mưu</Grid>
          </Grid>
        </DialogTitle>

        <DialogContent dividers>
          <DialogContent dividers className="bg-gray-200 p-3 md:px-10">
            <Box className="bg-white">
              <Box className="px-10 pt-10 pb-20 md:px-20">
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
                      <b>Số {employee?.id}/ QĐ - TL</b>
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
                      <Typography className="underline pb-1 mb-8 font-bold"
                        sx={{ fontFamily: 'Times New Roman, serif' }}>
                        Độc lập - Tự do - Hạnh phúc
                      </Typography>
                    </div>
                    <div className="flex justify-center font-bold">
                      <Typography className="truncate leading-relaxed italic mt-8"
                        sx={{ fontFamily: 'Times New Roman, serif' }}>
                        Hà Nội, Ngày{" "}
                        {proposal?.proposalDate ?
                          moment(new Date(proposal?.proposalDate))
                            .format("DD/MM/YYYY")
                            .split("/")[0] : ''}{" "}
                        tháng{" "}
                        {proposal?.proposalDate ?
                          moment(new Date(proposal?.proposalDate))
                            .format("DD/MM/YYYY")
                            .split("/")[1] : ''}{" "}
                        năm{" "}
                        {proposal?.proposalDate ?
                          moment(new Date(proposal?.proposalDate))
                            .format("DD/MM/YYYY")
                            .split("/")[2] : ''}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
                <div className="flex justify-center font-bold">
                  <Typography className="mt-8 mb-4 font-bold"
                    sx={{ fontFamily: 'Times New Roman, serif' }}>
                    ĐƠN ĐỀ XUẤT
                  </Typography>
                </div>
                <Typography className="font-bold text-center"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  <b>Kính gửi:</b> - Ban giám đốc Công ty OCEANTECH
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Tôi tên là <b>{employee?.name}</b>, hiện đang làm nhân viên IT của Công ty OCEANTECH
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Hôm nay tôi viết đơn này{" "}
                  <b>
                    {proposal?.type ? Object.values(PROPOSAL_TYPE)[proposal?.type] : ''}
                  </b>
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Trong quá trình làm việc tại Công ty OCEANTECH, tôi nhận thấy đề xuất của tôi giúp cải thiện
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  {" "}
                  - Giúp cải thiện được năng suất làm việc, tinh thần thoải mái.
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  {" "}
                  - Tạo một không gian lành mạnh, cạnh tranh cao trong công việc.
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Tôi viết đơn này mong ban lãnh đạo Công ty OCEANTECH, xem xét đề xuất của tôi.
                </Typography>
                <Typography className="font-bold"
                  sx={{ fontFamily: 'Times New Roman, serif' }}>
                  Xin trân trọng cảm ơn!
                </Typography>
                <Box className="flex justify-between mt-8 font-bold">
                  <Box className="mt-3 font-bold">
                    <Typography className="font-bold italic"
                      sx={{ fontFamily: 'Times New Roman, serif' }}>Nơi Nhận:</Typography>
                    <Typography className="font-bold"
                      sx={{ fontFamily: 'Times New Roman, serif' }}>
                      Cơ quan, tổ chức, cá nhân liên quan</Typography>
                    <Typography className="font-bold"
                      sx={{ fontFamily: 'Times New Roman, serif' }}>Lưu HS,VP</Typography>
                  </Box>
                  <Box>
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
                    {proposal?.proposalStatus === 3 && (
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
          <div className="text-center mx-auto space-x-2">
            {isManage ? (
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
              !ACTION_PROCESS.MANAGE.includes(proposal?.proposalStatus.toString() ?? '') && (
                <Button
                  variant="contained"
                  color="primary"
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
              onClick={onClose}
            >
              Hủy
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      {proposal?.id &&
        <SendingleaderDialog
          id={proposal?.id}
          type='PROPOSAL'
          open={openSendingLeaderDialog}
          onClose={handleCloseSendingLeaderDialog} />}

      {/* {showDialogApproved && (
        <ApprovalDialog
          t={t}
          open={showDialogApproved}
          handleClose={handleDialogApprovedClose}
          handleCloseProfile={handleClose}
          employee={employee}
          proposal={proposal}
          isProposal={true}
        />
      )} */}

      {/* {showDialogAddRequest && (
        <AddRequestDialog
          t={t}
          open={showDialogAddRequest}
          handleClose={handleDialogAddRequestClose}
          handleCloseProfile={handleClose}
          employee={employee}
          isProposal={true}
          proposal={proposal}
        />
      )} */}

      {/* {showDialogReasonRefusalDialog && (
        <ReasonRefusalDialog
          t={t}
          open={showDialogReasonRefusalDialog}
          handleClose={handleDialogReasonRefusalDialogClose}
          handleCloseProfile={handleClose}
          employee={employee}
          isProposal={true}
          proposal={proposal}
        />
      )} */}
    </div>
  )
}

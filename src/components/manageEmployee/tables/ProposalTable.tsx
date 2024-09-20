import { Box, Card, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { Bell, Eye, PencilSimple } from '@phosphor-icons/react';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { ChangeEvent, MouseEvent, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useAppDispatch } from '../../../redux/hook';
import { deleteProposalThunk } from '../../../redux/slices/proposalSlice';
import { PROPOSAL, STATUS_PROFILE } from '../../../types/employee';
import { ACTION_PROCESS } from '../../../types/process';
import { Proposal } from '../../../types/proposal';
import { formatDate, statusCode } from '../../../utils';
import ConfirmationDialog from '../../core/ConfirmationDialog';
import ShowDialog from '../../core/ShowDialog';
import { ProposalLetter } from '../ProposalLetter';

interface Props {
  employeeId: number;
  count: number;
  page: number;
  rows: Proposal[];
  rowsPerPage: number;
  handleChangePage: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  setProposalSelected: (proposal: Proposal | undefined) => void;
}

export const ProposalTable: React.FC<Props> = ({ employeeId, count, page, rows, rowsPerPage, handleChangePage, handleChangeRowsPerPage, setProposalSelected }) => {
  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const [openProposalLetter, setOpenProposalLetter] = useState<{
    proposalId: number;
    isOpen: boolean;
  }>();
  const [openNotify, setOpenNotify] = useState<{
    proposal: Proposal | undefined;
    isOpen: boolean;
  }>();


  const handleSelectProposal = (proposal: Proposal) => {
    setProposalSelected(proposal)
  }

  const handleDeleteProposal = async (proposal: number) => {
    if (!proposal) {
      return;
    }
    dispatch(deleteProposalThunk(proposal))
      .then(unwrapResult)
      .then((res) => {
        if (res.code === statusCode.SUCCESS) {
          showMessage({
            message: 'Xóa thông tin thăng chức thành công.',
            severity: 'success',
          });
        } else {
          showMessage({
            message: res.message || 'Xóa thông tin thăng chức thất bại.',
            severity: 'error',
          });
        }
      });
  };

  const handleopenProposalLetter = (proposalId?: number) => {
    if (!proposalId) {
      return;
    }

    setOpenProposalLetter({
      proposalId,
      isOpen: true,
    });
  }

  const handleCloseProposalLetter = () => {
    setOpenProposalLetter({
      proposalId: 0,
      isOpen: false,
    });
  }

  const handleOpenNotify = (proposal: Proposal) => {
    setOpenNotify({
      isOpen: true,
      proposal,
    });
  }

  const handleCloseNotify = () => {
    setOpenNotify({
      isOpen: false,
      proposal: undefined,
    });
  }

  return (
    <>
      <Card>
        <Box sx={{ overflow: 'auto', maxHeight: '250px' }}>
          <Table sx={{ minWidth: '800px' }} >
            <TableHead >
              <TableRow>
                <TableCell>Thao tác</TableCell>
                <TableCell>STT</TableCell>
                <TableCell>Ngày đề xuất</TableCell>
                <TableCell>Loại đề xuất</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Nội dung</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row, index) => (
                <TableRow key={row?.id}>
                  <TableCell align='center'>
                    {ACTION_PROCESS.DELETE.includes(row?.proposalStatus?.toString() ?? '') && (
                      <ConfirmationDialog
                        onYesClick={() => row.id && handleDeleteProposal(row.id)}
                        title="Xác nhận"
                        text={`Bạn có chắc chắn muốn xóa thông tin thăng chức`}
                        Yes="Xác nhận"
                        No="Hủy"
                        btnColor='error'
                        iconName='Trash'
                      />
                    )}

                    {ACTION_PROCESS.EDIT.includes(row?.proposalStatus?.toString() ?? '') && (
                      <IconButton
                        color="primary"
                        onClick={() => handleSelectProposal(row)}
                        size="small"
                      >
                        <PencilSimple style={{ fontSize: 'var(--icon-fontSize-md)' }} />
                      </IconButton>
                    )}

                    {ACTION_PROCESS.VIEW.includes(row?.proposalStatus?.toString() ?? '') && (
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleopenProposalLetter(row.id)}
                      >
                        <Eye color='green' />
                      </IconButton>
                    )}

                    {ACTION_PROCESS.NOTIFY.includes(row?.proposalStatus?.toString() ?? '') && (
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleOpenNotify(row)}
                      >
                        <Bell color='#ddb903' />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.proposalDate ? formatDate(row?.proposalDate) : ''}</TableCell>
                  <TableCell>{Object.values(PROPOSAL)[row?.type]}</TableCell>
                  <TableCell>{row?.note}</TableCell>
                  <TableCell>{row?.content}</TableCell>
                  <TableCell>{row?.detailedDescription}</TableCell>
                  <TableCell>{row?.proposalStatus ? STATUS_PROFILE[row?.proposalStatus] : ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={count}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page - 1}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowPerPageOptions(count)}
          labelRowsPerPage={"Số hàng mỗi trang"}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trong ${count}`
          }
        />
      </Card>

      {openProposalLetter &&
        <ProposalLetter
          open={openProposalLetter?.isOpen}
          onClose={handleCloseProposalLetter}
          employeeId={employeeId}
          proposalId={openProposalLetter?.proposalId}
        />
      }

      {openNotify && (
        <ShowDialog
          onConfirmDialogClose={handleCloseNotify}
          open={openNotify.isOpen}
          text={
            openNotify.proposal?.proposalStatus === 4
              ? openNotify.proposal?.additionalRequest || "Không có"
              : openNotify.proposal?.reasonForRefusal || "Không có"
          }
          title={
            openNotify.proposal?.proposalStatus === 4
              ? "Nội dung yêu cầu bổ sung"
              : "Lý do từ chối"
          }
          cancel='Hủy'
        />
      )}
    </>
  )
}

const rowPerPageOptions = (maxNumber: number): number[] =>
  Array.from({ length: Math.floor(maxNumber / 2) }, (_, i) => i * 2 + 1);


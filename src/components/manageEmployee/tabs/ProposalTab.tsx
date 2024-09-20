import { Button, Grid, MenuItem } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import moment from 'moment';
import React, { ChangeEvent, MouseEvent, useLayoutEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useAppContext } from '../../../context/AppContext';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { createNewProposalThunk, selectProposalsState, updateProposalThunk } from '../../../redux/slices/proposalSlice';
import { PROPOSAL } from '../../../types/employee';
import { Proposal } from '../../../types/proposal';
import { convertDateStringtoTime, statusCode } from '../../../utils';
import { ProposalLetter } from '../ProposalLetter';
import { ProposalTable } from '../tables/ProposalTable';

interface Props {
  employeeId: number;
  isAdmin?: boolean;
  isEnd?: boolean;
}

export const ProposalTab: React.FC<Props> = ({ employeeId, isAdmin, isEnd }) => {

  const dispatch = useAppDispatch();
  const { showMessage } = useAppContext();
  const [proposal, setProposal] = useState<Proposal>();
  const { proposals } = useAppSelector(selectProposalsState)
  const [proposalsByPage, setProposalsByPage] = useState<Proposal[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 3,
    keyword: '',
  });
  const [openProposalLetter, setOpenProposalLetter] = useState<{
    proposalId: number | undefined;
    isOpen: boolean;
  }>({
    proposalId: undefined,
    isOpen: false,
  })

  useLayoutEffect(() => {
    const startOfPage = (pagination.pageIndex - 1) * pagination.pageSize;
    const endOfPage = pagination.pageIndex * pagination.pageSize;
    setProposalsByPage(proposals.data?.slice(startOfPage, endOfPage));
  }, [pagination.pageIndex, pagination.pageSize, proposals.data])

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

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const formatValue = type === 'date' ? convertDateStringtoTime(value) : value

    setProposal((prev: Proposal | undefined) => (
      {
        ...prev,
        [name]: formatValue
      }
    ) as Proposal)
  }

  const handleSubmit = () => {
    if (proposal?.id) {
      dispatch(updateProposalThunk(proposal))
        .then(unwrapResult)
        .then((res) => {
          if (res.code === statusCode.SUCCESS) {
            setProposal(undefined);
            handleOpenProposalLetter(res.data.id)
            showMessage({
              message: 'Cập nhật thông tin thăng chức thành công.',
              severity: 'success',
            });
          } else {
            showMessage({
              message: res.message || 'Cập nhật thông tin thăng chức thất bại.',
              severity: 'error'
            });
          }
        });
    } else if (proposal) {
      dispatch(createNewProposalThunk({
        employeeId: employeeId, data: [{
          ...proposal,
        }]
      }))
        .then(unwrapResult)
        .then((res) => {
          if (res.code === statusCode.SUCCESS) {
            setProposal(undefined);
            handleOpenProposalLetter(res.data[0].id)
            showMessage({
              message: 'Thêm mới thông tin thăng chức thành công.',
              severity: 'success',
            });
          } else {
            showMessage({
              message: res.message || 'Thêm mới thông tin thăng chức thất bại.',
              severity: 'error'
            });
          }
        });
    }
  }
  const handleCancel = () => {
    setProposal(undefined)
  }

  const handleOpenProposalLetter = (proposalId: number) => {
    setOpenProposalLetter({
      proposalId,
      isOpen: true,
    })
  }

  const handleCloseProposalLetter = () => {
    setOpenProposalLetter({
      proposalId: undefined,
      isOpen: false,
    })
  }

  return (
    <>
      {!isAdmin && (
        <ValidatorForm onSubmit={handleSubmit}>
          <Grid container spacing={2} xs={12}>
            <Grid item xs={4}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Ngày đề xuất
                  </span>
                }
                type="date"
                value={
                  proposal?.proposalDate
                    ? moment(proposal?.proposalDate).format("YYYY-MM-DD")
                    : ""
                }
                disabled={isEnd}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  inputProps: {
                    min: moment().format("YYYY-MM-DD"),
                  },
                }}
                name="proposalDate"
                validators={["required"]}
                errorMessages="Hãy nhập trường thông tin này"
              />
            </Grid>
            <Grid item xs={4}>
              <TextValidator
                fullWidth
                label={<span>Loại đề xuất</span>}
                select
                value={proposal?.type || ""}
                disabled={isEnd}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100"
                name="type"
              >
                {Object.entries(PROPOSAL)?.map(([key, value]) => {
                  return (
                    <MenuItem value={key} key={key}>
                      {value}
                    </MenuItem>
                  );
                })}
              </TextValidator>
            </Grid>
            <Grid item xs={4}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Nội dung
                  </span>
                }
                value={proposal?.content || ""}
                disabled={isEnd}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100 "
                name="content"
                validators={["required"]}
                errorMessages="Hãy nhập trường thông tin này"
              />
            </Grid>

            <Grid item xs={12}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Ghi chú
                  </span>
                }
                value={proposal?.note || ""}
                disabled={isEnd}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100 "
                name="note"
                validators={["required"]}
                errorMessages="Hãy nhập trường thông tin này"
              />
            </Grid>

            <Grid item xs={12}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    <span className="text-red-500">*</span>
                    Mô tả chi tiết
                  </span>
                }
                value={proposal?.detailedDescription || ""}
                disabled={isEnd}
                variant="outlined"
                onChange={handleChangeInput}
                className="w-100 "
                name="detailedDescription"
                validators={["required"]}
                errorMessages="Hãy nhập trường thông tin này"
              />
            </Grid>
            <Grid
              item
              xs={12}
              className="text-center mt-auto"
            >
              <div className='m-auto space-x-2'>
                <Button
                  variant="contained"
                  color="primary"
                  className="mr-10"
                  type="submit"
                  disabled={isEnd}
                >
                  Lưu
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  type="button"
                  disabled={isEnd}
                  onClick={() => handleCancel()}
                >
                  Hủy
                </Button>
              </div>
            </Grid>
          </Grid>
        </ValidatorForm>
      )}

      <div className="pt-20">
        <ProposalTable
          employeeId={employeeId}
          rows={proposalsByPage}
          count={proposals.data?.length}
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          setProposalSelected={setProposal} />
      </div>

      {openProposalLetter?.proposalId &&
        <ProposalLetter
          employeeId={employeeId}
          proposalId={openProposalLetter?.proposalId}
          open={openProposalLetter?.isOpen}
          onClose={handleCloseProposalLetter}
        />}
    </>
  )
}

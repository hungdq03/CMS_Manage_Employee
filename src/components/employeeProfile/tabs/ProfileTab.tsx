import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import moment from 'moment'
import React from 'react'
import { useAppSelector } from '../../../redux/hook'
import { selectEmployeeById } from '../../../redux/slices/employeesSlice'
import { selectFamilyState } from '../../../redux/slices/familySlice'
import { RootState } from '../../../redux/store'
import { GENDER, RELATIONSHIP } from '../../../types/employee'
import { formatDate } from '../../../utils'

interface Props {
  employeeId: number
}

export const ProfileTab: React.FC<Props> = ({ employeeId }) => {
  const employee = useAppSelector((state: RootState) =>
    employeeId ? selectEmployeeById(state, employeeId) : undefined
  )
  const { families } = useAppSelector(selectFamilyState);
  return (
    <>
      <div className="font-serif px-[60px] py-[38px] bg-white mx-auto">
        <Grid container spacing={2}>
          <Grid item md={4}>
            <div className="w-[140px] h-[210px]">
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
                  borderRadius: '0'
                }} />
            </div>
          </Grid>
          <Grid item md={8}>
            <h3 className="text-center uppercase font-bold text-[1.5rem]">
              Cộng hòa xã hội chủ nghĩa việt nam
            </h3>
            <h4 className="text-center uppercase font-bold underline text-[1.1rem] pb-4 mb-[32px]">
              Độc lập - Tự do - Hạnh phúc
            </h4>
            <h3 className="text-center uppercase font-bold text-[1.5rem]">
              Sơ yếu lý lịch
            </h3>
            <h4 className="text-center uppercase font-bold text-[1.1rem]">
              Tự thuật
            </h4>
          </Grid>
        </Grid>

        <div className="mt-[32px] text-[1.1rem] leading-[1.8]">
          <div>
            <h4 className="uppercase font-bold text-[1.1rem] my-[12px]">I. Thông tin bản thân</h4>
            <div className="ml-[18px] flex flex-col">
              <Grid container spacing={2}>
                <Grid item md={8} lg={8} sm={8} className="flex">
                  <span>1. Họ và tên (chữ in hoa):</span>
                  <span className="pl-[12px] flex-grow uppercase border-b border-dashed">{employee?.name}</span>
                </Grid>
                <Grid item md={4} lg={4} sm={4} className="flex">
                  <span>Nam/Nữ:</span>
                  <span className="pl-[12px] flex-grow border-b border-dashed">
                    {employee?.gender ? Object.values(GENDER)[employee?.gender] : ''}
                  </span>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item md={12} lg={12} sm={12} className="flex">
                  <span>2. Ngày sinh:</span>
                  <span className="pl-[12px] flex-grow border-b border-dashed">
                    {employee?.dateOfBirth ? moment(new Date(employee?.dateOfBirth)).format("DD/MM/YYYY") : ''}
                  </span>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item md={12} lg={12} sm={12} className="flex">
                  <span>3. Nơi đăng ký hộ khẩu thường trú:</span>
                  <span className="pl-[12px] flex-grow border-b border-dashed">
                    {employee?.address}
                  </span>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item md={12} lg={12} sm={12} className="flex">
                  <span>4. Điện thoại liên hệ:</span>
                  <span className="pl-[12px] flex-grow border-b border-dashed">
                    {employee?.phone}
                  </span>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item md={6} lg={6} sm={6} className="flex">
                  <span>5. Dân tộc:</span>
                  <span className="pl-[12px] flex-grow border-b border-dashed">
                    {employee?.ethnic}
                  </span>
                </Grid>
                <Grid item md={6} lg={6} sm={6} className="flex">
                  <span>Tôn giáo:</span>
                  <span className="pl-[12px] flex-grow border-b border-dashed">
                    {employee?.religion}
                  </span>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item md={6} lg={6} sm={6} className="flex">
                  <span>6. Số CMND/CCCD:</span>
                  <span className="pl-[12px] flex-grow border-b border-dashed">
                    {employee?.citizenIdentificationNumber}
                  </span>
                </Grid>
                <Grid item md={6} lg={6} sm={6} className="flex">
                  <span>Ngày cấp:</span>
                  <span className="pl-[12px] flex-grow border-b border-dashed">
                    {employee?.dateOfIssuanceCard
                      ? moment(new Date(employee?.dateOfIssuanceCard)).format("DD/MM/YYYY")
                      : ''}
                  </span>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item md={12} lg={12} sm={12} className="flex">
                  <span>7. Nơi cấp:</span>
                  <span className="pl-[12px] flex-grow border-b border-dashed">
                    {employee?.placeOfIssueCard}
                  </span>
                </Grid>
              </Grid>
            </div>
          </div>

          <div>
            <h4 className="uppercase font-bold text-[1.1rem] my-[12px]">II. Quan hệ gia đình</h4>
            <TableContainer >
              <Table
                sx={{
                  border: '1px solid black',
                  borderCollapse: 'collapse',
                  fontFamily: 'Times New Roman, sans-serif',
                }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        fontWeight: 700, color: 'black',
                        fontFamily: 'Times New Roman, sans-serif'
                      }}
                      align="center" width="5%" className="font-bold text-black">STT</TableCell>
                    <TableCell sx={{
                      border: '1px solid black',
                      fontWeight: 700, color: 'black',
                      fontFamily: 'Times New Roman, sans-serif'
                    }}
                      align="center" width="20%" className="font-bold text-black">Họ tên</TableCell>
                    <TableCell sx={{
                      border: '1px solid black',
                      fontWeight: 700, color: 'black',
                      fontFamily: 'Times New Roman, sans-serif'
                    }}
                      align="center" width="12%" className="font-bold text-black">Ngày sinh</TableCell>
                    <TableCell sx={{
                      border: '1px solid black',
                      fontWeight: 700, color: 'black',
                      fontFamily: 'Times New Roman, sans-serif'
                    }}
                      align="center" width="10%" className="font-bold text-black">Quan hệ</TableCell>
                    <TableCell sx={{
                      border: '1px solid black',
                      fontWeight: 700, color: 'black',
                      fontFamily: 'Times New Roman, sans-serif'
                    }}
                      align="center" width="15%" className="font-bold text-black">Điện thoại</TableCell>
                    <TableCell sx={{
                      border: '1px solid black',
                      fontWeight: 700, color: 'black',
                      fontFamily: 'Times New Roman, sans-serif'
                    }}
                      align="center" width="15%" className="font-bold text-black">CCCD</TableCell>
                    <TableCell sx={{
                      border: '1px solid black',
                      fontWeight: 700, color: 'black',
                      fontFamily: 'Times New Roman, sans-serif'
                    }}
                      align="center" width="30%" className="font-bold text-black">Địa chỉ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className='font-sreif'>
                  {families?.data?.map((family, index) => (
                    <TableRow key={family?.id}>
                      <TableCell sx={{
                        border: '1px solid black',
                        fontFamily: 'Times New Roman, sans-serif'
                      }} align="center">{index + 1}</TableCell>
                      <TableCell sx={{
                        border: '1px solid black',
                        fontFamily: 'Times New Roman, sans-serif'
                      }} align="center">{family?.name}</TableCell>
                      <TableCell sx={{
                        border: '1px solid black',
                        fontFamily: 'Times New Roman, sans-serif'
                      }}
                        align="center">{family?.dateOfBirth ? formatDate(family?.dateOfBirth) : ''}</TableCell>
                      <TableCell sx={{
                        border: '1px solid black',
                        fontFamily: 'Times New Roman, sans-serif'
                      }}
                        align="center">{family?.relationShip !== null ?
                          Object.values(RELATIONSHIP)[family?.relationShip] : ''}</TableCell>
                      <TableCell sx={{
                        border: '1px solid black',
                        fontFamily: 'Times New Roman, sans-serif'
                      }}
                        align="center">{family?.citizenIdentificationNumber}</TableCell>
                      <TableCell sx={{
                        border: '1px solid black',
                        fontFamily: 'Times New Roman, sans-serif'
                      }}
                        align="center">{family?.phoneNumber}</TableCell>
                      <TableCell sx={{
                        border: '1px solid black',
                        fontFamily: 'Times New Roman, sans-serif'
                      }}
                        align="center">{family?.address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="mt-[30px] text-indent">
            <p>
              Tôi xin cam đoan bản khai sơ yếu lý lịch trên là đúng sự thật, nếu có điều gì không đúng tôi chịu trách nhiệm trước pháp luật về lời khai của mình.
            </p>
          </div>
        </div>

        <div className="flex justify-end text-[1.1rem]">
          <div className="flex flex-col items-center text-center w-[40%]">
            <div className="flex w-full italic">
              <span className="capitalize">Tp.Hà Nội</span>,
              <span className="flex-grow border-b border-dashed">
                {employee?.submitDay
                  ? moment(new Date(employee?.submitDay)).format("DD/MM/YYYY").split("/")[0]
                  : ''}
              </span>
              <span>tháng</span>
              <span className="flex-grow border-b border-dashed">
                {employee?.submitDay
                  ? moment(new Date(employee?.submitDay)).format("DD/MM/YYYY").split("/")[1]
                  : ''}
              </span>
              <span>năm</span>
              <span className="flex-grow border-b border-dashed">
                {employee?.submitDay
                  ? moment(new Date(employee?.submitDay)).format("DD/MM/YYYY").split("/")[2]
                  : ''}
              </span>
            </div>
            <h4 className="uppercase font-bold text-[17px] my-[12px]">Ký tên</h4>
            <span className="font-semibold">{employee?.name}</span>
          </div>
        </div>
      </div>
    </>
  )
}

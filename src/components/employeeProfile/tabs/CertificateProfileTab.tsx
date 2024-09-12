/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { useAppSelector } from '../../../redux/hook';
import { selectCertificateState } from '../../../redux/slices/certificateSlice';
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { formatDate } from '../../../utils';

interface Props {
  employeeId: number;
}

export const CertificateProfileTab: React.FC<Props> = ({ employeeId }) => {
  const { certificates } = useAppSelector(selectCertificateState)

  return (
    <div className="font-times w-full">
      <div className="ml-8 text-lg font-medium">
        <h2 className="font-bold mb-5 text-xl">Văn bằng</h2>
        <TableContainer>
          <Table sx={{ border: '1px solid black', borderCollapse: 'collapse' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center', width: '8%', border: '1px solid black', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>STT</TableCell>
                <TableCell sx={{ textAlign: 'center', width: '20%', border: '1px solid black', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Tên văn bằng</TableCell>
                <TableCell sx={{ textAlign: 'center', width: '12%', border: '1px solid black', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Ngày cấp</TableCell>
                <TableCell sx={{ textAlign: 'center', width: '12%', border: '1px solid black', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Lĩnh vực</TableCell>
                <TableCell sx={{ textAlign: 'center', width: '14%', border: '1px solid black', fontWeight: 'bold', fontFamily: 'Times New Roman' }}>Nội dung</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certificates.data.map((certificate, index) => (
                <TableRow key={certificate?.id} sx={{ border: '1px solid black' }}>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid black', fontFamily: 'Times New Roman' }}>
                    <span style={{ fontWeight: '500' }}>{index + 1}</span>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'left', border: '1px solid black', fontFamily: 'Times New Roman' }}>
                    <span style={{ fontWeight: '500' }}>{certificate?.certificateName}</span>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid black', fontFamily: 'Times New Roman' }}>
                    <span style={{ fontWeight: '500' }}>{formatDate(certificate?.issueDate)}</span>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'left', border: '1px solid black', fontFamily: 'Times New Roman' }}>
                    <span style={{ fontWeight: '500' }}>{certificate?.field}</span>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'left', border: '1px solid black', fontFamily: 'Times New Roman' }}>
                    <span style={{ fontWeight: '500' }}>{certificate?.content}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}

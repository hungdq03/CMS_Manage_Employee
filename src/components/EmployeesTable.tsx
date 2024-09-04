import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { Employee, GENDER, paramsSearchEmployees, STATUS_PROFILE, TEAM_CATEGORY } from '../types/employees';
import { formatDate } from '../utils';

interface EmployeesTableProps {
  count?: number;
  page?: number;
  rows?: Employee[];
  rowsPerPage?: number;
  onChangeParams: (state: Partial<paramsSearchEmployees>) => void;
}

export function EmployeesTable({
  count = 0,
  rows = [],
  page = 1,
  rowsPerPage = 0,
  onChangeParams,
}: EmployeesTableProps): React.JSX.Element {
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    if (event) {
      onChangeParams({ pageIndex: newPage + 1 });
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeParams({ pageSize: +event.target.value, pageIndex: 1 });
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Thao tác</TableCell>
              <TableCell>STT</TableCell>
              <TableCell>Mã nhân viên</TableCell>
              <TableCell>Tên nhân viên</TableCell>
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Nhóm</TableCell>
              <TableCell>SĐT</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              return (
                <TableRow key={row.id} >
                  <TableCell></TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{formatDate(row.dateOfBirth)}</TableCell>
                  <TableCell>{GENDER[row.gender]}</TableCell>
                  <TableCell>{TEAM_CATEGORY[row.team]}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{STATUS_PROFILE[row.submitProfileStatus]}</TableCell>
                </TableRow>
              );
            })}
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
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage={"Số hàng mỗi trang"}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trong ${count}`
        }
      />
    </Card>
  );
}

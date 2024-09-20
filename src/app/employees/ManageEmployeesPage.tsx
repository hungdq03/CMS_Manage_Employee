import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Fragment, useLayoutEffect, useState } from 'react';
import { EmployeesFilters } from '../../components/addEmployee/tables/EmployeesFilter';
import { EmployeesTable } from '../../components/addEmployee/tables/EmployeesTable';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { fetchEmployeesPage, selectEmployeesState } from '../../redux/slices/employeesSlice';
import { paramsSearchEmployees, STATUS_EMPLOYEE } from '../../types/employee';

const ManageEmployeesPage = () => {
  const dispatch = useAppDispatch()
  const { employees, employeeStatus, employeeError } = useAppSelector(selectEmployeesState);

  const [params, setParams] = useState<paramsSearchEmployees>(
    {
      pageIndex: 1,
      pageSize: 10,
      keyword: '',
      listStatus: STATUS_EMPLOYEE.MANAGE
    }
  )

  useLayoutEffect(() => {
    fetchData(params);
  }, []);

  const onChangeParams = (partialParams: Partial<paramsSearchEmployees>) => {
    setParams((prevParams) => {
      const newParams = { ...prevParams, ...partialParams };
      if (!Object.keys(partialParams).includes('keyword')) {
        fetchData(newParams);
      }
      return newParams;
    });
  };

  const fetchData = (newParams: paramsSearchEmployees) => {
    dispatch(fetchEmployeesPage({ ...newParams }));
  };

  const handleSearch = () => {
    dispatch(fetchEmployeesPage({ ...params }));
  }

  if (employeeStatus === 'failed') return <div>{employeeError}</div>;
  return (
    <Fragment>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Quản lý nhân viên</Typography>
          </Stack>
        </Stack>
        <EmployeesFilters keyword={params.keyword || ''} onChangeParams={onChangeParams} onSearch={handleSearch} />
        <EmployeesTable
          count={employees.totalElements}
          page={params.pageIndex}
          rows={employees.data}
          rowsPerPage={params.pageSize}
          onChangeParams={onChangeParams}
          isManage
        />
      </Stack>
    </Fragment>
  )
}

export default ManageEmployeesPage
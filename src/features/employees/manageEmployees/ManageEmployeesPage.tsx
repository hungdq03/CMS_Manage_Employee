/* eslint-disable react-hooks/exhaustive-deps */
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Fragment, useEffect, useState } from 'react';
import Loader from '../../../components/core/Loader';
import { EmployeesFilters } from '../../../components/EmployeesFilter';
import { EmployeesTable } from '../../../components/EmployeesTable';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { fetchEmployeesPage, selectEmployeesPage } from '../../../slices/employeesSlice';
import { paramsSearchEmployees, STATUS_EMPLOYEE } from '../../../types/employees';

const ManageEmployeesPage = () => {
  const dispatch = useAppDispatch()
  const { employees, status, error } = useAppSelector(selectEmployeesPage);

  const [params, setParams] = useState<paramsSearchEmployees>(
    {
      pageIndex: 1,
      pageSize: 10,
      keyword: '',
      listStatus: STATUS_EMPLOYEE.MANAGE
    }
  )

  useEffect(() => {
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

  if (status === 'failed') return <div>{error}</div>;
  return (
    <Fragment>
      {status === 'loading' && <Loader />}
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
        />
      </Stack>
    </Fragment>
  )
}

export default ManageEmployeesPage
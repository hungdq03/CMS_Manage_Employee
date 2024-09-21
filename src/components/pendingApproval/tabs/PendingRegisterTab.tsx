import { Stack } from '@mui/material';
import { useLayoutEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { fetchEmployeesPage, selectEmployeesState } from '../../../redux/slices/employeesSlice';
import { paramsSearchEmployees, STATUS_EMPLOYEE } from '../../../types/employee';
import { EmployeesFilters } from '../../addEmployee/tables/EmployeesFilter';
import { EmployeesTable } from '../../addEmployee/tables/EmployeesTable';

export const PendingRegisterTab = () => {
  const dispatch = useAppDispatch()
  const { employees, employeeStatus, employeeError } = useAppSelector(selectEmployeesState);

  const [params, setParams] = useState<paramsSearchEmployees>(
    {
      pageIndex: 1,
      pageSize: 10,
      keyword: '',
      listStatus: STATUS_EMPLOYEE.PENDING
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
    <>
      <Stack spacing={3}>
        <EmployeesFilters keyword={params.keyword || ''} onChangeParams={onChangeParams} onSearch={handleSearch} />
        <EmployeesTable
          count={employees.totalElements}
          page={params.pageIndex}
          rows={employees.data}
          rowsPerPage={params.pageSize}
          onChangeParams={onChangeParams}
          isAdmin
          isManage
        />
      </Stack>
    </>
  )
}

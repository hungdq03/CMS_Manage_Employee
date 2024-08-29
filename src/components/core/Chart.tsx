import { styled } from '@mui/material/styles';
import { Suspense, lazy } from 'react';

const ApexChart = lazy(() => import('react-apexcharts'));

export const Chart = styled(ApexChart)``;

const ChartComponent = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chart />
    </Suspense>
  );
};

export default ChartComponent;

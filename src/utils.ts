import dayjs from 'dayjs';

export const formatDate = (timestamp: number): string => {
  return dayjs(timestamp).format('DD/MM/YYYY');
}

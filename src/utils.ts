/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from "date-fns";
import dayjs from 'dayjs';

export const formatDate = (timestamp: number): string => {
  return dayjs(timestamp).format('DD/MM/YYYY');
}

export function convertTimeToDate(milliseconds: number | undefined) {
  if (!milliseconds) {
    return null;
  }

  const date = new Date(milliseconds);
  return format(date, 'yyyy-MM-dd');
}

export function convertDateStringtoTime(dateString: string) {
  const dateObject = new Date(dateString);
  const milliseconds = dateObject.getTime();

  return milliseconds;
}

export const statusCode = {
  SUCCESS: 200
}
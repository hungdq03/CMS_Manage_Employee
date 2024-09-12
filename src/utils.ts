/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from "date-fns";
import dayjs from 'dayjs';

export const formatDate = (timestamp: number): string => {
  return dayjs(timestamp).format('DD/MM/YYYY');
}

export const convertTimeToDate = (milliseconds: number | null | undefined) => {
  if (!milliseconds) {
    return null;
  }

  const date = new Date(milliseconds);
  return format(date, 'yyyy-MM-dd');
}

export const convertDateStringtoTime = (dateString: string) => {
  const dateObject = new Date(dateString);
  const milliseconds = dateObject.getTime();

  return milliseconds;
}

export const splitString = (inputString: string | null | undefined): string[] | null => {
  if (!inputString) {
    return null;
  }

  return inputString
    .split("\n")
    .map(item => item.trim())
    .filter(Boolean);
}

export const statusCode = {
  SUCCESS: 200
}
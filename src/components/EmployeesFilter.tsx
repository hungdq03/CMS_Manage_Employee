import { IconButton, Tooltip } from '@mui/material';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { ClearIcon } from '@mui/x-date-pickers/icons';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import { paramsSearchEmployees } from '../types/employees';
interface EmployeesFiltersProps {
  keyword: string;
  onChangeParams: (state: Partial<paramsSearchEmployees>) => void;
  onSearch: () => void;
}

export function EmployeesFilters({ keyword, onChangeParams, onSearch }: EmployeesFiltersProps): React.JSX.Element {
  const [showClearIcon, setShowClearIcon] = useState("none");

  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChangeParams({ keyword: event.target.value });
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const inputValue = (event.target as HTMLInputElement).value;
      onChangeParams({ keyword: inputValue });
      onSearch();
    }
  };

  const handleClearInput = () => {
    onChangeParams({ keyword: '' });
    setShowClearIcon("none");
  };

  return (
    <Card sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    }}>
      <OutlinedInput
        defaultValue=""
        name='keyword'
        value={keyword}
        onChange={(event) => handleKeywordChange(event)}
        fullWidth
        placeholder="Tìm kiếm nhân viên ..."
        onKeyDown={handleKeyDown}
        startAdornment={
          <InputAdornment position="start">
            <Tooltip title="Xóa">
              <IconButton
                onClick={handleClearInput}
                sx={{
                  display: showClearIcon,
                  transition: "all 0.3s ease",
                }}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <Tooltip title="Tìm kiếm">
              <IconButton
                onClick={onSearch}
              >
                <MagnifyingGlassIcon size={24} />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
      />
    </Card>
  );
}

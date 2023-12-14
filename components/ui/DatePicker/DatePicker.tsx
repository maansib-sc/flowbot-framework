import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerComponent({onChange}: {onChange: (value: string) => void}) {
const [value, setValue] = React.useState<Dayjs | null>(dayjs(new Date()));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker 
        value={value}
        onChange={(newValue) => {
            setValue(newValue);
            onChange(dayjs(newValue).format('YYYY-MM-DD HH:mm:ss'))
        }}
      />
    </LocalizationProvider>
  );
}
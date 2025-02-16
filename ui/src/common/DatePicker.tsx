/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { SxProps, TextField } from '@mui/material';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { he } from 'date-fns/locale';

interface IDatePickerFieldProps {
    date: Date | null;
    setDate: React.Dispatch<React.SetStateAction<Date | null>>;
    minDate?: any;
    maxDate?: any;
    disabled?: boolean;
    sx?: SxProps;
    label?: string;
}

const DatePickerField = (props: IDatePickerFieldProps) => {
    const { date, setDate, minDate, maxDate, disabled, sx = { size: 'small' }, label } = props;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
            <DatePicker
                value={date}
                onChange={setDate}
                renderInput={(params: any) => <TextField {...params} />}
                minDate={minDate}
                maxDate={maxDate}
                inputFormat="dd/MM/yyyy"
                views={['day']}
                label={label}
                components={{ LeftArrowIcon: ArrowForwardIos, RightArrowIcon: ArrowBackIos }}
                disabled={disabled}
                InputProps={{ sx }}
            />
        </LocalizationProvider>
    );
};

export default DatePickerField;

import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { TextField } from '@mui/material';
import { LocalizationProvider, MobileDatePicker, PickersLocaleText } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import heLocale from 'date-fns/locale/he';
import i18next from 'i18next';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

interface IDateFilterComponentProps {
    onDateChanged: () => void;
}

export const DateFilterComponent = forwardRef(({ onDateChanged }: IDateFilterComponentProps, ref) => {
    const [dateValue, setDateValue] = useState<Date | null>(null);

    const handleChange = (newValue: Date | null) => {
        setDateValue(newValue);
        onDateChanged(); // notify Ag-Grid on change
    };

    // functions for Ag-Grid
    useImperativeHandle(ref, () => ({
        getDate() {
            return dateValue;
        },
        setDate(date: Date | null) {
            setDateValue(date);
        },
    }));

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={heLocale}
            localeText={i18next.t('muiDatePickersLocaleText', { returnObjects: true }) as Partial<PickersLocaleText<unknown>>}
        >
            <MobileDatePicker
                inputFormat="dd/MM/yyyy"
                value={dateValue}
                onChange={handleChange}
                // eslint-disable-next-line react/jsx-props-no-spreading
                renderInput={(params) => <TextField {...params} />}
                DialogProps={{ PaperProps: { sx: { backgroundColor: 'white' } } }}
                components={{ LeftArrowIcon: ArrowForwardIos, RightArrowIcon: ArrowBackIos }}
                orientation="landscape"
            />
        </LocalizationProvider>
    );
});

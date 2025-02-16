import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { PickersLocaleText } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { he } from 'date-fns/locale';
import i18next from 'i18next';
import React from 'react';
import { DatePickerElement } from 'react-hook-form-mui';

interface IDateFieldProps {
    name: string;
    label: string;
    minDate?: Date;
    maxDate?: Date;
    required?: boolean;
    disabled?: boolean;
    sx?: any;
}

const DateField = (props: IDateFieldProps) => {
    const { name, label, minDate, maxDate, required, disabled, sx } = props;

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={he}
            localeText={i18next.t('muiDatePickersLocaleText', { returnObjects: true }) as Partial<PickersLocaleText<unknown>>}
        >
            <DatePickerElement
                name={name}
                label={`${required ? `${label} *` : label}`}
                minDate={minDate}
                maxDate={maxDate}
                views={['day']}
                inputFormat="dd/MM/yyyy"
                components={{ LeftArrowIcon: ArrowForwardIos, RightArrowIcon: ArrowBackIos }}
                required={required}
                disabled={disabled}
                inputProps={{ sx }}
                componentsProps={{
                    actionBar: {
                        actions: ['clear'], // Specify actions for the action bar
                    },
                }}
            />
        </LocalizationProvider>
    );
};

DateField.defaultProps = {
    minDate: new Date(),
    maxDate: undefined,
    required: false,
    disabled: false,
    sx: {},
};

export default DateField;

import { PickersLocaleText } from '@mui/x-date-pickers';

export const muiDatePickersLocaleText: Partial<PickersLocaleText<unknown>> = {
    cancelButtonLabel: 'סגירה',
    clearButtonLabel: 'איפוס',
    okButtonLabel: 'שמירה',
    nextMonth: 'חודש הבא',
    previousMonth: 'חודש קודם',
};

export const areDatesEqual = (date1: Date, date2: Date): boolean =>
    date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();

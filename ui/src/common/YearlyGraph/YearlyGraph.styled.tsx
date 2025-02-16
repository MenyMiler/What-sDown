/* eslint-disable import/no-unresolved */
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Button, styled, TableCell, tableCellClasses, TableContainer } from '@mui/material';

export const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        color: '#ACACAC',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        align: 'right',
        paddingTop: '5px',
        paddingBottom: '5px',
    },
}));

export const StyledTableContainer = styled(TableContainer)(() => ({
    maxHeight: '45rem',
    border: '1px solid #E7E8EA',
    backgroundColor: 'white',
    borderRadius: ' 10px ',
    minHeight: '40rem',
    marginBottom: '2rem',
}));

export const StyledTableOfFeedbacksContainer = styled(TableContainer)(() => ({
    border: '1px solid #E7E8EA',
    backgroundColor: 'white',
    borderRadius: ' 10px ',
    maxHeight: '15rem',
    marginBottom: '2rem',
}));

export const StyledAddResourceButton = styled(Button)(({ theme }) => ({
    background: theme.palette.addResourceYearly.background,
    border: theme.palette.addResourceYearly.border,
    color: theme.palette.addResourceYearly.color,
    ':hover': {
        border: theme.palette.addResourceYearly.border,
    },
    marginRight: '5%',
}));

export const StyledViewResourceButton = styled(Button)(({ theme }) => ({
    background: theme.palette.viewResourceYearly.background,
    border: theme.palette.viewResourceYearly.border,
    color: theme.palette.viewResourceYearly.color,
    ':hover': {
        border: theme.palette.viewResourceYearly.border,
    },
}));

export const StyledCalendarIcon = styled(CalendarMonthIcon)(() => ({ color: '#666666', marginRight: '2%' }));

import { Button, styled, TableCell, tableCellClasses, TableContainer } from '@mui/material';

export const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        color: '#ACACAC',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        align: 'right',
        paddingTop: '15px',
        paddingBottom: '15px',
    },
}));

export const StyledTableContainer = styled(TableContainer)(() => ({
    maxHeight: '20rem',
    border: '1px solid #E7E8EA',
    backgroundColor: 'white',
    borderRadius: ' 10px ',
    minHeight: '5rem',
    marginBottom: '2rem',
}));

export const StyledAddResourceButton = styled(Button)(({ theme }) => ({
    background: theme.palette.addResource.background,
    border: theme.palette.addResource.border,
    color: theme.palette.addResource.color,
    ':hover': {
        border: theme.palette.addResource.border,
    },
    marginRight: '5%',
}));

export const StyledViewResourceButton = styled(Button)(({ theme }) => ({
    background: theme.palette.viewResource.background,
    border: theme.palette.viewResource.border,
    color: theme.palette.viewResource.color,
    ':hover': {
        border: theme.palette.viewResource.border,
    },
}));

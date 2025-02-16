/* eslint-disable import/no-unresolved */
import { styled, TableCell, tableCellClasses, TableContainer } from '@mui/material';

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
    height: '25rem',
    border: '1px solid #E7E8EA',
    backgroundColor: 'white',
    borderRadius: ' 10px ',
    marginBottom: '2rem',
}));

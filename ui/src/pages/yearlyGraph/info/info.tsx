/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    Table,
    TableBody,
    TableHead,
    TableRow,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import i18next from 'i18next';
import { v4 as uuidv4 } from 'uuid';
import { StyledTableCell, StyledTableContainer } from '../../../common/YearlyGraph/YearlyGraph.styled';
import { tableRows } from './data';
import { annualGraphCategories } from '../../../utils/excel/categories';

interface IExcelInfoProps {
    open: boolean;
    handleClose: () => void;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ExcelInfoYearlyGraph = (props: IExcelInfoProps) => {
    const { open, handleClose } = props;
    return (
        <div>
            <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose}>
                <DialogTitle>{i18next.t('editUser.table.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <StyledTableContainer sx={{ minHeight: '100%' }}>
                            <Table stickyHeader sx={{ minWidth: '40rem' }}>
                                <TableHead>
                                    <TableRow>
                                        {annualGraphCategories.map((displayName) => (
                                            <StyledTableCell key={displayName}>
                                                {i18next.t(`excelCategories.annualGraphCategories.${displayName}`)}
                                            </StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableRows.map((row) => (
                                        <TableRow key={uuidv4()} hover>
                                            {row.map((cell) => (
                                                <StyledTableCell>{cell}</StyledTableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </StyledTableContainer>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{i18next.t('editUser.okButton')}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ExcelInfoYearlyGraph;

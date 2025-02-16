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
import { StyledTableCell, StyledTableContainer } from '../YearlyGraph/YearlyGraph.styled';
import { SoldierTypes } from '../../interfaces/soldier';

interface IExcelInfoProps {
    open: boolean;
    handleClose: () => void;
    soldierType: SoldierTypes;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const tableCategories = ['name', 'personalNumber', 'gender', 'studentType', 'exceptional'];
const tableRows = [
    { name: 'אבי אביחי', personalNumber: '8445577', gender: 'זכר', studentType: 'רגיל', exceptional: 'לא' },
    { name: 'רוני אטיאס', personalNumber: '9571244', gender: 'נקבה', studentType: 'מצנחי זהב', exceptional: 'כן' },
    { name: 'שיר סגל', personalNumber: '9976322', gender: 'אחר', studentType: 'נפלים', exceptional: 'לא' },
    { name: 'עומר כהן', personalNumber: '5588454', gender: 'זכר', studentType: 'עתודאים', exceptional: 'לא' },
];

const ExcelInfo = (props: IExcelInfoProps) => {
    const { open, handleClose, soldierType } = props;
    return (
        <div>
            <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>{i18next.t('editUser.table.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <StyledTableContainer sx={{ minHeight: '1rem', overflowX: 'hidden' }}>
                            <Table stickyHeader sx={{ minWidth: '30rem' }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        {tableCategories.map((displayName) => (
                                            <StyledTableCell key={displayName}>{i18next.t(`editUser.table.category.${displayName}`)}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableRows.map((row) => (
                                        <TableRow key={uuidv4()} hover>
                                            <StyledTableCell>{row.name}</StyledTableCell>
                                            <StyledTableCell>{row.personalNumber}</StyledTableCell>
                                            <StyledTableCell>{row.gender}</StyledTableCell>
                                            <StyledTableCell>
                                                {soldierType === SoldierTypes.STUDENT
                                                    ? row.studentType
                                                    : i18next.t('editUser.table.specialStudentType.REGULAR')}
                                            </StyledTableCell>
                                            <StyledTableCell>{row.exceptional}</StyledTableCell>
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

export default ExcelInfo;

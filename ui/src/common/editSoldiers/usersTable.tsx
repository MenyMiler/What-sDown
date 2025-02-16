/* eslint-disable import/no-unresolved */
/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { IconButton, LinearProgress, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material';
import i18next from 'i18next';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { StyledTableCell, StyledTableContainer } from '../YearlyGraph/YearlyGraph.styled';
import { SoldierDocument } from '../../interfaces/soldier';
import { trycatch } from '../../utils/trycatch';
import { SoldiersInRoomInCourseService } from '../../services/soldiersInRoomInCourse';

interface IUsersTableProps {
    rows: SoldierDocument[];
    loading: boolean;
    reloadSoldiers: () => void;
    courseId: string;
}

const UsersTable = (props: IUsersTableProps) => {
    const { rows, loading, reloadSoldiers, courseId } = props;
    const tableCategories = ['name', 'personalNumber', 'gender', 'studentType', 'exceptional', 'delete'];

    const handelDelete = async (soldierId: string) => {
        const { err } = await trycatch(() => SoldiersInRoomInCourseService.deleteOne(courseId, soldierId));
        if (!err) {
            toast.success(i18next.t('editUser.ok.delete'));
            reloadSoldiers();
        } else toast.error(i18next.t('editUser.errors.soldierDelete'));
    };

    return (
        <StyledTableContainer id="table">
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {tableCategories.map((category) => (
                            <StyledTableCell key={category}> {i18next.t(`editUser.table.category.${category}`)}</StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>{' '}
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={uuidv4()} hover>
                            <StyledTableCell>{row.name}</StyledTableCell>
                            <StyledTableCell>{row.personalNumber}</StyledTableCell>
                            <StyledTableCell>{i18next.t(`common.genders.${row.gender}`)}</StyledTableCell>
                            <StyledTableCell>{i18next.t(`editUser.table.specialStudentType.${row.studentType}`)}</StyledTableCell>
                            <StyledTableCell>{i18next.t(`common.${row.exceptional}`)}</StyledTableCell>
                            <StyledTableCell>
                                <IconButton onClick={() => handelDelete(row._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </StyledTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {loading ? (
                <LinearProgress />
            ) : !rows.length ? (
                <Typography sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '1rem' }}>{i18next.t('noData')}</Typography>
            ) : null}
        </StyledTableContainer>
    );
};

export default UsersTable;

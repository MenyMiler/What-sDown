import { Info as InfoIcon, Search as SearchIcon } from '@mui/icons-material';
import { Grid, IconButton, InputAdornment } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import i18next from 'i18next';
import _ from 'lodash';
import React, { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { RoomTypes } from '../../interfaces/room';
import { SoldierTypes } from '../../interfaces/soldier';
import AddSoldier from '../../pages/HumanResources/AddSoldier';
import AutocompleteCourse from '../../pages/HumanResources/AddSoldier/AutocompleteCourse';
import { StyledGrid } from '../../pages/yearlyGraph';
import { CoursesService } from '../../services/courses';
import ExcelButton from './excelButton';
import ExcelInfo from './info';
import { StyledTextField } from './styled';
import UsersTable from './usersTable';

interface IEditUsersProps {
    soldierType: SoldierTypes;
}

const EditSoldiers = ({ soldierType }: IEditUsersProps) => {
    const [infoOpen, setInfoOpen] = useState<boolean>(false);
    const [nameFilter, setNameFilter] = useState('');

    const { watch } = useFormContext();
    const courseId: string = watch('courseId') ?? '';

    const queryClient = useQueryClient();

    const queryKey = useMemo(() => ['populatedCourse', courseId, nameFilter], [courseId, nameFilter]);

    const { data: soldiers = [], isLoading } = useQuery({
        queryKey, // eslint-disable-line @tanstack/query/exhaustive-deps
        queryFn: () => CoursesService.getById(courseId, true),
        select: ({ rooms }) =>
            rooms
                .filter(({ type }) => type === RoomTypes.BEDROOM)
                .flatMap((bedroom) =>
                    bedroom.soldiers?.filter((soldier) => {
                        const type = bedroom.isStaff ? SoldierTypes.STAFF : SoldierTypes.STUDENT;
                        return type === soldierType && soldier && (nameFilter ? soldier.name.match(nameFilter) : true);
                    }),
                ),
        enabled: !!courseId,
        meta: { errorMessage: i18next.t('editUser.errors.soldiers') },
    });

    const isSelectDisabled = useMemo(() => !courseId || isLoading, [courseId, isLoading]);

    return (
        <>
            <StyledGrid direction="column">
                <Grid container justifyContent="space-between" flexWrap="nowrap">
                    <Grid item>
                        <AutocompleteCourse />
                    </Grid>
                    <Grid item>
                        <StyledTextField
                            size="small"
                            disabled={!courseId}
                            onChange={_.debounce((e) => setNameFilter(e.target.value), 500)}
                            label={i18next.t(`editUser.search${soldierType}`)}
                            InputProps={{
                                sx: { width: '20rem' },
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid container justifyContent="flex-end" alignItems="center" gap="0.5rem">
                        <Grid item>
                            <IconButton onClick={() => setInfoOpen(true)}>
                                <InfoIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <ExcelButton
                                soldierType={soldierType}
                                reloadSoldiers={() => queryClient.invalidateQueries({ queryKey })}
                                courseId={courseId}
                                disabled={isSelectDisabled}
                            />
                        </Grid>
                        <Grid item>
                            <AddSoldier
                                soldierType={soldierType}
                                reloadSoldiers={() => queryClient.invalidateQueries({ queryKey })}
                                disabled={isSelectDisabled}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <UsersTable
                        rows={soldiers}
                        loading={isLoading}
                        reloadSoldiers={() => queryClient.invalidateQueries({ queryKey })}
                        courseId={courseId}
                    />
                </Grid>
            </StyledGrid>
            <ExcelInfo open={infoOpen} handleClose={() => setInfoOpen(false)} soldierType={soldierType} />
        </>
    );
};

export default EditSoldiers;

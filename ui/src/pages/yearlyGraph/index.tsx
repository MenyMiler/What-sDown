/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Grid, IconButton, InputAdornment, styled, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { toast } from 'react-toastify';
import i18next from 'i18next';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import _ from 'lodash';
import YearlyGraph from '../../common/YearlyGraph';
import { PopulatedCourse } from '../../interfaces/course';
import ImportExcel from './importExcel';
import ExportExcel from './exportExcel';
import ExcelInfoYearlyGraph from './info/info';
import { StyledTextField } from '../../common/editSoldiers/styled';
import { CoursesService } from '../../services/courses';
import { useUserStore } from '../../stores/user';
import { EventsService } from '../../services/events';
import { PopulatedEvent } from '../../interfaces/event';

export const StyledGrid = styled(Grid)(() => ({
    textAlign: 'right',
}));

const YearlyGraphPage = () => {
    const [rows, setRows] = useState<(PopulatedCourse | PopulatedEvent)[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [infoOpen, setInfoOpen] = useState<boolean>(false);
    const [sort, setSort] = useState({});
    const [step, setStep] = useState<number>(0);
    const [dataType, setDataType] = useState<'course' | 'event'>('course');

    const [hasMore, setHasMore] = useState<boolean>(true);

    const currentUser = useUserStore(({ user }) => user);

    const getRows = async (currStep: number, currRows: (PopulatedCourse | PopulatedEvent)[]) => {
        setLoading(true);

        try {
            // Getting the data according to userType and current step progression;
            let newRows;

            if (dataType === 'course') {
                newRows = await CoursesService.getByQuery({
                    baseId: currentUser.baseId!,
                    ...sort,
                    limit: 15,
                    step: currStep,
                    populate: true,
                });
            } else {
                newRows = await EventsService.getByQuery({
                    baseId: currentUser.baseId!,
                    ...sort,
                    limit: 15,
                    step: currStep,
                    populate: true,
                });
            }

            // Checking if the amount of requests is done, if so no more infinite scroll;
            if (!newRows.length) {
                setHasMore(false);
                return;
            }
            // Updating the states accordingly;
            setRows([...currRows, ...newRows]);
            setStep(currStep + 1);
        } catch (error) {
            toast.error(i18next.t('error.config'));
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setStep(0);
        setHasMore(true);
        setRows([]);
        getRows(0, []);
    };

    useEffect(reset, [sort, currentUser.baseId!, dataType]);

    const searchCourseByName = async (courseName: string) => {
        reset();
        const { name, ...rest } = sort as any;
        setSort({ ...rest, ...(courseName && { name: courseName }) });
    };

    const handleChange = (_event: React.MouseEvent<HTMLElement>, newAlignment: 'course' | 'event') => {
        if (!newAlignment) return;
        setRows([]);
        setLoading(true);
        setDataType(newAlignment);
    };

    return (
        <>
            <StyledGrid direction="column">
                <Grid container justifyContent="space-between" flexWrap="nowrap">
                    <Grid container direction="row" justifyContent="start" spacing={2}>
                        <Grid item>
                            <StyledTextField
                                size="small"
                                onChange={_.debounce((e) => searchCourseByName(e.target.value), 500)}
                                label={i18next.t('yearlyGraph.search', { element: i18next.t(`yearlyGraph.${dataType}`) })}
                                InputProps={{
                                    size: 'small',
                                    sx: { width: '20rem' },
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <ToggleButtonGroup value={dataType} exclusive onChange={handleChange} size="small" sx={{ bgcolor: 'white', mr: '1rem' }}>
                                <ToggleButton key="course" value="course">
                                    {i18next.t('yearlyGraph.course')}
                                </ToggleButton>
                                <ToggleButton key="event" value="event">
                                    {i18next.t('yearlyGraph.event')}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                    {dataType === 'course' && ( // TODO impl the import/export excel for events
                        <Grid container direction="row" justifyContent="end" spacing={2}>
                            <Grid item>
                                <IconButton onClick={() => setInfoOpen(true)}>
                                    <InfoIcon />
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <ImportExcel reloadData={reset} />
                            </Grid>
                            <Grid item>
                                <ExportExcel rowsCount={rows.length} />
                            </Grid>
                        </Grid>
                    )}
                </Grid>

                <Grid item>
                    <YearlyGraph
                        rows={rows}
                        loading={loading}
                        getRows={() => getRows(step, rows)}
                        hasMore={hasMore}
                        setSort={setSort}
                        dataType={dataType}
                    />
                </Grid>
            </StyledGrid>
            <ExcelInfoYearlyGraph open={infoOpen} handleClose={() => setInfoOpen(false)} />
        </>
    );
};

export default YearlyGraphPage;

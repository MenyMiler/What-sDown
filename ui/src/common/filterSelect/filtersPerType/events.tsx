import { Grid } from '@mui/material';
import * as React from 'react';
import { environment } from '../../../globals';
import { ViewMode } from '../../ganttTask';
import { ChangeViewModeButton } from '../ChangeViewModeButton';
import { SortDate } from '../SortDate';
import { ChangeEventGanttModeButton } from '../ChangeEventGanttModeButton';
import { Filter } from '../../../utils/filter';

interface IEventsFilterProps {
    filter: Filter;
    setFilter: (curr: any) => void;
}

const EventsFilter = ({ filter, setFilter }: IEventsFilterProps) => {
    const handleViewMode = (newViewMode: ViewMode) => setFilter((curr: any) => ({ ...curr, viewMode: newViewMode }));
    const handleEventGanttMode = (newMode: boolean | string) => setFilter((curr: any) => ({ ...curr, isConnectedToCourseFilter: newMode }));

    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item>
                <ChangeViewModeButton setViewMode={handleViewMode} />
            </Grid>
            <Grid item>
                <ChangeEventGanttModeButton setMode={handleEventGanttMode} />
            </Grid>
            <Grid item>
                <SortDate filter={filter} setFilter={setFilter} hasEndDate defaultRangeInDays={environment.defaultRangeInDays} />
            </Grid>
        </Grid>
    );
};

export default EventsFilter;

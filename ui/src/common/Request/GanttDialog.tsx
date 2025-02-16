import React, { useState } from 'react';
import i18next from 'i18next';
import { Grid, MenuItem, Select } from '@mui/material';
import GeneralGantt from '../../pages/GeneralGantt';
import { PageType } from '../filterSelect';
import BedroomsGantt from '../../pages/BedroomsGantt';
import CoursesGantt from '../../pages/CoursesGantt';
import EventsGantt from '../../pages/eventsGantt';

export enum GanttTypes {
    COURSE = 'COURSE',
    BEDROOM = 'BEDROOM',
    CLASS = 'CLASS',
    OFFICE = 'OFFICE',
    EVENT = 'EVENT',
}

export const GanttDialogContent = () => {
    const [currentGantt, setCurrentGantt] = useState(GanttTypes.COURSE);

    const handleChange = ({ target: { value } }: any) => setCurrentGantt(value);

    const showSelectedGantt = () => {
        switch (currentGantt) {
            case GanttTypes.COURSE:
                return <CoursesGantt miniGanttFlag />;
            case GanttTypes.BEDROOM:
                return <BedroomsGantt miniGanttFlag />;
            case GanttTypes.CLASS:
                return <GeneralGantt type={PageType.CLASS} miniGanttFlag />;
            case GanttTypes.OFFICE:
                return <GeneralGantt type={PageType.OFFICE} miniGanttFlag />;
            default: // event gantt
                return <EventsGantt miniGanttFlag />;
        }
    };

    return (
        <Grid
            item
            container
            direction="column"
            alignItems="flex-start"
            justifyContent="space-between"
            sx={{ width: '65%', mt: '2rem', mb: '1.5rem' }}
        >
            <Grid item sx={{ mb: '1rem' }}>
                <Select value={currentGantt} onChange={handleChange}>
                    {Object.values(GanttTypes).map((type) => (
                        <MenuItem key={type} value={type} sx={{ minWidth: 120 }}>
                            {i18next.t(`common.ganttTypes.${type}`)}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item container>
                {showSelectedGantt()}
            </Grid>
        </Grid>
    );
};

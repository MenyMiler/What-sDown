/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Box, Typography } from '@mui/material';
import { HolidaysTypes } from 'date-holidays';
import i18next from 'i18next';
import DailyEventBox from './dailyEvent';

interface listOfDailyEventsProps {
    events: { title: string; type: string }[];
}

const ListOfDailyEvents = ({ events }: listOfDailyEventsProps) => {
    return (
        <Box sx={{ overflowY: 'auto', height: '12rem' }}>
            {!events.length && <Typography sx={{ ml: '1rem' }}>{i18next.t('noDailyEvents')}</Typography>}

            {events.map(({ title, type }, index) => (
                <DailyEventBox key={index} title={title} type={type} />
            ))}
        </Box>
    );
};

export default ListOfDailyEvents;

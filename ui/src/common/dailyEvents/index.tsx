/* eslint-disable react/require-default-props */
import { Box, Card, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { HolidaysTypes } from 'date-holidays';
import i18next from 'i18next';
import { useQuery } from '@tanstack/react-query';
import ListOfDailyEvents from './listOfDailyEvents';
import { getCurrentDate, convertDayToText, initHoliday } from '../../utils/today';
import { DailyButton } from './dayButton.styled';
import { EventsService } from '../../services/events';
import { useUserStore } from '../../stores/user';
import { environment } from '../../globals';
import { EventDocument } from '../../interfaces/event';
import { EventColor } from './dailyEvent';

const { limitForEventsInMainPage } = environment;
interface dailyEventsProps {
    height?: string;
}

const DailyEvents = ({ height }: dailyEventsProps) => {
    const currentUser = useUserStore(({ user }) => user);

    const { data: events = [] } = useQuery({
        queryKey: ['events', currentUser.baseId],
        queryFn: () =>
            EventsService.getByQuery({
                startDate: new Date(),
                endDate: new Date(),
                baseId: currentUser.baseId,
                limit: limitForEventsInMainPage,
                populate: false,
            }),
        select: (data: EventDocument[]) => data.map(({ name: title }) => ({ title, type: EventColor.regularEvent })),
        meta: { errorMessage: i18next.t('error.getEvents') },
    });

    return (
        <Card sx={{ borderRadius: '0.625rem', height: height || '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '0.5rem', mr: '1rem' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', ml: '1rem' }}>{i18next.t('dailyEvents')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{getCurrentDate()}</Typography>
                    <DailyButton>{convertDayToText()}</DailyButton>
                </Box>
            </Box>
            <Divider sx={{ my: '0.5rem' }} />
            <ListOfDailyEvents
                events={[
                    ...(initHoliday() as HolidaysTypes.Holiday[]).map(({ name: title }) => ({ title, type: EventColor.ceremony })),
                    ...events,
                ].slice(0, limitForEventsInMainPage)}
            />
        </Card>
    );
};

export default DailyEvents;

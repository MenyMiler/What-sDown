/* eslint-disable indent */
/* eslint-disable react/no-array-index-key */
import { Box, Button, Grid, Typography } from '@mui/material';
import { useQueries } from '@tanstack/react-query';
import { HolidaysTypes } from 'date-holidays';
import i18next from 'i18next';
import React from 'react';
import { useNavigate } from 'react-router';
import { environment } from '../../globals';
import { EventDocument } from '../../interfaces/event';
import { EventsService } from '../../services/events';
import { RequestsService } from '../../services/requests';
import { useUserStore } from '../../stores/user';
import { convertDayToText, getCurrentDate, initHoliday } from '../../utils/today';
import { DailyButton } from '../dailyEvents/dayButton.styled';
import CompleteBox, { typeOfData } from './CompleteBox';
import { EventColor } from '../dailyEvents/dailyEvent';

const { limitForEventsInMainPage, permissions } = environment;

const MainPageUnauthorized = () => {
    const currentUser = useUserStore(({ user }) => user);
    const navigate = useNavigate();

    const dailyEventsSubTitle = () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{getCurrentDate()}</Typography>
            <DailyButton>{convertDayToText()}</DailyButton>
        </Box>
    );

    const [{ data: requests = [] }, { data: events = [] }] = useQueries({
        queries: [
            {
                queryKey: ['requests', currentUser.genesisId],
                queryFn: () =>
                    RequestsService.getByQuery({
                        requesterId: currentUser.genesisId!,
                        limit: limitForEventsInMainPage,
                        populate: false,
                    }),
                meta: { errorMessage: i18next.t('error.getRequests') },
            },
            {
                queryKey: ['events', currentUser.baseId],
                queryFn: () =>
                    EventsService.getByQuery({ startDate: new Date(), baseId: currentUser.baseId, limit: limitForEventsInMainPage, populate: false }),
                select: (data: EventDocument[]) => data.map(({ name: title }) => ({ title, type: EventColor.regularEvent })),
                meta: { errorMessage: i18next.t('error.getEvents') },
            },
        ],
    });

    const myRequestsSubTitle = () => <Button onClick={() => navigate('/requests')}>{i18next.t('myRequests.btn')}</Button>;

    return (
        <>
            <Grid container direction="row" spacing={5} justifyContent="center" sx={{ mt: '5rem' }}>
                <Grid item xs={6}>
                    <CompleteBox
                        title={i18next.t('myRequests.title')}
                        subTitle={myRequestsSubTitle()}
                        type={typeOfData.requests}
                        dataToShow={requests}
                    />
                </Grid>
                <Grid item xs={6}>
                    <CompleteBox
                        title={i18next.t('dailyEvents')}
                        subTitle={dailyEventsSubTitle()}
                        type={typeOfData.dailyEvents}
                        dataToShow={[
                            ...(initHoliday() as HolidaysTypes.Holiday[]).map(({ name: title }) => ({ title, type: EventColor.ceremony })),
                            ...events,
                        ].slice(0, limitForEventsInMainPage)}
                    />
                </Grid>
            </Grid>
            {currentUser.currentUserType && permissions.mainPageUnauthorized.includes(currentUser.currentUserType) ? (
                <img
                    src="images/logo.svg"
                    alt=""
                    style={{ position: 'absolute', left: '50px', height: '17.5rem', width: '17.5rem', bottom: '50px', opacity: 0.3 }}
                />
            ) : null}
        </>
    );
};
export default MainPageUnauthorized;

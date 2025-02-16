/* eslint-disable indent */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { Box, Button, Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { ArrowForwardIos } from '@mui/icons-material';
import ColumnOfDetails from '../../../common/ganttTask/components/modal/ColumnOfDetails';
import ColumnOfRooms from '../../../common/ganttTask/components/modal/ColumnOfRooms';
import Legend from '../../../common/Legend';
import { environment } from '../../../globals';
import { ICurrState } from '../../../utils/resourcesTypes';
import style from '../styles';
import { PopulatedEvent } from '../../../interfaces/event';
import { RoomTypes } from '../../../interfaces/room';

const { colors } = environment;

interface IPageTwoProps {
    event: PopulatedEvent;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
}

const PageTwoModal = ({ event, setPageIndex }: IPageTwoProps) => {
    const [classes, setClasses] = useState<ICurrState[]>([]);
    const [offices, setOffices] = useState<ICurrState[]>([]);

    useEffect(() => {
        setClasses(
            event.rooms.reduce((acc, room) => {
                if (room.type === RoomTypes.CLASS) {
                    acc.push({
                        roomName: room.name,
                        currentCapacity: room.soldiers.length,
                    });
                }
                return acc;
            }, [] as ICurrState[]),
        );

        setOffices(
            event.rooms.reduce((acc, room) => {
                if (room.type === RoomTypes.OFFICE) {
                    acc.push({
                        roomName: room.name,
                        currentCapacity: room.soldiers.length,
                    });
                }
                return acc;
            }, [] as ICurrState[]),
        );
    }, [event]);

    return (
        <Box sx={style}>
            <Grid container direction="row" sx={{ mb: 4, display: 'flex' }}>
                <Grid item xs={9} sx={{ pl: '20rem' }}>
                    <Typography variant="h6" fontWeight="bold">
                        {i18next.t('courseDetailsModal.resources')}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Grid container direction="column" gap={0.1} sx={{ ml: '2rem' }}>
                        <Grid item>
                            <Legend
                                items={[
                                    {
                                        dotColor: `${colors.gender.male}`,
                                        text: `${i18next.t('gender.male')}`,
                                    },
                                    {
                                        dotColor: `${colors.gender.female}`,
                                        text: `${i18next.t('gender.female')}`,
                                    },
                                ]}
                                sx={{ display: 'flex', gap: '0.92rem', pl: '1rem', pt: '0.3rem' }}
                                spacing="space-evenly"
                            />
                        </Grid>
                        <Grid item>
                            <Legend
                                items={[
                                    {
                                        dotColor: `${colors.gender.otherMale}`,
                                        text: `${i18next.t('gender.otherMale')}`,
                                    },
                                    {
                                        dotColor: `${colors.gender.otherFemale}`,
                                        text: `${i18next.t('gender.otherFemale')}`,
                                    },
                                ]}
                                sx={{ display: 'flex', gap: '1rem', pl: '1rem', pt: '0.3rem' }}
                                spacing="space-evenly"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="center" spacing={4} sx={{ ml: '2rem' }}>
                <Grid item xs={3}>
                    <ColumnOfDetails title="classes" arrOfDetails={classes} />
                </Grid>
                <Grid item xs={3}>
                    <ColumnOfDetails title="offices" arrOfDetails={offices} />
                </Grid>
                <Grid item xs={3}>
                    <ColumnOfRooms arrOfRooms={event.rooms.filter(({ type }) => type === RoomTypes.BEDROOM)} />
                </Grid>
            </Grid>
            <Grid container direction="row" sx={{ mt: '5rem' }}>
                <Grid item>
                    <Button
                        sx={{ color: 'black' }}
                        variant="text"
                        onClick={() => {
                            setPageIndex((curr) => (curr -= 1));
                        }}
                    >
                        <ArrowForwardIos />
                        <Typography sx={{ ml: '1rem' }}>{i18next.t('courseDetailsModal.basicInfo')}</Typography>
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PageTwoModal;

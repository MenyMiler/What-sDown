/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import React from 'react';
import { RoomWithSoldiers } from '../../../../interfaces/room';

interface columnOfGenderProps {
    rooms: RoomWithSoldiers[];
    color: string;
}

const ColumnOfGender = ({ rooms, color }: columnOfGenderProps) => {
    return (
        <Grid item>
            <Grid container direction="column" spacing={1.5}>
                <Grid item>
                    <Grid container direction="column">
                        {rooms.map((room, index) => {
                            return (
                                <Grid key={index} item>
                                    <Grid container direction="row" spacing={1.5}>
                                        <Grid item>
                                            <Grid container direction="row" spacing={0.5}>
                                                <Grid item>
                                                    <Typography sx={{ color }}>{i18next.t('courseDetailsModal.typeOfCol.rooms')}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography sx={{ color }}>{room.name}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography sx={{ color }}>-</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography sx={{ color }}>{i18next.t('courseDetailsModal.building')}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography sx={{ color }}>{room.location.buildingName}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography sx={{ color }}>{i18next.t('courseDetailsModal.floor')}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography sx={{ color }}>{room.location.floorNumber}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ColumnOfGender;

/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import React from 'react';
import { ICurrState } from '../../../../utils/resourcesTypes';

interface columnOfDetailsProps {
    arrOfDetails: ICurrState[];
    title: 'classes' | 'offices';
}

const ColumnOfDetails = ({ title, arrOfDetails }: columnOfDetailsProps) => {
    return (
        <Grid item>
            <Grid container direction="column" spacing={2} sx={{ mt: 1, mb: 1 }}>
                <Grid item>
                    <Grid container direction="row" spacing={0.5}>
                        <Grid item>
                            <Typography sx={{ fontWeight: 'bold' }}> {i18next.t(`ganttTitles.${title}`)}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography sx={{ fontWeight: 'bold' }}> ({arrOfDetails.length})</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sx={{ overflowY: 'auto', overflowX: 'hidden', height: '20rem' }}>
                    {arrOfDetails.map((detail, index) => {
                        return (
                            <Grid key={index} item>
                                <Grid container direction="row" spacing={1.5}>
                                    <Grid item>
                                        <Grid container direction="row" spacing={0.5}>
                                            <Grid item>
                                                <Typography>{i18next.t(`courseDetailsModal.typeOfCol.${title}`)}</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography>{detail.roomName}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Typography>{detail.currentCapacity}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ColumnOfDetails;

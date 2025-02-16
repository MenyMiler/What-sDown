import React from 'react';
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';

interface singleDetailProps {
    title: string;
    value: any;
}

const SingleDetailEvents = ({ title, value }: singleDetailProps) => (
    <Grid container direction="row" spacing={2} sx={{ mt: 1, mb: 1 }}>
        <Grid item>
            <Typography sx={{ fontWeight: 'bold' }}>{i18next.t(`eventsGantt.EventsDetailsModal.${title}`)}</Typography>
        </Grid>
        <Grid item>
            <Typography>{value && value.length !== 0 ? value : '-'}</Typography>
        </Grid>
    </Grid>
);

export default SingleDetailEvents;

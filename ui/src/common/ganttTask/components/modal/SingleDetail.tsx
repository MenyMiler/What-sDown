import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import React from 'react';

interface singleDetailProps {
    title: string;
    value: any;
}

const SingleDetail = ({ title, value }: singleDetailProps) => {
    return (
        <Grid container direction="row" spacing={2} sx={{ mt: 1, mb: 1 }}>
            <Grid item>
                <Typography sx={{ fontWeight: 'bold' }}>{i18next.t(`courseDetailsModal.${title}`)}</Typography>
            </Grid>
            <Grid item>
                <Typography>{value.length !== 0 ? value : '-'}</Typography>
            </Grid>
        </Grid>
    );
};

export default SingleDetail;

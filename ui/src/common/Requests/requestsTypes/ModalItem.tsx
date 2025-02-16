import React from 'react';
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';

interface modalItemProps {
    label: string;
    value: string;
}

const ModalItem = ({ label, value }: modalItemProps) => {
    return (
        <Grid item>
            <Grid container direction="row" sx={{ display: 'flex', justifyContent: 'center' }} spacing={1}>
                <Grid item>
                    <Typography>{i18next.t(`requestDetailsModal.${label}`)}:</Typography>
                </Grid>
                <Grid item>
                    <Typography>{value}</Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ModalItem;

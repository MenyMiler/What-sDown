import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Circle } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';

interface ISingleDailyEventProps {
    title: string;
    type: string;
}

const SingleDailyEvent = ({ title, type }: ISingleDailyEventProps) => (
    <Grid
        key={uuidv4()}
        container
        item
        direction="row"
        sx={{
            my: 0.75,
            width: '90%',
            border: '1px solid #E7E8ff',
            borderRadius: '10px',
            ':hover': { opacity: '0.8' },
            p: 1,
            boxShadow: '0px 3px 15px #00000012',
            height: '4.2rem',
        }}
        alignItems="center"
    >
        <Grid item sx={{ ml: '1rem' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Circle sx={{ color: type, width: '1rem' }} />
            </Box>
        </Grid>
        <Grid item sx={{ ml: '0.5rem' }}>
            <Typography>{title}</Typography>
        </Grid>
    </Grid>
);
export default SingleDailyEvent;

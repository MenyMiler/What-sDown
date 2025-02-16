import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Circle } from '@mui/icons-material';
import { DailyEvent } from './dailyEvent.styled';

interface dailyEventProps {
    title: string;
    type: string;
}

export enum EventColor {
    regularEvent = 'blue',
    ceremony = 'pink',
}

const DailyEventBox = ({ title, type }: dailyEventProps) => {
    return (
        <DailyEvent>
            <Box sx={{ width: '3rem', display: 'flex', alignItems: 'center', padding: '1rem' }}>
                <Circle sx={{ color: type, width: '1rem' }} />
            </Box>
            <Typography>{title}</Typography>
        </DailyEvent>
    );
};

export default DailyEventBox;

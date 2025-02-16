import React from 'react';
import { Card } from '@mui/material';
import PiechartColumn from './PiechartColumn';
import { RoomTypes } from '../../interfaces/room';

const Piecharts = () => {
    return (
        <Card
            sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                borderRadius: '0.625rem',
                opacity: 1,
                py: '1rem',
            }}
        >
            <PiechartColumn type={RoomTypes.CLASS} />
            <PiechartColumn type={RoomTypes.OFFICE} />
            <PiechartColumn type={RoomTypes.BEDROOM} />
        </Card>
    );
};

export default Piecharts;
